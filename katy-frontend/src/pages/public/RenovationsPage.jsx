import { CheckCircle2, Image as ImageIcon } from 'lucide-react';
import Hero from '../../components/public/Hero';
import SectionHeading from '../../components/public/SectionHeading';
import SocialProof from '../../components/public/SocialProof';
import LeadForm from '../../components/public/LeadForm';
import { Loading, ErrorMessage } from '../../components/Loading';
import { api } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import Reveal from '../../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../../components/motion/StaggerGroup';
import { STOCK_PHOTOS } from '../../lib/stockPhotos';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

const DEFAULT_FEATURES = [
  'Project management', 'Budget planning', 'Vendor coordination',
  'Site visits', 'Permit coordination', 'Design consultation',
];

export default function RenovationsPage() {
  const { data: profile } = useBusinessProfile();
  const { data: portfolio, error, loading } = useApi(api.getRenovationPortfolio, []);
  const features = profile?.renovation_services?.length ? profile.renovation_services : DEFAULT_FEATURES;

  return (
    <div>
      <Hero
        eyebrow="Renovations"
        title="Interior and exterior renovations, fully managed."
        subtitle="From budget planning to the final walkthrough, we coordinate every vendor and permit so the project stays on track."
        primaryCta={{ label: 'See Our Work', to: '#portfolio' }}
        secondaryCta={{ label: 'Start a Project', to: '#inquire' }}
        image={STOCK_PHOTOS.renovations}
        imageAlt="Construction worker on site"
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

      <section id="portfolio" className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <Reveal><SectionHeading eyebrow="Portfolio" title="Before & after" /></Reveal>
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {portfolio && portfolio.length === 0 && (
          <div className="clay-field flex flex-col items-center gap-3 rounded-2xl py-14 text-center">
            <ImageIcon className="text-gray-300" size={32} />
            <p className="text-sm text-gray-400">Our before & after portfolio is being put together — check back soon.</p>
          </div>
        )}
        {portfolio && portfolio.length > 0 && (
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((job) => (
              <StaggerItem key={job.photo_id}>
                <div className="group overflow-hidden clay rounded-[1.75rem] transition-transform hover:-translate-y-1">
                  <div className="overflow-hidden">
                    <img
                      src={job.url}
                      alt={job.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{job.before_after}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.scope}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      <SocialProof
        title="Projects delivered with care"
        stats={[
          { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
          { value: profile ? `${profile.properties_managed_approx}+` : '—', label: 'Properties Managed' },
          { value: 'End-to-end', label: 'Project Management' },
          { value: 'Metro Manila', label: 'Coverage Area' },
        ]}
      />

      <section id="inquire" className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Renovations" title="Have a project in mind?" />
            <LeadForm defaultService="renovations" title="Start your renovation inquiry" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
