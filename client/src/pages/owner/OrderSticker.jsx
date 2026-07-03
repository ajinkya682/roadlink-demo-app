import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Sun, Nfc, CheckCircle2, Truck, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';

const stickerOptions = [
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Durable matte finish, weatherproof adhesive.',
    price: 99,
    icon: QrCode
  },
  {
    id: 'reflective',
    name: 'Reflective',
    desc: 'High-visibility reflective coating for night safety.',
    price: 149,
    icon: Sun
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Hybrid NFC chip + QR. Tap to identify instantly.',
    price: 249,
    icon: Nfc,
    best: true
  }
];

export default function OrderSticker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSticker, setSelectedSticker] = useState('standard');
  const [loading, setLoading] = useState(false);

  const selectedPrice = stickerOptions.find(s => s.id === selectedSticker)?.price || 0;

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/order-confirmation');
    }, 1500);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const animationProps = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body flex flex-col pb-24 md:pb-0">
      <AppHeader title="Order Sticker" onBack={handleBack} />

      <main className="max-w-4xl mx-auto px-4 md:px-10 py-6 space-y-8 w-full flex-grow">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...animationProps} className="space-y-12">
              {/* Hero Branding Section */}
              <section className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-xl border border-black/10">
                <div className="w-full space-y-4">
                  <span className="bg-[#feae2c] text-[#291800] font-body text-[12px] font-bold tracking-[0.08em] px-3 py-1 rounded-full uppercase inline-block">
                    OFFICIAL CREDENTIALS
                  </span>
                  <h2 className="font-display text-[26px] md:text-[32px] font-semibold leading-tight tracking-tight">
                    Secure Your Digital Plate
                  </h2>
                  <p className="text-[#434751] font-body text-[16px] leading-relaxed">
                    Order a high-durability QR identifier for your vehicle. Link your identity, insurance, and emergency contacts to a single scan.
                  </p>
                </div>
                
                <div className="w-full relative h-56 md:h-72 overflow-hidden rounded-lg group">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbbqD8uHqZP_NMXhe6p6KBkOs-bfWXCZwXdDlccq5tqrqxKHPagl0jW0MOvnGeU_XgJjxVmL_Yz9zMuNkYS2VkxDFaOHlB1MJHgnOXM2CbCjAgQP1HCMs37hptSdT_ge__AUKA1QqVrpnhLznZm-mtrgJKflSo0EjGs2_Jc2UeH5-n6xAe4Jzj4LQcOMyndSePUbX_9ChxBA7pPlBMEM9nE24JMd9F4iP-sOKx25Ebub6SlmhJjdTCPfqXGFwqG6EnIR47bL3aPg')" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <ShieldCheck size={20} />
                    <span className="font-body text-[12px] font-bold tracking-[0.08em] uppercase">MVA COMPLIANT</span>
                  </div>
                </div>
              </section>

              {/* Section 1: Sticker Type Selection */}
              <section id="sticker-selection">
                <div className="mb-6">
                  <h3 className="font-display text-[20px] font-semibold uppercase tracking-wide">01. Select Sticker Type</h3>
                  <div className="h-1 w-12 bg-[#003470] mt-1"></div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {stickerOptions.map((opt) => {
                    const isSelected = selectedSticker === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => setSelectedSticker(opt.id)}
                        className={`group cursor-pointer p-5 rounded-xl transition-all flex items-center gap-4 ${
                          isSelected 
                            ? 'bg-white border-2 border-[#1c1b1b] shadow-[4px_4px_0px_0px_rgba(28,27,27,0.1)] -translate-y-[2px]' 
                            : 'bg-[#f6f3f2] border border-black/15 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#003470]/10' : 'bg-black/5'}`}>
                          <Icon size={28} className={isSelected ? "text-[#003470]" : "text-[#434751]"} strokeWidth={1.5} />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-[18px] md:text-[20px] font-semibold text-[#1c1b1b]">{opt.name}</h4>
                            {opt.best && (
                              <span className="bg-[#1b4b8f] text-[#9cbdff] text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider">BEST</span>
                            )}
                          </div>
                          
                          <p className="text-[#434751] font-body text-[13px] md:text-[14px] leading-snug mt-1 max-w-[280px]">
                            {opt.desc}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <CheckCircle2 size={24} className={isSelected ? "text-[#003470] fill-[#003470]/10" : "text-black/15"} strokeWidth={1.5} />
                          <div className="font-mono text-[18px] md:text-[20px] font-semibold text-[#1c1b1b]">
                            ₹{opt.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-black/10">
                  <button 
                    onClick={handleNext}
                    className="w-full bg-[#1c1b1b] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#2a2a2a] active:scale-95 transition-all"
                  >
                    <span className="font-body text-[14px] tracking-wider uppercase">CONTINUE TO SHIPPING</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...animationProps} className="space-y-12">
              {/* Section 2: Shipping Address */}
              <section id="shipping-address">
                <div className="mb-6">
                  <h3 className="font-display text-[20px] font-semibold uppercase tracking-wide">02. Shipping Logistics</h3>
                  <div className="h-1 w-12 bg-[#003470] mt-1"></div>
                </div>
                
                <div className="bg-white p-6 md:p-8 rounded-xl border border-black/15">
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-full md:col-span-1 space-y-2">
                      <label className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase block">FULL NAME</label>
                      <input className="w-full bg-[#fcf9f8] border-black/20 border rounded-lg px-4 py-3 focus:border-[#003470] focus:ring-1 focus:ring-[#003470] outline-none transition-all font-body text-[16px]" placeholder="John Doe" type="text" />
                    </div>
                    <div className="col-span-full md:col-span-1 space-y-2">
                      <label className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase block">PIN CODE</label>
                      <input className="w-full bg-[#fcf9f8] border-black/20 border rounded-lg px-4 py-3 focus:border-[#003470] focus:ring-1 focus:ring-[#003470] outline-none transition-all font-mono text-[16px]" placeholder="110001" type="number" />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase block">HOUSE / FLAT / BUILDING NO.</label>
                      <input className="w-full bg-[#fcf9f8] border-black/20 border rounded-lg px-4 py-3 focus:border-[#003470] focus:ring-1 focus:ring-[#003470] outline-none transition-all font-body text-[16px]" placeholder="A-12, Green Park" type="text" />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase block">AREA / STREET / LOCALITY</label>
                      <input className="w-full bg-[#fcf9f8] border-black/20 border rounded-lg px-4 py-3 focus:border-[#003470] focus:ring-1 focus:ring-[#003470] outline-none transition-all font-body text-[16px]" placeholder="Near Main Metro Station" type="text" />
                    </div>
                    <div className="col-span-full md:col-span-1 space-y-2">
                      <label className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase block">CITY</label>
                      <input className="w-full bg-[#fcf9f8] border-black/20 border rounded-lg px-4 py-3 focus:border-[#003470] focus:ring-1 focus:ring-[#003470] outline-none transition-all font-body text-[16px]" placeholder="New Delhi" type="text" />
                    </div>
                    <div className="col-span-full md:col-span-1 space-y-2">
                      <label className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase block">STATE</label>
                      <div className="relative">
                        <select className="w-full bg-[#fcf9f8] border-black/20 border rounded-lg px-4 py-3 focus:border-[#003470] focus:ring-1 focus:ring-[#003470] outline-none appearance-none transition-all font-body text-[16px]">
                          <option>Delhi</option>
                          <option>Maharashtra</option>
                          <option>Karnataka</option>
                          <option>Tamil Nadu</option>
                          <option>Haryana</option>
                          <option>Gujarat</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#434751]"></div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="mt-8 pt-6 border-t border-black/10">
                  <button 
                    onClick={handleNext}
                    className="w-full bg-[#1c1b1b] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#2a2a2a] active:scale-95 transition-all"
                  >
                    <span className="font-body text-[14px] tracking-wider uppercase">CONTINUE TO SUMMARY</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...animationProps} className="space-y-12">
              {/* Section 3: Order Summary & Payment */}
              <section id="order-summary">
                <div className="mb-6">
                  <h3 className="font-display text-[20px] font-semibold uppercase tracking-wide">03. Order Summary</h3>
                  <div className="h-1 w-12 bg-[#003470] mt-1"></div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="w-full space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-[#f6f3f2] border border-black/10">
                      <div className="bg-white p-3 rounded border border-black/5">
                        <Truck size={24} className="text-[#003470]" />
                      </div>
                      <div>
                        <p className="font-display text-[20px] font-semibold text-[#1c1b1b]">Estimated Delivery</p>
                        <p className="text-[#434751] font-body text-[14px]">Arriving within 3-5 business days via RoadLink Express.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#003e23] font-medium px-2">
                      <ShieldCheck size={18} />
                      <span className="font-body text-[14px]">Your vehicle data is encrypted end-to-end.</span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <div className="bg-[#1c1b1b] text-white p-6 rounded-xl shadow-lg space-y-4">
                      <div className="flex justify-between items-center font-body text-[14px] opacity-80">
                        <span>Subtotal</span>
                        <span className="font-mono">₹{selectedPrice}</span>
                      </div>
                      <div className="flex justify-between items-center font-body text-[14px] opacity-80">
                        <span>Shipping</span>
                        <span className="font-mono text-[#90f7ba]">FREE</span>
                      </div>
                      <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                        <span className="font-body text-[12px] font-bold tracking-[0.08em] uppercase">TOTAL DUE</span>
                        <span className="font-mono text-[20px] font-semibold">₹{selectedPrice}</span>
                      </div>
                      
                      <button 
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-[#1B4B8F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#153a6f] active:scale-95 transition-all mt-4 disabled:opacity-70 disabled:active:scale-100"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2 font-body text-[14px] tracking-wider uppercase">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            SECURING GATEWAY...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 font-body text-[14px] tracking-wider uppercase">
                            PAY WITH RAZORPAY
                            <Zap size={18} className="fill-current" />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="w-full py-12 border-t border-black/10 flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBG-zbidPxTBjx5s6Q5NPbSm0_e7kM0PXfub2spzuqZkbmrZOIMopIoMtXro_f9JgoenX286-7DtC4fB0rxhRzxOZ6ALQ7whJuQPfCAg7yw3CJb8l97K1AJsFJPIbO1UtyGm2QydMrXYqZGbKNvjS2gdHGR_SyYGB8UHDBrjMMbZgC4eiSKHJbQ44Db4K142RcirUXEKw-lbjvUuTG_mb1cOlBZqMzpfIB-nIcRWm3RztAwHXNeYSMI7n13ridNNPm6XVN9uf60XQ')" }}></div>
                  <div className="text-left">
                    <p className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase">FULFILLMENT PARTNER</p>
                    <p className="font-display text-[20px] font-bold text-[#1c1b1b]">RoadLink Logistics Pvt. Ltd.</p>
                  </div>
                </div>
                
                <div className="max-w-md space-y-2">
                  <p className="font-body text-[14px] text-[#1c1b1b]">Privacy Encrypted. Secure fulfillment via RoadLink Logistics.</p>
                  <p className="font-body text-[14px] text-[#434751]">This page never shows the owner's phone number or sensitive RTO data.</p>
                </div>
                
                <div className="flex gap-4">
                  <a className="text-[#434751] underline font-body text-[14px] hover:text-[#003470] transition-colors" href="#">Privacy Policy</a>
                  <a className="text-[#434751] underline font-body text-[14px] hover:text-[#003470] transition-colors" href="#">Legal Terms</a>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
