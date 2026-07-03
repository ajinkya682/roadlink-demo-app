import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, MapPin } from "lucide-react";
import AppHeader from "../../components/AppHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDemoData } from "../../context/DemoContext";

export default function MyProfile() {
  const { user } = useDemoData();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.maskedPhone,
    email: "john.doe@example.com",
    address: "Mumbai, Maharashtra",
  });

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Edit Profile" />

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 pt-4"
        >
          <div className="relative group cursor-pointer">
            <div className="w-28 h-28 bg-[#1B4B8F] rounded-[2rem] flex items-center justify-center shadow-lg transition-transform group-active:scale-95">
              <span className="font-display text-[40px] font-bold text-white">
                {user.avatar}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-[#e5e2e1] rounded-full flex items-center justify-center shadow-sm text-[#434751] group-hover:text-[#003470] transition-colors">
              <Camera size={20} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-display text-[24px] font-semibold text-[#1c1b1b]">
              {user.name}
            </h2>
            <p className="font-body text-[14px] text-[#737782]">
              Member since {user.joinedDate}
            </p>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#e5e2e1] p-6 shadow-[0px_4px_12px_rgba(26,26,26,0.02)] space-y-6"
        >
          <h3 className="font-display text-[20px] font-semibold text-[#1c1b1b]">
            Personal Information
          </h3>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div>
              <label className="block font-body text-[12px] font-bold tracking-[0.08em] text-[#737782] uppercase mb-2">
                Phone Number (Locked)
              </label>
              <div className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3.5 text-[#434751] font-mono cursor-not-allowed">
                {form.phone}
              </div>
              <p className="font-body text-[12px] text-[#737782] mt-1.5 ml-1">
                Contact support to change your primary phone number.
              </p>
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Mail
                size={20}
                className="absolute right-4 top-10 text-[#737782]"
              />
            </div>

            <div className="relative">
              <Input
                label="City / State"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <MapPin
                size={20}
                className="absolute right-4 top-10 text-[#737782]"
              />
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button className="w-full bg-[#1B4B8F] text-white font-body text-[14px] font-bold tracking-[0.08em] uppercase py-4 rounded-xl hover:bg-[#153a6f] active:scale-[0.98] transition-all shadow-md">
            Save Changes
          </button>
        </motion.div>
      </main>
    </div>
  );
}
