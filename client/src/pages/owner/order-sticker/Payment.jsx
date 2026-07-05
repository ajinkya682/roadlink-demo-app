import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutData } = location.state || {};
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!checkoutData) {
      navigate('/dashboard');
      return;
    }

    const loadRazorpay = () => {
      if (isInitializing.current) return;
      isInitializing.current = true;

      const options = {
        key: checkoutData.keyId,
        amount: checkoutData.amount * 100,
        currency: checkoutData.currency,
        name: 'RoadLink',
        description: 'Sticker Order',
        order_id: checkoutData.id,
        handler: function (response) {
          // On success, Razorpay will call our webhook to verify and process.
          // We can optimistically show the confirmation.
          navigate('/order-confirmation', { state: { orderId: location.state.orderId } });
        },
        prefill: {
          name: checkoutData.orderInfo?.shippingAddress?.name || '',
          contact: checkoutData.orderInfo?.shippingAddress?.phone || ''
        },
        theme: {
          color: '#1b4b8f'
        },
        modal: {
          ondismiss: function() {
            // User closed the modal
            navigate('/order-sticker/cart', { replace: true });
          }
        }
      };

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        alert('Razorpay SDK failed to load. Are you online?');
        isInitializing.current = false;
        navigate('/order-sticker/cart');
      };
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, [checkoutData, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-[#1E3A8A] rounded-2xl flex items-center justify-center shadow-lg mb-8">
        <span className="text-white font-bold text-2xl tracking-tighter">RL</span>
      </div>
      <div className="flex flex-col items-center space-y-4">
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
