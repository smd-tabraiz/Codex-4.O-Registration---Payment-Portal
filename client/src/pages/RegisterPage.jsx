import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../api/axiosInstance';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [completedRegistration, setCompletedRegistration] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Auto-verify if redirected from Cashfree / UPI with order_id in URL
  useEffect(() => {
    const orderId = searchParams.get('order_id') || searchParams.get('orderId') || searchParams.get('cf_id');
    const teamId = searchParams.get('team_id') || searchParams.get('teamId');

    if (orderId || teamId) {
      verifyRedirectedPayment(orderId, teamId);
    }
  }, [searchParams]);

  const verifyRedirectedPayment = async (orderId, teamId, retryCount = 0) => {
    setVerifyingPayment(true);
    setVerificationError('');

    try {
      const res = await api.post('/register/verify-payment', {
        orderId,
        teamId,
      });

      if (res.data?.success && res.data?.registration) {
        // Clean URL query parameters so refreshing won't re-verify
        window.history.replaceState({}, document.title, window.location.pathname);
        localStorage.removeItem('codex_active_payment');
        setCompletedRegistration(res.data.registration);
      } else {
        // Retry polling up to 4 times (every 2 seconds) for bank settlement sync
        if (retryCount < 4) {
          setTimeout(() => {
            verifyRedirectedPayment(orderId, teamId, retryCount + 1);
          }, 2000);
          return;
        }
        setVerificationError(res.data?.message || 'Payment verification pending. If money was deducted, please click Verify below.');
      }
    } catch (err) {
      if (retryCount < 4) {
        setTimeout(() => {
          verifyRedirectedPayment(orderId, teamId, retryCount + 1);
        }, 2000);
        return;
      }
      console.error('[Payment Verification Error]', err);
      setVerificationError(err.response?.data?.message || 'Could not verify payment automatically. Please check status below.');
    } finally {
      if (retryCount >= 4) {
        setVerifyingPayment(false);
      }
    }
  };

  const handleSuccess = (registration) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCompletedRegistration(registration);
  };

  return (
    <div className="py-6 sm:py-10 min-h-[calc(100vh-4rem)] px-4 sm:px-6 flex flex-col justify-center">
      
      {/* Verifying Payment Banner (Shown when returning from UPI/Cashfree) */}
      {verifyingPayment && !completedRegistration && (
        <div className="w-full max-w-xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center shadow-sm space-y-3 animate-fade-in-up">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            Verifying Your UPI / Card Payment...
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Please wait while we confirm your transaction with Cashfree. This usually takes just a couple of seconds.
          </p>
        </div>
      )}

      {/* Verification Error Notice */}
      {verificationError && !completedRegistration && (
        <div className="w-full max-w-xl mx-auto mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center shadow-sm space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-2 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-sm">Payment Confirmation Notice</span>
          </div>
          <p className="text-xs text-amber-700">
            {verificationError}
          </p>
          <button
            onClick={() => {
              const orderId = searchParams.get('order_id') || searchParams.get('orderId');
              const teamId = searchParams.get('team_id') || searchParams.get('teamId');
              verifyRedirectedPayment(orderId, teamId, 0);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check & Verify Status Again</span>
          </button>
        </div>
      )}

      {/* Registration Form Component */}
      <div className="w-full max-w-3xl mx-auto">
        <RegistrationForm onSuccess={handleSuccess} />
      </div>

      {/* Payment Success Modal */}
      {completedRegistration && (
        <PaymentSuccessModal
          registration={completedRegistration}
          onClose={() => {
            setCompletedRegistration(null);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

export default RegisterPage;
