import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatCurrency, formatDate, formatLabel } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';

const STATUSES = ['applied', 'active', 'inactive'];

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function AgentDetail() {
  const { id } = useParams();
  const { data: agents, reload: reloadAgents } = useApi(api.getAgents, []);
  const agent = (agents || []).find((a) => a.id === id);

  const { data: referrals, error: refError, loading: refLoading } = useApi(() => api.getAgentReferrals(id), [id]);
  const { data: commissions, error: commError, loading: commLoading, reload: reloadCommissions } = useApi(() => api.getAgentCommissions(id), [id]);

  const [statusSaving, setStatusSaving] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [commForm, setCommForm] = useState({ amount: '', service: '' });
  const [savingComm, setSavingComm] = useState(false);

  async function handleStatusChange(e) {
    setStatusSaving(true);
    setActionError(null);
    try {
      await api.updateAgentStatus(id, e.target.value);
      reloadAgents();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleAddCommission(e) {
    e.preventDefault();
    setSavingComm(true);
    setActionError(null);
    try {
      await api.addCommission(id, {
        amount: commForm.amount ? Number(commForm.amount) : null,
        service: commForm.service || null,
      });
      setCommForm({ amount: '', service: '' });
      reloadCommissions();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSavingComm(false);
    }
  }

  async function handleRelease(commissionId) {
    setActionError(null);
    try {
      await api.releaseCommission(commissionId);
      reloadCommissions();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (!agent) return <Loading />;

  return (
    <div>
      <Link to="/admin/agents" className="text-sm text-gray-500 hover:underline">&larr; Back to agents</Link>
      <PageHeader
        title={agent.full_name}
        subtitle={agent.coverage_area || 'Referral agent'}
        action={
          <select value={agent.status} disabled={statusSaving} onChange={handleStatusChange}
            className="clay-field rounded-xl px-3 py-1.5 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
          </select>
        }
      />

      {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-1">
          <h2 className="mb-4 font-semibold text-gray-900">Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Status" value={<Badge value={agent.status} />} />
            <Field label="Email" value={agent.email} />
            <Field label="Phone" value={agent.phone} />
            <Field label="Onboarded" value={formatDate(agent.onboarded_at)} />
          </div>
        </div>

        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Referred Leads</h2>
          {refLoading && <Loading />}
          {refError && <ErrorMessage message={refError} />}
          {referrals && (
            <table className="mb-6 w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Service</th>
                  <th className="pb-2 pr-4 font-medium">Stage</th>
                  <th className="pb-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length === 0 && (
                  <tr><td colSpan={3} className="py-3 text-gray-400">No referrals yet</td></tr>
                )}
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4">{formatLabel(r.service)}</td>
                    <td className="py-2 pr-4"><Badge value={r.stage} /></td>
                    <td className="py-2">{formatDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="mb-4 font-semibold text-gray-900">Commissions</h2>
          <form onSubmit={handleAddCommission} className="mb-4 flex gap-2">
            <input placeholder="Amount" type="number" value={commForm.amount}
              onChange={(e) => setCommForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-32 clay-field rounded-xl px-3 py-2 text-sm" />
            <input placeholder="Service (optional)" value={commForm.service}
              onChange={(e) => setCommForm((f) => ({ ...f, service: e.target.value }))}
              className="flex-1 clay-field rounded-xl px-3 py-2 text-sm" />
            <button type="submit" disabled={savingComm}
              className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
              {savingComm ? 'Saving…' : 'Add'}
            </button>
          </form>

          {commLoading && <Loading />}
          {commError && <ErrorMessage message={commError} />}
          {commissions && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Service</th>
                  <th className="pb-2 pr-4 font-medium text-right">Amount</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 && (
                  <tr><td colSpan={4} className="py-3 text-gray-400">No commissions yet</td></tr>
                )}
                {commissions.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4">{formatLabel(c.service)}</td>
                    <td className="py-2 pr-4 text-right">{formatCurrency(c.amount)}</td>
                    <td className="py-2 pr-4"><Badge value={c.status} /></td>
                    <td className="py-2 text-right">
                      {c.status === 'pending' && (
                        <button onClick={() => handleRelease(c.id)} className="text-xs font-medium text-brand-700 hover:underline">
                          Release
                        </button>
                      )}
                    </td>
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
