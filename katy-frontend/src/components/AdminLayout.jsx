import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  KeyRound,
  Handshake,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { clearSession, getEmail } from '../lib/auth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/tenants', label: 'Tenants', icon: KeyRound },
  { to: '/admin/agents', label: 'Agents', icon: Handshake },
];

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <>
      <div className="px-5 py-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Katy Property</p>
        <p className="text-lg font-bold text-gray-900">Admin CRM</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'clay-field text-brand-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-100 p-3">
        <p className="truncate px-3 text-xs text-gray-400">{getEmail()}</p>
        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearSession();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile top bar */}
      <div className="clay-sm sticky top-0 z-30 flex items-center justify-between bg-brand-50 px-4 py-3 lg:hidden">
        <div className="leading-tight">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Katy Property</p>
          <p className="text-base font-bold text-gray-900">Admin CRM</p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-brand-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="clay-sm z-10 hidden w-60 shrink-0 flex-col bg-brand-50 lg:flex">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
