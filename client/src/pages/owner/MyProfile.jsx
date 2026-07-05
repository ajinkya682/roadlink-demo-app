import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, MapPin, Loader2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAppData } from "../../context/AppContext";
import SyncIndicator from "../../components/SyncIndicator";

export default function MyProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAppData();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.maskedPhone || user.phone || "",
    email: user.email || "",
    address: "Mumbai, Maharashtra", // Mocked for UI currently
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      // address not fully modeled on backend yet but can append
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Edit Profile" />

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 pt-4"
        >
          <div 
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg" 
              onChange={handleFileChange} 
            />
            
            <div className="w-28 h-28 bg-[#1B4B8F] rounded-[2rem] flex items-center justify-center shadow-lg transition-transform group-active:scale-95 overflow-hidden">
              {(previewUrl || user.avatarUrl) ? (
                <img 
                  src={previewUrl || user.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-[40px] font-bold text-white">
                  {user.avatar}
                </span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-[#e5e2e1] rounded-full flex items-center justify-center shadow-sm text-[#434751] group-hover:text-[#003470] transition-colors">
              <Camera size={20} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-display text-[24px] font-semibold text-[#1c1b1b] flex items-center justify-center gap-2">
              {form.name || "Your Name"}
              <SyncIndicator urlPrefix="/users/me" />
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
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">Profile updated successfully!</p>}
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#e5e2e1] p-4 shadow-[0px_4px_12px_rgba(26,26,26,0.02)]"
        >
          <button 
            onClick={() => navigate('/order-history')}
            className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[#1E3A8A]">
                <Package size={20} />
              </div>
              <span className="font-display font-semibold text-[#1c1b1b]">Sticker Order History</span>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            className="w-full flex items-center justify-center bg-[#1B4B8F] text-white font-body text-[14px] font-bold tracking-[0.08em] uppercase py-4 rounded-xl hover:bg-[#153a6f] active:scale-[0.98] transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Save Changes"}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
