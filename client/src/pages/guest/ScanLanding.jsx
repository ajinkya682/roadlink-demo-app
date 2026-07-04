import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { reportCategories } from '../../demo-data/categories';
import api from '../../lib/api';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

export default function ScanLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialToken = location.state?.qrId || searchParams.get('qr');
  const initialNumber = searchParams.get('number');
  const [token, setToken] = useState(initialToken);
  const [number, setNumber] = useState(initialNumber);
  const [profile, setProfile] = useState(location.state?.profile || null);
  const [loading, setLoading] = useState(!location.state?.profile);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile && (token || number)) {
      const fetchProfile = async () => {
        try {
          if (token === 'ROADLINK-SIMULATED123') {
            setProfile({ publicDisplayName: 'TEST VEHICLE', isVerified: true });
            setLoading(false);
            return;
          }

          const url = token ? `/vehicles/resolve?token=${token}` : `/vehicles/resolve?number=${number}`;
          const res = await api.get(url);
          if (res.data.success) {
            setProfile(res.data.data.profile);
          } else {
            navigate('/', { replace: true });
          }
        } catch (err) {
          navigate('/', { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else if (!profile && !token && !number) {
      navigate('/', { replace: true });
    }
  }, [token, number, profile]);

  const handleCategory = (cat) => {
    navigate('/report-detail', { state: { category: cat, token, number, profile } });
  };

  if (loading) {
    return (
      <div className="bg-[#F7F8FA] min-h-screen flex items-center justify-center">
        <p className="text-[#1c1b1b]/50 animate-pulse">Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-[#F7F8FA] min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-[#ba1a1a] font-bold">{error || 'Unable to load vehicle.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] text-[#1c1b1b] font-body min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 md:px-10 py-8 max-w-2xl">
        <header className="flex flex-col gap-6 mb-10 mt-4 items-center w-full">
          <div className="flex flex-col items-center gap-3">
             {/* Vehicle Icon */}
             <div className="w-16 h-16 bg-[#003470]/10 rounded-full flex items-center justify-center mb-2 border border-[#003470]/20 shadow-sm">
               <span className="material-symbols-outlined text-[32px] text-[#003470]">
                 {profile.type === 'two-wheeler' ? 'two_wheeler' : profile.type === 'heavy-vehicle' ? 'directions_bus' : 'directions_car'}
               </span>
             </div>

            <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center border-2 border-[#1c1b1b] shadow-[2px_2px_0px_0px_rgba(28,27,27,0.1)]">
              <span className="font-mono text-[16px] text-[#1c1b1b] font-bold tracking-widest uppercase">
                {profile.publicDisplayName}
              </span>
            </div>
            
            {profile.isVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E8E5A]/10 text-[#1E8E5A] border border-[#1E8E5A]/20 mt-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-body text-[11px] font-bold tracking-widest uppercase">VERIFIED</span>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl border border-[#1c1b1b]/10 shadow-sm p-5 space-y-4 w-full">
            <h3 className="font-display text-[16px] font-bold text-[#1c1b1b] border-b border-[#1c1b1b]/10 pb-2">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {profile.make && profile.model && (
                <div>
                  <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Make / Model</p>
                  <p className="font-semibold text-[#1c1b1b]">{profile.make} {profile.model}</p>
                </div>
              )}
              {profile.type && (
                <div>
                  <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Type</p>
                  <p className="font-semibold text-[#1c1b1b] capitalize">{profile.type.replace('-', ' ')}</p>
                </div>
              )}
              {profile.year && (
                <div>
                  <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Year</p>
                  <p className="font-semibold text-[#1c1b1b]">{profile.year}</p>
                </div>
              )}
              {profile.color && (
                <div>
                  <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Color</p>
                  <p className="font-semibold text-[#1c1b1b]">{profile.color}</p>
                </div>
              )}
              {profile.ownerName && (
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Owner Name</p>
                  <p className="font-semibold text-[#1c1b1b]">{profile.ownerName}</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#1c1b1b]/10 pt-4 mt-4 space-y-3">
               <div>
                  <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-2">Emergency Contact</p>
                  {profile.ownerPhone ? (
                    <a href={`tel:${profile.ownerPhone}`} className="inline-flex items-center justify-center w-full gap-2 bg-[#003470]/10 text-[#003470] px-4 py-3 rounded-xl font-bold hover:bg-[#003470]/20 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                      {profile.ownerPhone}
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-center w-full gap-2 bg-[#1c1b1b]/5 text-[#434751] px-4 py-3 rounded-xl font-medium border border-[#1c1b1b]/10">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      Masked for Privacy
                    </div>
                  )}
               </div>
            </div>
          </div>

          <h1 className="font-display text-[20px] font-semibold text-[#1c1b1b] text-center opacity-80 mt-2">
            Report an issue with this vehicle
          </h1>
        </header>

        <motion.section
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {reportCategories.map((cat) => {
            const isRedAlert = cat.isAlert;
            const isFullWidth = cat.fullWidth;
            
            return (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCategory(cat)}
                className={`
                  flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-colors min-h-[110px]
                  ${isFullWidth ? 'col-span-2 flex-row' : ''}
                  ${isRedAlert 
                    ? 'bg-white border-2 border-[#ba1a1a]/60 shadow-sm hover:bg-[#ba1a1a]/5' 
                    : 'bg-white border border-[#1c1b1b]/10 hover:border-[#003470]/30'
                  }
                `}
              >
                <span
                  className={`material-symbols-outlined ${isRedAlert ? 'text-[#ba1a1a]' : 'text-[#003470]'}`}
                  style={isRedAlert ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {cat.icon}
                </span>
                <span
                  className={`font-body text-[12px] font-bold tracking-widest uppercase text-center ${
                    isRedAlert ? 'text-[#ba1a1a]' : 'text-[#1c1b1b]'
                  }`}
                >
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </motion.section>

        <div className="mt-12 flex justify-center">
          <div className="bg-[#003470]/5 rounded-2xl p-6 border border-[#003470]/10 flex items-start gap-4 max-w-sm">
            <span className="material-symbols-outlined text-[#003470] mt-1">info</span>
            <div className="flex flex-col">
              <p className="font-body text-[14px] text-[#1c1b1b]/70 leading-relaxed">
                Selecting an option will immediately notify the vehicle owner via a privacy-protected link. Do not use this service for harassment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 px-4 text-center flex flex-col items-center gap-4 border-t border-[#1c1b1b]/5 mt-4">
        {(!profile || !profile.ownerPhone) && (
          <p className="font-body text-[14px] text-[#434751]">This page never shows the owner's phone number.</p>
        )}
        <div className="flex items-center gap-2">
          <span className="font-display text-[18px] tracking-tight text-[#003470] font-bold">RoadLink</span>
          <span className="font-mono text-[10px] bg-[#1c1b1b]/5 px-2 py-0.5 rounded text-[#1c1b1b]/60">v2.4.0</span>
        </div>
      </footer>
    </div>
  );
}
