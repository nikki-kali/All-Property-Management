import { useState } from 'react';
import { api } from '../../lib/api';
import Modal from '../../components/Modal';
import { ErrorMessage } from '../../components/Loading';

export default function AgentFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', coverage_area: '' });
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
      await api.createAgent(form);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add Agent" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <ErrorMessage message={error} />}
        <input required placeholder="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input required placeholder="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
        </div>
        <input placeholder="Coverage area" value={form.coverage_area} onChange={(e) => update('coverage_area', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm" />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Add Agent'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
