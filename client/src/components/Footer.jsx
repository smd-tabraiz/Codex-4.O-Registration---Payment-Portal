import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, ShieldCheck, MapPin, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] pt-12 pb-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid: Brand, Navigation, Legal & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img
                src="/coders-club-logo.png"
                alt="Coders' Club Logo"
                className="w-9 h-9 object-contain bg-white rounded-lg p-0.5 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-extrabold text-white text-base tracking-wide">CODEX 4.0</span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase ml-1.5">
                  GPREC
                </span>
                <p className="text-[11px] text-[#CBD5E1] font-normal">Coders' Club Flagship Event</p>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              Premier Technical Coding Competition organized by Coders' Club, GPREC, Kurnool.
            </p>
          </div>

          {/* Col 2: Event Navigation */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Event</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Team Registration</Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-white transition-colors">Event Rules & Eligibility</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Merchant Policy Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Legal & Policies</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pricing" className="hover:text-blue-400 transition-colors">Products, Services & Pricing</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-blue-400 transition-colors">Cancellation & Refund Policy</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-blue-400 transition-colors">Shipping & Delivery Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Contact & Support</h4>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:codersclubrecruitment@gmail.com"
                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">codersclubrecruitment@gmail.com</span>
              </a>

              <a
                href="tel:+919391491123"
                className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Shaik Mohammed Tabraiz - +91 9391491123 </span>
              </a>
              <a
                href="tel:+919391491123"
                className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kashif - +91 9492068097 </span>
              </a>
              <a
                href="tel:+919391491123"
                className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><span>S Vidya Sagar - +91 7416420488 </span> </span>
              </a>
              <div className="flex items-start space-x-2 text-slate-400 text-[11px] pt-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>GPREC Campus, Nandyal Road, Kurnool, Andhra Pradesh - 518007</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Security & Developer Credit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Coders' Club, GPREC. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span>Secure Payments by</span>
              <strong className="text-blue-400 font-semibold">Cashfree</strong>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-300">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Developed by</span>
              <strong className="text-white font-bold">SMD Tabraiz</strong>
              <span className="text-blue-400 font-semibold text-[10px] tracking-wider uppercase">(Full Stack Developer)</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
