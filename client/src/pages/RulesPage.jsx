import React from 'react';
import { useNavigate } from 'react-router-dom';
import RulesSection from '../components/RulesSection';

const RulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8 min-h-[calc(100vh-4rem)]">
      <RulesSection onRegisterClick={() => navigate('/register')} />
    </div>
  );
};

export default RulesPage;
