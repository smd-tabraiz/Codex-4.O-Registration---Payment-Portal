import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  User, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  Sparkles, 
  Loader2, 
  Lock, 
  LogIn, 
  LogOut, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Building2, 
  GraduationCap, 
  Phone, 
  Mail, 
  FileText,
  Clock,
  ShieldCheck,
  XCircle,
  Trophy
} from 'lucide-react';
import api from '../api/axiosInstance';
import AuthModal from './AuthModal';

export const BRANCH_OPTIONS = [
  'CSE',
  'CSM',
  'CSD',
  'CSBS',
  'CSE-AIML',
  'CST',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'OTHERS',
];

export const COLLEGE_OPTIONS = [
  'G. Pulla Reddy Engineering College',
  'G. Pullaiah Engineering College',
  'Dr. K.V. Subba Reddy Engineering College',
  'Ashoka Engineering College',
  'BITS',
  'Rajiv Gandhi Memorial College (RGMCET)',
  'Ravindra College',
  'Santhiram Engineering College',
  'Others',
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

export const YEAR_OPTIONS = ['1st', '2nd', '3rd', '4th'];

const RegistrationForm = ({ onSuccess }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('codex_user_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Leader Info, 2: Members & Team Size, 3: Preview & Confirm

  const [teamName, setTeamName] = useState(() => {
    return localStorage.getItem('codex_form_team_name') || '';
  });

  const [teamSize, setTeamSize] = useState(() => {
    const saved = localStorage.getItem('codex_form_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) return 3;
      } catch (e) {}
    }
    return 2;
  });

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('codex_form_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      } catch (e) {}
    }
    return [
      {
        name: currentUser ? currentUser.name : '',
        email: currentUser ? currentUser.email : '',
        rollNo: currentUser ? currentUser.rollNo || '' : '',
        year: currentUser ? currentUser.year || '2nd' : '2nd',
        branch: currentUser ? currentUser.branch || 'CSE' : 'CSE',
        customBranch: '',
        gender: currentUser ? currentUser.gender || 'Male' : 'Male',
        college: currentUser ? currentUser.college || 'G. Pulla Reddy Engineering College' : 'G. Pulla Reddy Engineering College',
        customCollege: '',
        mobile: currentUser ? currentUser.mobile || '' : '',
        isLeader: true,
      },
      {
        name: '',
        email: '',
        rollNo: '',
        year: '2nd',
        branch: 'CSE',
        customBranch: '',
        gender: 'Male',
        college: 'G. Pulla Reddy Engineering College',
        customCollege: '',
        mobile: '',
        isLeader: false,
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [checkingRolls, setCheckingRolls] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rollCheckStatus, setRollCheckStatus] = useState(null);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(300);
  const [registrationsClosed, setRegistrationsClosed] = useState(false);

  const errorRef = useRef(null);

  // Fetch dynamic registration fee and closed status configured by Admin
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/register/system-settings');
        if (res.data?.settings?.registrationFee !== undefined) {
          setRegistrationFee(Number(res.data.settings.registrationFee));
        }
        if (res.data?.settings?.registrationsClosed !== undefined) {
          setRegistrationsClosed(res.data.settings.registrationsClosed === true);
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchSettings();
  }, []);

  // Auto-scroll to error message whenever it is set
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errorMsg]);

  const clearFormDraft = () => {
    localStorage.removeItem('codex_form_team_name');
    localStorage.removeItem('codex_form_members');
  };

  // Save form draft state to localStorage
  useEffect(() => {
    if (teamName) {
      localStorage.setItem('codex_form_team_name', teamName);
    }
  }, [teamName]);

  useEffect(() => {
    if (members && members.length > 0) {
      localStorage.setItem('codex_form_members', JSON.stringify(members));
    }
  }, [members]);

  // Adjust members array when team size toggle changes
  const handleTeamSizeChange = (newSize) => {
    setTeamSize(newSize);
    setRollCheckStatus(null);
    setErrorMsg('');

    if (newSize === 2) {
      setMembers((prev) => prev.slice(0, 2));
    } else if (newSize === 3 && members.length < 3) {
      setMembers((prev) => [
        ...prev,
        {
          name: '',
          email: '',
          rollNo: '',
          year: '2nd',
          branch: 'CSE',
          customBranch: '',
          gender: 'Male',
          college: 'G. Pulla Reddy Engineering College',
          customCollege: '',
          mobile: '',
          isLeader: false,
        },
      ]);
    }
  };

  // Pre-fill form from active pending registration if available
  useEffect(() => {
    if (pendingRegistration) {
      if (pendingRegistration.teamName) {
        setTeamName(pendingRegistration.teamName);
      }
      if (pendingRegistration.members && pendingRegistration.members.length >= 2) {
        setMembers(pendingRegistration.members);
        setTeamSize(pendingRegistration.members.length);
      }
    }
  }, [pendingRegistration]);

  // Fetch pending registration when currentUser is available
  useEffect(() => {
    if (currentUser?.email) {
      fetchPendingRegistration(currentUser.email);
    }
  }, [currentUser]);

  // Auto-verify when user returns from UPI app (Visibility Change / Window Focus on Mobile)
  useEffect(() => {
    const handleAppReturn = async () => {
      if (document.visibilityState === 'visible') {
        const rawPayment = localStorage.getItem('codex_active_payment');
        if (rawPayment) {
          try {
            const { orderId, teamId, timestamp } = JSON.parse(rawPayment);
            // Check if initiated within last 15 minutes
            if (Date.now() - timestamp < 15 * 60 * 1000) {
              await handlePaymentVerification(orderId, teamId);
            }
          } catch (e) {
            console.error('[App Return Verification Error]', e);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleAppReturn);
    window.addEventListener('focus', handleAppReturn);
    return () => {
      document.removeEventListener('visibilitychange', handleAppReturn);
      window.removeEventListener('focus', handleAppReturn);
    };
  }, []);

  const fetchPendingRegistration = async (email) => {
    try {
      const res = await api.get(`/register/pending?email=${encodeURIComponent(email)}`);
      if (res.data.success && res.data.pending) {
        setPendingRegistration(res.data.pending);
      } else {
        setPendingRegistration(null);
      }
    } catch (err) {
      console.log('[fetchPendingRegistration] Note:', err.message);
    }
  };

  // Countdown Timer for Expiration
  useEffect(() => {
    if (!pendingRegistration || !pendingRegistration.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(pendingRegistration.expiresAt) - new Date()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        setPendingRegistration(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingRegistration]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Handle Leader state update when currentUser logs in / logs out
  useEffect(() => {
    if (currentUser) {
      setMembers((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          name: currentUser.name || updated[0].name,
          email: currentUser.email || updated[0].email,
          rollNo: currentUser.rollNo || updated[0].rollNo,
          year: currentUser.year || updated[0].year || '2nd',
          branch: currentUser.branch || updated[0].branch || 'CSE',
          gender: currentUser.gender || updated[0].gender || 'Male',
          college: currentUser.college || updated[0].college || 'G. Pulla Reddy Engineering College',
          mobile: currentUser.mobile || updated[0].mobile,
          isLeader: true,
        };
        return updated;
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('codex_user_token');
    localStorage.removeItem('codex_user_data');
    setCurrentUser(null);
    setPendingRegistration(null);
    clearFormDraft();
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
    setRollCheckStatus(null);
    setErrorMsg('');
  };

  const fourthYearCount = members.filter((m) => String(m.year).trim() === '4th').length;

  const handleCheckRollNumbers = async () => {
    const rollNumbers = members.map((m) => String(m.rollNo).trim()).filter(Boolean);

    if (rollNumbers.length === 0) {
      setRollCheckStatus({ available: false, message: 'Please enter roll numbers to check.' });
      return;
    }

    setCheckingRolls(true);
    setRollCheckStatus(null);

    try {
      const res = await api.post('/register/check-roll', { rollNumbers });
      if (res.data.success) {
        if (res.data.available) {
          setRollCheckStatus({
            available: true,
            message: 'All entered roll numbers are available for registration!',
          });
        } else {
          setRollCheckStatus({
            available: false,
            message: `The following roll number(s) are already registered: ${res.data.occupiedRolls.join(', ')}`,
          });
        }
      }
    } catch (err) {
      setRollCheckStatus({
        available: false,
        message: err.response?.data?.message || 'Error checking roll numbers availability.',
      });
    } finally {
      setCheckingRolls(false);
    }
  };

  // Step 1 Validation (Team Name & Leader Info)
  const validateStep1 = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      setErrorMsg('Please Sign In / Register as Team Leader before proceeding.');
      return false;
    }

    if (!teamName.trim()) {
      setErrorMsg('Please enter a valid Team Name.');
      return false;
    }

    if (teamName.trim().length < 2) {
      setErrorMsg('Team Name must be at least 2 characters long.');
      return false;
    }

    const leader = members[0];
    if (!leader?.name?.trim()) {
      setErrorMsg('Please enter Team Leader Name.');
      return false;
    }
    if (!leader?.email?.trim() || !leader.email.includes('@')) {
      setErrorMsg('Please enter a valid Team Leader Email.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  // Step 2 Validation (All Member Details)
  const validateStep2 = () => {
    if (members.length < 2 || members.length > 3) {
      setErrorMsg('A team must consist of exactly 2 or 3 members.');
      return false;
    }

    if (fourthYearCount > 1) {
      setErrorMsg('Rule Violation: A team can include ZERO or ONE 4th-year student. Your team currently has 2 or more 4th-year students.');
      return false;
    }

    const rollNumbers = [];
    const emails = [];

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const memberLabel = i === 0 ? 'Team Leader' : `Member ${i + 1}`;

      if (!m.name || !m.name.trim()) {
        setErrorMsg(`Please enter full name for ${memberLabel}.`);
        return false;
      }

      if (!m.rollNo || !m.rollNo.trim()) {
        setErrorMsg(`Please enter student roll number for ${memberLabel}.`);
        return false;
      }

      if (!m.email || !m.email.trim() || !m.email.includes('@')) {
        setErrorMsg(`Please enter a valid email address for ${memberLabel}.`);
        return false;
      }

      const cleanMobile = String(m.mobile || '').replace(/\D/g, '');
      if (!cleanMobile || cleanMobile.length !== 10) {
        setErrorMsg(`Please enter a valid 10-digit mobile number for ${memberLabel}.`);
        return false;
      }

      if (m.branch === 'OTHERS' && (!m.customBranch || !m.customBranch.trim())) {
        setErrorMsg(`Please specify the department/branch for ${memberLabel}.`);
        return false;
      }

      if (m.college === 'Others' && (!m.customCollege || !m.customCollege.trim())) {
        setErrorMsg(`Please specify the college name for ${memberLabel}.`);
        return false;
      }

      const cleanRoll = String(m.rollNo).trim().toUpperCase();
      const cleanEmail = String(m.email).trim().toLowerCase();

      if (rollNumbers.includes(cleanRoll)) {
        setErrorMsg(`Duplicate roll number "${cleanRoll}" entered for multiple team members.`);
        return false;
      }
      rollNumbers.push(cleanRoll);

      if (emails.includes(cleanEmail)) {
        setErrorMsg(`Duplicate email "${cleanEmail}" entered for multiple team members.`);
        return false;
      }
      emails.push(cleanEmail);
    }

    setErrorMsg('');
    return true;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToStep1 = () => {
    setErrorMsg('');
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStep2 = () => {
    setErrorMsg('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare clean payload with custom branch and college replacements
  const getPreparedMembers = () => {
    return members.map((m, idx) => ({
      name: m.name.trim(),
      email: m.email.trim().toLowerCase(),
      rollNo: m.rollNo.trim().toUpperCase(),
      year: m.year,
      branch: m.branch === 'OTHERS' && m.customBranch?.trim() ? m.customBranch.trim().toUpperCase() : m.branch,
      gender: m.gender || 'Male',
      college: m.college === 'Others' && m.customCollege?.trim() ? m.customCollege.trim() : m.college,
      mobile: String(m.mobile).replace(/\D/g, ''),
      isLeader: idx === 0,
    }));
  };

  const handleResumePendingPayment = async (teamIdToResume) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/register/retry-order', { teamId: teamIdToResume });
      if (res.data.success) {
        const { order, paymentSessionId, teamId, registration } = res.data;
        if (registration) {
          setPendingRegistration(registration);
        }
        await launchCashfreeModal(order, paymentSessionId, teamId);
      } else {
        setErrorMsg(res.data.message || 'Failed to resume pending registration payment.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error resuming payment.');
      setLoading(false);
    }
  };

  const handleCancelPending = async () => {
    if (!pendingRegistration) return;
    setLoading(true);
    try {
      await api.post('/register/cancel-pending', { teamId: pendingRegistration.teamId });
      setPendingRegistration(null);
      clearFormDraft();
      setTeamName('');
      setMembers([
        {
          name: currentUser ? currentUser.name : '',
          email: currentUser ? currentUser.email : '',
          rollNo: currentUser ? currentUser.rollNo || '' : '',
          year: currentUser ? currentUser.year || '2nd' : '2nd',
          branch: currentUser ? currentUser.branch || 'CSE' : 'CSE',
          customBranch: '',
          gender: currentUser ? currentUser.gender || 'Male' : 'Male',
          college: currentUser ? currentUser.college || 'G. Pulla Reddy Engineering College' : 'G. Pulla Reddy Engineering College',
          customCollege: '',
          mobile: currentUser ? currentUser.mobile || '' : '',
          isLeader: true,
        },
        {
          name: '',
          email: '',
          rollNo: '',
          year: '2nd',
          branch: 'CSE',
          customBranch: '',
          gender: 'Male',
          college: 'G. Pulla Reddy Engineering College',
          customCollege: '',
          mobile: '',
          isLeader: false,
        },
      ]);
      setStep(1);
    } catch (err) {
      setErrorMsg('Failed to cancel pending registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setRollCheckStatus(null);

    if (!validateStep1() || !validateStep2()) return;

    setLoading(true);

    try {
      const preparedMembers = getPreparedMembers();

      const res = await api.post('/register/create-order', {
        teamName,
        members: preparedMembers,
      });

      if (res.data.success) {
        const { order, paymentSessionId, teamId } = res.data;
        setPendingRegistration((prev) => {
          if (prev && prev.teamId === teamId) return prev;
          return {
            teamId,
            teamName,
            members: preparedMembers,
            status: 'pending',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            amount: order?.order_amount || order?.amount || 300,
          };
        });
        await launchCashfreeModal(order, paymentSessionId, teamId);
      } else {
        setErrorMsg(res.data.message || 'Failed to initialize registration order.');
        setLoading(false);
      }
    } catch (err) {
      console.error('[RegistrationForm] Submission Error:', err);
      setErrorMsg(err.response?.data?.message || 'Server error creating registration order.');
      setLoading(false);
    }
  };

  const launchCashfreeModal = async (order, paymentSessionId, teamId) => {
    try {
      const sessionId = paymentSessionId || order?.payment_session_id;
      const orderId = order?.order_id || order?.id;

      // If Cashfree credentials are in mock mode
      if (order?.isMock || orderId?.startsWith('order_mock_')) {
        setLoading(false);
        setErrorMsg(
          'Cashfree API Credentials (CASHFREE_APP_ID and CASHFREE_SECRET_KEY) are missing in server/.env. Please add your live Cashfree keys to process payments.'
        );
        return;
      }

      if (typeof window.Cashfree === 'undefined') {
        setLoading(false);
        setErrorMsg('Cashfree Payment Gateway SDK failed to load. Please check your internet connection and refresh.');
        return;
      }

      if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
        setLoading(false);
        setErrorMsg('Payment session ID is missing or invalid. Please refresh and try again.');
        return;
      }

      try {
        const cashfreeMode =
          (order?.environment || order?.cfEnv || import.meta.env.VITE_CASHFREE_MODE || 'production').toLowerCase();

        const cashfree = window.Cashfree({
          mode: cashfreeMode === 'production' ? 'production' : 'sandbox',
        });

        const checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: '_modal',
        };

        // Save active payment session to localStorage for mobile app-return recovery
        localStorage.setItem(
          'codex_active_payment',
          JSON.stringify({ orderId, teamId, timestamp: Date.now() })
        );

        cashfree.checkout(checkoutOptions).then(async (result) => {
          if (result.error) {
            console.warn('[Cashfree] Modal closed or error:', result.error);
            setLoading(false);
            if (
              result.error.message &&
              !result.error.message.toLowerCase().includes('closed') &&
              !result.error.message.toLowerCase().includes('dismiss')
            ) {
              setErrorMsg(`Payment error: ${result.error.message}`);
            }
            if (currentUser?.email) {
              fetchPendingRegistration(currentUser.email);
            }
            return;
          }

          if (result.paymentDetails || result.redirect) {
            await handlePaymentVerification(orderId, teamId);
          }
        });
      } catch (cfErr) {
        console.error('[Cashfree] Checkout error:', cfErr);
        setLoading(false);
        setErrorMsg(`Failed to launch Cashfree checkout popup: ${cfErr.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('[Cashfree] Modal error:', err);
      setLoading(false);
      setErrorMsg('Failed to open payment gateway.');
    }
  };

  const handlePaymentVerification = async (orderId, teamId) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/register/verify-payment', {
        orderId,
        teamId,
      });

      if (res.data.success) {
        localStorage.removeItem('codex_active_payment');
        clearFormDraft();
        setPendingRegistration(null);
        if (onSuccess) {
          onSuccess(res.data.registration, res.data.teamId, res.data.amount);
        }
      } else {
        setErrorMsg(res.data.message || 'Payment verification failed.');
      }
    } catch (err) {
      console.error('[Payment Verification Error]', err);
      setErrorMsg(err.response?.data?.message || 'Payment verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (registrationsClosed) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in-up my-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#E64B2E]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <XCircle className="w-4 h-4 text-rose-400 animate-pulse" />
            Registrations Are Officially Closed
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Codex 4.0 Registration Cap Reached! 🚀
          </h2>
          <p className="text-xs sm:text-sm text-[#E64B2E]/50 font-medium">
            Thank you for the overwhelming response and incredible enthusiasm!
          </p>
        </div>

        {/* Motivational Content */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#E64B2E]/10 text-[#E64B2E] border border-[#E64B2E]/30 flex items-center justify-center font-extrabold text-2xl shadow-xs">
              🏆
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Team Requirement Satisfied!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-normal">
                We have officially satisfied our complete team capacity requirement for <span className="font-bold text-slate-900">Codex 4.0</span>. All available team slots have been successfully filled!
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto bg-[#fdf1ee]/50 p-4 rounded-xl border border-[#E64B2E]/20/60">
            <p>
              🌟 <strong className="text-slate-900">To All Registered Teams:</strong> Get ready for an action-packed, high-energy competitive coding challenge! Keep an eye on your registered email address for complete event schedule details.
            </p>
            <p>
              💡 <strong className="text-slate-900">Missed Out This Time?</strong> Stay connected with <strong className="text-[#E64B2E]">Coders' Club GPREC</strong>! We organize exciting hackathons, tech workshops, and coding challenges throughout the year.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              className="px-6 py-2.5 rounded-xl bg-[#E64B2E] hover:bg-[#c73d21] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg"
            >
              Return to Home
            </a>
            <a
              href="/pricing"
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
            >
              View Event Guidelines
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl mx-auto space-y-4 sm:space-y-5 animate-fade-in-up">
      {/* Auth Modal popup */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setShowAuthModal(false);
        }}
      />

      {/* Active Pending Registration Banner */}
      {pendingRegistration && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                Active Slot Held: Team {pendingRegistration.teamId}
              </h4>
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Your team slot is reserved. If you have already paid via UPI / NetBanking, click <strong>Verify Payment</strong> below to receive your pass immediately.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handlePaymentVerification(pendingRegistration.paymentDetails?.cfOrderId, pendingRegistration.teamId)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 text-white" />}
              <span>Verify Payment Status</span>
            </button>
            <button
              onClick={() => handleResumePendingPayment(pendingRegistration.teamId)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
              <span>Pay ₹300 INR</span>
            </button>
            <button
              onClick={handleCancelPending}
              disabled={loading}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      )}

      {/* Multi-Step Wizard Progress Stepper */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2 text-center relative">
          
          {/* Step 1 Indicator */}
          <div
            onClick={() => {
              if (step > 1) {
                setErrorMsg('');
                setStep(1);
              }
            }}
            className={`flex flex-col items-center space-y-1 cursor-pointer transition-all ${
              step === 1 ? 'opacity-100' : step > 1 ? 'opacity-90 hover:opacity-100' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 1
                  ? 'bg-[#E64B2E] text-white shadow-sm ring-2 ring-blue-100'
                  : step > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span className={`text-[11px] font-bold ${step === 1 ? 'text-[#E64B2E]' : 'text-slate-700'}`}>
              Leader Info
            </span>
          </div>

          {/* Step 2 Indicator */}
          <div
            onClick={() => {
              if (step === 3) {
                setErrorMsg('');
                setStep(2);
              }
            }}
            className={`flex flex-col items-center space-y-1 transition-all ${
              step === 2 ? 'opacity-100' : step > 2 ? 'opacity-90 cursor-pointer hover:opacity-100' : 'opacity-40'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 2
                  ? 'bg-[#E64B2E] text-white shadow-sm ring-2 ring-blue-100'
                  : step > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span className={`text-[11px] font-bold ${step === 2 ? 'text-[#E64B2E]' : 'text-slate-700'}`}>
              Team Members
            </span>
          </div>

          {/* Step 3 Indicator */}
          <div
            className={`flex flex-col items-center space-y-1 transition-all ${
              step === 3 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 3
                  ? 'bg-[#E64B2E] text-white shadow-sm ring-2 ring-blue-100'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span className={`text-[11px] font-bold ${step === 3 ? 'text-[#E64B2E]' : 'text-slate-700'}`}>
              Preview & Pay
            </span>
          </div>

        </div>
      </div>

      {/* Error Banner with Auto-scroll Ref */}
      {errorMsg && (
        <div
          ref={errorRef}
          className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-start space-x-2.5 shadow-xs animate-shake"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-xs">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* STEP 1: Leader Details & Team Name */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 animate-fade-in-up">
          
          <div className="border-b border-slate-100 pb-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf1ee] text-[#E64B2E] text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <User className="w-3 h-3" />
              <span>Step 1 of 3 · Team Leadership</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Team Leader & Team Information
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide your unique Team Name and the primary Team Leader details.
            </p>
          </div>

          {/* Authentication Banner */}
          {!currentUser ? (
            <div className="bg-[#fdf1ee]/70 border border-[#E64B2E]/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#fbe4de] text-[#E64B2E] flex items-center justify-center font-bold shrink-0">
                  <LogIn className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Team Leader Sign In Required</h4>
                  <p className="text-[11px] text-slate-500">Sign in to automatically link your team pass and receipt.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-[#E64B2E] hover:bg-[#c73d21] text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5 shrink-0"
              >
                <span>Sign In / Register</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] text-emerald-800 font-semibold">Signed in as Team Leader</p>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name} ({currentUser.email})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center space-x-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Switch</span>
              </button>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Team Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Team Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. Byte Busters, Algorithmic Aces"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] text-xs sm:text-sm bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              <p className="text-[11px] text-slate-400">
                This name will appear on official certificates and scoreboards.
              </p>
            </div>

            {/* Leader Name & Leader Email */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Team Leader Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={members[0]?.name || ''}
                  onChange={(e) => handleMemberChange(0, 'name', e.target.value)}
                  placeholder="Full legal name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] text-xs sm:text-sm bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Team Leader Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={members[0]?.email || ''}
                  onChange={(e) => handleMemberChange(0, 'email', e.target.value)}
                  placeholder="Official student email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] text-xs sm:text-sm bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
                <p className="text-[10px] text-slate-400">Confirmation pass will be sent here.</p>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleNextToStep2}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E64B2E] hover:bg-[#c73d21] text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <span>Next: Team Members</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: Team Size Selection & All Member Details */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 animate-fade-in-up">
          
          <div className="border-b border-slate-100 pb-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf1ee] text-[#E64B2E] text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Users className="w-3 h-3" />
              <span>Step 2 of 3 · Team Composition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Select Team Size & Member Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose 2 or 3 members and fill their academic details.
            </p>
          </div>

          {/* Team Size Selector Toggle */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Team Size:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTeamSizeChange(2)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-0.5 ${
                  teamSize === 2
                    ? 'border-[#E64B2E] bg-[#fdf1ee]/80 text-[#E64B2E] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm sm:text-base font-extrabold">2 Members</span>
                <span className="text-[11px] font-medium text-slate-500">₹300 INR Flat Fee</span>
              </button>

              <button
                type="button"
                onClick={() => handleTeamSizeChange(3)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-0.5 ${
                  teamSize === 3
                    ? 'border-[#E64B2E] bg-[#fdf1ee]/80 text-[#E64B2E] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm sm:text-base font-extrabold">3 Members</span>
                <span className="text-[11px] font-medium text-slate-500">₹300 INR Flat Fee</span>
              </button>
            </div>
          </div>

          {/* 4th-Year Rule Status Indicator */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
              fourthYearCount > 1
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>4th-Year Rule:</strong> Max 1 allowed per team. (Current: {fourthYearCount})
              </span>
            </div>
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {fourthYearCount > 1 ? 'Violation (2+)' : 'Valid (≤ 1)'}
            </span>
          </div>

          {/* Member Cards */}
          <div className="space-y-4">
            {members.slice(0, teamSize).map((member, index) => {
              const isLeader = index === 0;

              return (
                <div
                  key={index}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5 relative shadow-xs"
                >
                  {/* Header of Member Card */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-[#fbe4de] text-[#E64B2E] flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                        {isLeader ? 'Team Leader (Member 1)' : `Member ${index + 1}`}
                      </h3>
                      {isLeader && (
                        <span className="bg-[#fbe4de] text-[#E64B2E] text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                          Leader
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        placeholder="Student name"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>

                    {/* Roll No */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Roll Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.rollNo}
                        onChange={(e) => handleMemberChange(index, 'rollNo', e.target.value.toUpperCase())}
                        placeholder="e.g. 229X1A05XX"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none uppercase font-mono text-xs sm:text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        placeholder="student@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none text-xs sm:text-sm"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength="10"
                        value={member.mobile}
                        onChange={(e) => handleMemberChange(index, 'mobile', e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none font-mono text-xs sm:text-sm"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={member.gender || 'Male'}
                        onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none cursor-pointer text-xs sm:text-sm"
                      >
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year of Study */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Year of Study <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={member.year}
                        onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none cursor-pointer text-xs sm:text-sm"
                      >
                        {YEAR_OPTIONS.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr} Year
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Branch Dropdown */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        Branch / Department <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={member.branch}
                        onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none cursor-pointer text-xs sm:text-sm"
                      >
                        {BRANCH_OPTIONS.map((br) => (
                          <option key={br} value={br}>
                            {br}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Branch Input (if OTHERS) */}
                    {member.branch === 'OTHERS' && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-slate-700">
                          Specify Other Branch/Department <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.customBranch || ''}
                          onChange={(e) => handleMemberChange(index, 'customBranch', e.target.value)}
                          placeholder="Enter your exact department name"
                          className="w-full px-3 py-2 rounded-lg border border-[#D6D3CF] focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none text-xs sm:text-sm font-medium"
                        />
                      </div>
                    )}

                    {/* College Dropdown */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        College / Institution <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={member.college}
                        onChange={(e) => handleMemberChange(index, 'college', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none cursor-pointer text-xs sm:text-sm"
                      >
                        {COLLEGE_OPTIONS.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom College Input (if Others) */}
                    {member.college === 'Others' && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-slate-700">
                          Specify College / Institution Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.customCollege || ''}
                          onChange={(e) => handleMemberChange(index, 'customCollege', e.target.value)}
                          placeholder="Enter your full college name"
                          className="w-full px-3 py-2 rounded-lg border border-[#D6D3CF] focus:ring-2 focus:ring-[#E64B2E]/20 focus:border-[#E64B2E] bg-white text-slate-900 outline-none text-xs sm:text-sm font-medium"
                        />
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>



          {/* Navigation Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-0">
            <button
              type="button"
              onClick={handleBackToStep1}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNextToStep3}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E64B2E] hover:bg-[#c73d21] text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <span>Next: Review & Confirm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Preview & Confirmation Screen */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 animate-fade-in-up">
          
          <div className="border-b border-slate-100 pb-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              <span>Step 3 of 3 · Final Review</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Review & Confirm Registration Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Please verify all entered details carefully before proceeding to payment.
            </p>
          </div>

          {/* Team Summary Overview Card */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Team Name
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {teamName}
                </h3>
              </div>

              <div className="bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registration Fee
                </span>
                <span className="text-base font-extrabold text-[#E64B2E]">
                  ₹300 INR <span className="text-xs text-slate-500 font-normal">({teamSize} Members)</span>
                </span>
              </div>
            </div>

            {/* Quick Badge Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Leader</span>
                <span className="font-bold text-slate-900 truncate block">{members[0]?.name}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Leader Email</span>
                <span className="font-bold text-slate-900 truncate block">{members[0]?.email}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">4th-Year Students</span>
                <span className="font-bold text-emerald-700">{fourthYearCount} of 1 allowed</span>
              </div>
            </div>
          </div>

          {/* Full Members Details Preview Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Member Breakdown ({teamSize} Members):
            </h4>

            <div className="grid gap-3">
              {getPreparedMembers().map((mem, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-[#fdf1ee] text-[#E64B2E] flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{mem.name}</span>
                      {mem.isLeader && (
                        <span className="text-[10px] bg-[#fbe4de] text-[#E64B2E] font-bold px-2 py-0.2 rounded-full uppercase">
                          Leader
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {mem.rollNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Gender</span>
                      <span className="font-medium text-slate-900">{mem.gender}</span>
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
                    <div className="col-span-2 sm:col-span-4 pt-0.5">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">College</span>
                      <span className="font-medium text-slate-900">{mem.college}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Edit or Confirm & Pay */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBackToStep2}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting to Cashfree...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Confirm & Proceed to Payment (₹{registrationFee} INR)</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default RegistrationForm;
