import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Database, Smartphone } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Toggle from '../../components/Toggle';

export default function PrivacyControls() {
  const [controls, setControls] = useState({
    publicProfile: false,
    showPhone: false,
    shareAnalytics: true,
    allowSearch: false,
  });

  const toggleControl = (key) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: "Scanner Visibility",
      description: "Control what happens when someone scans your vehicle's QR code.",
      items: [
        {
          key: 'publicProfile',
          icon: Eye,
          label: 'Public Vehicle Profile',
          desc: 'Show vehicle make and model to anyone who scans your QR tag.',
        },
        {
          key: 'showPhone',
          icon: Smartphone,
          label: 'Display Phone Number',
          desc: 'Allow emergency responders to see your unmasked phone number instead of using our secure proxy.',
        }
      ]
    },
    {
      title: "Data & Discoverability",
      description: "Manage how your RoadLink profile is handled internally.",
      items: [
        {
          key: 'allowSearch',
          icon: Shield,
          label: 'Plate Searchable',
          desc: 'Allow registered authorities to search your vehicle by its license plate.',
        },
        {
          key: 'shareAnalytics',
          icon: Database,
          label: 'Share Anonymous Analytics',
          desc: 'Help us improve by sharing crash reports and basic usage metrics.',
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Privacy Controls" />

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#003470]/5 p-5 rounded-xl border border-[#003470]/10 flex items-start gap-4"
        >
          <Shield size={24} className="text-[#003470] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-[18px] font-semibold text-[#1c1b1b]">End-to-End Encrypted</h3>
            <p className="font-body text-[14px] text-[#434751] mt-1">
              Your identity and emergency contacts are encrypted. We never sell your data. You have full control over what gets shared.
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.section 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className="space-y-4"
            >
              <div className="px-1">
                <h3 className="font-display text-[20px] font-semibold text-[#1c1b1b]">{section.title}</h3>
                <p className="font-body text-[14px] text-[#737782]">{section.description}</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#e5e2e1] divide-y divide-[#e5e2e1] shadow-[0px_4px_12px_rgba(26,26,26,0.02)]">
                {section.items.map((item) => (
                  <div key={item.key} className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-[#434751]" />
                    </div>
                    <div className="flex-1 pr-4">
                      <p className="font-display text-[16px] font-semibold text-[#1c1b1b]">{item.label}</p>
                      <p className="font-body text-[13px] text-[#737782] mt-1 leading-snug">{item.desc}</p>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Toggle on={controls[item.key]} onChange={() => toggleControl(item.key)} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
}
