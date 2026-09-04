import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap, 
  ShieldCheck, 
  Laptop, 
  Wifi, 
  Coffee, 
  Award, 
  ArrowRight, 
  CreditCard,
  Building2,
  FileCheck,
  HelpCircle
} from 'lucide-react';

const PRICING_FEATURES = [
  'Team Entry Pass for 2 or 3 student members',
  'Full eligibility to compete for ₹50,000 Cash Prize Pool',
  'Access to Round 1 (3-Hr Preliminary Challenge) & Round 2 (Grand Finale)',
  'High-speed Wi-Fi and designated workstation in GPREC CSE Labs',
  'Complimentary Lunch, Tea, Coffee & Refreshments on event day',
  'Official hard-copy Participation Certificates for all registered team members',
  'Direct mentorship and project review from faculty and senior tech leads',
  'Instant digital confirmation pass with Unique Team ID (e.g. CDX4-0001)',
  'Access to curated algorithm problem sets and post-event solution repository',
];

const FAQS = [
  {
    q: 'What currency is the registration fee charged in?',
    a: 'All transactions on this portal are processed in Indian Rupees (INR - ₹). The fee is fixed at exactly ₹300.00 INR per team.',
  },
  {
    q: 'Does the ₹300 INR fee cover the entire team or per person?',
    a: 'The ₹300 INR fee is a flat fee per team and covers all 2 or 3 members of your team. There are no additional individual fees.',
  },
  {
    q: 'How will I receive the event entry pass after payment?',
    a: 'Delivery is 100% digital and instantaneous. Upon successful payment verification via Cashfree Payments, your unique Team ID is displayed on screen and a formal confirmation pass is emailed to your Team Leader.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We accept all major Indian payment methods through Cashfree Payments, including UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Debit & Credit Cards (Visa, Mastercard, RuPay), and Net Banking across all major banks.',
  },
];

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Products & Services · Official Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Event Passes & <span className="text-[#2563EB]">Pricing Details</span>
        </h1>
        <p className="text-[#475569] text-sm sm:text-base font-normal">
          Transparent, all-inclusive pricing in INR (Indian Rupees) for Codex 4.0 technical coding competition.
        </p>
      </div>

      {/* Main Pricing & Product Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E2E8F0] shadow-card-hover overflow-hidden">
        <div className="grid md:grid-cols-5">
          
          {/* Left / Top Details */}
          <div className="md:col-span-3 p-6 sm:p-10 space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Service Category: Technical Competition Pass</span>
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                Codex 4.0 Team Registration Pass
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                All-access registration pass for a team of 2 to 3 engineering students for the flagship Codex 4.0 on-campus coding battle at GPREC Kurnool.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                What's Included in this Service:
              </h3>
              <ul className="space-y-2.5">
                {PRICING_FEATURES.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right / Pricing Box */}
          <div className="md:col-span-2 bg-[#F8FAFC] border-t md:border-t-0 md:border-l border-[#E2E8F0] p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Total Fee (Inclusive of All Taxes)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">₹300</span>
                  <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    INR
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] pt-1">
                  Flat ₹300 INR per team · covers 2 to 3 members
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#475569]">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Hosted by <strong>Coders' Club, GPREC</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Secure checkout via <strong>Cashfree</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Instant Team ID issuance</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Register Your Team Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-[#64748B]">
                Seats capped at 50 teams. Registration closes once full.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Pricing Policy Highlights Grid */}
      <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm">
            INR
          </div>
          <h4 className="font-bold text-sm text-[#0F172A]">Indian Rupee Billing</h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            All prices and fee quotes on this portal are in Indian Rupees (INR - ₹). No hidden processing surcharges.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            100%
          </div>
          <h4 className="font-bold text-sm text-[#0F172A]">Instant Digital Delivery</h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Upon payment verification, your Team ID pass and confirmation email are generated instantaneously.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
            PCI
          </div>
          <h4 className="font-bold text-sm text-[#0F172A]">PCI-DSS Secure Payments</h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Payments are securely handled by Cashfree Payments with 256-bit encryption. We never store payment credentials.
          </p>
        </div>

      </div>

      {/* Pricing FAQs */}
      <div className="max-w-4xl mx-auto space-y-6 pt-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#0F172A]">Frequently Asked Questions about Pricing</h3>
          <p className="text-xs text-[#64748B] mt-1">Have questions about payment methods, pass delivery, or invoicing?</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card space-y-2">
              <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Policy Links reminder */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-center space-y-2">
          <p className="text-xs text-[#1E3A8A]">
            Please review our official compliance policies before completing your registration:
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <Link to="/terms" className="text-[#2563EB] hover:underline">Terms & Conditions</Link>
            <span className="text-slate-300">•</span>
            <Link to="/refund-policy" className="text-[#2563EB] hover:underline">Refund & Cancellation Policy</Link>
            <span className="text-slate-300">•</span>
            <Link to="/privacy" className="text-[#2563EB] hover:underline">Privacy Policy</Link>
            <span className="text-slate-300">•</span>
            <Link to="/shipping-policy" className="text-[#2563EB] hover:underline">Shipping & Delivery</Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="text-[#2563EB] hover:underline">Contact Support</Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PricingPage;
