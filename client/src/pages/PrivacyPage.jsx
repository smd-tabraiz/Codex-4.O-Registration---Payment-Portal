import React from 'react';
import { Shield } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';

const PRIVACY_SECTIONS = [
  {
    heading: 'Introduction',
    paragraphs: [
      'Coders\' Club, GPREC ("we", "our", or "us") is dedicated to protecting the privacy and personal data of participants registering for Codex 4.0.',
      'This Privacy Policy outlines the types of information we collect, how it is used, and how it is secured when you access our registration portal.',
    ],
  },
  {
    heading: 'Information We Collect',
    paragraphs: [
      'When you register a team on the Codex 4.0 portal, we collect the following student information for all team members:',
    ],
    list: [
      'Full Name (as per official college records)',
      'Email Address (for registration confirmation and official event communications)',
      'Student Roll Number / Registration Number (to verify academic eligibility and ensure registration uniqueness)',
      'Current Year of Study (1st, 2nd, 3rd, or 4th Year — for team composition compliance)',
      'Engineering Branch / Department (e.g., CSE, ECE, EEE, MECH, CIVIL, etc.)',
      'College / Institution Name (GPREC or other recognized engineering colleges)',
      '10-Digit Mobile / Contact Number (for urgent logistical and event day announcements)',
    ],
  },
  {
    heading: 'How We Use Your Information',
    paragraphs: [
      'The collected information is used strictly and exclusively for legitimate event administration purposes, including:',
    ],
    list: [
      'Validating team composition rules (e.g. team size, unique roll numbers, 4th-year student constraints)',
      'Generating unique Team IDs and digital entry confirmation passes',
      'Sending automated transactional confirmation emails and WhatsApp group invitations',
      'Verifying student identity at the physical entry desk on event day (September 24, 2026)',
      'Printing and issuing official participation certificates and winner merit awards',
      'Maintaining administrative records in synchronized Google Sheets and MongoDB Atlas databases',
    ],
  },
  {
    heading: 'Information Sharing & Third-Party Disclosure',
    paragraphs: [
      'We do NOT sell, rent, trade, or share your personal information with any third-party marketing companies, advertisers, or outside entities.',
      'Data is shared only with the authorized payment gateway provider (Razorpay Software Private Limited) solely to the extent necessary to process registration transactions securely and verify payment signatures.',
      'Payment transaction data (card details, UPI PINs, net banking credentials) is handled directly by Razorpay on PCI-DSS compliant secure infrastructure and is never stored on our servers.',
    ],
  },
  {
    heading: 'Data Security & Storage',
    paragraphs: [
      'We implement industry-standard technical safeguards, including HTTPS encryption in transit, JWT token authentication, and secure database hosting on MongoDB Atlas.',
      'Access to participant databases is restricted strictly to authorized Coders\' Club faculty and student coordinators.',
    ],
  },
  {
    heading: 'Contact for Privacy Concerns',
    paragraphs: [
      'If you have any questions, concerns, or requests regarding your personal information, please reach out to the organizing team at codersclubrecuirtment@gmail.com or codersclub@gprec.ac.in.',
    ],
  },
];

const PrivacyPage = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information for Codex 4.0."
      lastUpdated="September 1, 2026"
      icon={Shield}
      sections={PRIVACY_SECTIONS}
    />
  );
};

export default PrivacyPage;
