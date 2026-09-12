import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { Lock, ShieldCheck, User } from 'lucide-react';
import api from '../api/axiosInstance';

const AdminPage = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('codex_admin_token') || '');
  const [username, setUsername] = useState('SMD-TABRAIZ');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both Admin Username and Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/admin/login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (res.data.success && res.data.token) {
        localStorage.setItem('codex_admin_token', res.data.token);
        setAdminToken(res.data.token);
      } else {
        setError(res.data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Admin Username or Password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('codex_admin_token');
    setAdminToken('');
    setPassword('');
  };

  if (!adminToken) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-[#F2F2F2]">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#D6D3CF] shadow-card-hover space-y-6">
          <div className="text-center">
            <div className="inline-flex p-3 bg-[#fdf1ee] text-[#E64B2E] rounded-xl mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D0D0D]">Tabraiz Admin Portal</h2>
            <p className="text-xs text-[#9A9A9A] mt-1 font-normal">
              Log in with Tabraiz - (Admin) credentials to view team records & Excel export.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D0D0D] uppercase tracking-wider mb-2">
                Admin Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="SMD-TABRAIZ"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D6D3CF] text-[#0D0D0D] text-sm font-medium focus:border-[#E64B2E] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D0D0D] uppercase tracking-wider mb-2">
                Admin Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter password (Shamstabraiz@100251)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D6D3CF] text-[#0D0D0D] text-sm focus:border-[#E64B2E] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E64B2E] hover:bg-[#c73d21] text-white font-semibold text-sm shadow-xs transition-all"
            >
              {loading ? 'Authenticating...' : 'Authenticate & Open Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-[calc(100vh-4rem)] bg-[#F2F2F2]">
      <AdminDashboard
        adminToken={adminToken}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default AdminPage;
