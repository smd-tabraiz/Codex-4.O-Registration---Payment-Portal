import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

const faqs = [
  {
    q: "How many rounds are there in Codex 4.0 and how do teams qualify?",
    a: "Codex 4.0 consists of 2 competition rounds: Round 1 is 3 Hours (preliminary round) and Round 2 is 1 Hour 30 Minutes (Grand Finale). Qualification for Round 2 is strictly based on good performance in Round 1."
  },
  {
    q: "What is the Prize Pool for Codex 4.0?",
    a: "Codex 4.0 features a grand Cash Prize Pool of ₹50,000 (50K). Top performing teams will be awarded cash prizes, trophies, and official merit certificates."
  },
  {
    q: "What is the 4th-Year Student constraint?",
    a: "Every team must include either 0 or at most ONE 4th-year student. A team with two or three 4th-year students is strictly prohibited and will be rejected automatically by our backend registration validation."
  },
  {
    q: "What is the team size requirement?",
    a: "Teams must have 2 to 3 members. Individual registrations or 4-member teams are not allowed."
  },
  {
    q: "Can students from other engineering colleges register?",
    a: "Yes! While GPREC is the default college, students from all engineering colleges are welcome to participate. Select your college name in the registration form."
  },
  {
    q: "What are the event timings?",
    a: "Codex 4.0 starts at 9:00 AM on 24th September and concludes at 5:00 PM. Participants must report by 8:30 AM."
  },
  {
    q: "What should we bring to the event?",
    a: "Each team must bring at least 1 laptop with chargers and extension boards. Physical College ID cards are mandatory for entry."
  },
  {
    q: "How do I know my registration is confirmed?",
    a: "Once Razorpay payment succeeds, your unique Team ID (e.g. CDX4-0001) will be displayed on screen, and an official confirmation email will be sent to your primary Team Leader."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2.5 bg-blue-50 text-[#2563EB] rounded-xl mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          Frequently Asked <span className="text-[#2563EB]">Questions</span>
        </h2>
        <p className="text-[#475569] text-sm font-normal">
          Everything you need to know about Codex 4.0 registration and guidelines.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border transition-all duration-200 shadow-card ${
                isOpen ? 'border-[#2563EB] ring-2 ring-blue-100' : 'border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-[#2563EB] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#64748B] shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#475569] border-t border-[#E2E8F0] pt-3 leading-relaxed font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Queries Box */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] text-center space-y-4 shadow-card">
        <div className="inline-flex p-3 bg-blue-50 text-[#2563EB] rounded-xl">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#0F172A]">Have More Questions or Need Help?</h3>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 font-normal">
            Reach out directly to the Coders' Club organizing team for any event or payment queries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="mailto:codersclubrecuirtment@gmail.com"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#2563EB] text-xs font-semibold flex items-center justify-center space-x-2 border border-[#E2E8F0] transition-all"
          >
            <Mail className="w-4 h-4 text-[#2563EB]" />
            <span>codersclubrecuirtment@gmail.com</span>
          </a>

          <a
            href="tel:+919391491123"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center space-x-2 border border-emerald-200 transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>+91 9391491123</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default FAQSection;
