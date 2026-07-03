import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, HelpCircle } from "lucide-react";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Toggle from "../../components/Toggle";
import PlateTag from "../../components/PlateTag";
import { useAppData } from "../../context/AppContext";

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
  const canSave = rawPlate.length >= 6 && make.length >= 2 && model.length >= 2;

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      addVehicle({
        plate,
        displayName: `${make} ${model}`.trim(),
        make,
        model,
        nickname,
        privacyMode: !showName,
      });
      navigate("/qr-detail");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col pb-20">
      <AppHeader
        title={
          <span className="text-navy font-bold tracking-wide">ADD VEHICLE</span>
        }
        onBack={() => navigate(-1)}
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
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            <PlateTag 
              plateNumber={plate || "MH 12 AB 1234"} 
              size="lg" 
              className={!plate ? "opacity-30" : ""}
            />
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-6 pt-1">
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
                    When OFF, only the vehicle's display name is shown. Your name is never shown.
                  </span>
                </div>
                <Toggle on={showName} onChange={setShowName} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 space-y-4">
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
          <button
            className="w-full py-2 text-on-surface font-body text-[14px] font-medium underline hover:text-navy transition-colors disabled:opacity-50"
            onClick={handleSave}
            disabled={!canSave}
          >
            Skip documents for now
          </button>
        </div>
      </main>
    </div>
  );
}
