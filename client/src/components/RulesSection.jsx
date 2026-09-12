import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Users, Laptop, Clock, Award, FileText, Trophy, Zap } from 'lucide-react';

const RulesSection = ({ onRegisterClick }) => {
  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight mb-3">
          Event Guidelines & <span className="text-[#E64B2E]">Rules</span>
        </h2>
        <p className="text-[#9A9A9A] text-sm sm:text-base max-w-xl mx-auto font-normal">
          Please review the official competition structure, rounds, and 4th-year team constraints.
        </p>
      </div>

      {/* Critical Highlight Alert: 4th-Year Student Constraint */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-6 mb-8 shadow-card relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-rose-100 rounded-xl text-rose-600 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-rose-200/80 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                CRITICAL TEAM CONSTRAINT
              </span>
              <span className="text-xs font-semibold text-rose-700">Strictly Enforced</span>
            </div>
            <h3 className="text-xl font-bold text-rose-950 mb-1">
              4th-Year Student Eligibility Rule
            </h3>
            <p className="text-rose-900 text-sm sm:text-base leading-relaxed">
              A team may include <strong className="text-rose-950 underline underline-offset-4 font-extrabold">ZERO or ONE 4th-year student</strong> — <span className="text-rose-700 font-bold">NEVER two or more 4th-year students</span>.
            </p>
            <p className="text-xs text-rose-800 mt-2 font-mono">
              ✓ Allowed: [1st, 2nd, 3rd] OR [1st, 2nd, 4th] OR [3rd, 3rd, 4th]<br />
              ✕ Prohibited: [4th, 4th] OR [4th, 4th, 3rd] (System automatically rejects registrations violating this rule).
            </p>
          </div>
        </div>
      </div>

      {/* 2-Round Structure & Qualification Highlight Banner */}
      <div className="bg-[#fdf1ee]/80 border-2 border-[#E64B2E]/30 rounded-xl p-6 mb-10 shadow-card">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[#fbe4de] rounded-xl text-[#E64B2E] shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-[#E64B2E]/20 text-[#0D0D0D] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                COMPETITION ROUNDS & SELECTION
              </span>
              <span className="text-xs font-semibold text-emerald-700 font-medium">₹50,000 Prize Pool</span>
            </div>

            <h3 className="text-xl font-bold text-[#0D0D0D]">
              Two Competition Rounds (Round 1 & Round 2)
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-4 rounded-xl border border-[#E64B2E]/20 shadow-sm">
                <div className="flex items-center space-x-2 text-[#E64B2E] font-bold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <span>ROUND 1: Preliminary Round (3 Hours)</span>
                </div>
                <p className="text-xs text-[#9A9A9A] leading-relaxed font-normal">
                  All registered teams battle through an intensive 3-hour algorithmic coding challenge testing speed and problem-solving.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-1">
                  <Trophy className="w-4 h-4" />
                  <span>ROUND 2: Grand Finale (1 Hour 30 Mins)</span>
                </div>
                <p className="text-xs text-[#9A9A9A] leading-relaxed font-normal">
                  Top performing teams selected from Round 1 performance advance to the 90-minute Grand Finale to claim the ₹50K prize pool!
                </p>
              </div>
            </div>

            <p className="text-xs text-[#0D0D0D] font-medium">
              * Selection for Round 2 is strictly based on high performance and score in Round 1.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        
        {/* Card 1: Team Composition */}
        <div className="bg-white p-6 rounded-xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-[#fdf1ee] rounded-lg text-[#E64B2E]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D]">Team Size & Leadership</h3>
          </div>
          <ul className="space-y-3 text-[#9A9A9A] text-sm">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Each team must contain exactly <strong className="text-[#0D0D0D]">2 to 3 members</strong>. Single participant or 4+ member teams are not permitted.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#0D0D0D]">Team Leader:</strong> Member 1 is designated as the primary leader responsible for registering, completing payment, and receiving updates.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Cross-branch and inter-year teams are encouraged (subject to 4th-year rule).</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Roll Number & Registration Uniqueness */}
        <div className="bg-white p-6 rounded-xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-purple-50 rounded-lg text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D]">Registration & Roll Numbers</h3>
          </div>
          <ul className="space-y-3 text-[#9A9A9A] text-sm">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Each student roll number can be registered in <strong className="text-[#0D0D0D]">only one team</strong>. Duplicate roll numbers will trigger automatic rejection.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Verify all student roll numbers, email addresses, and mobile numbers before submitting.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>College default is GPREC; participants from other engineering colleges can edit college name.</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Event Timings & Check-In */}
        <div className="bg-white p-6 rounded-xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D]">Event Timings & Check-in</h3>
          </div>
          <ul className="space-y-3 text-[#9A9A9A] text-sm">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#0D0D0D]">Event Duration:</strong> Starts at <strong className="text-[#0D0D0D]">9:00 AM on 24th September</strong> and concludes at <strong className="text-[#0D0D0D]">5:00 PM</strong>.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Reporting time is <strong className="text-[#0D0D0D]">8:30 AM</strong> at GPREC Campus. Present your Team ID email for physical check-in.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Physical College ID Cards are mandatory for entry.</span>
            </li>
          </ul>
        </div>

        {/* Card 4: Equipment & Requirements */}
        <div className="bg-white p-6 rounded-xl border border-[#D6D3CF] shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-cyan-50 rounded-lg text-cyan-600">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D]">Tips for Participants</h3>
          </div>
          <ul className="space-y-3 text-[#9A9A9A] text-sm">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Read the complete problem statement carefully.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Think about edge cases before submitting.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Optimize your solution when necessary.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Manage your time across all problems.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* CTA Bottom Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#D6D3CF] text-center shadow-card">
        <h3 className="text-2xl font-bold text-[#0D0D0D] mb-2">Ready to Register Your Team?</h3>
        <p className="text-[#9A9A9A] text-sm mb-6 max-w-lg mx-auto font-normal">
          Ensure your team complies with all guidelines and proceed to fill out member details.
        </p>
        <button
          onClick={onRegisterClick}
          className="px-8 py-3.5 rounded-xl bg-[#E64B2E] hover:bg-[#c73d21] text-white font-semibold shadow-sm transition-all"
        >
          Proceed to Team Registration
        </button>
      </div>

    </div>
  );
};

export default RulesSection;
