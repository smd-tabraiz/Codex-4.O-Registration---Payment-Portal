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
    <div className="py-8 min-h-[calc(100vh-4rem)]">
      <RegistrationForm onSuccess={handleSuccess} />

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
