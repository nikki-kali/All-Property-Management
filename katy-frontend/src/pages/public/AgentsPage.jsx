import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import Hero from '../../components/public/Hero';
import SectionHeading from '../../components/public/SectionHeading';
import SocialProof from '../../components/public/SocialProof';
import { ErrorMessage } from '../../components/Loading';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/format';
import Reveal from '../../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../../components/motion/StaggerGroup';
import { STOCK_PHOTOS } from '../../lib/stockPhotos';
import { useBusinessProfile } from '../../lib/useBusinessProfile';

function EarningsCalculator() {
  const [dealValue, setDealValue] = useState('2000000');
  const [rate, setRate] = useState('3');

  const commission = useMemo(() => {
    const value = Number(dealValue) || 0;
    const pct = Number(rate) || 0;
    return (value * pct) / 100;
  }, [dealValue, rate]);

  return (
    <div className="clay rounded-[1.75rem] bg-brand-50 p-6">
      <div className="flex items-center gap-2 text-brand-600">
        <Calculator size={18} />
        <p className="text-sm font-semibold uppercase tracking-wide">Earnings Estimator</p>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Plug in a deal value and a commission rate to see what a closed referral could look like.
        Your actual commission rate and split are confirmed during onboarding.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">Deal value (₱)</span>
          <input type="number" value={dealValue} onChange={(e) => setDealValue(e.target.value)}
            className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">Assumed commission rate (%)</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
            className="w-full clay-field rounded-xl px-3 py-2 text-sm" />
        </label>
      </div>
      <div className="clay-field mt-5 rounded-2xl bg-brand-50 p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Estimated Commission</p>
        <p className="mt-1 text-2xl font-bold text-brand-800">{formatCurrency(commission)}</p>
      </div>
    </div>
  );
}

function AgentApplicationForm() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', coverage_area: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.submitAgentApplication(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="clay-sm rounded-2xl bg-emerald-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-emerald-800">Application received!</h3>
        <p className="mt-2 text-sm text-emerald-700">We'll review your application and follow up with next steps.</p>
      </div>
    );
  }

  return (
    <div className="clay rounded-[1.75rem] bg-brand-50 p-8">
      <h3 className="text-lg font-semibold text-gray-900">Apply to join the network</h3>
      <p className="mt-1 text-sm text-gray-500">Zero cost to apply — you earn a commission when your referral closes.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <ErrorMessage message={error} />}
        <input required placeholder="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2.5 text-sm" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input required placeholder="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)}
            className="clay-field rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <input placeholder="Coverage area (e.g. BGC & Taguig)" value={form.coverage_area} onChange={(e) => update('coverage_area', e.target.value)}
          className="w-full clay-field rounded-xl px-3 py-2.5 text-sm" />
        <button type="submit" disabled={submitting}
          className="w-full clay-btn rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

export default function AgentsPage() {
  const { data: profile } = useBusinessProfile();
  const services = profile?.agent_sourcing_services?.length
    ? profile.agent_sourcing_services
    : ['Agent recruitment', 'Agent screening', 'Commission split setup', 'Referral matching'];

  return (
    <div>
      <Hero
        eyebrow="Agent Network"
        title="Refer clients, earn commission — no cost to join."
        subtitle="Whether you're a full-time broker or just have a strong network, we make it easy to refer clients across rentals, sales, renovations, and titling."
        primaryCta={{ label: 'Apply Now', to: '#apply' }}
        secondaryCta={{ label: 'See How It Works', to: '#how-it-works' }}
        image={STOCK_PHOTOS.agents}
        imageAlt="Business handshake"
      />

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <Reveal><SectionHeading eyebrow="How It Works" title="What we handle for you" /></Reveal>
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <StaggerItem key={s}>
              <div className="clay-sm h-full rounded-2xl bg-brand-50 p-5 text-center">
                <p className="text-sm font-medium text-gray-800">{s}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <Reveal>
          <SectionHeading eyebrow="Commission" title="How referrals pay out" />
          <div className="overflow-hidden clay rounded-[1.75rem]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Service</th>
                    <th className="px-5 py-3 font-medium">Payout Trigger</th>
                    <th className="px-5 py-3 font-medium">Commission Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Rentals', 'Lease signed'],
                    ['Buy & Sell', 'Sale closes'],
                    ['Renovations', 'Project contracted'],
                    ['Titling', 'Service engaged'],
                  ].map(([service, trigger]) => (
                    <tr key={service} className="border-t border-gray-100">
                      <td className="px-5 py-3 font-medium text-gray-900">{service}</td>
                      <td className="px-5 py-3 text-gray-500">{trigger}</td>
                      <td className="px-5 py-3 text-gray-400">Confirmed at onboarding</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <Reveal><EarningsCalculator /></Reveal>
      </section>

      <SocialProof
        title="A growing referral network"
        stats={[
          { value: profile ? `${profile.agent_count_reported}` : '—', label: 'Partner Agents' },
          { value: profile ? `${profile.years_in_business}+` : '—', label: 'Years in Business' },
          { value: '₱0', label: 'Cost to Apply' },
          { value: 'Metro Manila', label: 'Coverage Area' },
        ]}
      />

      <section id="apply" className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Join Us" title="Apply to become a referral agent" />
            <AgentApplicationForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
