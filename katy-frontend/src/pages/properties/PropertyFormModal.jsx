import { useState } from 'react';
import { api } from '../../lib/api';
import Modal from '../../components/Modal';
import { ErrorMessage } from '../../components/Loading';

export default function PropertyFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '', address: '', property_type: '', size_sqm: '', rental_term: '', rate: '', description: '',
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
      await api.createProperty({
        ...form,
        size_sqm: form.size_sqm ? Number(form.size_sqm) : null,
        rate: form.rate ? Number(form.rate) : null,
        rental_term: form.rental_term || null,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add Property" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <ErrorMessage message={error} />}
        <input required placeholder="Title" value={form.title} onChange={(e) => update('title', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
        <input required placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="Property type (condo, house...)" value={form.property_type} onChange={(e) => update('property_type', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Size (sqm)" type="number" value={form.size_sqm} onChange={(e) => update('size_sqm', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select value={form.rental_term} onChange={(e) => update('rental_term', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm">
            <option value="">Not a rental</option>
            <option value="short_term">Short term</option>
            <option value="long_term">Long term</option>
          </select>
          <input placeholder="Rate" type="number" value={form.rate} onChange={(e) => update('rate', e.target.value)}
            className="clay-field rounded-xl px-3 py-2 text-sm" />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => update('description', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2 text-sm" rows={3} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Create Property'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
