import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/format';
import { ErrorMessage } from '../../components/Loading';

function ChecklistItem({ item, onToggle }) {
  const Icon = item.done ? CheckSquare : Square;
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-gray-50 ${
        item.done ? 'text-gray-400 line-through' : 'text-gray-700'
      }`}
    >
      <Icon size={16} className={item.done ? 'text-emerald-600' : 'text-gray-300'} />
      {item.item}
    </button>
  );
}

function AddChecklistItem({ onAdd }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add checklist item…"
        className="flex-1 clay-field rounded-xl px-3 py-1.5 text-xs"
      />
      <button type="submit" className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
        Add
      </button>
    </form>
  );
}

function JobCard({ job, onChange }) {
  const [error, setError] = useState(null);
  const [milestone, setMilestone] = useState(job.milestone || '');
  const [savingMilestone, setSavingMilestone] = useState(false);

  async function toggleItem(index) {
    setError(null);
    const updated = job.checklist.map((item, i) => (i === index ? { ...item, done: !item.done } : item));
    try {
      await api.updateTitlingChecklist(job.id, updated);
      onChange();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addItem(text) {
    setError(null);
    const updated = [...(job.checklist || []), { item: text, done: false }];
    try {
      await api.updateTitlingChecklist(job.id, updated);
      onChange();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMilestoneSave(e) {
    e.preventDefault();
    setSavingMilestone(true);
    setError(null);
    try {
      await api.updateTitlingJob(job.id, { milestone });
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingMilestone(false);
    }
  }

  const checklist = job.checklist || [];
  const doneCount = checklist.filter((i) => i.done).length;

  return (
    <div className="border-b border-gray-50 py-4 last:border-0">
      <p className="text-sm font-medium text-gray-900">{job.service_type || 'Titling job'}</p>
      <p className="mt-1 text-xs text-gray-500">
        Govt fees {formatCurrency(job.govt_fees)} · {job.timeline_days ? `${job.timeline_days} day timeline` : 'Timeline TBD'}
      </p>

      <form onSubmit={handleMilestoneSave} className="mt-2 flex gap-2">
        <input
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          placeholder="Milestone (e.g. tax_clearance_pending)"
          className="flex-1 clay-field rounded-xl px-3 py-1.5 text-xs"
        />
        <button type="submit" disabled={savingMilestone}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50">
          {savingMilestone ? 'Saving…' : 'Save'}
        </button>
      </form>

      {error && <div className="mt-2"><ErrorMessage message={error} /></div>}

      <div className="mt-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          Checklist ({doneCount}/{checklist.length})
        </p>
        {checklist.length === 0 && <p className="text-sm text-gray-400">No checklist items yet.</p>}
        {checklist.map((item, i) => (
          <ChecklistItem key={i} item={item} onToggle={() => toggleItem(i)} />
        ))}
        <AddChecklistItem onAdd={addItem} />
      </div>
    </div>
  );
}

function AddJobForm({ propertyId, onAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ service_type: '', govt_fees: '', timeline_days: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.createTitlingJob(propertyId, {
        ...form,
        govt_fees: form.govt_fees ? Number(form.govt_fees) : null,
        timeline_days: form.timeline_days ? Number(form.timeline_days) : null,
        checklist: [],
      });
      setForm({ service_type: '', govt_fees: '', timeline_days: '' });
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-medium text-brand-700 hover:underline">
        + Add titling job
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="clay-sm space-y-2 rounded-2xl bg-brand-50 p-3">
      {error && <ErrorMessage message={error} />}
      <input required placeholder="Service type (e.g. Deed of Sale & Title Transfer)" value={form.service_type}
        onChange={(e) => update('service_type', e.target.value)}
        className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input placeholder="Govt fees" type="number" value={form.govt_fees} onChange={(e) => update('govt_fees', e.target.value)}
          className="clay-field rounded-xl px-3 py-2 text-sm" />
        <input placeholder="Timeline (days)" type="number" value={form.timeline_days} onChange={(e) => update('timeline_days', e.target.value)}
          className="clay-field rounded-xl px-3 py-2 text-sm" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="clay-btn rounded-2xl bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Add Job'}
        </button>
      </div>
    </form>
  );
}

export default function TitlingJobsSection({ propertyId, jobs, onChange }) {
  return (
    <div className="clay rounded-3xl bg-brand-50 p-5">
      <h2 className="mb-3 font-semibold text-gray-900">Titling Jobs</h2>

      {jobs.length === 0 && <p className="text-sm text-gray-400">No titling jobs for this property yet.</p>}
      {jobs.map((job) => <JobCard key={job.id} job={job} onChange={onChange} />)}

      <div className="mt-3">
        <AddJobForm propertyId={propertyId} onAdded={onChange} />
      </div>
    </div>
  );
}
