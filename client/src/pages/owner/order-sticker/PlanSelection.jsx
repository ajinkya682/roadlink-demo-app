import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import standardImg from '../../../assets/images/stickers/sticker-template8.png';
import reflectiveImg from '../../../assets/images/stickers/sticker-template9.png';
import premiumImg from '../../../assets/images/stickers/sticker-template10.png';

export default function PlanSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVehicle = location.state?.vehicle;
  
  const [vehicle, setVehicle] = React.useState(initialVehicle);
  const [isFree, setIsFree] = React.useState(initialVehicle && !initialVehicle.hasUsedFreeStickerOrder);

  React.useEffect(() => {
    if (initialVehicle && (initialVehicle._id || initialVehicle.id)) {
      const vId = initialVehicle._id || initialVehicle.id;
      // Fetch latest vehicle status to ensure accurate hasUsedFreeStickerOrder
      import('../../../lib/api').then(({ default: api }) => {
        api.get(`/vehicles/${vId}`)
          .then(res => {
            if (res.data.success) {
              const latestV = res.data.data.vehicle;
              setVehicle({ ...initialVehicle, ...latestV });
              setIsFree(!latestV.hasUsedFreeStickerOrder);
            }
          })
          .catch(err => console.error("Failed to fetch latest vehicle status", err));
      });
    }
  }, [initialVehicle]);

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
          
          {/* Reflective Tier */}
          <div 
            onClick={() => handleSelect('reflective')}
            className="bg-white rounded-xl shadow-md border-2 border-[#1E3A8A] p-4 flex items-center cursor-pointer active:scale-95 transition-transform relative overflow-hidden"
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
                {isFree ? (
                  <>
                    <span className="font-mono font-medium text-slate-500 line-through mr-1 text-xs">₹299</span>
                    <span className="font-mono font-bold text-verified-green">FREE</span>
                  </>
                ) : (
                  <span className="font-mono font-medium text-slate-500">₹299</span>
                )}
              </div>
              <p className="text-sm text-slate-500">2 stickers, reflective material</p>
            </div>
            <ChevronRight size={20} className="text-[#1E3A8A] ml-2" />
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Other plans coming soon</p>
          </div>

        </div>
      </main>
    </div>
  );
}
