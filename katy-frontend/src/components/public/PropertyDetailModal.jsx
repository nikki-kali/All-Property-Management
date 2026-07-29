import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Building2, Users,
  Wifi, Car, Waves, Snowflake, ChefHat, Tv, WashingMachine,
  Dumbbell, ShieldCheck, Dog, CigaretteOff, Sofa, Sun, CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatLabel } from '../../lib/format';

const AMENITY_ICONS = [
  [/wifi|internet/i, Wifi],
  [/park/i, Car],
  [/pool|swim/i, Waves],
  [/air.?con|aircon|a\/c/i, Snowflake],
  [/kitchen|cook/i, ChefHat],
  [/tv|television|cable/i, Tv],
  [/wash|laundry/i, WashingMachine],
  [/gym|fitness/i, Dumbbell],
  [/security|guard/i, ShieldCheck],
  [/pet/i, Dog],
  [/no.?smoking|smoke.?free/i, CigaretteOff],
  [/furnish/i, Sofa],
  [/balcony|view/i, Sun],
];

function amenityIcon(label) {
  const match = AMENITY_ICONS.find(([pattern]) => pattern.test(label));
  return match ? match[1] : CheckCircle2;
}

const EASE = [0.21, 0.47, 0.32, 0.98];

export default function PropertyDetailModal({ property, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = property?.photos || [];

  useEffect(() => {
    setPhotoIndex(0);
  }, [property?.id]);

  useEffect(() => {
    if (!property) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') setPhotoIndex((i) => (i + 1) % photos.length);
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [property, photos.length, onClose]);

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="clay flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] bg-brand-50"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-white sm:aspect-[16/9]">
              {photos.length > 0 ? (
                <img
                  key={photos[photoIndex]}
                  src={photos[photoIndex]}
                  alt={`${property.title} — photo ${photoIndex + 1} of ${photos.length}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="text-brand-300" size={56} />
                </div>
              )}

              <button
                onClick={onClose}
                aria-label="Close"
                className="clay-btn absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-gray-700"
              >
                <X size={18} />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                    aria-label="Previous photo"
                    className="clay-btn absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-50 text-gray-700"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                    aria-label="Next photo"
                    className="clay-btn absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-50 text-gray-700"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {photos.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${i === photoIndex ? 'w-4 bg-white' : 'bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="overflow-y-auto p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {formatLabel(property.property_type)}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-gray-900">{property.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{property.address}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-xl font-bold text-gray-900">{formatCurrency(property.rate)}</span>
                {property.rental_term && (
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                    {formatLabel(property.rental_term)}
                  </span>
                )}
                {property.max_occupancy && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users size={16} className="text-brand-600" />
                    Sleeps {property.max_occupancy}
                  </span>
                )}
              </div>

              {property.description && (
                <p className="mt-4 text-sm leading-relaxed text-gray-700">{property.description}</p>
              )}

              {(property.amenities || []).length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">What this place offers</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {property.amenities.map((a) => {
                      const Icon = amenityIcon(a);
                      return (
                        <div key={a} className="clay-sm flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3">
                          <Icon size={18} className="shrink-0 text-brand-600" />
                          <span className="text-sm text-gray-700">{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
