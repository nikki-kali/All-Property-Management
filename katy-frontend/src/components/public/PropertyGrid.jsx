import { useState } from 'react';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { Loading, ErrorMessage } from '../Loading';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';

export default function PropertyGrid({ params = {}, filter, emptyMessage = 'No listings published yet — check back soon.' }) {
  const paramsKey = JSON.stringify(params);
  const { data, error, loading } = useApi(() => api.getPublicProperties(params), [paramsKey]);
  const properties = filter ? (data || []).filter(filter) : data;
  const [selected, setSelected] = useState(null);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!properties || properties.length === 0) {
    return <p className="clay-field rounded-2xl py-10 text-center text-sm text-gray-400">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />
        ))}
      </div>
      <PropertyDetailModal property={selected} onClose={() => setSelected(null)} />
    </>
  );
}
