import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { Clock, Users, ShieldAlert, Award, ArrowRight, CheckCircle2, Sparkles, Trophy } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartRegister = () => {
    navigate('/register');
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection onStartRegister={handleStartRegister} />

      {/* Feature Highlights Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            Why Participate in <span className="text-[#2563EB]">Codex 4.0?</span>
          </h2>
          <p className="text-[#475569] text-sm max-w-lg mx-auto font-normal">
            Test your technical grit, teamwork, and algorithmic prowess in an exciting 2-round coding challenge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-amber-50/70 p-6 rounded-xl border border-amber-200 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">₹50,000 (50K) Prize Pool</h3>
            <p className="text-[#475569] text-xs sm:text-sm leading-relaxed font-normal">
              Substantial cash prizes, trophies, and merit certificates awarded to top-performing teams.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">2 Competition Rounds</h3>
            <p className="text-[#475569] text-xs sm:text-sm leading-relaxed font-normal">
              Round 1 (3 Hours) + Round 2 (1.5 Hours). Qualification for Round 2 is based on good performance in Round 1.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Team Strategy (2–3 Members)</h3>
            <p className="text-[#475569] text-xs sm:text-sm leading-relaxed font-normal">
              Collaborate in teams of 2 to 3 members. Pair up across branches to solve engineering challenges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">4th-Year Student Rule</h3>
            <p className="text-[#475569] text-xs sm:text-sm leading-relaxed font-normal">
              Strictly enforced limit of zero or ONE 4th-year student per team.
            </p>
          </div>

        </div>

        {/* Quick Links Banner */}
        <div className="mt-12 bg-blue-50/70 p-8 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-1">Ready to step up?</h3>
            <p className="text-xs sm:text-sm text-[#475569] font-normal">
              Form your team, pay ₹300 per team, and claim your Team ID entry pass now!
            </p>
          </div>
          <button
            onClick={handleStartRegister}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-xs transition-all shrink-0 group"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
