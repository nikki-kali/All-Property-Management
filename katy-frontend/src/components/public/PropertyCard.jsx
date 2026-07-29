import { Building2 } from 'lucide-react';
import { formatCurrency, formatLabel } from '../../lib/format';

export default function PropertyCard({ property }) {
  return (
    <div className="group overflow-hidden clay rounded-[1.75rem] bg-brand-50 transition-transform hover:-translate-y-1">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-white">
        {property.photo_url ? (
          <img
            src={property.photo_url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Building2 className="text-brand-300" size={40} />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{formatLabel(property.property_type)}</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{property.address}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(property.rate)}</span>
          {property.rental_term && (
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              {formatLabel(property.rental_term)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
