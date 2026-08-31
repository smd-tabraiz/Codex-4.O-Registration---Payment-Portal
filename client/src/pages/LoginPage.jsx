import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Terminal, LogIn, UserPlus } from 'lucide-react';
import api from '../api/axiosInstance';

const LoginPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration inputs
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [year, setYear] = useState('2nd');
  const [branch, setBranch] = useState('CSE');
  const [college, setCollege] = useState('GPREC');
  const [mobile, setMobile] = useState('');

  // Clean Name Extraction Algorithm (Strips numbers, dots, hyphens, underscores)
  const extractCleanNameFromEmail = (rawEmail) => {
    if (!rawEmail) return 'STUDENT';
    const prefix = String(rawEmail).split('@')[0];
    const clean = prefix.replace(/[._\-0-9]+/g, ' ').trim();
    return clean ? clean.toUpperCase() : prefix.toUpperCase();
  };

  // Direct Google Auth Exchange with Backend
  const handleGoogleBackendExchange = async (credential, fallbackEmail = '', fallbackName = '') => {
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/google', {
        credential,
        email: fallbackEmail,
        name: fallbackName,
        rollNo,
        year,
        branch,
        college,
        mobile,
      });

      if (res.data.token) {
        localStorage.setItem('codex_user_token', res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem('codex_user_data', JSON.stringify(res.data.user));
      }

      if (onAuthSuccess) onAuthSuccess(res.data.user);
      navigate('/');
    } catch (err) {
      console.error('[Google Auth Error]', err);
      setError(err.response?.data?.message || 'Google Authentication failed. (Server could not verify identity or network error)');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Component Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      handleGoogleError();
      return;
    }
    await handleGoogleBackendExchange(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    setError('Google Sign-In is unavailable right now. Please use Email & Password below to sign in or create an account.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });

        if (res.data.isAdmin) {
          localStorage.setItem('codex_admin_token', res.data.token);
          if (onAuthSuccess) onAuthSuccess({ isAdmin: true, token: res.data.token });
          navigate('/admin');
          return;
        }

        if (res.data.token) {
          localStorage.setItem('codex_user_token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('codex_user_data', JSON.stringify(res.data.user));
        }

        if (onAuthSuccess) onAuthSuccess(res.data.user);
        navigate('/');
      } else {
        if (!name || !email || !password) {
          setError('Please fill in Name, Email, and Password.');
          setLoading(false);
          return;
        }

        const res = await api.post('/auth/register', {
          name,
          email,
          password,
          rollNo,
          year,
          branch,
          college,
          mobile,
        });

        if (res.data.token) {
          localStorage.setItem('codex_user_token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('codex_user_data', JSON.stringify(res.data.user));
        }

        if (onAuthSuccess) onAuthSuccess(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden">

      <div className="relative w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-card-hover z-10 my-8">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white border border-[#E2E8F0] mb-2 shadow-xs p-1">
            <img src="/coders-club-logo.png" alt="Coders' Club Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">CODEX 4.0</h2>
          <p className="text-xs text-[#2563EB] font-semibold mt-1">Coders' Club, GPREC Flagship Event Portal</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-xl mb-6 border border-[#E2E8F0]">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              isLogin ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              !isLogin ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>New User Sign Up</span>
          </button>
        </div>

        {/* Official GoogleLogin Button */}
        <div className="mb-6 flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            shape="pill"
            text={isLogin ? 'signin_with' : 'signup_with'}
            width="100%"
          />
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#E2E8F0] w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-[#64748B] uppercase shrink-0">
            or use credentials
          </span>
        </div>

        {error && (
          <div className="mb-4 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Student Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Email / Username <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isLogin ? "Email or Username (e.g. SMD-TABRAIZ)" : "student@gprec.ac.in"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Roll No
                </label>
                <input
                  type="text"
                  placeholder="219X1A05XX"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs transition-all mt-4"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Portal' : 'Create Account & Continue'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
