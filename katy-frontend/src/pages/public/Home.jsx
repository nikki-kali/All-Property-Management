import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import Hero from '../../components/public/Hero';
import SectionHeading from '../../components/public/SectionHeading';
import SocialProof from '../../components/public/SocialProof';
import LeadForm from '../../components/public/LeadForm';
import Reveal from '../../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../../components/motion/StaggerGroup';
import { SERVICES } from '../../lib/services';
import { STOCK_PHOTOS } from '../../lib/stockPhotos';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

export default function Home() {
  const { data: profile } = useBusinessProfile();

  const stats = [
    { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
    { value: profile ? `${profile.properties_managed_approx}+` : '—', label: 'Properties Managed' },
    { value: profile ? `${profile.active_listings_approx}+` : '—', label: 'Active Listings' },
    { value: profile ? `${profile.agent_count_reported}` : '—', label: 'Partner Agents' },
  ];

  return (
    <div>
      <Hero
        eyebrow="Katy Property Solutions"
        title="Property management, buying, selling, and renovation — all under one roof."
        subtitle="From tenant placement to titling paperwork, we handle the details so you don't have to. One team, five services, zero guesswork."
        primaryCta={{ label: 'Get in Touch', to: '/contact' }}
        secondaryCta={{ label: 'Explore Services', to: '#services' }}
        image={STOCK_PHOTOS.home}
        imageAlt="Model house with keys, representing property ownership"
        badge={
          profile && {
            icon: Building2,
            title: `${profile.properties_managed_approx}+ Properties`,
            subtitle: 'Actively managed',
          }
        }
      />

      <section id="services" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="What We Do"
            title="Five services, one point of contact"
            subtitle="Wherever you are in the property journey, there's a Katy Property Solutions service built for it."
          />
        </Reveal>
        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const featured = i === 0;
            return (
              <StaggerItem key={s.key} className={featured ? 'sm:col-span-2 lg:col-span-2' : ''}>
                <Link
                  to={s.slug}
                  className={`group clay flex h-full flex-col rounded-[1.75rem] bg-brand-50 transition-transform hover:-translate-y-1 ${
                    featured ? 'justify-between gap-6 p-8 sm:flex-row sm:items-center' : 'p-6'
                  }`}
                >
                  <div>
                    <div
                      className={`flex items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white ${
                        featured ? 'h-14 w-14' : 'h-11 w-11'
                      }`}
                    >
                      <Icon size={featured ? 26 : 22} />
                    </div>
                    <h3 className={`mt-4 font-display font-semibold text-gray-900 ${featured ? 'text-2xl' : 'text-lg'}`}>
                      {s.name}
                    </h3>
                    <p className={`mt-2 text-gray-500 ${featured ? 'max-w-sm text-base' : 'text-sm'}`}>
                      {featured ? s.tagline : s.description}
                    </p>
                    {featured && <p className="mt-3 text-sm text-gray-500">{s.description}</p>}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight size={16} />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <SocialProof
        title="Trusted across Metro Manila"
        subtitle="A growing team, a growing portfolio."
        stats={stats}
      />

      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="About Katy"
            title={profile ? `Led by ${profile.primary_contact_name}` : 'About Katy Property Solutions'}
            subtitle={
              profile
                ? `A ${profile.business_type.toLowerCase()} company built on hands-on service — from the first inquiry to the day your keys are handed over.`
                : undefined
            }
          />
          <Link to="/about" className="text-sm font-semibold text-brand-700 hover:underline">
            Learn more about our story &rarr;
          </Link>
        </Reveal>
      </section>

      <section id="contact" className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Get Started" title="Tell us what you need" />
            <LeadForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
