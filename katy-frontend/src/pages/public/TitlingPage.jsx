import { CheckSquare } from 'lucide-react';
import Hero from '../../components/public/Hero';
import SectionHeading from '../../components/public/SectionHeading';
import SocialProof from '../../components/public/SocialProof';
import LeadForm from '../../components/public/LeadForm';
import Reveal from '../../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../../components/motion/StaggerGroup';
import { STOCK_PHOTOS } from '../../lib/stockPhotos';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

const DEFAULT_STEPS = [
  'Title search', 'Deed preparation', 'Document filing',
  'Notarization coordination', 'Compliance review',
];

export default function TitlingPage() {
  const { data: profile } = useBusinessProfile();
  const steps = profile?.titling_services?.length ? profile.titling_services : DEFAULT_STEPS;

  return (
    <div>
      <Hero
        eyebrow="Titling"
        title="Title transfer and documentation, done right."
        subtitle="Property titling involves paperwork most people only deal with once. We handle the search, filing, and compliance so nothing gets missed."
        primaryCta={{ label: 'Start a Request', to: '#inquire' }}
        secondaryCta={{ label: 'See the Process', to: '#process' }}
        image={STOCK_PHOTOS.titling}
        imageAlt="Person signing property documents"
      />

      <section id="process" className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <Reveal><SectionHeading eyebrow="Process" title="How a titling job moves forward" /></Reveal>
        <StaggerGroup className="space-y-4">
          {steps.map((step, i) => (
            <StaggerItem key={step}>
              <div className="clay-sm flex items-start gap-4 rounded-2xl bg-brand-50 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{step}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24">
        <Reveal><SectionHeading eyebrow="Checklist" title="Documents we'll typically need" /></Reveal>
        <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {['Owner\'s valid ID', 'Certified true copy of title', 'Tax declaration', 'Latest real property tax receipt', 'Deed of sale or transfer document', 'Special power of attorney (if applicable)'].map((doc) => (
            <StaggerItem key={doc}>
              <div className="clay-sm flex h-full items-start gap-3 rounded-2xl bg-brand-50 p-4">
                <CheckSquare className="mt-0.5 shrink-0 text-brand-600" size={18} />
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <p className="mt-4 text-sm text-gray-400">Exact requirements vary by transaction type — we'll confirm your specific checklist once we understand your situation.</p>
      </section>

      <SocialProof
        title="Titling handled with compliance in mind"
        stats={[
          { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
          { value: profile ? `${profile.properties_managed_approx}+` : '—', label: 'Properties Managed' },
          { value: 'Full', label: 'Compliance Review' },
          { value: 'Metro Manila', label: 'Coverage Area' },
        ]}
      />

      <section id="inquire" className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Titling" title="Start your titling request" />
            <LeadForm defaultService="titling" title="Tell us about the property" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
