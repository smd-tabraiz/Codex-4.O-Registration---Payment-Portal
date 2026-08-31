import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import api from './api/axiosInstance';

// Individual Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import RulesPage from './pages/RulesPage';
import FAQPage from './pages/FAQPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

// Scroll to top helper component on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Under Construction Screen Component
function UnderConstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden text-center">

      <div className="relative z-10 max-w-lg bg-white p-8 sm:p-10 rounded-2xl border border-amber-200 shadow-card-hover space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto shadow-xs">
          <Wrench className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            System Maintenance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Application is under service
          </h1>
          <p className="text-sm text-[#475569] font-normal">
            it will get back soon pls wait
          </p>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-xs text-[#64748B]">Codex 4.0 · Coders' Club GPREC</span>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-[#2563EB] hover:underline transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const [underConstruction, setUnderConstruction] = useState(false);
  const [checkingSettings, setCheckingSettings] = useState(true);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('codex_user_data'));
    } catch (e) {
      return null;
    }
  });

  const handleAuthSuccess = (userData) => {
    if (userData) {
      setUser(userData);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/register/system-settings');
        if (res.data?.settings) {
          setUnderConstruction(res.data.settings.underConstruction === true);
        }
      } catch (err) {
        console.error('Failed to fetch system settings:', err);
      } finally {
        setCheckingSettings(false);
      }
    };

    fetchSettings();
    // Poll settings every 10 seconds for real-time live sync across all open tabs/users
    const interval = setInterval(fetchSettings, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  if (checkingSettings) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
        <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  // If system is Under Construction and user is NOT accessing admin/login routes, show Under Construction page
  if (underConstruction && !isAdminRoute) {
    return <UnderConstructionPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans">
      <ScrollToTop />
      
      <Routes>
        {/* Unprotected Public Login Route */}
        <Route path="/login" element={<LoginPage onAuthSuccess={handleAuthSuccess} />} />

        {/* Protected App Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute onUserLoaded={setUser}>
              <div className="flex flex-col min-h-screen">
                <Navbar user={user} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
