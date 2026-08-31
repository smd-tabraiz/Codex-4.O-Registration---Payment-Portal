import React, { useState } from 'react';
import { X, LogIn, UserPlus, Terminal } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axiosInstance';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  if (!isOpen) return null;

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [year, setYear] = useState('2nd');
  const [branch, setBranch] = useState('CSE');
  const [college, setCollege] = useState('GPREC');
  const [mobile, setMobile] = useState('');

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

      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign-In failed. (Server could not verify identity or network error)');
    } finally {
      setLoading(false);
    }
  };

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
        if (res.data.token) {
          localStorage.setItem('codex_user_token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('codex_user_data', JSON.stringify(res.data.user));
        }
        onAuthSuccess(res.data.user);
        onClose();
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

        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-card-hover my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white border border-[#E2E8F0] mb-2 shadow-sm p-1">
            <img src="/coders-club-logo.png" alt="Coders' Club Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A]">CODEX 4.0 PORTAL</h3>
          <p className="text-xs text-[#2563EB] font-medium mt-1">Coders' Club Flagship Event</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-xl mb-6 border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            New Sign Up
          </button>
        </div>

        {/* Google Login Component */}
        <div className="mb-5 flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            shape="pill"
            text={isLogin ? 'signin_with' : 'signup_with'}
            width="100%"
          />
        </div>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#E2E8F0] w-full" />
          <span className="bg-white px-3 text-[10px] font-semibold text-[#64748B] uppercase shrink-0">
            or email
          </span>
        </div>

        {error && (
          <div className="mb-4 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="student@gprec.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  Roll No
                </label>
                <input
                  type="text"
                  placeholder="219X1A05XX"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-sm transition-all mt-3"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;
