import React from 'react';
import { Truck } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';

const SHIPPING_SECTIONS = [
  {
    heading: 'Digital Service Description',
    paragraphs: [
      'Codex 4.0 (codex-4-o-registration-portal.onrender.com) is a technical educational event registration portal operated by Coders\' Club, GPREC.',
      'We provide event access ticketing and team registration services for an on-site, in-person coding competition. We do NOT sell, manufacture, or ship any physical goods, commodities, or merchandise.',
    ],
  },
  {
    heading: 'Shipping & Courier Policy Applicability',
    paragraphs: [
      'Because all services rendered through this portal are purely digital and event-oriented, traditional physical shipping, postal delivery, courier transit, and physical return policies are NOT APPLICABLE to any transactions on this website.',
    ],
  },
  {
    heading: 'Digital Delivery of Event Credentials',
    paragraphs: [
      'Upon successful completion of payment via the Razorpay payment gateway, delivery of your event access credentials is instantaneous and digital:',
    ],
    list: [
      'On-Screen Confirmation: A digital receipt containing your Unique Team ID (e.g. CDX4-XXXX), payment amount, and team breakdown is immediately displayed upon payment verification.',
      'Automated Email Pass: An official HTML registration confirmation email containing full event schedule, venue instructions, and WhatsApp group joining links is automatically dispatched to the primary Team Leader\'s registered email address.',
      'Delivery Timeline: Instantaneous (typically within 5 to 30 seconds of transaction completion).',
    ],
  },
  {
    heading: 'On-Campus Distribution of Certificates & Prizes',
    paragraphs: [
      'Official printed Participation Certificates and Winner Merit Awards/Trophies are awarded physically to registered participants in-person at the event venue (GPREC Campus, Kurnool) during the valedictory ceremony on September 24, 2026.',
    ],
  },
  {
    heading: 'Non-Delivery / Missing Confirmation Email',
    paragraphs: [
      'If you have completed your payment but did not receive your confirmation email within 15 minutes (please also check your Spam/Junk folder), please reach out to us at codersclubrecuirtment@gmail.com with your Razorpay payment ID or registered email, and our team will re-issue your Team ID pass immediately.',
    ],
  },
];

const ShippingPolicyPage = () => {
  return (
    <LegalPageLayout
      title="Shipping and Delivery Policy"
      subtitle="Information regarding digital delivery of event passes and non-applicability of physical shipping."
      lastUpdated="September 1, 2026"
      icon={Truck}
      sections={SHIPPING_SECTIONS}
    />
  );
};

export default ShippingPolicyPage;
