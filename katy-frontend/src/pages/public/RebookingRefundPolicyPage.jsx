import SectionHeading from '../../components/public/SectionHeading';

export default function RebookingRefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Rebooking & Refund Policy" center={false} />
      <p className="clay-sm mb-8 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Placeholder policy — pending confirmation of exact rates, deadlines, and fees before launch.
      </p>
      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Scope</h2>
          <p>
            This policy covers <strong>short-term rental bookings</strong> arranged through Katy Property
            Solutions. Long-term leases, property sales, renovation projects, and titling engagements are
            governed by their own signed agreements, not by this page.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Cancellations & Refunds</h2>
          <p>As a general guide, cancellations are typically eligible for a refund as follows:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>7 or more days before check-in — full refund, less any payment processing fees.</li>
            <li>3–6 days before check-in — 50% refund.</li>
            <li>Less than 3 days before check-in, or no-shows — non-refundable.</li>
          </ul>
          <p className="mt-2">
            Exact windows, fees, and percentages will be confirmed per listing and stated at the time of
            booking — the figures above are indicative only.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Rebooking</h2>
          <p>
            Instead of a refund, guests may request to rebook their stay for a future date, subject to
            availability. Rebooked stays are generally valid for use within 12 months of the original
            booking date, and a stay may typically be rebooked once at no extra charge.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Circumstances Beyond Our Control</h2>
          <p>
            In the event a booking is affected by circumstances outside anyone's reasonable control —
            natural disasters, government-ordered restrictions, or similar events — we'll offer a full
            refund or a free rebooking, regardless of how close to check-in the cancellation occurs.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">How to Request a Refund or Rebooking</h2>
          <p>
            Email hello@katypropertysolutions.com with your booking details and the reason for your
            request. We aim to respond within one business day.
          </p>
        </div>
      </div>
    </div>
  );
}
