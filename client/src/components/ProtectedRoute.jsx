import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../api/axiosInstance';

/**
 * ProtectedRoute component
 * Allows through:
 *  1. Regular users verified via GET /api/user/me (httpOnly cookie session)
 *  2. Admin users who have a valid codex_admin_token in localStorage
 */
const ProtectedRoute = ({ children, onUserLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      // 1. Check if an admin token is stored — admins bypass the user/me check
      const adminToken = localStorage.getItem('codex_admin_token');
      if (adminToken) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // 2. Regular user — verify via session cookie
      try {
        const res = await api.get('/user/me');
        if (res.data && res.data.user) {
          setIsAuthenticated(true);
          if (onUserLoaded) onUserLoaded(res.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        <div className="flex items-center space-x-3 bg-[#0D0D0D] border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-sm font-semibold">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
