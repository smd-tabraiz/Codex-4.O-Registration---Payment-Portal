import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HelpCircle, FileText, Home, LogOut, Building2, ScrollText, LogIn, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const savedUserData = localStorage.getItem('codex_user_data');
  const user = savedUserData ? JSON.parse(savedUserData) : null;
  const adminToken = localStorage.getItem('codex_admin_token');

  const handleSignOut = () => {
    localStorage.removeItem('codex_user_token');
    localStorage.removeItem('codex_user_data');
    localStorage.removeItem('codex_admin_token');
    window.location.reload();
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

        {/* Right Section: Login button if not logged in, or User & Sign Out if logged in */}
        <div className="flex items-center justify-end space-x-2 shrink-0">
          {(user || adminToken) ? (
            <div className="flex items-center space-x-2">
              {user && (
                <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="max-w-[120px] truncate font-medium">{user.name || user.email}</span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
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
