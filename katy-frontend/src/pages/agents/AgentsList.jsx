import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatDate } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';
import AgentFormModal from './AgentFormModal';

export default function AgentsList() {
  const [showForm, setShowForm] = useState(false);
  const { data: agents, error, loading, reload } = useApi(api.getAgents, []);

  return (
    <div>
      <PageHeader
        title="Agents"
        subtitle="Referral network and commission tracking"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Add Agent
          </button>
        }
      />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {agents && (
        <div className="overflow-hidden clay rounded-3xl bg-brand-50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Coverage Area</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Onboarded</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No agents found</td></tr>
              )}
              {agents.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/agents/${a.id}`} className="font-medium text-brand-700 hover:underline">
                      {a.full_name}
                    </Link>
                    <p className="text-xs text-gray-400">{a.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{a.coverage_area || '—'}</td>
                  <td className="px-4 py-3"><Badge value={a.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(a.onboarded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showForm && (
        <AgentFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); reload(); }}
        />
      )}
    </div>
  );
}
