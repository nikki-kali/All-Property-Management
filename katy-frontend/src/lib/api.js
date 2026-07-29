import { getToken, clearSession } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (res.status === 401 && path !== '/api/auth/login') {
    clearSession();
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/auth/me'),

  // Leads
  getLeads: (params = {}) => request(`/api/leads?${new URLSearchParams(params)}`),
  getLead: (id) => request(`/api/leads/${id}`),
  createLead: (body) => request('/api/leads', { method: 'POST', body }),
  updateLeadStage: (id, stage) => request(`/api/leads/${id}/stage`, { method: 'PATCH', body: { stage } }),
  addLeadNote: (id, content) => request(`/api/leads/${id}/notes`, { method: 'POST', body: { content } }),

  // Properties
  getProperties: (params = {}) => request(`/api/properties?${new URLSearchParams(params)}`),
  getProperty: (id) => request(`/api/properties/${id}`),
  createProperty: (body) => request('/api/properties', { method: 'POST', body }),
  updateProperty: (id, body) => request(`/api/properties/${id}`, { method: 'PATCH', body }),
  addPropertyPhoto: (id, body) => request(`/api/properties/${id}/photos`, { method: 'POST', body }),
  createRenovationJob: (propertyId, body) => request(`/api/properties/${propertyId}/renovation-jobs`, { method: 'POST', body }),
  updateRenovationJob: (id, body) => request(`/api/properties/renovation-jobs/${id}`, { method: 'PATCH', body }),
  createTitlingJob: (propertyId, body) => request(`/api/properties/${propertyId}/titling-jobs`, { method: 'POST', body }),
  updateTitlingJob: (id, body) => request(`/api/properties/titling-jobs/${id}`, { method: 'PATCH', body }),
  updateTitlingChecklist: (id, checklist) => request(`/api/properties/titling-jobs/${id}/checklist`, { method: 'PATCH', body: { checklist } }),

  // Tenants
  getTenants: () => request('/api/tenants'),
  getLatePayments: () => request('/api/tenants/late'),
  getUpcomingRenewals: () => request('/api/tenants/renewals'),
  getTenant: (id) => request(`/api/tenants/${id}`),
  createTenant: (body) => request('/api/tenants', { method: 'POST', body }),
  logPayment: (id, body) => request(`/api/tenants/${id}/payments`, { method: 'POST', body }),

  // Agents
  getAgents: () => request('/api/agents'),
  createAgent: (body) => request('/api/agents', { method: 'POST', body }),
  updateAgentStatus: (id, status) => request(`/api/agents/${id}/status`, { method: 'PATCH', body: { status } }),
  getAgentReferrals: (id) => request(`/api/agents/${id}/referrals`),
  getAgentCommissions: (id) => request(`/api/agents/${id}/commissions`),
  addCommission: (id, body) => request(`/api/agents/${id}/commissions`, { method: 'POST', body }),
  releaseCommission: (id) => request(`/api/agents/commissions/${id}/release`, { method: 'PATCH' }),

  // Reports
  getSummary: () => request('/api/reports/summary'),
  getAttribution: () => request('/api/reports/attribution'),
  getRevenueByService: () => request('/api/reports/revenue'),
  getMonthlySnapshot: (month) => request(`/api/reports/monthly${month ? `?month=${month}` : ''}`),

  // Proposals
  sendProposal: (leadId, variables) => request('/api/proposals/send', { method: 'POST', body: { lead_id: leadId, variables } }),

  // Business profile
  getBusinessProfile: () => request('/api/business-profile'),

  // Public site
  getPublicProperties: (params = {}) => request(`/api/public/properties?${new URLSearchParams(params)}`),
  getRenovationPortfolio: () => request('/api/public/renovations'),
  submitInquiry: (body) => request('/api/public/inquiry', { method: 'POST', body }),
  submitAgentApplication: (body) => request('/api/public/agent-application', { method: 'POST', body }),
};
