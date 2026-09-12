import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Award, ShieldAlert, Sparkles, ArrowRight, Trophy, Building2, CheckCircle2 } from 'lucide-react';

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
    <div className="relative py-6 sm:py-10 lg:py-14 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Top Institutional & Organizing Club Header Card (Fills width gracefully without empty sides) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-card max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand Logo & College/Club Details */}
          <div className="flex items-center space-x-3 text-center md:text-left justify-center md:justify-start">
            <img 
              src="/coders-club-logo.png" 
              alt="Coders' Club Logo" 
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain bg-white rounded-xl p-1 border border-[#E2E8F0] shadow-xs shrink-0" 
            />
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 sm:gap-1.5">
                <h2 className="text-sm sm:text-lg lg:text-xl font-extrabold text-[#0F172A] tracking-tight">
                  G. Pulla Reddy Engineering College
                </h2>
                <span className="text-[11px] sm:text-sm font-bold text-[#64748B]">(Autonomous)</span>
              </div>
              <p className="text-[11px] sm:text-sm font-bold text-[#2563EB] flex items-center justify-center md:justify-start space-x-1 sm:space-x-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Department of CSE (AI & ML) · Coders' Club</span>
              </p>
            </div>
          </div>

          {/* Right: Accreditations Strip */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 sm:gap-2 text-[10px] sm:text-xs shrink-0">
            <span className="font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200">
              NAAC 'A+'
            </span>
            <span className="font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200">
              NBA Tier-II
            </span>
            <span className="font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200">
              Affiliated to JNTUA
            </span>
          </div>

        </div>

        {/* Grand Event Title Section */}
        <div className="space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold shadow-xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>₹50,000 Cash Prize Pool</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#0F172A] leading-none">
            CODEX <span className="text-[#2563EB]">4.0</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
            The Flagship Technical Coding Competition
          </p>
          <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-2xl mx-auto">
            Compete in 2 intense algorithmic rounds for the grand <strong className="text-[#0F172A] font-semibold">₹50,000 Prize Pool</strong>, trophies, and official merit certificates.
          </p>
        </div>

        {/* Feature Highlights Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs sm:text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>24th September 2026</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[#0F172A] text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>GPREC Campus, Kurnool</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold">
            <Users className="w-4 h-4" />
            <span>Teams of 2–3 Students</span>
          </div>
        </div>

        {/* Key Event Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto pt-2">
          
          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-[#2563EB] mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Date</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-[#0F172A]">24th Sept</p>
            <span className="text-[11px] text-[#64748B]">Full Day Event</span>
          </div>

          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-amber-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Timings</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">9:00 AM – 5:00 PM</p>
            <span className="text-[11px] text-amber-700 font-semibold">Report 8:30 AM</span>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl text-left border border-amber-200 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-amber-700 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Prize Pool</span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-amber-900">₹50,000</p>
            <span className="text-[11px] text-amber-700 font-medium">Cash + Trophies</span>
          </div>

          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-center space-x-2 text-purple-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Team Size</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-[#0F172A]">2 – 3 Members</p>
            <span className="text-[11px] text-[#64748B]">₹300 Per Team</span>
          </div>

          <div className="bg-white p-4 rounded-xl text-left border border-[#E2E8F0] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-rose-600 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">4th Year Rule</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">Max 1 Student</p>
            <span className="text-[11px] text-rose-600 font-semibold">Strictly Enforced</span>
          </div>

        </div>

        {/* Live Active Countdown Timer Card */}
        <div className="bg-white max-w-xl mx-auto p-6 rounded-2xl border border-[#E2E8F0] shadow-card">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase font-bold tracking-widest text-[#2563EB]">
              Countdown to Codex 4.0 · 24th September (9:00 AM)
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#E2E8F0]">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#64748B] uppercase tracking-wider">Days</span>
            </div>

            <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#E2E8F0]">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#64748B] uppercase tracking-wider">Hours</span>
            </div>

            <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#E2E8F0]">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#64748B] uppercase tracking-wider">Mins</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#2563EB] font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#2563EB] uppercase tracking-wider">Secs</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartRegister}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-200 group"
          >
            <span>Register Your Team (₹300)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
