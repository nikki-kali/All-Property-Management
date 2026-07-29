import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatDate, formatLabel } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';

const SERVICES = ['rentals', 'buy_sell', 'renovations', 'titling', 'agents'];
const STAGES = ['new', 'contacted', 'qualified', 'proposal_sent', 'closed', 'lost'];

export default function LeadsList() {
  const [service, setService] = useState('');
  const [stage, setStage] = useState('');

  const params = {};
  if (service) params.service = service;
  if (stage) params.stage = stage;

  const { data: leads, error, loading } = useApi(() => api.getLeads(params), [service, stage]);

  return (
    <div>
      <PageHeader title="Leads" subtitle="CRM pipeline across all services" />

      <div className="mb-4 flex gap-3">
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="clay-field rounded-xl px-3 py-1.5 text-sm"
        >
          <option value="">All services</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{formatLabel(s)}</option>
          ))}
        </select>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="clay-field rounded-xl px-3 py-1.5 text-sm"
        >
          <option value="">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{formatLabel(s)}</option>
          ))}
        </select>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {leads && (
        <div className="overflow-hidden clay rounded-3xl bg-brand-50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No leads found</td></tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/leads/${lead.id}`} className="font-medium text-brand-700 hover:underline">
                      {lead.client_name || 'Unknown'}
                    </Link>
                    <p className="text-xs text-gray-400">{lead.client_email}</p>
                  </td>
                  <td className="px-4 py-3">{formatLabel(lead.service)}</td>
                  <td className="px-4 py-3"><Badge value={lead.stage} /></td>
                  <td className="px-4 py-3 text-gray-500">{lead.source_page || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
