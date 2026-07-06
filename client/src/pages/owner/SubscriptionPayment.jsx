import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Car } from "lucide-react";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import api from "../../lib/api";

export default function SubscriptionPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vehicle) {
      navigate("/dashboard");
    }
  }, [vehicle, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // Hit our backend to create a subscription
      const { data } = await api.post("/subscriptions/create", {
        vehicleId: vehicle.id || vehicle._id
      });

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to initiate subscription");
      }

      const { subscriptionId, orderId, keyId, amount } = data.data;

      if (keyId === 'dummy_key') {
         setTimeout(() => {
            navigate("/dashboard");
         }, 1000);
         return;
      }

      const options = {
        key: keyId,
        ...(orderId ? { order_id: orderId } : { subscription_id: subscriptionId }),
        name: "RoadLink Digital",
        description: `Vehicle Protection for ${vehicle.plate || vehicle.registrationNumber}`,
        image: "https://via.placeholder.com/150",
        handler: async function (response) {
          try {
            await api.post("/subscriptions/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              vehicleId: vehicle.id || vehicle._id
            });
            navigate("/dashboard");
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com", // Usually prefilled by backend if available
          contact: "9999999999",
        },
        theme: {
          color: "#1B4B8F",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setError(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col pb-20">
      <AppHeader
        title={<span className="text-navy font-bold tracking-wide">ACTIVATE PROTECTION</span>}
        onBack={() => navigate("/dashboard")}
      />

      <main className="flex-1 w-full max-w-xl mx-auto px-5 pt-8 pb-12">
        
        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mb-4">
             <Shield size={40} className="text-navy" />
           </div>
           <h2 className="font-display text-2xl font-bold text-on-surface mb-2">Secure Your Vehicle</h2>
           <p className="font-body text-sm text-on-surface-muted max-w-sm">
             Activate RoadLink protection to enable your digital ID and get emergency access capabilities.
           </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-outline-light p-6 shadow-sm mb-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-navy"></div>
           
           <h3 className="font-body text-xs font-bold tracking-widest text-on-surface-muted uppercase mb-4">
             Protection Plan
           </h3>
           
           <div className="flex justify-between items-end mb-6 border-b border-dashed border-outline-light pb-6">
              <div>
                 <p className="font-display text-xl font-bold text-on-surface">Vehicle Subscription</p>
                 <p className="font-body text-sm text-on-surface-muted mt-1">{vehicle.plate || vehicle.registrationNumber}</p>
              </div>
              <div className="text-right">
                 <p className="font-mono text-2xl font-bold text-navy">₹299</p>
                 <p className="font-body text-[10px] uppercase tracking-wider text-on-surface-muted font-bold mt-1">PER MONTH</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <CheckCircle size={18} className="text-verified-green mt-0.5 flex-shrink-0" />
                 <p className="font-body text-sm text-on-surface">Instantly activate QR digital identity</p>
              </div>
              <div className="flex items-start gap-3">
                 <CheckCircle size={18} className="text-verified-green mt-0.5 flex-shrink-0" />
                 <p className="font-body text-sm text-on-surface">Real-time emergency & parking alerts</p>
              </div>
              <div className="flex items-start gap-3">
                 <CheckCircle size={18} className="text-[#9B6D19] mt-0.5 flex-shrink-0" />
                 <p className="font-body text-sm text-on-surface font-semibold">Includes 1st order of physical Reflective Stickers free (Save ₹199)</p>
              </div>
           </div>
        </div>

        {error && (
          <div className="bg-alert-red/10 border border-alert-red/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-alert-red font-body text-sm font-semibold">{error}</p>
          </div>
        )}

        <Button fullWidth onClick={handleSubscribe} isLoading={loading}>
           SUBSCRIBE & ACTIVATE
        </Button>
        <p className="text-center font-body text-xs text-on-surface-muted mt-4">
          Includes a 7-day money-back guarantee. Cancel anytime.
        </p>
      </main>
    </div>
  );
}
