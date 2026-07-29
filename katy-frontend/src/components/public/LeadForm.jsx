import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import { SERVICES } from '../../lib/services';
import { ErrorMessage } from '../Loading';

export default function LeadForm({ defaultService, propertyId, title = 'Tell us what you need', subtitle }) {
  const location = useLocation();
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', service: defaultService || '', message: '',
    budget: '', move_in_date: '', current_address: '', preferred_contact_method: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.submitInquiry({
        ...form,
        source_page: location.pathname,
        property_id: propertyId || null,
        budget: form.budget ? Number(form.budget) : null,
        move_in_date: form.move_in_date || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="clay-sm rounded-2xl bg-emerald-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-emerald-800">Thanks — we got your message!</h3>
        <p className="mt-2 text-sm text-emerald-700">A member of the Katy Property Solutions team will reach out shortly.</p>
      </div>
    );
  }

  return (
    <div className="clay rounded-[1.75rem] bg-brand-50 p-8">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input required placeholder="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
          <input required placeholder="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
          <select required value={form.service} onChange={(e) => update('service', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm">
            <option value="">What do you need help with?</option>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input placeholder="Budget / rate range (₱)" type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
          <input placeholder="Desired move-in date" type="date" value={form.move_in_date} onChange={(e) => update('move_in_date', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
        </div>

        <input placeholder="Current address" value={form.current_address} onChange={(e) => update('current_address', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2.5 text-sm" />

        <select value={form.preferred_contact_method} onChange={(e) => update('preferred_contact_method', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2.5 text-sm">
          <option value="">Preferred contact method</option>
          <option value="Phone">Phone call</option>
          <option value="Email">Email</option>
          <option value="Viber">Viber</option>
          <option value="Any">Any</option>
        </select>

        <textarea placeholder="Anything else we should know?" rows={3} value={form.message} onChange={(e) => update('message', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2.5 text-sm" />

        <button type="submit" disabled={submitting}
          className="w-full clay-btn rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {submitting ? 'Sending…' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
