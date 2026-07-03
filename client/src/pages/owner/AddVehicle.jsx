import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, HelpCircle } from "lucide-react";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Toggle from "../../components/Toggle";
import BottomTabBar from "../../components/BottomTabBar";
import { useAppData } from "../../context/AppContext";
import api from "../../lib/api";

function formatPlate(val) {
  const raw = val.replace(/[^A-Z0-9]/g, "").slice(0, 10);
  let out = raw;
  if (raw.length > 2) out = raw.slice(0, 2) + " " + raw.slice(2);
  if (raw.length > 4)
    out = raw.slice(0, 2) + " " + raw.slice(2, 4) + " " + raw.slice(4);
  if (raw.length > 6)
    out =
      raw.slice(0, 2) +
      " " +
      raw.slice(2, 4) +
      " " +
      raw.slice(4, 6) +
      " " +
      raw.slice(6);
  return out;
}

export default function AddVehicle() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewSetup = location.state?.isNewSetup || false;

  // Using AppContext for phase 2 since DemoContext was removed
  const { addVehicle } = useAppData();

  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [nickname, setNickname] = useState("");
  const [showName, setShowName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlate = (e) =>
    setPlate(formatPlate(e.target.value.toUpperCase()));

  const rawPlate = plate.replace(/\s/g, "");
  const showModel = rawPlate.length >= 5;
  const showNickname = make.length >= 2 || model.length >= 2;
  const canSave =
    rawPlate.length >= 6 && (make.length >= 2 || model.length >= 2);

  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/vehicles", {
        registrationNumber: plate,
        make: make || undefined,
        model: model || undefined,
        nickname: nickname || undefined,
        showOwnerName: showName,
      });

      if (res.data.success) {
        const { vehicle, qrToken } = res.data.data;
        // Prepend to local AppContext cache to immediately show in dashboard
        if (addVehicle) addVehicle(vehicle, qrToken);

        // Navigate to QR Detail, passing the raw QR token string
        navigate("/qr-detail", { state: { qrToken, vehicle } });
      } else {
        throw new Error(res.data.error?.message || "Failed to add vehicle");
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message || err.message || "Network error",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col pb-20">
      <AppHeader
        title={
          <span className="text-navy font-bold tracking-wide">ADD VEHICLE</span>
        }
        onBack={isNewSetup ? null : () => navigate("/dashboard")}
        rightSlot={
          <button className="text-on-surface-muted hover:opacity-80 transition-opacity active:scale-95">
            <HelpCircle size={22} />
          </button>
        }
      />

      <main className="flex-1 w-full max-w-xl mx-auto px-5 pt-8 pb-12">
        {/* Live plate preview */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            className="w-full max-w-[340px] aspect-[2.5/1] rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-white border-2 border-[#1c1b1b] px-4"
            style={{ boxShadow: "0 4px 0px rgba(0,0,0,0.05)" }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Blue strip */}
            <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-navy"></div>

            <div className="font-body text-[9px] sm:text-[10px] font-bold tracking-[0.08em] text-on-surface-muted/50 absolute top-2 left-1/2 -translate-x-1/2 uppercase whitespace-nowrap">
              ROADLINK DIGITAL IDENTITY
            </div>

            <div
              className={`font-mono text-[24px] sm:text-[28px] md:text-[32px] whitespace-nowrap font-bold tracking-[0.1em] uppercase transition-opacity duration-300 w-full text-center ${
                plate ? "text-on-surface" : "text-[#1c1b1b] opacity-30"
              }`}
            >
              {plate || "MH 12 AB 1234"}
            </div>

            <div className="flex gap-2 absolute bottom-2 left-1/2 -translate-x-1/2 opacity-40">
              <Shield size={13} className="text-[#1c1b1b]" />
              <div
                className="w-[13px] h-[13px] bg-[#1c1b1b]"
                style={{
                  maskImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3H11V11H3V3ZM5 5V9H9V5H5ZM13 3H21V11H13V3ZM15 5V9H19V5H15ZM3 13H11V21H3V13ZM5 15V19H9V15H5ZM13 13H16V16H13V13ZM18 13H21V16H18V13ZM13 18H16V21H13V18ZM18 18H21V21H18V18ZM16 16H18V18H16V16Z' fill='currentColor'/%3E%3C/svg%3E\")",
                  WebkitMaskImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3H11V11H3V3ZM5 5V9H9V5H5ZM13 3H21V11H13V3ZM15 5V9H19V5H15ZM3 13H11V21H3V13ZM5 15V19H9V15H5ZM13 13H16V16H13V13ZM18 13H21V16H18V13ZM13 18H16V21H13V18ZM18 18H21V21H18V18ZM16 16H18V18H16V16Z' fill='currentColor'/%3E%3C/svg%3E\")",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                }}
              />
            </div>
          </motion.div>

          <p className="font-body text-[11px] font-bold tracking-[0.08em] uppercase text-on-surface-muted mt-4 opacity-70">
            Live Plate Preview
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Input
            label="VEHICLE REGISTRATION NUMBER"
            value={plate}
            onChange={handlePlate}
            placeholder="MH 12 AB 1234"
            inputClassName="font-mono uppercase tracking-widest text-lg"
          />

          <AnimatePresence>
            {showModel && (
              <motion.div
                key="model-inputs"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 180 }}
                className="grid grid-cols-2 gap-4"
              >
                <Input
                  label="MAKE"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Honda"
                />
                <Input
                  label="MODEL"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Activa"
                />
              </motion.div>
            )}

            {showNickname && (
              <motion.div
                key="nickname-inputs"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  type: "spring",
                  damping: 22,
                  stiffness: 180,
                  delay: 0.05,
                }}
                className="space-y-6 pt-1"
              >
                <Input
                  label="NICKNAME (OPTIONAL)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Blue Bullet"
                />

                {/* Privacy Controls */}
                <div className="bg-white/50 p-4 rounded-xl space-y-4 border border-outline-light/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col pr-4">
                      <span className="font-body text-xs font-bold tracking-wider uppercase text-on-surface">
                        SHOW MY NAME PUBLICLY
                      </span>
                      <span className="text-[11px] text-on-surface-muted font-body mt-0.5">
                        Visible when your plate is scanned
                      </span>
                    </div>
                    <Toggle on={showName} onChange={setShowName} />
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-white rounded-lg border border-outline-light/40 shadow-card">
                    <Shield size={20} className="text-navy flex-shrink-0" />
                    <p className="font-body text-[12px] text-on-surface-muted leading-relaxed">
                      Your phone number and sensitive PII are always encrypted
                      and never shown. Privacy is our administrative mandate.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="mt-12 space-y-4">
          {error && (
            <p className="text-red-500 text-sm font-body text-center">
              {error}
            </p>
          )}
          <motion.div animate={{ opacity: canSave ? 1 : 0.45 }}>
            <Button
              fullWidth
              onClick={handleSave}
              disabled={!canSave}
              isLoading={loading}
            >
              SAVE VEHICLE
            </Button>
          </motion.div>

          {isNewSetup && (
            <button
              className="w-full py-2 text-on-surface font-body text-[14px] font-medium underline hover:text-navy transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              Skip for now
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
