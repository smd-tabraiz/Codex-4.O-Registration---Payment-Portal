import React from 'react';
import { Terminal, Heart, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] py-10 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-sm">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-wide">CODEX 4.0</span>
            <p className="text-[11px] text-[#CBD5E1] font-normal">Organized by Coders' Club, GPREC</p>
          </div>
        </div>

        {/* Contact Queries Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-700/80">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">For Queries:</span>
          
          <a
            href="mailto:codersclubrecuirtment@gmail.com"
            className="flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>codersclubrecuirtment@gmail.com</span>
          </a>

          <a
            href="tel:+919391491123"
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 9391491123</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right space-y-1">
          <p className="text-slate-300 font-normal">&copy; {new Date().getFullYear()} Coders' Club GPREC. All rights reserved.</p>
          <p className="text-[11px] text-slate-400 flex items-center justify-center md:justify-end space-x-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Coders' Club, GPREC</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
