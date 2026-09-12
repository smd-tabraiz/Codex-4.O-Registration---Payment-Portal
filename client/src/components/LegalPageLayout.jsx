import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Clock, FileText } from 'lucide-react';

/**
 * Shared layout component for legal, policy, and information pages.
 * @param {string} title - Page Title (e.g. "Terms and Conditions")
 * @param {string} subtitle - Short description / context
 * @param {string} lastUpdated - Last updated date string
 * @param {React.ReactNode} icon - Optional Lucide icon component
 * @param {Array<{ heading?: string, text?: string, paragraphs?: string[], list?: string[] }>} sections - Array of content sections
 * @param {React.ReactNode} children - Optional custom JSX to render inside/after sections
 */
const LegalPageLayout = ({
  title,
  subtitle,
  lastUpdated = 'September 1, 2026',
  icon: Icon = FileText,
  sections = [],
  children,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 sm:py-14 bg-[#F2F2F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E64B2E] hover:text-[#c73d21] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Codex 4.0 Home</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-[#D6D3CF] p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#fdf1ee] border border-[#E64B2E]/30 text-[#E64B2E] flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#fdf1ee] text-[#E64B2E] border border-[#E64B2E]/30 inline-block mb-1.5">
                  Codex 4.0 · Legal & Policies
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 font-normal">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-[#9A9A9A] bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#D6D3CF] self-start sm:self-auto shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-[#D6D3CF] p-6 sm:p-10 shadow-card space-y-8 text-[#0D0D0D]">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              {section.heading && (
                <h2 className="text-lg sm:text-xl font-bold text-[#0D0D0D] flex items-center space-x-2 border-b border-[#F1F5F9] pb-2">
                  <span className="text-[#E64B2E] font-mono text-sm font-semibold">{idx + 1}.</span>
                  <span>{section.heading}</span>
                </h2>
              )}

              {section.text && (
                <p className="text-sm text-[#9A9A9A] leading-relaxed font-normal">
                  {section.text}
                </p>
              )}

              {section.paragraphs &&
                section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="text-sm text-[#9A9A9A] leading-relaxed font-normal">
                    {para}
                  </p>
                ))}

              {section.list && (
                <ul className="space-y-2 pl-2">
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx} className="text-sm text-[#9A9A9A] flex items-start space-x-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E64B2E] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {children}

          {/* Organizer Footer Note */}
          <div className="pt-6 border-t border-[#D6D3CF] text-center sm:text-left text-xs text-[#9A9A9A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Codex 4.0 is organized by Coders' Club, GPREC, Kurnool.</span>
            {title !== 'Contact Us' && (
              <Link to="/contact" className="text-[#E64B2E] font-semibold hover:underline">
                Have questions? Contact Support →
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LegalPageLayout;
