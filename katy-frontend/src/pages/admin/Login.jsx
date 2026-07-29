import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { setSession, getToken } from '../../lib/auth';
import { ErrorMessage } from '../../components/Loading';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (getToken()) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { token, email: sessionEmail } = await api.login(email, password);
      setSession(token, sessionEmail);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm clay rounded-[1.75rem] bg-brand-50 p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Katy Property</p>
        <h1 className="text-lg font-bold text-gray-900">Admin Sign In</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <ErrorMessage message={error} />}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full clay-field rounded-xl px-3 py-2.5 text-sm"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full clay-field rounded-xl px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full clay-btn rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
