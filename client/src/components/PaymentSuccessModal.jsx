import React, { useEffect } from 'react';
import { CheckCircle2, Copy, Download, Calendar, Clock, MapPin, Mail, Award, X, Sparkles, Printer, MessageSquare, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccessModal = ({ registration, onClose }) => {
  useEffect(() => {
    // Scroll window to top when success modal opens
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.style.overflow = 'hidden';

    // Fire confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti trigger optional');
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!registration) return null;

  const leader = registration.members.find((m) => m.isLeader) || registration.members[0];

  const handleCopyTeamId = () => {
    navigator.clipboard.writeText(registration.teamId);
    alert(`Team ID ${registration.teamId} copied to clipboard!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-wrapper fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 bg-[#0D0D0D]/60 backdrop-blur-xs flex justify-center items-start pt-6 sm:pt-10 pb-12">
      <div className="print-card relative w-full max-w-2xl bg-white border border-[#D6D3CF] rounded-2xl shadow-card-hover overflow-hidden my-auto shrink-0">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-2 text-[#9A9A9A] hover:text-[#0D0D0D] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Banner */}
        <div className="bg-[#16A34A] p-6 sm:p-8 text-center text-white relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-3 border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
            Registration Successful! 🎉
          </h2>
          <p className="text-emerald-100 text-sm font-medium">
            Payment Verified • Welcome to Codex 4.0
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Team ID Highlight Card */}
          <div className="bg-[#fdf1ee]/70 border-2 border-[#E64B2E]/30 rounded-xl p-6 text-center relative group">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E64B2E] block mb-1">
              OFFICIAL TEAM ID
            </span>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-widest text-[#0D0D0D] font-mono">
                {registration.teamId}
              </span>
              <button
                onClick={handleCopyTeamId}
                className="no-print p-2 rounded-lg bg-[#fbe4de] hover:bg-[#fbe4de]/70 text-[#E64B2E] transition-colors"
                title="Copy Team ID"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9A9A9A] mt-2 font-normal">
              (Show this Team ID at the venue desk during check-in on 24th September)
            </p>
          </div>

          {/* Join Official WhatsApp Group Banner */}
          <a
            href="https://chat.whatsapp.com/IuGeagGKwFEF7sdbH42dkV?s=cl&p=a&mlu=4&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="no-print bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl p-4 flex items-center justify-between space-x-3 text-emerald-900 text-xs sm:text-sm font-semibold transition-all group shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white font-bold flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[#0D0D0D] font-bold block text-sm">Join Official Participants WhatsApp Group</span>
                <span className="text-emerald-700 text-xs font-normal">Get live updates, announcements & problem statements</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0" />
          </a>

          {/* Email Confirmation & Participation Certificate Banner */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-emerald-900 font-normal">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                Confirmation pass sent to leader <strong className="text-[#0D0D0D] font-semibold underline">{leader?.email}</strong>.
              </div>
            </div>

            <div className="bg-[#fdf1ee] border border-[#E64B2E]/30 rounded-xl p-3.5 flex items-start space-x-2.5 text-[#0D0D0D] font-normal">
              <Award className="w-4 h-4 text-[#E64B2E] shrink-0 mt-0.5" />
              <div>
                Official <strong className="text-[#0D0D0D] font-semibold">Participation Certificates</strong> awarded to ALL participants!
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="bg-[#F2F2F2] p-3.5 rounded-xl border border-[#D6D3CF]">
              <span className="text-[#9A9A9A] block mb-1 font-medium">Event Date & Time</span>
              <span className="text-[#0D0D0D] font-bold block">24th September (9:00 AM – 5:00 PM)</span>
              <span className="text-amber-600 text-[11px] font-semibold">Day Event</span>
            </div>

            <div className="bg-[#F2F2F2] p-3.5 rounded-xl border border-[#D6D3CF]">
              <span className="text-[#9A9A9A] block mb-1 font-medium">Venue</span>
              <span className="text-[#0D0D0D] font-bold block">GPREC Campus, Kurnool</span>
              <span className="text-[#9A9A9A] text-[11px]">Report by 8:30 AM</span>
            </div>
          </div>

          {/* Members Table */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-3">
              Registered Team: <span className="text-[#0D0D0D] font-bold">{registration.teamName}</span>
            </h4>
            <div className="bg-white rounded-xl border border-[#D6D3CF] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-[#F2F2F2] text-[#9A9A9A] font-semibold border-b border-[#D6D3CF]">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Year & Branch</th>
                    <th className="p-3">College</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6D3CF] text-[#0D0D0D]">
                  {registration.members.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-[#0D0D0D]">
                        {m.name} {m.isLeader && <span className="text-[10px] bg-[#fbe4de] text-[#E64B2E] border border-[#E64B2E]/30 px-1.5 py-0.5 rounded font-semibold ml-1">Leader</span>}
                      </td>
                      <td className="p-3 font-mono text-[#E64B2E] font-semibold">{m.rollNo}</td>
                      <td className="p-3 font-normal">{m.year} ({m.branch})</td>
                      <td className="p-3 text-[#9A9A9A] font-normal">{m.college}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="no-print flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0D0D0D] font-semibold text-sm flex items-center justify-center space-x-2 border border-[#D6D3CF] transition-all shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#9A9A9A]" />
              <span>Print / Download Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#E64B2E] hover:bg-[#c73d21] text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <span>Back to Portal</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentSuccessModal;
