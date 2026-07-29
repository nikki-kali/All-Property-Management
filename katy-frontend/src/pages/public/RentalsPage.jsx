import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../../components/public/Hero';
import SectionHeading from '../../components/public/SectionHeading';
import SocialProof from '../../components/public/SocialProof';
import LeadForm from '../../components/public/LeadForm';
import PropertyGrid from '../../components/public/PropertyGrid';
import Reveal from '../../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../../components/motion/StaggerGroup';
import { STOCK_PHOTOS } from '../../lib/stockPhotos';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

const DEFAULT_FEATURES = [
  'Tenant placement', 'Lease management', 'Rent collection',
  'Property maintenance coordination', 'Eviction support',
];

export default function RentalsPage() {
  const { data: profile } = useBusinessProfile();
  const [term, setTerm] = useState('long_term');

  const features = profile?.rental_services?.length ? profile.rental_services : DEFAULT_FEATURES;

  return (
    <div>
      <Hero
        eyebrow="Rentals"
        title="Short-term stays, long-term homes."
        subtitle="We manage the tenant search, the lease, and the rent collection — for owners and tenants alike."
        primaryCta={{ label: 'Browse Listings', to: '#listings' }}
        secondaryCta={{ label: 'Talk to Us', to: '#inquire' }}
        image={STOCK_PHOTOS.rentals}
        imageAlt="Bright, furnished rental living room"
      />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <Reveal><SectionHeading eyebrow="How It Works" title="What's included" /></Reveal>
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f}>
              <div className="clay-sm flex h-full items-start gap-3 rounded-2xl bg-brand-50 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={18} />
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section id="listings" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <Reveal>
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <SectionHeading center={false} eyebrow="Available Now" title="Rental listings" />
            <div className="clay-field flex rounded-2xl p-1">
              {[{ key: 'long_term', label: 'Long Term' }, { key: 'short_term', label: 'Short Term' }].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTerm(opt.key)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    term === opt.key ? 'clay-btn bg-brand-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <PropertyGrid params={{ rental_term: term }} emptyMessage="No listings published for this term yet — contact us to ask about upcoming availability." />
        <p className="mt-6 text-center text-sm text-gray-400">
          Interested in viewing a unit? Reach out below and we'll confirm current availability with you directly.
        </p>
        {term === 'short_term' && (
          <p className="mt-2 text-center text-sm text-gray-400">
            Booking a short-term stay? Review our{' '}
            <Link to="/rebooking-refund-policy" className="font-medium text-brand-700 hover:underline">
              Rebooking &amp; Refund Policy
            </Link>{' '}
            before you confirm.
          </p>
        )}
      </section>

      <SocialProof
        title="Rentals, handled end to end"
        stats={[
          { value: profile ? `${profile.active_listings_approx}+` : '—', label: 'Active Listings' },
          { value: profile ? `${profile.properties_managed_approx}+` : '—', label: 'Properties Managed' },
          { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
          { value: 'Metro Manila', label: 'Coverage Area' },
        ]}
      />

      <section id="inquire" className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Rentals" title="Looking to rent, or list your property?" />
            <LeadForm defaultService="rentals" title="Start your rental inquiry" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
