import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Award, ShieldAlert, Sparkles, ArrowRight, Trophy } from 'lucide-react';

const HeroSection = ({ onStartRegister }) => {
  // Target Event Countdown calculation strictly for 24th September at 9:00 AM IST
  const calculateTimeLeft = () => {
    const now = new Date();
    let eventYear = now.getFullYear();
    let targetDate = new Date(`${eventYear}-09-24T09:00:00+05:30`);

    // If 24th September 9:00 AM of current year has passed, target upcoming 24th September 9:00 AM
    if (targetDate - now <= 0) {
      targetDate = new Date(`${eventYear + 1}-09-24T09:00:00+05:30`);
    }

    const difference = Math.max(0, targetDate - now);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative py-10 lg:py-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Coders' Club, GPREC Presents</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Prize Pool: ₹50,000 (50K)</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-4">
          CODEX <span className="text-[#2563EB]">4.0</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#475569] font-normal mb-8 leading-relaxed">
          The Premier Technical Coding Competition. Compete in 2 rounds for the massive <strong className="text-[#0F172A] font-semibold">₹50,000 (50K) Prize Pool</strong> and algorithmic glory.
        </p>

        {/* Key Event Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto mb-10">
          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-[#2563EB] mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Date</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-[#0F172A]">24th Sept</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-amber-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Timing</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">9:00 AM – 5:00 PM</p>
            <span className="text-[11px] text-[#64748B]">Day Event</span>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl text-left border border-amber-200 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-amber-700 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Prize Pool</span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-amber-900">₹50,000</p>
            <span className="text-[11px] text-amber-700 font-medium">50K Cash Prizes</span>
          </div>

          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-purple-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Team Size</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-[#0F172A]">2 – 3 Members</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-rose-600 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">4th Year Rule</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">Max 1 Student</p>
            <span className="text-[11px] text-[#64748B]">0 or 1 per team</span>
          </div>
        </div>

        {/* Live Active Countdown Timer Card */}
        <div className="bg-white max-w-xl mx-auto p-6 rounded-xl border border-[#E2E8F0] shadow-card mb-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase font-bold tracking-widest text-[#2563EB]">
              Live Countdown to 24th September (9:00 AM)
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-[#F1F5F9] p-3 rounded-lg border border-[#E2E8F0]">
              <span className="block text-2xl sm:text-3xl font-bold text-[#0F172A] font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[#64748B] uppercase tracking-wider">Days</span>
            </div>

            <div className="bg-[#F1F5F9] p-3 rounded-lg border border-[#E2E8F0]">
              <span className="block text-2xl sm:text-3xl font-bold text-[#0F172A] font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[#64748B] uppercase tracking-wider">Hours</span>
            </div>

            <div className="bg-[#F1F5F9] p-3 rounded-lg border border-[#E2E8F0]">
              <span className="block text-2xl sm:text-3xl font-bold text-[#0F172A] font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[#64748B] uppercase tracking-wider">Mins</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <span className="block text-2xl sm:text-3xl font-bold text-[#2563EB] font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Secs</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartRegister}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-200 group"
          >
            <span>Register Your Team Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
