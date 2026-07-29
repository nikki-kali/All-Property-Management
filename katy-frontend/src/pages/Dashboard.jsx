import { useApi } from '../lib/useApi';
import { api } from '../lib/api';
import { formatLabel } from '../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../components/Loading';

function StatCard({ label, value }) {
  return (
    <div className="clay rounded-3xl bg-brand-50 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, error: summaryError, loading: summaryLoading } = useApi(api.getSummary, []);
  const { data: attribution, error: attrError } = useApi(api.getAttribution, []);
  const { data: revenue, error: revError } = useApi(api.getRevenueByService, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of leads, properties, tenants, and commissions" />

      {summaryLoading && <Loading />}
      {summaryError && <ErrorMessage message={summaryError} />}

      {summary && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Leads" value={summary.total_leads} />
          <StatCard label="Active Properties" value={summary.active_properties} />
          <StatCard label="Active Tenants" value={summary.active_tenants} />
          <StatCard label="Pending Commissions" value={summary.pending_commissions} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="clay rounded-3xl bg-brand-50 p-5">
          <h2 className="mb-3 font-semibold text-gray-900">Lead Source Attribution</h2>
          {attrError && <ErrorMessage message={attrError} />}
          {attribution && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Source Page</th>
                  <th className="pb-2 pr-4 font-medium">Service</th>
                  <th className="pb-2 font-medium text-right">Leads</th>
                </tr>
              </thead>
              <tbody>
                {attribution.length === 0 && (
                  <tr><td colSpan={3} className="py-3 text-gray-400">No data yet</td></tr>
                )}
                {attribution.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 pr-4">{row.source_page || '—'}</td>
                    <td className="py-2 pr-4">{formatLabel(row.service)}</td>
                    <td className="py-2 text-right">{row.lead_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="clay rounded-3xl bg-brand-50 p-5">
          <h2 className="mb-3 font-semibold text-gray-900">Closed Deals by Service</h2>
          {revError && <ErrorMessage message={revError} />}
          {revenue && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Service</th>
                  <th className="pb-2 font-medium text-right">Closed Deals</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2">{formatLabel(row.service)}</td>
                    <td className="py-2 text-right">{row.closed_deals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
