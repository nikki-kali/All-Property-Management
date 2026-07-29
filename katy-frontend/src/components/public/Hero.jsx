import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.21, 0.47, 0.32, 0.98];

export default function Hero({ eyebrow, title, subtitle, primaryCta, secondaryCta, image, imageAlt, visual, badge }) {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background blobs — purely visual, clipped by the section */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-16 top-32 h-64 w-64 rounded-full bg-brand-50 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {eyebrow && (
              <p className="mb-4 inline-flex items-center rounded-full bg-brand-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 sm:text-sm">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-4xl font-semibold leading-[1.08] text-gray-900 sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {subtitle && <p className="mt-5 max-w-lg text-base text-gray-500 sm:text-lg">{subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta && (
                <Link
                  to={primaryCta.to}
                  className="clay-btn rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className="clay-btn rounded-2xl bg-brand-50 px-6 py-3 text-sm font-semibold text-gray-700"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="relative"
          >
            <div className="clay aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-100 via-brand-50 to-white">
              {image ? (
                <img src={image} alt={imageAlt || ''} className="h-full w-full object-cover" />
              ) : (
                visual
              )}
            </div>

            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
                className="clay absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 sm:-left-8"
              >
                {badge.icon && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <badge.icon size={20} />
                  </div>
                )}
                <div className="leading-tight">
                  <p className="font-display text-lg font-semibold text-gray-900">{badge.title}</p>
                  <p className="text-xs text-gray-500">{badge.subtitle}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
