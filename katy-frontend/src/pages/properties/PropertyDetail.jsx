import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { formatCurrency, formatDate, formatLabel } from '../../lib/format';
import { PageHeader, Loading, ErrorMessage } from '../../components/Loading';
import Badge from '../../components/Badge';
import RenovationJobsSection from './RenovationJobsSection';
import TitlingJobsSection from './TitlingJobsSection';

const STATUSES = ['available', 'occupied', 'under_renovation', 'for_sale', 'sold'];

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { data: property, error, loading, reload } = useApi(() => api.getProperty(id), [id]);
  const { data: allTenants } = useApi(api.getTenants, []);
  const tenants = (allTenants || []).filter((t) => t.property_id === id);
  const [actionError, setActionError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  async function handleStatusChange(e) {
    setActionError(null);
    try {
      await api.updateProperty(id, { status: e.target.value });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleTogglePublish() {
    setActionError(null);
    try {
      await api.updateProperty(id, { is_published: !property.is_published });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleAddPhoto(e) {
    e.preventDefault();
    if (!photoUrl.trim()) return;
    setSavingPhoto(true);
    setActionError(null);
    try {
      await api.addPropertyPhoto(id, { url: photoUrl });
      setPhotoUrl('');
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSavingPhoto(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!property) return null;

  return (
    <div>
      <Link to="/admin/properties" className="text-sm text-gray-500 hover:underline">&larr; Back to properties</Link>
      <PageHeader
        title={property.title}
        subtitle={property.address}
        action={
          <div className="flex items-center gap-2">
            <select value={property.status} onChange={handleStatusChange}
              className="clay-field rounded-xl px-3 py-1.5 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
            </select>
            <button
              onClick={handleTogglePublish}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                property.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {property.is_published ? 'Published' : 'Unpublished'}
            </button>
          </div>
        }
      />

      {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-1">
          <h2 className="mb-4 font-semibold text-gray-900">Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Status" value={<Badge value={property.status} />} />
            <Field label="Type" value={formatLabel(property.property_type)} />
            <Field label="Size" value={property.size_sqm ? `${property.size_sqm} sqm` : '—'} />
            <Field label="Rental Term" value={formatLabel(property.rental_term)} />
            <Field label="Rate" value={formatCurrency(property.rate)} />
            <Field
              label="Tenant"
              value={
                tenants.length === 0
                  ? null
                  : tenants.map((t) => (
                      <Link key={t.id} to={`/admin/tenants/${t.id}`} className="block text-brand-700 hover:underline">
                        {t.full_name} <span className="text-xs text-gray-400">(through {formatDate(t.lease_end)})</span>
                      </Link>
                    ))
              }
            />
            <Field label="Description" value={property.description} />
          </div>
        </div>

        <div className="clay rounded-3xl bg-brand-50 p-5 md:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Photos</h2>

          <form onSubmit={handleAddPhoto} className="mb-5 flex gap-2">
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Photo URL…"
              className="flex-1 clay-field rounded-xl px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={savingPhoto}
              className="clay-btn rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {savingPhoto ? 'Saving…' : 'Add Photo'}
            </button>
          </form>

          {(property.photos || []).length === 0 && <p className="text-sm text-gray-400">No photos yet</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(property.photos || []).map((photo) => (
              <img key={photo.id} src={photo.url} alt="" className="h-24 w-full rounded-lg object-cover" />
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <RenovationJobsSection propertyId={id} jobs={property.renovation_jobs || []} onChange={reload} />
        </div>

        <div className="md:col-span-3">
          <TitlingJobsSection propertyId={id} jobs={property.titling_jobs || []} onChange={reload} />
        </div>
      </div>
    </div>
  );
}
