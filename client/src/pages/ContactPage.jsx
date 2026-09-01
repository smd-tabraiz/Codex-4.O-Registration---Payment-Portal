import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Building2, Send } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';

const CONTACT_SECTIONS = [
  {
    heading: 'Organizing Committee & Institution',
    paragraphs: [
      'Codex 4.0 is organized and executed by the student leadership and faculty advisors of Coders\' Club, GPREC.',
      'Institution: G. Pulla Reddy Engineering College (Autonomous), approved by AICTE, affiliated to JNTUA, Ananthapuramu, and accredited by NAAC with \'A+\' Grade.',
    ],
  },
  {
    heading: 'Direct Communication Channels',
    paragraphs: [
      'For technical issues with registration, payment queries, eligibility clarifications, or general event information, please reach out through our official channels:',
    ],
    list: [
      'Primary Support Email: codersclubrecuirtment@gmail.com',
      'Institutional Email: codersclub@gprec.ac.in',
      'Event Helpline & WhatsApp: +91 9391491123',
      'Operating / Support Hours: Monday to Saturday, 9:00 AM – 7:00 PM IST',
      'Typical Response Time: Within 12 to 24 hours',
    ],
  },
  {
    heading: 'Event Venue & Physical Address',
    paragraphs: [
      'Codex 4.0 will be conducted physically on-campus at the following venue address:',
    ],
    list: [
      'Venue: Main Seminar Hall & Computer Labs, GPREC Campus',
      'Address: G. Pulla Reddy Engineering College (Autonomous), G.Pulla Reddy Nagar, Nandyal Road, Kurnool, Andhra Pradesh — 518007, India',
      'Event Date: September 24, 2026',
      'Event Timings: 9:00 AM – 5:00 PM IST (Reporting Time: 8:30 AM IST)',
    ],
  },
];

const ContactPage = () => {
  return (
    <LegalPageLayout
      title="Contact Us"
      subtitle="Get in touch with the Coders' Club GPREC organizing team for queries and assistance."
      lastUpdated="September 1, 2026"
      icon={Mail}
      sections={CONTACT_SECTIONS}
    >
      {/* Visual Contact Cards Grid */}
      <div className="pt-4 grid sm:grid-cols-2 gap-4">
        
        {/* Email Card */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#0F172A]">Email Inquiries</h3>
          <p className="text-xs text-[#64748B]">Drop us an email anytime for registrations or sponsorships.</p>
          <div className="pt-1 space-y-1 text-xs">
            <a href="mailto:codersclubrecuirtment@gmail.com" className="block text-[#2563EB] font-medium hover:underline">
              codersclubrecuirtment@gmail.com
            </a>
            <a href="mailto:codersclub@gprec.ac.in" className="block text-[#2563EB] font-medium hover:underline">
              codersclub@gprec.ac.in
            </a>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#0F172A]">Phone / WhatsApp</h3>
          <p className="text-xs text-[#64748B]">Call or WhatsApp our student event coordinator.</p>
          <div className="pt-1 text-xs">
            <a href="tel:+919391491123" className="text-emerald-700 font-semibold hover:underline">
              +91 9391491123
            </a>
            <span className="block text-[11px] text-[#64748B] mt-0.5">Available 9:00 AM – 7:00 PM</span>
          </div>
        </div>

        {/* Campus Address Card */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-xl space-y-2 sm:col-span-2">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#0F172A]">Campus Address</h3>
          <p className="text-xs text-[#475569] leading-relaxed">
            Coders' Club, Department of Computer Science & Engineering,<br />
            G. Pulla Reddy Engineering College (Autonomous),<br />
            Nandyal Road, Kurnool, Andhra Pradesh – 518007.
          </p>
        </div>

      </div>
    </LegalPageLayout>
  );
};

export default ContactPage;
