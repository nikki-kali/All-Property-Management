import { formatLabel } from '../lib/format';

const COLORS = {
  new: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-indigo-100 text-indigo-700',
  proposal_sent: 'bg-amber-100 text-amber-700',
  closed: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',

  available: 'bg-emerald-100 text-emerald-700',
  occupied: 'bg-blue-100 text-blue-700',
  under_renovation: 'bg-amber-100 text-amber-700',
  for_sale: 'bg-indigo-100 text-indigo-700',
  sold: 'bg-slate-100 text-slate-700',

  applied: 'bg-slate-100 text-slate-700',
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-rose-100 text-rose-700',

  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700',
  late: 'bg-rose-100 text-rose-700',
  partial: 'bg-blue-100 text-blue-700',
  released: 'bg-emerald-100 text-emerald-700',

  in_progress: 'bg-amber-100 text-amber-700',
  complete: 'bg-emerald-100 text-emerald-700',
  on_hold: 'bg-rose-100 text-rose-700',
};

export default function Badge({ value }) {
  const color = COLORS[value] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {formatLabel(value)}
    </span>
  );
}
