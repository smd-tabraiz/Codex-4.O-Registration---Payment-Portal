import React from 'react';
import { RotateCcw } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';

const REFUND_SECTIONS = [
  {
    heading: 'General Policy & Non-Refundable Registration Fee',
    paragraphs: [
      'Codex 4.0 is an on-campus technical competition organized by Coders\' Club, GPREC, with a capped participant capacity (limited to 50 teams) and substantial upfront logistical commitments (₹50,000 INR prize pool allocation, laboratory reservations, catering, certificates, and infrastructure).',
      'Therefore, the registration fee of ₹300.00 INR (Indian Rupees) per team is strictly NON-REFUNDABLE once payment is completed and confirmed via the payment gateway.',
      'Once a team registers and payment is confirmed, the slot is locked and unavailable to other aspiring teams.',
    ],
  },
  {
    heading: 'Voluntary Withdrawals & Absenteeism',
    paragraphs: [
      'No refunds, full or partial, will be issued if a registered team or individual team member decides to withdraw, cancel, or fails to report to the venue on the event date (September 24, 2026).',
      'Team members who are unable to attend may be substituted before the registration deadline by contacting the organizing team directly with valid student credentials.',
    ],
  },
  {
    heading: 'Disqualification & Rule Violations',
    paragraphs: [
      'If a team is disqualified due to submission of falsified student credentials, violation of the 4th-year student rule (e.g. attempting to register 2 or more 4th-year students), duplicate roll numbers, plagiarism, or indiscipline during the event, no refund will be provided under any circumstances.',
    ],
  },
  {
    heading: 'Duplicate Transactions & Technical Overcharges',
    paragraphs: [
      'In the rare event of a technical glitch, network timeout, or payment gateway error resulting in duplicate debits for the same team registration, the duplicate/excess amount will be refunded in full.',
      'To report a duplicate payment, the Team Leader must email codersclubrecuirtment@gmail.com within 48 hours of payment with the transaction details (Cashfree Payment / Reference ID, Bank reference number, team name, and date).',
      'Verified duplicate payments are processed directly through the Cashfree payment gateway back to the original payment source (UPI / Card / Net Banking) within 5 to 7 working days.',
    ],
  },
  {
    heading: 'Event Postponement or Cancellation by Organizers',
    paragraphs: [
      'In the improbable event that Codex 4.0 is rescheduled due to unforeseen administrative circumstances, natural calamities, or institutional directives, all confirmed registrations will automatically remain valid for the rescheduled date.',
      'If the event is completely cancelled by the organizing institution without a rescheduled date, 100% of the registration fee will be refunded back to the original payment method.',
    ],
  },
  {
    heading: 'Contact for Payment & Refund Inquiries',
    paragraphs: [
      'For any transaction-related queries, duplicate payment disputes, or receipt verifications, please contact our financial and coordination team:',
    ],
    list: [
      'Email: codersclubrecuirtment@gmail.com / codersclub@gprec.ac.in',
      'Phone / WhatsApp Helpline: +91 9391491123',
      'Response Time: Within 24 hours',
    ],
  },
];

const RefundPolicyPage = () => {
  return (
    <LegalPageLayout
      title="Cancellation and Refund Policy"
      subtitle="Official policy regarding event registration cancellations, refunds, and duplicate charges."
      lastUpdated="September 1, 2026"
      icon={RotateCcw}
      sections={REFUND_SECTIONS}
    />
  );
};

export default RefundPolicyPage;
