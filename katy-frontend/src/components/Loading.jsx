export function Loading() {
  return <p className="text-sm text-gray-400">Loading…</p>;
}

export function ErrorMessage({ message }) {
  return (
    <p className="clay-sm rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {message}
    </p>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}
