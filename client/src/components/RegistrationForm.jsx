import React, { useState, useEffect, useRef } from 'react';
import { Users, User, Plus, Trash2, ShieldAlert, CheckCircle, AlertCircle, CreditCard, Sparkles, Loader2, Lock, LogIn, LogOut, Check } from 'lucide-react';
import api from '../api/axiosInstance';
import AuthModal from './AuthModal';

const RegistrationForm = ({ onSuccess }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('codex_user_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [teamName, setTeamName] = useState(() => {
    return localStorage.getItem('codex_form_team_name') || '';
  });
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('codex_form_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        name: currentUser ? currentUser.name : '',
        email: currentUser ? currentUser.email : '',
        rollNo: currentUser ? currentUser.rollNo || '' : '',
        year: currentUser ? currentUser.year || '2nd' : '2nd',
        branch: currentUser ? currentUser.branch || 'CSE' : 'CSE',
        college: currentUser ? currentUser.college || 'GPREC' : 'GPREC',
        mobile: currentUser ? currentUser.mobile || '' : '',
        isLeader: true,
      },
      { name: '', email: '', rollNo: '', year: '2nd', branch: 'CSE', college: 'GPREC', mobile: '', isLeader: false },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [checkingRolls, setCheckingRolls] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rollCheckStatus, setRollCheckStatus] = useState(null);
  const [mockOrderDetails, setMockOrderDetails] = useState(null);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const errorRef = useRef(null);

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

  // Save form draft state to localStorage whenever changed
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

  // Pre-fill form from active pending registration if available
  useEffect(() => {
    if (pendingRegistration) {
      if (pendingRegistration.teamName) {
        setTeamName(pendingRegistration.teamName);
      }
      if (pendingRegistration.members && pendingRegistration.members.length >= 2) {
        setMembers(pendingRegistration.members);
      }
    }
  }, [pendingRegistration]);

  // Fetch pending registration when currentUser is available
  useEffect(() => {
    if (currentUser?.email) {
      fetchPendingRegistration(currentUser.email);
    }
  }, [currentUser]);

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
          college: currentUser.college || updated[0].college || 'GPREC',
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

  const addMember = () => {
    if (members.length >= 3) return;
    setMembers([
      ...members,
      { name: '', email: '', rollNo: '', year: '2nd', branch: 'CSE', college: 'GPREC', mobile: '', isLeader: false },
    ]);
  };

  const removeMember = (index) => {
    if (index === 0) return;
    if (members.length <= 2) return;
    const updated = members.filter((_, idx) => idx !== index);
    setMembers(updated);
    setRollCheckStatus(null);
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

  const validateForm = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      setErrorMsg('Please Sign In / Register as Team Leader before proceeding.');
      setTimeout(() => {
        const authBox = document.getElementById('auth-banner-box');
        if (authBox) authBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return false;
    }

    if (!teamName.trim()) {
      setErrorMsg('Please enter your Team Name.');
      const el = document.getElementById('team-name-input');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    if (members.length < 2 || members.length > 3) {
      setErrorMsg('A team must consist of exactly 2 or 3 members.');
      return false;
    }

    if (fourthYearCount > 1) {
      setErrorMsg('A team can include ZERO or ONE 4th-year student. System rejected your team due to 2+ 4th-year students.');
      const statusCard = document.getElementById('fourth-year-status-card');
      if (statusCard) statusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim()) {
        setErrorMsg(`Member ${i + 1}: Name is required.`);
        return false;
      }
      if (!m.email.trim() || !emailRegex.test(m.email.trim())) {
        setErrorMsg(`Member ${i + 1}: Valid email address is required.`);
        return false;
      }
      if (!m.rollNo.trim()) {
        setErrorMsg(`Member ${i + 1}: Roll Number is required.`);
        return false;
      }
      if (!m.branch.trim()) {
        setErrorMsg(`Member ${i + 1}: Branch is required.`);
        return false;
      }
      if (!m.mobile.trim() || !phoneRegex.test(m.mobile.trim())) {
        setErrorMsg(`Member ${i + 1}: Valid 10-digit mobile number is required.`);
        return false;
      }
    }

    const rolls = members.map((m) => m.rollNo.trim().toUpperCase());
    const uniqueRolls = new Set(rolls);
    if (uniqueRolls.size !== rolls.length) {
      setErrorMsg('Duplicate roll numbers detected within your team members list.');
      return false;
    }

    const emails = members.map((m) => m.email.trim().toLowerCase());
    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size !== emails.length) {
      setErrorMsg('Duplicate email addresses detected within your team members list.');
      return false;
    }

    return true;
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
          college: currentUser ? currentUser.college || 'GPREC' : 'GPREC',
          mobile: currentUser ? currentUser.mobile || '' : '',
          isLeader: true,
        },
        { name: '', email: '', rollNo: '', year: '2nd', branch: 'CSE', college: 'GPREC', mobile: '', isLeader: false },
      ]);
    } catch (err) {
      setErrorMsg('Failed to cancel pending registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setRollCheckStatus(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await api.post('/register/create-order', {
        teamName,
        members,
      });

      if (res.data.success) {
        const { order, paymentSessionId, teamId } = res.data;
        setPendingRegistration((prev) => {
          if (prev && prev.teamId === teamId) return prev;
          return {
            teamId,
            teamName,
            members,
            status: 'pending',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            amount: order.order_amount || order.amount || 300,
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

      setPendingRegistration((prev) => {
        if (prev && prev.teamId === teamId) return prev;
        return {
          teamId,
          teamName,
          members,
          status: 'pending',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          amount: order?.order_amount || order?.amount || 300,
        };
      });

      // If Cashfree credentials are not configured in server/.env
      if (order?.isMock || orderId?.startsWith('order_mock_')) {
        setLoading(false);
        setErrorMsg(
          'Cashfree API Credentials (CASHFREE_APP_ID and CASHFREE_SECRET_KEY) are missing in server/.env. Please add your Cashfree API keys in server/.env to launch the live Cashfree payment gateway popup.'
        );
        return;
      }

      // Check if Cashfree SDK script is available
      if (typeof window.Cashfree === 'undefined') {
        setLoading(false);
        setErrorMsg('Cashfree Payment Gateway SDK failed to load. Please check your internet connection and refresh.');
        return;
      }

      try {
        const cashfreeMode = import.meta.env.VITE_CASHFREE_MODE || 'sandbox';
        const cashfree = window.Cashfree({
          mode: cashfreeMode,
        });

        const checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: '_modal',
        };

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
      console.error('[Registration] Error launching payment modal:', err);
      setLoading(false);
      if (!err.response) {
        setErrorMsg('Cannot connect to backend server. Please make sure the backend server is running on port 5000.');
      } else {
        setErrorMsg(err.response?.data?.message || 'Failed to initialize payment.');
      }
    }
  };

  const handlePaymentVerification = async (orderId, teamId) => {
    try {
      setLoading(true);
      const verifyRes = await api.post('/register/verify-payment', {
        orderId: orderId,
        teamId: teamId,
      });

      if (verifyRes.data.success) {
        setPendingRegistration(null);
        clearFormDraft();
        onSuccess(verifyRes.data.registration);
      } else {
        setErrorMsg(verifyRes.data.message || 'Payment verification failed.');
      }
    } catch (verifyErr) {
      setErrorMsg(verifyErr.response?.data?.message || 'Server error verifying payment status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Form Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          Codex 4.0 <span className="text-[#2563EB]">Team Registration</span>
        </h2>
        <p className="text-[#475569] text-sm font-normal">
          Register your team of 2 to 3 members. Entry Fee: <strong className="text-emerald-700 font-semibold">₹300 / Team</strong>
        </p>
      </div>

      {/* User Auth Banner Header */}
      {!currentUser ? (
        <div id="auth-banner-box" className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-3 bg-blue-100 text-[#2563EB] rounded-xl shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-base">Sign In Required to Register</h4>
              <p className="text-xs text-[#475569] font-normal">
                Log in via Email or Google to lock yourself as Team Leader & receive entry pass.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register Leader</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium text-[#0F172A]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#64748B] text-xs block">Logged In Primary Team Leader:</span>
              <strong className="text-[#0F172A] font-bold text-sm">{currentUser.name}</strong> <span className="text-emerald-700 font-semibold">({currentUser.email})</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-rose-700 hover:text-rose-800 font-semibold flex items-center space-x-1 border border-rose-200 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      )}

      {/* Pending Registration Alert Banner */}
      {pendingRegistration && (
        <div id="pending-banner-card" className="relative overflow-hidden bg-white border-2 border-blue-400 rounded-xl p-5 sm:p-6 mb-8 text-[#0F172A] shadow-card transition-all">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2563EB]" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start space-x-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 text-[#2563EB] rounded-xl mt-0.5 shrink-0 shadow-xs">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-blue-100 text-blue-900 border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                    <span>Pending Payment</span>
                  </span>
                  {timeLeft > 0 && (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-blue-950 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                      <span className="text-blue-700">⏳ Data held for:</span>
                      <strong className="text-[#2563EB] font-extrabold text-sm">{formatTime(timeLeft)}</strong>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-[#0F172A] text-base sm:text-lg tracking-tight pt-0.5">
                  Incomplete Registration: <span className="text-[#2563EB]">Team "{pendingRegistration.teamName}"</span> <span className="text-[#64748B] text-xs font-mono">({pendingRegistration.teamId})</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                  Your registration data will be held for <strong className="text-[#2563EB] font-semibold">10 mins</strong>. Complete payment to finish registration!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => handleResumePendingPayment(pendingRegistration.teamId)}
                disabled={loading}
                className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Complete Pending Registration (₹{pendingRegistration.amount || 300})</span>
              </button>
              <button
                type="button"
                onClick={handleCancelPending}
                disabled={loading}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-[#E2E8F0] hover:border-rose-200 text-xs font-semibold transition-all cursor-pointer"
                title="Cancel pending registration to start new"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4th Year Constraint Live Counter Badge */}
      <div id="fourth-year-status-card" className={`p-4 rounded-xl mb-6 border transition-all ${
        fourthYearCount > 1
          ? 'bg-rose-50 border-rose-300 text-rose-900'
          : fourthYearCount === 1
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-white border-[#E2E8F0] text-[#0F172A]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldAlert className={`w-5 h-5 ${fourthYearCount > 1 ? 'text-rose-600' : 'text-[#2563EB]'}`} />
            <div>
              <span className="font-semibold text-sm text-[#0F172A]">4th-Year Student Status:</span>
              <span className="text-xs text-[#475569] ml-2">
                {fourthYearCount === 0 && '0 of 1 fourth-year student selected (Allowed)'}
                {fourthYearCount === 1 && '✓ 1 fourth-year student selected (Max Limit Reached)'}
                {fourthYearCount > 1 && `❌ ${fourthYearCount} fourth-year students selected! (EXCEEDED RULE LIMIT - MAX 1 ALLOWED)`}
              </span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            fourthYearCount > 1 ? 'bg-rose-600 text-white' : 'bg-blue-100 text-[#2563EB]'
          }`}>
            {fourthYearCount} / 1 Max
          </span>
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMsg && (
        <div ref={errorRef} className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Roll Check Status Alert */}
      {rollCheckStatus && (
        <div className={`p-4 rounded-xl mb-6 border text-sm font-medium flex items-center space-x-3 ${
          rollCheckStatus.available
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {rollCheckStatus.available ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
          <div>{rollCheckStatus.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        
        {/* Team Details Section */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A] flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#2563EB]" />
              <span>Team Information</span>
            </h3>
            <span className="text-xs text-[#64748B] font-medium">Team Size: {members.length} Members</span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-2">
              Team Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-name-input"
              type="text"
              required
              placeholder="e.g. Byte Busters / Algo Knights"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm font-normal transition-all"
            />
          </div>
        </div>

        {/* Member Form Fields */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[#0F172A]">Team Members</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCheckRollNumbers}
                disabled={checkingRolls}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-medium border border-[#CBD5E1] flex items-center space-x-1.5 transition-all shadow-xs"
              >
                {checkingRolls ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Check Roll Numbers Availability</span>
              </button>

              {members.length < 3 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 text-xs font-semibold flex items-center space-x-1 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member 3</span>
                </button>
              )}
            </div>
          </div>

          {members.map((member, index) => {
            const isLockedLeader = index === 0 && currentUser;

            return (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl border shadow-card transition-all relative ${
                  member.isLeader
                    ? 'border-blue-300 ring-2 ring-blue-50'
                    : 'border-[#E2E8F0]'
                }`}
              >
                {/* Header inside Member Card */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      member.isLeader ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#0F172A]'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-base flex items-center space-x-2">
                        <span>Member {index + 1} {member.name ? `— ${member.name}` : ''}</span>
                        {isLockedLeader && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Verified Leader</span>
                          </span>
                        )}
                      </h4>
                      {member.isLeader && (
                        <span className="text-[11px] font-medium text-[#2563EB]">
                          Primary Team Leader (Handles Payment & Receives Pass)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove button (Only available for member 3) */}
                  {index > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs flex items-center space-x-1 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Input Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`member-${index}-name`}
                      type="text"
                      required
                      readOnly={isLockedLeader}
                      placeholder="Full Student Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-[#0F172A] text-sm focus:outline-none transition-all ${
                        isLockedLeader
                          ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] cursor-not-allowed font-medium'
                          : 'bg-white border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 placeholder-[#94A3B8]'
                      }`}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`member-${index}-email`}
                      type="email"
                      required
                      readOnly={isLockedLeader}
                      placeholder="student@example.com"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-[#0F172A] text-sm focus:outline-none transition-all ${
                        isLockedLeader
                          ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] cursor-not-allowed font-medium'
                          : 'bg-white border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 placeholder-[#94A3B8]'
                      }`}
                    />
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Roll Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`member-${index}-rollNo`}
                      type="text"
                      required
                      placeholder="e.g. 219X1A05XX"
                      value={member.rollNo}
                      onChange={(e) => handleMemberChange(index, 'rollNo', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm uppercase font-mono tracking-wider focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Year of Study <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id={`member-${index}-year`}
                      value={member.year}
                      onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-[#0F172A] text-sm font-medium focus:outline-none transition-all ${
                        member.year === '4th' ? 'border-amber-400 text-amber-900 bg-amber-50/30' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                      }`}
                    >
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year (Max 1 student per team)</option>
                    </select>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Branch <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`member-${index}-branch`}
                      type="text"
                      required
                      placeholder="e.g. CSE / ECE / EEE / Mechanical"
                      value={member.branch}
                      onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`member-${index}-mobile`}
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={member.mobile}
                      onChange={(e) => handleMemberChange(index, 'mobile', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm font-mono focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>

                  {/* College */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      College Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`member-${index}-college`}
                      type="text"
                      required
                      placeholder="GPREC (G. Pulla Reddy Engineering College)"
                      value={member.college}
                      onChange={(e) => handleMemberChange(index, 'college', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Section */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#64748B] block">Total Team Fee</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">₹300</span>
              <span className="text-xs text-emerald-600 font-semibold">Per Team ({members.length} Members)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || fourthYearCount > 1}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base flex items-center justify-center space-x-3 transition-all ${
              fourthYearCount > 1
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm hover:shadow'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order & Checkout...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹300 & Complete Registration</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setErrorMsg('');
        }}
      />

    </div>
  );
};

export default RegistrationForm;
