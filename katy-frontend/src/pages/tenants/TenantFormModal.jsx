import { useState } from 'react';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import Modal from '../../components/Modal';
import { ErrorMessage } from '../../components/Loading';

export default function TenantFormModal({ onClose, onSaved }) {
  const { data: properties } = useApi(api.getProperties, []);
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '', property_id: '',
    lease_start: '', lease_end: '', monthly_rate: '', due_day_of_month: '', grace_period_days: '0',
  });
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
      await api.createTenant({
        ...form,
        monthly_rate: form.monthly_rate ? Number(form.monthly_rate) : null,
        due_day_of_month: form.due_day_of_month ? Number(form.due_day_of_month) : null,
        grace_period_days: form.grace_period_days ? Number(form.grace_period_days) : 0,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add Tenant" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <ErrorMessage message={error} />}
        <input required placeholder="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
        </div>
        <select required value={form.property_id} onChange={(e) => update('property_id', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm">
          <option value="">Select property…</option>
          {(properties || []).map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="Lease start" type="date" value={form.lease_start} onChange={(e) => update('lease_start', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Lease end" type="date" value={form.lease_end} onChange={(e) => update('lease_end', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input placeholder="Monthly rate" type="number" value={form.monthly_rate} onChange={(e) => update('monthly_rate', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Due day (1-31)" type="number" value={form.due_day_of_month} onChange={(e) => update('due_day_of_month', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Grace days" type="number" value={form.grace_period_days} onChange={(e) => update('grace_period_days', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Create Tenant'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
