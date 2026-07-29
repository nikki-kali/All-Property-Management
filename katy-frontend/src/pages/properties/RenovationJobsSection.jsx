import { useState } from 'react';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/format';
import { ErrorMessage } from '../../components/Loading';

const STATUSES = ['in_progress', 'complete', 'on_hold'];

function JobRow({ job, onChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleStatusChange(e) {
    setSaving(true);
    setError(null);
    try {
      const status = e.target.value;
      await api.updateRenovationJob(job.id, {
        status,
        completed_at: status === 'complete' ? new Date().toISOString().slice(0, 10) : job.completed_at,
      });
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-b border-gray-50 py-3 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-900">{job.scope || 'Renovation job'}</p>
          <p className="mt-1 text-xs text-gray-500">
            Started {formatDate(job.started_at)}
            {job.completed_at && ` · Completed ${formatDate(job.completed_at)}`}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Project fee {formatCurrency(job.project_fee)} · Materials {formatCurrency(job.materials_estimate)}
          </p>
        </div>
        <select
          value={job.status}
          disabled={saving}
          onChange={handleStatusChange}
          className="clay-field rounded-xl px-2 py-1 text-xs"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      {error && <div className="mt-2"><ErrorMessage message={error} /></div>}
    </div>
  );
}

function AddJobForm({ propertyId, onAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ scope: '', project_fee: '', materials_estimate: '', started_at: '' });
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
      await api.createRenovationJob(propertyId, {
        ...form,
        project_fee: form.project_fee ? Number(form.project_fee) : null,
        materials_estimate: form.materials_estimate ? Number(form.materials_estimate) : null,
        started_at: form.started_at || null,
      });
      setForm({ scope: '', project_fee: '', materials_estimate: '', started_at: '' });
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
        + Add renovation job
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="clay-sm space-y-2 rounded-2xl bg-brand-50 p-3">
      {error && <ErrorMessage message={error} />}
      <textarea required placeholder="Scope of work" value={form.scope} onChange={(e) => update('scope', e.target.value)}
        rows={2} className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input placeholder="Project fee" type="number" value={form.project_fee} onChange={(e) => update('project_fee', e.target.value)}
          className="clay-field rounded-xl px-3 py-2 text-sm" />
        <input placeholder="Materials est." type="number" value={form.materials_estimate} onChange={(e) => update('materials_estimate', e.target.value)}
          className="clay-field rounded-xl px-3 py-2 text-sm" />
        <input type="date" value={form.started_at} onChange={(e) => update('started_at', e.target.value)}
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

export default function RenovationJobsSection({ propertyId, jobs, onChange }) {
  return (
    <div className="clay rounded-3xl bg-brand-50 p-5">
      <h2 className="mb-3 font-semibold text-gray-900">Renovation Jobs</h2>

      {jobs.length === 0 && <p className="text-sm text-gray-400">No renovation jobs for this property yet.</p>}
      {jobs.map((job) => <JobRow key={job.id} job={job} onChange={onChange} />)}

      <div className="mt-3">
        <AddJobForm propertyId={propertyId} onAdded={onChange} />
      </div>
    </div>
  );
}
