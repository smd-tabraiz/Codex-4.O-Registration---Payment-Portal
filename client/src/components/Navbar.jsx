import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Terminal, HelpCircle, FileText, UserPlus, Home, LogOut } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F172A] border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src="/coders-club-logo.png" 
            alt="Coders' Club Logo" 
            className="w-10 h-10 object-contain bg-white rounded-lg p-0.5 shadow-sm group-hover:scale-105 transition-transform" 
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-wide text-white">CODEX 4.0</span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                GPREC
              </span>
            </div>
            <p className="text-[11px] text-[#CBD5E1] font-normal">Coders' Club Flagship Event</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/80'
              }`
            }
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/80'
              }`
            }
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Register</span>
          </NavLink>

          <NavLink
            to="/rules"
            className={({ isActive }) =>
              `px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/80'
              }`
            }
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Rules</span>
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/80'
              }`
            }
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </NavLink>

          {/* User Profile / Logout Button */}
          {(user || adminToken) && (
            <button
              onClick={handleSignOut}
              className="ml-2 p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center space-x-1.5 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
