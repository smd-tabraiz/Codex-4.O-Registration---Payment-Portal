import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Users, 
  User, 
  Building2, 
  Printer, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText
} from 'lucide-react';
import api from '../api/axiosInstance';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndRegistration = async () => {
      setLoading(true);
      setError('');

      try {
        const savedUser = localStorage.getItem('codex_user_data');
        const userObj = savedUser ? JSON.parse(savedUser) : null;
        setUserData(userObj);

        // Fetch registration details from backend
        let userEmail = userObj?.email || '';
        let userRollNo = userObj?.rollNo || '';

        const res = await api.get('/register/my-registration', {
          params: { email: userEmail, rollNo: userRollNo }
        });

        if (res.data?.success && res.data?.registered && res.data?.registration) {
          setRegistration(res.data.registration);
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
          setRegistration(null);
        }
      } catch (err) {
        console.error('[Dashboard Error]', err);
        setError('Could not load team registration details. Please refresh or try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRegistration();
  }, []);

  const handlePrintPass = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-600 space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs font-semibold">Loading your team dashboard...</p>
      </div>
    );
  }

  // Case 1: Logged in & Registered
  if (isRegistered && registration) {
    const leader = registration.members.find(m => m.isLeader) || registration.members[0];

    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Registration Confirmed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Team Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Official Entry Pass & Registered Squad Details for Codex 4.0
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handlePrintPass}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Entry Ticket</span>
            </button>
          </div>
        </div>

        {/* Main Team Pass Card */}
        <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
          
          {/* Top Status & Team Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Team Identifier
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {registration.teamName}
                </span>
                <span className="bg-blue-100 text-blue-700 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-blue-200">
                  ID: {registration.teamId}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Payment Status
              </span>
              <span className="text-lg font-extrabold text-emerald-700 block">
                ₹300 INR (PAID)
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-medium block">
                {registration.paymentDetails?.cfOrderId || registration.paymentDetails?.razorpayPaymentId || 'Verified Transaction'}
              </span>
            </div>
          </div>

          {/* Quick Badges Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Leader</span>
              <span className="font-bold text-slate-900 truncate block">{leader?.name}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Leader Email</span>
              <span className="font-bold text-slate-900 truncate block">{leader?.email}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Size</span>
              <span className="font-bold text-slate-900">{registration.members?.length || 2} Members</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pass Benefits</span>
              <span className="font-bold text-emerald-700">Lunch, Wi-Fi & Certs</span>
            </div>
          </div>

          {/* Team Members Breakdown */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Registered Squad Members ({registration.members?.length} Students)</span>
            </h3>

            <div className="grid gap-3 sm:grid-cols-1">
              {registration.members.map((mem, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50/80 border border-slate-200 p-4 rounded-xl space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{mem.name}</span>
                      {mem.isLeader && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase">
                          Team Leader
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {mem.rollNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Gender</span>
                      <span className="font-medium text-slate-900">{mem.gender || 'Male'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Year & Branch</span>
                      <span className="font-medium text-slate-900">{mem.year} Yr · {mem.branch}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Mobile</span>
                      <span className="font-medium text-slate-900 font-mono">{mem.mobile}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Email</span>
                      <span className="font-medium text-slate-900 truncate block">{mem.email}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 md:col-span-4 pt-1">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">College</span>
                      <span className="font-medium text-slate-900">{mem.college}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Schedule & Reporting Venue Box */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Event Reporting & Venue Details</span>
            </h4>

            <div className="grid sm:grid-cols-3 gap-3 text-xs text-blue-950">
              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Event Date:</strong>
                  <span>24th September 2026</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Reporting Time:</strong>
                  <span>08:30 AM Sharp</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Venue:</strong>
                  <span>Main Seminar Hall & Labs, GPREC</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed border-t border-blue-200/60 pt-2 font-medium">
              * Note: All squad members must bring their original College ID Card and digital or printed entry ticket at the check-in counter.
            </p>
          </div>

        </div>

      </div>
    );
  }

  // Case 2: Logged in but NOT Registered
  return (
    <div className="py-12 px-4 sm:px-6 max-w-xl mx-auto text-center space-y-6 animate-fade-in-up">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            No Active Team Registration Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Logged in as <strong className="text-slate-900">{userData?.name || userData?.email || 'User'}</strong>.
            You haven't completed team registration for Codex 4.0 yet.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <span>Register Team Now (₹300)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
