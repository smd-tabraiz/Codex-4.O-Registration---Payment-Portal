import React from 'react';
import { Building2, Code2, Award, GraduationCap, Trophy, Users, BookOpen, CheckCircle2, Sparkles, MapPin, ExternalLink } from 'lucide-react';

const CollegeClubSection = () => {
  return (
    <div id="about" className="py-12 bg-white border-y border-[#D6D3CF] my-8 animate-fade-in-up scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#fdf1ee] border border-[#E64B2E]/30 text-[#E64B2E] text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Academic & Technical Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight">
            About the <span className="text-[#E64B2E]">Institution & Club</span>
          </h2>
          <p className="text-[#0D0D0D] text-sm sm:text-base mt-2 font-normal">
            Codex 4.0 is powered by the legacy of G. Pulla Reddy Engineering College and driven by the passion of Coders' Club.
          </p>
        </div>

        {/* 2-Column Showcase: College & Club */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Card 1: G. Pulla Reddy Engineering College */}
          <div className="bg-[#F2F2F2] p-6 sm:p-8 rounded-2xl border border-[#D6D3CF] shadow-card hover:shadow-card-hover transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center border border-[#E64B2E]/30 shadow-xs overflow-hidden shrink-0">
                  <img src="/gprec-logo.png" alt="G. Pulla Reddy Engineering College Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E64B2E] bg-[#fdf1ee] px-3 py-1 rounded-full border border-[#E64B2E]/30">
                  Estd. 1984 · 40+ Years
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0D0D0D] tracking-tight">
                  G. Pulla Reddy Engineering College
                </h3>
                <p className="text-xs text-[#E64B2E] font-semibold mt-0.5">
                  Autonomous Institution · Affiliated to JNTUA, Ananthapuramu
                </p>
              </div>

              <p className="text-sm text-[#444444] leading-relaxed font-normal">
                Founded by the revered philanthropist <strong>Late Sri G. Pulla Reddy Garu</strong> in 1984, GPREC stands as one of Andhra Pradesh's premier technical institutions. The college is recognized for academic excellence, state-of-the-art computational infrastructure, and industry-oriented engineering education.
              </p>

              {/* Accreditations bullet points */}
              <div className="space-y-2.5 pt-2 border-t border-[#D6D3CF]">
                <div className="flex items-start space-x-2.5 text-xs text-[#0D0D0D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>NAAC 'A+' Grade:</strong> Accredited with top academic standards.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#0D0D0D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>NBA Tier-II Accredited:</strong> National Board of Accreditation for Engineering Programs.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#0D0D0D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Autonomous since 2006:</strong> Approved by AICTE, New Delhi & UGC 2(f) / 12(B).</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-[#444444] border-t border-[#D6D3CF]">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Kurnool, Andhra Pradesh</span>
              </span>
              <a
                href="https://www.gprec.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E64B2E] font-semibold hover:underline inline-flex items-center space-x-1"
              >
                <span>Visit College Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 2: Coders' Club */}
          <div className="bg-[#F2F2F2] p-6 sm:p-8 rounded-2xl border border-[#D6D3CF] shadow-card hover:shadow-card-hover transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center border border-emerald-200 shadow-xs overflow-hidden shrink-0">
                  <img src="/coders-club-logo.png" alt="Coders' Club GPREC Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Dept. of CSE (AI & ML) · GPREC
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0D0D0D] tracking-tight">
                  Coders' Club GPREC
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                  Official Competitive Programming & Development Community
                </p>
              </div>

              <p className="text-sm text-[#444444] leading-relaxed font-normal">
                <strong>Coders' Club</strong> is the vibrant, student-led technical organization under the Department of Computer Science & Engineering at GPREC. Dedicated to cultivating problem-solving acumen, mastering Data Structures & Algorithms, and grooming students for top product-based tech roles.
              </p>

              {/* Club pillars */}
              <div className="space-y-2.5 pt-2 border-t border-[#D6D3CF]">
                <div className="flex items-start space-x-2.5 text-xs text-[#0D0D0D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E64B2E] shrink-0 mt-0.5" />
                  <span><strong>Competitive Contests:</strong> Regular algorithmic challenges and hackathons.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#0D0D0D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E64B2E] shrink-0 mt-0.5" />
                  <span><strong>Peer Mentorship:</strong> Senior-guided review bootcamps on DS & Algorithms.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#0D0D0D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E64B2E] shrink-0 mt-0.5" />
                  <span><strong>Flagship Legacy:</strong> Organizers of Codex 1.0, 2.0, 3.0, and now Codex 4.0.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-[#444444] border-t border-[#D6D3CF]">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-[#E64B2E]" />
                <span>500+ Active Student Developers</span>
              </span>
              <span className="text-emerald-700 font-semibold">Organizing Team · Codex 4.0</span>
            </div>
          </div>

        </div>

        {/* Institutional Accreditation Badges Banner */}
        <div className="bg-[#0D0D0D] rounded-2xl p-6 sm:p-8 text-white shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            <div className="space-y-1.5 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#E64B2E] font-mono block">NAAC A+</span>
              <span className="text-xs font-semibold text-slate-200 block uppercase tracking-wider">Accredited Grade</span>
              <p className="text-[11px] text-slate-400">Highest Academic Standard</p>
            </div>

            <div className="space-y-1.5 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono block">NBA Tier-II</span>
              <span className="text-xs font-semibold text-slate-200 block uppercase tracking-wider">Accredited Programs</span>
              <p className="text-[11px] text-slate-400">National Board of Accreditation</p>
            </div>

            <div className="space-y-1.5 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono block">Autonomous</span>
              <span className="text-xs font-semibold text-slate-200 block uppercase tracking-wider">Since 2006</span>
              <p className="text-[11px] text-slate-400">JNTUA Affiliated & AICTE Approved</p>
            </div>

            <div className="space-y-1.5 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono block">Up to ₹50,000</span>
              <span className="text-xs font-semibold text-slate-200 block uppercase tracking-wider">Prize Pool</span>
              <p className="text-[11px] text-slate-400">Cash Awards & Certificates</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CollegeClubSection;
