import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CollegeClubSection from '../components/CollegeClubSection';
import { Clock, Users, ShieldAlert, ArrowRight, Trophy } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#fdf1ee] text-[#E64B2E] text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Why Join Codex 4.0?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight mb-2">
            Compete, Collaborate, <span className="text-[#E64B2E]">Conquer</span>
          </h2>
          <p className="text-[#9A9A9A] text-sm sm:text-base max-w-xl mx-auto font-normal">
            Codex 4.0 tests your algorithmic prowess, teamwork, and coding speed in an authentic competitive arena.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 border border-amber-200 shadow-xs">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">₹50,000 Prize Pool</h3>
            <p className="text-[#9A9A9A] text-xs sm:text-sm leading-relaxed font-normal">
              Lucrative cash prizes, merit trophies, and official certificates for winning teams and top performers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-[#fdf1ee] text-[#E64B2E] flex items-center justify-center mb-4 border border-[#E64B2E]/30 shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">2 Competition Rounds</h3>
            <p className="text-[#9A9A9A] text-xs sm:text-sm leading-relaxed font-normal">
              Round 1 (3 Hours) Preliminary challenge + Round 2 (1.5 Hours) Grand Finale for selected finalists.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-200 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">Teams of 2–3 Members</h3>
            <p className="text-[#9A9A9A] text-xs sm:text-sm leading-relaxed font-normal">
              Collaborate and code together. Inter-branch and inter-year teams are highly encouraged.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">4th-Year Student Rule</h3>
            <p className="text-[#9A9A9A] text-xs sm:text-sm leading-relaxed font-normal">
              Fair competition rule: A team may contain zero or maximum ONE 4th-year student (never 2+).
            </p>
          </div>

        </div>
      </div>

      {/* College & Club Showcase Section */}
      <CollegeClubSection />

      {/* Event Schedule / Itinerary Timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Event Day Itinerary</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Schedule for <span className="text-[#E64B2E]">24th September 2026</span>
          </h2>
          <p className="text-[#9A9A9A] text-sm mt-1">
            Reporting Venue: Main Seminar Hall & CSE Computer Labs, GPREC Campus
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-[#D6D3CF] shadow-card space-y-2 relative">
            <span className="text-xs font-bold text-[#E64B2E] bg-[#fdf1ee] px-2.5 py-1 rounded-lg border border-[#E64B2E]/20 inline-block font-mono">
              08:30 AM – 09:00 AM
            </span>
            <h4 className="font-bold text-[#0D0D0D] text-sm">Reporting & Check-in</h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Show Team ID email pass & physical College ID card at verification desk.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E64B2E]/30 shadow-card space-y-2 relative ring-2 ring-[#E64B2E]/10">
            <span className="text-xs font-bold text-[#E64B2E] bg-[#fbe4de] px-2.5 py-1 rounded-lg border border-[#E64B2E]/30 inline-block font-mono">
              09:00 AM – 12:00 PM
            </span>
            <h4 className="font-bold text-[#0D0D0D] text-sm flex items-center space-x-1">
              <span>ROUND 1: Preliminary</span>
            </h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              3-hour intensive coding battle. Top scoring teams qualify for Round 2.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-card space-y-2 relative ring-2 ring-amber-50">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 inline-block font-mono">
              01:30 PM – 03:00 PM
            </span>
            <h4 className="font-bold text-[#0D0D0D] text-sm flex items-center space-x-1">
              <span>ROUND 2: Grand Finale</span>
            </h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              90-minute championship round for finalists to claim the ₹50K prize pool.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D6D3CF] shadow-card space-y-2 relative">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block font-mono">
              04:00 PM – 05:00 PM
            </span>
            <h4 className="font-bold text-[#0D0D0D] text-sm">Valedictory & Awards</h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Prize distribution by Dignitaries, trophy handovers & certificates for all.
            </p>
          </div>

        </div>
      </div>



    </div>
  );
};

export default HomePage;
