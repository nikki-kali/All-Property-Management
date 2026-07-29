import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

// Animates the leading number in a stat string ("28+", "₱0", "4") on scroll into
// view. Falls back to rendering the value as-is if it has no leading number
// (e.g. "Metro Manila").
export default function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const match = typeof value === 'string' ? value.match(/^(\D*)(\d+)(.*)$/) : null;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!match || !isInView) return undefined;
    const target = Number(match[2]);
    const controls = animate(0, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  );
}
