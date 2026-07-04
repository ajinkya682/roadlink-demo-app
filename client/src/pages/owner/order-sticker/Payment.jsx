import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || { orderId: 'UNKNOWN' };

  useEffect(() => {
    // Simulate Razorpay checkout overlay opening and then succeeding after a few seconds.
    // In reality, here we would initialize the Razorpay checkout script, open the modal,
    // and wait for the onSuccess / onDismiss callbacks.
    const timer = setTimeout(() => {
      // Simulate successful payment routing
      navigate('/order-confirmation', { state: { orderId } });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      
      {/* RoadLink Logo placeholder */}
      <div className="w-20 h-20 bg-[#1E3A8A] rounded-2xl flex items-center justify-center shadow-lg mb-8">
        <span className="text-white font-bold text-2xl tracking-tighter">RL</span>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#F59E0B] rounded-full animate-spin"></div>
        
        <div className="flex items-center space-x-2 text-slate-700 mt-4">
          <Lock size={18} className="text-[#10B981]" />
          <span className="font-medium text-lg">Opening secure payment...</span>
        </div>
        
        <p className="text-sm text-slate-500 max-w-xs mt-2">
          Please do not close this window or press the back button.
        </p>
      </div>

    </div>
  );
}
