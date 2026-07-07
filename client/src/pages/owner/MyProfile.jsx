import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, MapPin, Loader2, Package, Plus, Edit2, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAppData } from "../../context/AppContext";
import SyncIndicator from "../../components/SyncIndicator";
import api from "../../lib/api";

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
  
  const [addresses, setAddresses] = useState(user.savedAddresses || []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', isDefault: false });

  useEffect(() => {
    api.get('/users/me').then(res => {
      if(res.data.success && res.data.data.user.savedAddresses) {
        setAddresses(res.data.data.user.savedAddresses);
      }
    }).catch(console.error);
  }, []);

  const handleSaveAddress = async () => {
     try {
       if (editingAddress) {
         const res = await api.put(`/users/me/addresses/${editingAddress._id}`, addressForm);
         setAddresses(res.data.data.savedAddresses);
       } else {
         const res = await api.post('/users/me/addresses', addressForm);
         setAddresses(res.data.data.savedAddresses);
       }
       setShowAddressModal(false);
     } catch(err) {
       alert(err.response?.data?.error?.message || "Failed to save address");
     }
  };

  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Delete this address?")) return;
    try {
       const res = await api.delete(`/users/me/addresses/${id}`);
       setAddresses(res.data.data.savedAddresses);
    } catch(err) {
       alert("Failed to delete address");
    }
  };
  
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

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#e5e2e1] p-6 shadow-[0px_4px_12px_rgba(26,26,26,0.02)] space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[20px] font-semibold text-[#1c1b1b]">
              Saved Addresses ({addresses.length}/3)
            </h3>
            {addresses.length < 3 && (
              <button 
                onClick={() => { setEditingAddress(null); setAddressForm({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', isDefault: addresses.length === 0 }); setShowAddressModal(true); }}
                className="text-[#1E3A8A] flex items-center text-sm font-bold hover:underline"
              >
                <Plus size={16} className="mr-1" /> Add
              </button>
            )}
          </div>

          <div className="space-y-3">
            {addresses.length === 0 && <p className="text-slate-500 text-sm">No saved addresses.</p>}
            {addresses.map(addr => (
               <div key={addr._id} className="p-3 border border-slate-200 rounded-lg relative hover:border-[#1E3A8A] transition-colors">
                 {addr.isDefault && <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Main</span>}
                 <p className="font-bold text-slate-800 text-sm">{addr.name}</p>
                 <p className="text-xs text-slate-600 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                 <p className="text-xs text-slate-600">{addr.city}, {addr.state} {addr.pincode}</p>
                 <p className="text-xs text-slate-600">{addr.phone}</p>
                 <div className="flex mt-3 space-x-4 border-t border-slate-100 pt-2">
                   <button onClick={() => { setEditingAddress(addr); setAddressForm(addr); setShowAddressModal(true); }} className="text-slate-500 hover:text-[#1E3A8A] flex items-center text-xs font-bold transition-colors"><Edit2 size={14} className="mr-1.5"/> Edit</button>
                   <button onClick={() => handleDeleteAddress(addr._id)} className="text-slate-500 hover:text-red-600 flex items-center text-xs font-bold transition-colors"><Trash2 size={14} className="mr-1.5"/> Delete</button>
                 </div>
               </div>
            ))}
          </div>
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

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto relative">
             <button onClick={() => setShowAddressModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24} />
             </button>
             <h2 className="text-xl font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
             
             <div className="space-y-4">
                <Input label="Full Name" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} casing="words" />
                <Input label="Address Line 1" value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} casing="words" />
                <Input label="Address Line 2" value={addressForm.line2} onChange={e => setAddressForm({...addressForm, line2: e.target.value})} casing="words" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} casing="words" />
                  <Input label="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} casing="words" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="PIN Code" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                  <Input label="Phone" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                </div>
                <div className="flex items-center pt-2">
                 <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 text-[#1E3A8A] rounded" id="isDefault" />
                 <label htmlFor="isDefault" className="ml-2 text-sm text-slate-600">Set as Main Address</label>
               </div>
               {addressForm.isDefault && addresses.length >= 3 && !editingAddress?.isDefault && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">This will replace your current Main address.</p>
               )}
               
               <button 
                 onClick={handleSaveAddress} 
                 disabled={!addressForm.name || !addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.pincode}
                 className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50"
               >
                 Save Address
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
