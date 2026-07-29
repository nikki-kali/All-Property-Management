import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatCurrency, formatLabel } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';
import PropertyFormModal from './PropertyFormModal';

const STATUSES = ['available', 'occupied', 'under_renovation', 'for_sale', 'sold'];

export default function PropertiesList() {
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);

  const params = {};
  if (status) params.status = status;

  const { data: properties, error, loading, reload } = useApi(() => api.getProperties(params), [status]);

  return (
    <div>
      <PageHeader
        title="Properties"
        subtitle="Listings across rentals, sales, and renovation jobs"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Add Property
          </button>
        }
      />

      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="clay-field rounded-xl px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{formatLabel(s)}</option>
          ))}
        </select>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {properties && (
        <div className="overflow-hidden clay rounded-3xl bg-brand-50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Rate</th>
                <th className="px-4 py-3 font-medium">Published</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No properties found</td></tr>
              )}
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/properties/${p.id}`} className="font-medium text-brand-700 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.address}</td>
                  <td className="px-4 py-3 text-gray-500">{formatLabel(p.property_type)}</td>
                  <td className="px-4 py-3"><Badge value={p.status} /></td>
                  <td className="px-4 py-3 text-right">{formatCurrency(p.rate)}</td>
                  <td className="px-4 py-3">{p.is_published ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showForm && (
        <PropertyFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); reload(); }}
        />
      )}
    </div>
  );
}
