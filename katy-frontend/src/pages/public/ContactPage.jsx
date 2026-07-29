import { Mail, MapPin } from 'lucide-react';
import SectionHeading from '../../components/public/SectionHeading';
import LeadForm from '../../components/public/LeadForm';
import Reveal from '../../components/motion/Reveal';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

export default function ContactPage() {
  const { data: profile } = useBusinessProfile();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <Reveal><SectionHeading eyebrow="Contact" title="Let's talk about your property" center={false} /></Reveal>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="clay-sm flex items-start gap-3 rounded-2xl bg-brand-50 p-4">
              <Mail className="mt-0.5 shrink-0 text-brand-600" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{profile?.contact_email || 'hello@katypropertysolutions.com'}</p>
              </div>
            </div>
            <div className="clay-sm flex items-start gap-3 rounded-2xl bg-brand-50 p-4">
              <MapPin className="mt-0.5 shrink-0 text-brand-600" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Coverage Area</p>
                <p className="text-sm text-gray-500">Metro Manila</p>
              </div>
            </div>
          </div>

          <div className="clay-field mt-8 flex aspect-video items-center justify-center rounded-2xl text-sm text-gray-400">
            Map coming soon — office address pending confirmation
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <LeadForm title="Send us a message" subtitle="We usually respond within one business day." />
        </Reveal>
      </div>
    </div>
  );
}
