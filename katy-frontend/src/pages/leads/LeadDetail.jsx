import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatCurrency, formatDate, formatLabel } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';

const STAGES = ['new', 'contacted', 'qualified', 'proposal_sent', 'closed', 'lost'];

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function LeadDetail() {
  const { id } = useParams();
  const { data: lead, error, loading, reload } = useApi(() => api.getLead(id), [id]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function handleStageChange(e) {
    setActionError(null);
    try {
      await api.updateLeadStage(id, e.target.value);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await api.addLeadNote(id, note);
      setNote('');
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!lead) return null;

  return (
    <div>
      <Link to="/admin/leads" className="text-sm text-gray-500 hover:underline">&larr; Back to leads</Link>
      <PageHeader
        title={lead.client_name || 'Unknown client'}
        subtitle={`${formatLabel(lead.service)} lead · created ${formatDate(lead.created_at)}`}
        action={
          <select
            value={lead.stage}
            onChange={handleStageChange}
            className="clay-field rounded-xl px-3 py-1.5 text-sm"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{formatLabel(s)}</option>
            ))}
          </select>
        }
      />

      {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-1">
          <h2 className="mb-4 font-semibold text-gray-900">Lead Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Stage" value={<Badge value={lead.stage} />} />
            <Field label="Email" value={lead.client_email} />
            <Field label="Phone" value={lead.client_phone} />
            <Field label="Budget" value={formatCurrency(lead.budget)} />
            <Field label="Move-in Date" value={formatDate(lead.move_in_date)} />
            <Field label="Current Address" value={lead.current_address} />
            <Field label="Preferred Contact" value={formatLabel(lead.preferred_contact_method)} />
            <Field label="Source Page" value={lead.source_page} />
            <Field label="Proposal Sent" value={formatDate(lead.proposal_sent_at)} />
          </div>
        </div>

        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Activity</h2>

          <form onSubmit={handleAddNote} className="mb-5 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note…"
              className="flex-1 clay-field rounded-xl px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Add Note'}
            </button>
          </form>

          <ul className="space-y-3">
            {(lead.activity || []).length === 0 && <p className="text-sm text-gray-400">No activity yet</p>}
            {(lead.activity || []).map((item) => (
              <li key={item.id} className="border-b border-gray-50 pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {formatLabel(item.activity_type)}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-800">{item.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
