import Hero from '../../components/public/Hero';
import SectionHeading from '../../components/public/SectionHeading';
import SocialProof from '../../components/public/SocialProof';
import Reveal from '../../components/motion/Reveal';
import { STOCK_PHOTOS } from '../../lib/stockPhotos';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

export default function AboutPage() {
  const { data: profile } = useBusinessProfile();

  return (
    <div>
      <Hero
        eyebrow="About Us"
        title={profile ? `Meet ${profile.primary_contact_name}` : 'About Katy Property Solutions'}
        subtitle={
          profile
            ? `Founder and primary contact behind Katy Property Solutions, a ${profile.business_type.toLowerCase()} company serving property owners, buyers, sellers, and tenants across Metro Manila.`
            : 'A full-service property management company serving owners, buyers, sellers, and tenants.'
        }
        primaryCta={{ label: 'Get in Touch', to: '/contact' }}
        image={STOCK_PHOTOS.about}
        imageAlt="Team working together around a table"
      />

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-24">
        <Reveal>
          <SectionHeading eyebrow="Our Mission" title="Property services that don't require a middleman for every step" center={false} />
          <div className="space-y-4 text-gray-600">
            <p>
              Katy Property Solutions was built around a simple idea: owning, renting, buying, selling, renovating,
              or titling a property in Metro Manila shouldn't mean juggling five different contacts. One team
              handles the tenant search, the lease, the renovation crew, and the paperwork — so you only have to
              explain your situation once.
            </p>
            <p>
              {profile
                ? `Over ${profile.years_in_business} years, that approach has grown into a portfolio of roughly ${profile.properties_managed_approx} managed properties and a partner network of ${profile.agent_count_reported} referral agents.`
                : 'The team has grown steadily by focusing on responsiveness and follow-through, not just listings.'}
            </p>
            <p>
              Team photos, headshots, and a full company story are on the way as we finish putting the site together —
              check back soon, or reach out directly if you'd like to talk to us now.
            </p>
          </div>
        </Reveal>
      </section>

      <SocialProof
        title="By the numbers"
        stats={[
          { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
          { value: profile ? `${profile.properties_managed_approx}+` : '—', label: 'Properties Managed' },
          { value: profile ? `${profile.active_listings_approx}+` : '—', label: 'Active Listings' },
          { value: profile ? `${profile.agent_count_reported}` : '—', label: 'Partner Agents' },
        ]}
      />
    </div>
  );
}
