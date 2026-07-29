import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getToken, clearSession } from '../lib/auth';
import { Loading } from './Loading';

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState(getToken() ? 'checking' : 'unauthenticated');

  useEffect(() => {
    if (status !== 'checking') return;
    api.me()
      .then(() => setStatus('authenticated'))
      .catch(() => {
        clearSession();
        setStatus('unauthenticated');
      });
  }, [status]);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
