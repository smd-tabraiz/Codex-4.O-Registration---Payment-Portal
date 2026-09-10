import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  FileText, 
  Home, 
  LogOut, 
  Building2, 
  ScrollText, 
  LogIn, 
  User, 
  Trophy, 
  ChevronDown, 
  ShieldCheck, 
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import api from '../api/axiosInstance';

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const savedUserData = localStorage.getItem('codex_user_data');
  const user = savedUserData ? JSON.parse(savedUserData) : null;
  const adminToken = localStorage.getItem('codex_admin_token');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingReg, setCheckingReg] = useState(false);

  // Check if current user has a paid team registration
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!user || !user.email) {
        setIsRegistered(false);
        return;
      }
      setCheckingReg(true);
      try {
        const res = await api.get('/register/my-registration', {
          params: { email: user.email, rollNo: user.rollNo || '' }
        });
        if (res.data?.success && res.data?.registered) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      } catch (err) {
        console.error('[Navbar Reg Check Error]', err);
      } finally {
        setCheckingReg(false);
      }
    };

    checkUserRegistration();
  }, [user?.email]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('codex_user_token');
    localStorage.removeItem('codex_user_data');
    localStorage.removeItem('codex_admin_token');
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const handleLoginClick = async (e) => {
    // If user is already logged in and team is registered, navigate directly to dashboard
    if (user && isRegistered) {
      e.preventDefault();
      navigate('/dashboard');
      return;
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all ${
      isActive
        ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
        : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/80'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F172A] border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Left */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img 
              src="/coders-club-logo.png" 
              alt="Coders' Club Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-white rounded-lg p-0.5 shadow-sm group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white whitespace-nowrap">CODEX 4.0</span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 sm:px-2 rounded-full uppercase">
                  GPREC
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#CBD5E1] font-normal hidden sm:block">Coders' Club Flagship Event</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 mx-auto">
          
          <NavLink to="/" end className={navLinkClass}>
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">About Us</span>
          </NavLink>

          <NavLink to="/terms" className={navLinkClass}>
            <ScrollText className="w-4 h-4" />
            <span className="hidden sm:inline">Terms & Conditions</span>
          </NavLink>

          <NavLink to="/rules" className={navLinkClass}>
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Rules</span>
          </NavLink>

          <NavLink to="/faq" className={navLinkClass}>
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </NavLink>

        </nav>

        {/* Right Section: Login button if not logged in, or User Profile dropdown if logged in */}
        <div className="flex items-center justify-end shrink-0 relative" ref={menuRef}>
          {(user || adminToken) ? (
            <div className="relative">
              {/* User Name Profile Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-700 transition-all shadow-sm cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="max-w-[110px] sm:max-w-[140px] truncate font-semibold">
                  {user?.name || user?.email || (adminToken ? 'Admin User' : 'Account')}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1E293B] border border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-fade-in-up space-y-1">
                  
                  {/* User Details Header */}
                  <div className="px-4 py-2 border-b border-slate-700/80">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name || (adminToken ? 'Administrator' : 'User')}
                    </p>
                    {user?.email && (
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    )}
                    {isRegistered && (
                      <span className="mt-1 inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Registered Squad</span>
                      </span>
                    )}
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    {/* Dashboard Option for Registered Teams (or Admin) */}
                    {(isRegistered || adminToken) && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (adminToken) {
                            navigate('/admin');
                          } else {
                            navigate('/dashboard');
                          }
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-700/70 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-400" />
                        <span>{adminToken ? 'Admin Dashboard' : 'My Team Dashboard'}</span>
                      </button>
                    )}

                    {/* Register Option if NOT registered */}
                    {!isRegistered && !adminToken && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/register');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-700/70 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                        <span>Register Team (₹300)</span>
                      </button>
                    )}

                    {/* Sign Out Option */}
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-300 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors cursor-pointer border-t border-slate-700/50 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={handleLoginClick}
              className={({ isActive }) =>
                `px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
                  isActive
                    ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                    : 'bg-[#2563EB] hover:bg-blue-700 text-white hover:shadow-md'
                }`
              }
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </NavLink>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
