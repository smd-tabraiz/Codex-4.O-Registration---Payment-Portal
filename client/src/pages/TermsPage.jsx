import React from 'react';
import { FileText } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';

const TERMS_SECTIONS = [
  {
    heading: 'Overview & Event Organization',
    paragraphs: [
      'This portal (codex-4-o-registration-portal.onrender.com) is the official technical event registration and payment portal for Codex 4.0.',
      'Codex 4.0 is a premier technical coding competition organized and hosted by Coders\' Club, G. Pulla Reddy Engineering College (Autonomous), Kurnool, Andhra Pradesh.',
      'By accessing this portal, creating an account, or completing a team registration, you acknowledge and agree to comply with these Terms and Conditions in full.',
    ],
  },
  {
    heading: 'Team Composition & Registration Rules',
    paragraphs: [
      'Registration for Codex 4.0 is conducted strictly on a team basis. Each participating team must consist of minimum 2 and maximum 3 members.',
      'Member 1 is designated as the primary Team Leader and is responsible for completing team registration, making payment, and receiving official team entry credentials.',
      'All team members must provide accurate and verifiable student details, including full legal name, official student roll number, college name, branch, and current year of study.',
    ],
  },
  {
    heading: 'Eligibility Criteria & 4th-Year Constraint',
    paragraphs: [
      'Codex 4.0 enforces a strict team composition constraint regarding 4th-year engineering students: a team may include ZERO or at most ONE 4th-year student. Teams with two or more 4th-year students are strictly prohibited and will be rejected automatically.',
      'Each student roll number can only be registered with one team across the entire competition. Duplicate roll number registrations will result in automatic rejection.',
      'Students from GPREC as well as other accredited engineering colleges and universities are eligible to participate.',
    ],
  },
  {
    heading: 'Products / Services Offered & Pricing in INR',
    paragraphs: [
      'The service offered on this portal is the "Codex 4.0 Hackathon & Coding Competition Team Entry Pass".',
      'The pricing is fixed at exactly ₹300.00 INR (Indian Rupees) per team. This is an all-inclusive flat fee covering all 2 or 3 registered student team members.',
      'The service includes: Full round participation access (Round 1 & Round 2), eligibility up to the ₹50,000 INR prize pool and official hard-copy Participation Certificates for all particpants.',
      'All payments are processed securely in Indian Rupees (INR) via our authorized payment gateway partner, Cashfree Payments India Private Limited.',
      'Upon successful payment verification, a Unique Team ID (e.g., CDX4-0001) will be generated and issued instantaneously via on-screen receipt and official confirmation email to the Team Leader.',
    ],
  },
  {
    heading: 'Verification & Organizers\' Rights',
    paragraphs: [
      'The organizers reserve the right to verify student identity, college enrollment, roll numbers, and academic year eligibility at any point—before, during, or after payment.',
      'Physical College ID cards must be presented by all team members at the event check-in desk on the event day (September 24, 2026).',
      'The organizing committee reserves the right to disqualify any team found submitting falsified details, violating team composition rules, or engaging in unfair practices, without entitlement to refund.',
      'The organizers reserve the right to modify round schedules, rules, or platform settings if deemed necessary for fair and smooth execution of the competition.',
    ],
  },
  // {
  //   heading: 'Event Conduct & Venue Guidelines',
  //   paragraphs: [
  //     'Participants must bring their own functional laptops, chargers, and required accessories to the venue (GPREC Campus, Kurnool).',
  //     'Teams are expected to maintain academic honesty, integrity, and discipline throughout the competition.',
  //   ],
  // },
];

const TermsPage = () => {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      subtitle="Official rules, registration terms, and eligibility conditions for Codex 4.0."
      lastUpdated="September 1, 2026"
      icon={FileText}
      sections={TERMS_SECTIONS}
    />
  );
};

export default TermsPage;
