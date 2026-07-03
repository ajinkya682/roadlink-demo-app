import React from 'react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';

export default function TermsPrivacy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create or modify your account, order a digital plate, contact customer support, or otherwise communicate with us. This information may include: name, email address, phone number, vehicle registration details, and emergency contact information."
    },
    {
      title: "2. How We Use Your Information",
      content: "RoadLink uses the collected data exclusively to provide, maintain, and improve our services. Specifically, your vehicle and contact data is used to route emergency alerts and notifications when your QR tag is scanned. We do not sell your personal data to third parties."
    },
    {
      title: "3. Data Security & Encryption",
      content: "Your privacy is our primary concern. All sensitive data, including emergency contacts and phone numbers, are encrypted at rest and in transit. When a user scans your QR code, your phone number remains masked behind our secure proxy servers to prevent unauthorized access and harassment."
    },
    {
      title: "4. User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your login credentials and for keeping your vehicle registration and emergency contact information accurate and up to date. RoadLink is not liable for failed notifications resulting from outdated contact data."
    },
    {
      title: "5. Changes to This Policy",
      content: "We may change this Privacy Policy from time to time. If we make significant changes, we will notify you through the RoadLink app or via email. By continuing to access or use the Services after those changes become effective, you agree to be bound by the revised Privacy Policy."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Terms & Privacy Policy" />

      <main className="max-w-2xl mx-auto px-5 pt-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="font-display text-[28px] font-bold text-[#1c1b1b] leading-tight">
            RoadLink Terms of Service & Privacy Policy
          </h2>
          <p className="font-body text-[14px] text-[#737782]">
            Last Updated: October 2026
          </p>
          <div className="w-16 h-1 bg-[#1B4B8F] rounded-full mt-4"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#e5e2e1] p-6 md:p-8 shadow-[0px_4px_12px_rgba(26,26,26,0.02)] space-y-8"
        >
          <p className="font-body text-[15px] text-[#434751] leading-relaxed">
            Welcome to RoadLink. By using our digital plate services, mobile applications, and platform, you agree to these terms. Please read them carefully to understand how we protect your data and identity on the road.
          </p>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="font-display text-[18px] font-semibold text-[#1c1b1b]">
                  {section.title}
                </h3>
                <p className="font-body text-[15px] text-[#434751] leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#e5e2e1] mt-8">
            <p className="font-body text-[14px] text-[#737782] italic">
              If you have any questions about this Privacy Policy, please contact us at privacy@roadlink.in
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
