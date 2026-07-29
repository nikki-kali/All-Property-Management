import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
  'Buyer representation', 'Seller representation', 'Comparative market analysis',
  'Offer negotiation', 'Open house support',
];

export default function BuySellPage() {
  const { data: profile } = useBusinessProfile();
  const [intent, setIntent] = useState('buy');

  const features = profile?.buy_sell_services?.length ? profile.buy_sell_services : DEFAULT_FEATURES;

  return (
    <div>
      <Hero
        eyebrow="Buy & Sell"
        title={intent === 'buy' ? 'Find a property worth calling home.' : 'Sell with a team that knows the market.'}
        subtitle={
          intent === 'buy'
            ? "Tell us your budget and must-haves, and we'll match you with listings and set up viewings."
            : "We'll price it right, market it well, and negotiate on your behalf from listing to closing."
        }
        primaryCta={{ label: 'Browse Listings', to: '#listings' }}
        secondaryCta={{ label: 'Talk to Us', to: '#inquire' }}
        image={STOCK_PHOTOS.buySell}
        imageAlt="Modern white house exterior"
      />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="clay-field mx-auto flex w-fit rounded-2xl p-1">
          {[{ key: 'buy', label: 'I want to buy' }, { key: 'sell', label: 'I want to sell' }].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setIntent(opt.key)}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                intent === opt.key ? 'clay-btn bg-brand-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
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

      {intent === 'buy' && (
        <section id="listings" className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
          <Reveal><SectionHeading eyebrow="For Sale" title="Properties on the market" /></Reveal>
          <PropertyGrid
            filter={(p) => !p.rental_term}
            emptyMessage="No sale listings published yet — tell us what you're looking for and we'll reach out when something matches."
          />
        </section>
      )}

      <SocialProof
        title="A market-savvy team on your side"
        stats={[
          { value: profile ? `${profile.properties_managed_approx}+` : '—', label: 'Properties Managed' },
          { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
          { value: profile ? `${profile.agent_count_reported}` : '—', label: 'Partner Agents' },
          { value: 'Metro Manila', label: 'Coverage Area' },
        ]}
      />

      <section id="inquire" className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Buy & Sell" title={intent === 'buy' ? 'Tell us what you’re looking for' : 'Tell us about your property'} />
            <LeadForm defaultService="buy_sell" title={intent === 'buy' ? 'Start your buyer inquiry' : 'Start your seller inquiry'} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
