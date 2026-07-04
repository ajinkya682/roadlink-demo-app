import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Car, UserCircle, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { label: "Home", Icon: Home, path: "/dashboard" },
  { label: "Vehicles", Icon: Car, path: "/vehicles" },
  null,
  { label: "Docs", Icon: FileText, path: "/document-vault" },
  { label: "Profile", Icon: UserCircle, path: "/settings" },
];

// Scalloped SVG path: 375×72 viewBox, notch centered at 187.5, dipping 30px
// Cubic bezier gives smooth, premium "molded" feel
const SCALLOP_PATH =
  "M 0 0 L 135 0 C 148 0 155 30 187.5 30 C 220 30 227 0 240 0 L 375 0 L 375 72 L 0 72 Z";

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScan = () => {
    navigate("/scanner");
  };

  return (
    /* Extra top padding so the scan button (which peeks above) is clickable */
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50"
      style={{ height: "80px", overflow: "visible" }}
    >
      {/* ── SVG scalloped bar background ────────────────────── */}
      <svg
        viewBox="0 0 375 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: "72px",
          filter: "drop-shadow(0 -6px 20px rgba(0,0,0,0.09))",
        }}
      >
        <path d={SCALLOP_PATH} fill="white" />
      </svg>

      {/* ── Amber scan button (floats above the notch) ────────── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{ bottom: "34px" }} // sits ~2/3 above bar, 1/3 inside notch
      >
        <motion.button
          aria-label="Scan QR Code"
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
          style={{
            background: "#F5A623",
            boxShadow:
              "0 6px 24px rgba(245,166,35,0.45), 0 2px 8px rgba(0,0,0,0.12)",
            border: "3px solid white", // clean ring where button meets notch
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScan}
        >
          <QrCode size={26} color="white" strokeWidth={2} />
        </motion.button>
      </div>

      {/* ── Tab row ──────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full flex items-end"
        style={{ height: "72px", paddingBottom: "10px" }}
      >
        {TABS.map((tab, i) => {
          if (!tab) {
            /* Empty space for scan button center slot */
            return <div key="scan-slot" className="flex-1" />;
          }

          const isActive =
            location.pathname === tab.path ||
            (tab.path === "/vehicles" &&
              (location.pathname.startsWith("/vehicles") || location.pathname.startsWith("/vehicle-detail")));

          const { Icon } = tab;

          return (
            <motion.button
              key={tab.path}
              className="flex-1 flex flex-col items-center gap-[2px]"
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
                style={{ color: isActive ? "#003470" : "rgba(28,27,27,0.50)" }}
              />

              {/* Active underline pill */}
              <div className="h-[3px] w-4 flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="w-4 h-[3px] rounded-full"
                    style={{ background: "#003470" }}
                    transition={{ type: "spring", damping: 22, stiffness: 300 }}
                  />
                )}
              </div>

              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? "#003470" : "rgba(28,27,27,0.50)" }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
