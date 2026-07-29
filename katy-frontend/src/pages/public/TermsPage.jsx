import SectionHeading from '../../components/public/SectionHeading';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Terms of Service" center={false} />
      <p className="clay-sm mb-8 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Placeholder terms — pending legal review before launch.
      </p>
      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Use of This Site</h2>
          <p>This website is provided by Katy Property Solutions to share information about our rental, buy & sell, renovation, titling, and agent referral services, and to collect inquiries from prospective clients and agents.</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">No Guarantee of Availability</h2>
          <p>Property listings shown on this site reflect our records at the time of publishing and are subject to change without notice. Contact us to confirm current availability before making decisions.</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Service Agreements</h2>
          <p>Specific terms for rentals, sales, renovations, titling, and agent commissions are confirmed in a separate agreement once you engage our services — nothing on this site constitutes a binding offer.</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Contact Us</h2>
          <p>Questions about these terms can be sent to hello@katypropertysolutions.com.</p>
        </div>
      </div>
    </div>
  );
}
