import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatCurrency, formatDate, formatLabel } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function TenantDetail() {
  const { id } = useParams();
  const { data: tenant, error, loading, reload } = useApi(() => api.getTenant(id), [id]);
  const [form, setForm] = useState({ amount: '', due_date: '', paid_date: '', method: '', status: 'pending' });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleLogPayment(e) {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    try {
      await api.logPayment(id, {
        ...form,
        amount: form.amount ? Number(form.amount) : null,
        paid_date: form.paid_date || null,
        method: form.method || null,
      });
      setForm({ amount: '', due_date: '', paid_date: '', method: '', status: 'pending' });
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!tenant) return null;

  return (
    <div>
      <Link to="/admin/tenants" className="text-sm text-gray-500 hover:underline">&larr; Back to tenants</Link>
      <PageHeader title={tenant.full_name} subtitle="Tenant & payment history" />

      {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-1">
          <h2 className="mb-4 font-semibold text-gray-900">Lease Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Phone" value={tenant.phone} />
            <Field label="Email" value={tenant.email} />
            <Field label="Lease Start" value={formatDate(tenant.lease_start)} />
            <Field label="Lease End" value={formatDate(tenant.lease_end)} />
            <Field label="Monthly Rate" value={formatCurrency(tenant.monthly_rate)} />
            <Field label="Due Day" value={tenant.due_day_of_month} />
            <Field label="Grace Period" value={`${tenant.grace_period_days ?? 0} days`} />
          </div>
        </div>

        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Log a Payment</h2>
          <form onSubmit={handleLogPayment} className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <input required placeholder="Amount" type="number" value={form.amount} onChange={(e) => update('amount', e.target.value)}
              className="clay-field rounded-xl px-3 py-2 text-sm" />
            <input required placeholder="Due date" type="date" value={form.due_date} onChange={(e) => update('due_date', e.target.value)}
              className="clay-field rounded-xl px-3 py-2 text-sm" />
            <input placeholder="Paid date" type="date" value={form.paid_date} onChange={(e) => update('paid_date', e.target.value)}
              className="clay-field rounded-xl px-3 py-2 text-sm" />
            <select value={form.method} onChange={(e) => update('method', e.target.value)}
              className="clay-field rounded-xl px-3 py-2 text-sm">
              <option value="">Method…</option>
              <option value="gcash">GCash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}
              className="clay-field rounded-xl px-3 py-2 text-sm">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="late">Late</option>
              <option value="partial">Partial</option>
            </select>
            <button type="submit" disabled={saving}
              className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Log Payment'}
            </button>
          </form>

          <h3 className="mb-2 text-sm font-semibold text-gray-900">Payment History</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-2 pr-4 font-medium">Due</th>
                <th className="pb-2 pr-4 font-medium">Paid</th>
                <th className="pb-2 pr-4 font-medium text-right">Amount</th>
                <th className="pb-2 pr-4 font-medium">Method</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(tenant.payments || []).length === 0 && (
                <tr><td colSpan={5} className="py-3 text-gray-400">No payments logged</td></tr>
              )}
              {(tenant.payments || []).map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="py-2 pr-4">{formatDate(p.due_date)}</td>
                  <td className="py-2 pr-4">{formatDate(p.paid_date)}</td>
                  <td className="py-2 pr-4 text-right">{formatCurrency(p.amount)}</td>
                  <td className="py-2 pr-4">{formatLabel(p.method)}</td>
                  <td className="py-2"><Badge value={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
