export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`mx-auto mb-12 max-w-2xl ${center ? 'text-center' : ''}`}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold text-gray-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-gray-500">{subtitle}</p>}
    </div>
  );
}
