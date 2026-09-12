import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, MapPin, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0D0D0D] pt-12 pb-8 mt-16 text-[#9A9A9A] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid: Brand, Navigation, Legal & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#1a1a1a]">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img
                src="/coders-club-logo.png"
                alt="Coders Club Logo"
                className="w-9 h-9 object-contain bg-white rounded-lg p-0.5 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-black text-white text-base tracking-wide">
                  Code<span className="text-[#E64B2E]">X</span><sup className="text-[#E64B2E] font-black text-[10px] ml-0.5">4.0</sup>
                </span>
                <span className="bg-[#E64B2E]/20 text-[#E64B2E] border border-[#E64B2E]/30 text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase ml-1.5">
                  GPREC
                </span>
                <p className="text-[11px] text-[#9A9A9A] font-normal mt-0.5">Coders Club Flagship Event</p>
              </div>
            </Link>
            <p className="text-[#9A9A9A] text-xs leading-relaxed font-normal">
              Premier Technical Coding Competition organized by Coders Club, GPREC, Kurnool.
            </p>
          </div>

          {/* Col 2: Event Navigation */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Event</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-[#E64B2E] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#E64B2E] transition-colors">About Us</Link></li>
              <li><Link to="/register" className="hover:text-[#E64B2E] transition-colors">Team Registration</Link></li>
              <li><Link to="/rules" className="hover:text-[#E64B2E] transition-colors">Event Rules and Eligibility</Link></li>
              <li><Link to="/faq" className="hover:text-[#E64B2E] transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal and Merchant Policy Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E64B2E]" />
              <span>Legal and Policies</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/pricing" className="hover:text-[#E64B2E] transition-colors">Products, Services and Pricing</Link></li>
              <li><Link to="/terms" className="hover:text-[#E64B2E] transition-colors">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#E64B2E] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#E64B2E] transition-colors">Cancellation and Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#E64B2E] transition-colors">Shipping and Delivery Policy</Link></li>
              <li><Link to="/contact" className="hover:text-[#E64B2E] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4: Help and Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Contact and Support</h4>
            <div className="space-y-2 text-xs">
              <a href="mailto:codersclubrecruitment@gmail.com"
                className="flex items-center space-x-2 text-[#9A9A9A] hover:text-[#E64B2E] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#E64B2E] shrink-0" />
                <span className="truncate">codersclubrecruitment@gmail.com</span>
              </a>
              <a href="tel:+919391491123"
                className="flex items-center space-x-2 text-[#9A9A9A] hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#E64B2E] shrink-0" />
                <span>Shaik Mohammed Tabraiz - +91 9391491123</span>
              </a>
              <a href="tel:+919492068097"
                className="flex items-center space-x-2 text-[#9A9A9A] hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#E64B2E] shrink-0" />
                <span>Kashif - +91 9492068097</span>
              </a>
              <a href="tel:+917416420488"
                className="flex items-center space-x-2 text-[#9A9A9A] hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#E64B2E] shrink-0" />
                <span>S Vidya Sagar - +91 7416420488</span>
              </a>
              <div className="flex items-start space-x-2 text-[#9A9A9A] text-[11px] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E64B2E] shrink-0 mt-0.5" />
                <span>GPREC Campus, Nandyal Road, Kurnool, Andhra Pradesh - 518007</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Security and Developer Credit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#9A9A9A] text-center md:text-left">
            &copy; {new Date().getFullYear()} Coders Club, GPREC. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#9A9A9A]">
            <span className="flex items-center space-x-1">
              <span>Secure Payments by</span>
              <strong className="text-[#E64B2E] font-semibold">Cashfree</strong>
            </span>
            <span>|</span>
            <span className="flex items-center space-x-1.5 bg-[#1a1a1a] px-2.5 py-1 rounded-md border border-[#D6D3CF]/10 text-[#9A9A9A]">
              <Code2 className="w-3.5 h-3.5 text-[#E64B2E]" />
              <span>Developed by</span>
              <strong className="text-white font-bold">SMD Tabraiz</strong>
              <span className="text-[#E64B2E] font-semibold text-[10px] tracking-wider uppercase">(Full Stack Developer)</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;