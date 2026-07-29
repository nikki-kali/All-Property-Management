import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatCurrency, formatDate } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import TenantFormModal from './TenantFormModal';

export default function TenantsList() {
  const [showForm, setShowForm] = useState(false);
  const { data: tenants, error, loading, reload } = useApi(api.getTenants, []);
  const { data: late } = useApi(api.getLatePayments, []);
  const { data: renewals } = useApi(api.getUpcomingRenewals, []);

  const lateTenantIds = new Set((late || []).map((p) => p.tenant_id));
  const renewalTenantIds = new Set((renewals || []).map((t) => t.id));

  return (
    <div>
      <PageHeader
        title="Tenants"
        subtitle="Active leases and rent collection"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Add Tenant
          </button>
        }
      />

      {late && late.length > 0 && (
        <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {late.length} payment{late.length === 1 ? '' : 's'} currently past the grace period.
        </div>
      )}

      {renewals && renewals.length > 0 && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {renewals.length} lease{renewals.length === 1 ? '' : 's'} up for renewal in the next 90 days.
        </div>
      )}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {tenants && (
        <div className="overflow-hidden clay rounded-3xl bg-brand-50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Tenant</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Lease</th>
                <th className="px-4 py-3 font-medium text-right">Monthly Rate</th>
                <th className="px-4 py-3 font-medium">Due Day</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No tenants found</td></tr>
              )}
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/tenants/${t.id}`} className="font-medium text-brand-700 hover:underline">
                      {t.full_name}
                    </Link>
                    {lateTenantIds.has(t.id) && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                        Late
                      </span>
                    )}
                    {renewalTenantIds.has(t.id) && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Renewal Soon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.property_title}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(t.lease_start)} – {formatDate(t.lease_end)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(t.monthly_rate)}</td>
                  <td className="px-4 py-3 text-gray-500">{t.due_day_of_month ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showForm && (
        <TenantFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); reload(); }}
        />
      )}
    </div>
  );
}
