import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Mail } from 'lucide-react';
import { SERVICES } from '../../lib/services';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-brand-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Katy</p>
          <p className="text-lg font-bold text-gray-900">Property Solutions</p>
          <p className="mt-3 text-sm text-gray-500">
            Full-service property management, sales, renovations, and titling.
          </p>
          <div className="mt-4 flex gap-3 text-gray-400">
            <a href="#" aria-label="Website" className="hover:text-brand-600"><Globe size={18} /></a>
            <a href="#" aria-label="Social" className="hover:text-brand-600"><MessageCircle size={18} /></a>
            <a href="mailto:hello@katypropertysolutions.com" aria-label="Email" className="hover:text-brand-600"><Mail size={18} /></a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Services</p>
          <ul className="mt-3 space-y-2">
            {SERVICES.map((s) => (
              <li key={s.key}>
                <Link to={s.slug} className="text-sm text-gray-500 hover:text-brand-700">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Company</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/about" className="text-sm text-gray-500 hover:text-brand-700">About</Link></li>
            <li><Link to="/contact" className="text-sm text-gray-500 hover:text-brand-700">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Legal</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-brand-700">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-brand-700">Terms of Service</Link></li>
            <li><Link to="/rebooking-refund-policy" className="text-sm text-gray-500 hover:text-brand-700">Rebooking & Refunds</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Katy Property Solutions. All rights reserved.
      </div>
    </footer>
  );
}
