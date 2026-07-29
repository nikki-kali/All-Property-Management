import SectionHeading from '../../components/public/SectionHeading';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Privacy Policy" center={false} />
      <p className="clay-sm mb-8 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Placeholder policy — pending legal review before launch.
      </p>
      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <p>
          Katy Property Solutions ("we", "us") collects the information you submit through our inquiry and
          application forms — name, contact details, budget, and property preferences — in order to respond
          to your request and provide the service you asked for.
        </p>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Information We Collect</h2>
          <p>Contact details (name, email, phone), property or service interest, budget range, move-in date, current address, and any message you send us through our forms.</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">How We Use It</h2>
          <p>To respond to inquiries, prepare proposals, manage leases and payments for active tenants, and track referrals for our agent network. We do not sell your information to third parties.</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Data Retention</h2>
          <p>We retain inquiry and client records for as long as needed to provide our services and meet our recordkeeping obligations.</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-gray-900">Contact Us</h2>
          <p>Questions about this policy can be sent to hello@katypropertysolutions.com.</p>
        </div>
      </div>
    </div>
  );
}
