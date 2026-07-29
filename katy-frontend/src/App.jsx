import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import RequireAuth from './components/RequireAuth';
import Login from './pages/admin/Login';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/leads/LeadsList';
import LeadDetail from './pages/leads/LeadDetail';
import PropertiesList from './pages/properties/PropertiesList';
import PropertyDetail from './pages/properties/PropertyDetail';
import TenantsList from './pages/tenants/TenantsList';
import TenantDetail from './pages/tenants/TenantDetail';
import AgentsList from './pages/agents/AgentsList';
import AgentDetail from './pages/agents/AgentDetail';

import PublicLayout from './components/public/PublicLayout';
import Home from './pages/public/Home';
import RentalsPage from './pages/public/RentalsPage';
import BuySellPage from './pages/public/BuySellPage';
import RenovationsPage from './pages/public/RenovationsPage';
import TitlingPage from './pages/public/TitlingPage';
import AgentsPage from './pages/public/AgentsPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsPage from './pages/public/TermsPage';
import RebookingRefundPolicyPage from './pages/public/RebookingRefundPolicyPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/buy-sell" element={<BuySellPage />} />
        <Route path="/renovations" element={<RenovationsPage />} />
        <Route path="/titling" element={<TitlingPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />
        <Route path="/rebooking-refund-policy" element={<RebookingRefundPolicyPage />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<LeadsList />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="properties" element={<PropertiesList />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="tenants" element={<TenantsList />} />
        <Route path="tenants/:id" element={<TenantDetail />} />
        <Route path="agents" element={<AgentsList />} />
        <Route path="agents/:id" element={<AgentDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
