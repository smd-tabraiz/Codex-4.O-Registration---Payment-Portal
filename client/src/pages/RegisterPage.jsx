import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import PaymentSuccessModal from '../components/PaymentSuccessModal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [completedRegistration, setCompletedRegistration] = useState(null);

  const handleSuccess = (registration) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCompletedRegistration(registration);
  };

  return (
    <div className="py-6 sm:py-10 min-h-[calc(100vh-4rem)] px-4 sm:px-6 flex flex-col justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <RegistrationForm onSuccess={handleSuccess} />
      </div>

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
