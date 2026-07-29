import AnimatedCounter from '../motion/AnimatedCounter';

export default function StatBlock({ value, label }) {
  return (
    <div className="clay-sm rounded-2xl bg-brand-50 p-5 text-center transition-transform hover:-translate-y-0.5">
      <p className="font-display text-4xl font-semibold text-brand-700">
        <AnimatedCounter value={value} />
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}
