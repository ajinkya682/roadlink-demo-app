import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import standardImg from '../../../assets/images/stickers/standard-minimal-card.png';
import reflectiveImg from '../../../assets/images/stickers/reflective-split.png';
import premiumImg from '../../../assets/images/stickers/sticker-template1.png';

export default function PlanSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;

  const handleSelect = (tier) => {
    if (tier === 'standard') navigate('/order-sticker/standard', { state: { vehicle } });
    else if (tier === 'reflective') navigate('/order-sticker/reflective', { state: { vehicle } });
    else if (tier === 'premium') navigate('/order-sticker/premium', { state: { vehicle } });
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Select Plan</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <p className="text-slate-600 mb-6 font-medium">Choose a sticker tier for your vehicle.</p>
        
        <div className="space-y-4">
          
          {/* Standard Tier */}
          <div 
            onClick={() => handleSelect('standard')}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 mr-4 overflow-hidden border border-slate-200">
               <img src={standardImg} alt="Standard Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-[#1F2937]">Standard</h3>
                <span className="font-mono font-medium text-slate-500">₹199</span>
              </div>
              <p className="text-sm text-slate-500">1 sticker, choose your design</p>
            </div>
            <ChevronRight size={20} className="text-slate-400 ml-2" />
          </div>

          {/* Reflective Tier */}
          <div 
            onClick={() => handleSelect('reflective')}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center cursor-pointer active:scale-95 transition-transform relative overflow-hidden"
          >
            {/* Subtle sheen effect for reflective */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 mr-4 overflow-hidden border border-slate-300 relative">
               <img src={reflectiveImg} alt="Reflective Preview" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-40"></div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-[#1F2937]">Reflective</h3>
                <span className="font-mono font-medium text-slate-500">₹299</span>
              </div>
              <p className="text-sm text-slate-500">2 stickers, reflective material</p>
            </div>
            <ChevronRight size={20} className="text-slate-400 ml-2" />
          </div>

          {/* Premium Tier */}
          <div 
            onClick={() => handleSelect('premium')}
            className="bg-white rounded-xl shadow-md border-2 border-[#F59E0B] p-4 flex items-center cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-lg flex-shrink-0 mr-4 overflow-hidden border border-amber-200">
               <img src={premiumImg} alt="Premium Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <h3 className="font-bold text-[#1F2937] mr-2">Premium</h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Custom</span>
                </div>
                <span className="font-mono font-medium text-[#F59E0B]">₹399</span>
              </div>
              <p className="text-sm text-slate-500">Fully custom, design your own</p>
            </div>
            <ChevronRight size={20} className="text-amber-500 ml-2" />
          </div>

        </div>
      </main>
    </div>
  );
}
