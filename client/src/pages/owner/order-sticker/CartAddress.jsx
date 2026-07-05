import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../lib/api';

export default function CartAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier, selections, vehicle, customization } = location.state || { tier: 'standard', selections: [] };

  const [formData, setFormData] = useState({
    name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: ''
  });
  const [saveDefault, setSaveDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImgUrl, setPreviewImgUrl] = useState('');

  const isFree = vehicle && !vehicle.hasUsedFreeStickerOrder;
  const basePrices = { standard: 199, reflective: 299, premium: 399 };
  const basePrice = isFree ? 0 : (basePrices[tier] || 199);
  const shipping = isFree ? 0 : 50;
  const gst = isFree ? 0 : Math.round((basePrice + shipping) * 0.18);
  const total = basePrice + shipping + gst;
  const qty = tier === 'reflective' ? 2 : 1;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.name && formData.line1 && formData.city && formData.state && formData.pincode && formData.phone;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);
    
    try {
      // 1. Create Draft Order
      const createRes = await api.post('/orders', {
        vehicleId: vehicle._id || vehicle.id,
        tier,
        templateSelections: selections,
        customization: customization || {}
      });
      
      const order = createRes.data;

      // 2. Update Address
      await api.patch(`/orders/${order._id}/address`, { ...formData, saveDefault });

      // 3. Checkout
      const checkoutRes = await api.post(`/orders/${order._id}/checkout`);
      const checkoutData = checkoutRes.data;

      if (checkoutData.isFree) {
        // Free order complete, go straight to confirmation
        navigate('/order-confirmation', { state: { orderId: order._id } });
      } else {
        // Proceed to Razorpay payment screen
        navigate('/order-sticker/payment', { 
          state: { 
            orderId: order._id, 
            amount: checkoutData.amount / 100,
            tier: tier,
            checkoutData
          } 
        });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to process order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Checkout</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
        
        {/* Order Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <h2 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Order Summary</h2>
          <div className="flex items-center mb-4">
             <div 
                className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mr-4 cursor-pointer relative"
                onClick={() => { if(selections[0]?.previewImageUrl) { setPreviewImgUrl(selections[0].previewImageUrl); setPreviewOpen(true); } }}
             >
                {selections && selections[0] && selections[0].previewImageUrl ? (
                   <img src={selections[0].previewImageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-200 uppercase">{tier}</div>
                )}
             </div>
             <div>
               <h3 className="font-bold text-slate-800 capitalize">{tier} Tier</h3>
               <p className="text-sm text-slate-500">Qty: {qty}</p>
             </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono">₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-mono">₹{shipping}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (18%)</span>
              <span className="font-mono">₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-[#1F2937] pt-2 border-t border-slate-100 mt-2">
              <span>Total</span>
              <span className="font-mono">₹{total}</span>
            </div>
          </div>
        </section>

        {/* Shipping Address */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <h2 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Shipping Address</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1</label>
              <input type="text" name="line1" value={formData.line1} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="123 Main St" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2 (Optional)</label>
              <input type="text" name="line2" value={formData.line2} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="Apt 4B" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="MH" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="400001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="+91" />
              </div>
            </div>

            <div className="pt-2 flex items-center">
              <input 
                type="checkbox" 
                id="saveDefault" 
                checked={saveDefault} 
                onChange={() => setSaveDefault(!saveDefault)}
                className="w-4 h-4 text-[#1E3A8A] border-slate-300 rounded focus:ring-[#1E3A8A]"
              />
              <label htmlFor="saveDefault" className="ml-2 text-sm text-slate-600">Save as default address</label>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[420px] p-6 bg-white border-t border-slate-200 z-10 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-colors flex justify-center items-center ${
            isFormValid() && !isSubmitting
              ? 'bg-[#F59E0B] text-white hover:bg-amber-600' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isFree ? (
            'Place Order (Free)'
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </div>

      {/* Full screen image preview */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setPreviewOpen(false)}>
           <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
             <button onClick={() => setPreviewOpen(false)} className="absolute -top-12 right-0 text-white font-bold p-2 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center">X</button>
             <img src={previewImgUrl} alt="Full Screen Preview" className="w-full h-auto object-contain rounded-lg" />
           </div>
        </div>
      )}
    </div>
  );
}
