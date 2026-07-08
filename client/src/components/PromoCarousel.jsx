import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const promos = [
  {
    id: 1,
    headline: "Add an emergency contact",
    subtext: "So responders know who to call first",
    cta: "Add Contact",
    image: "/assets/promos/emergency-contact.png",
    fallbackBg: "#312E81",
    actionPath: "/emergency-contacts",
  },
  {
    id: 2,
    headline: "Refer a friend, get a month free",
    subtext: "Share the digital identity experience",
    cta: "Invite",
    image: "/assets/promos/refer-a-friend.png",
    fallbackBg: "#6D28D9",
    action: "invite",
  },
  {
    id: 3,
    headline: "Get your reflective sticker",
    subtext: "For night visibility and easy scanning",
    cta: "Order Sticker",
    image: "/assets/promos/reflective-sticker.png",
    fallbackBg: "linear-gradient(135deg, #6D28D9, #0F172A)",
    actionPath: "/order-sticker",
  },
  {
    id: 4,
    headline: "Turn on push notifications",
    subtext: "So you never miss an alert",
    cta: "Settings",
    image: "/assets/promos/push-notifications.png",
    fallbackBg: "#0F172A",
    actionPath: "/notifications",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function PromoCarousel({ onAction }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const imageIndex = Math.abs(page % promos.length);
  const currentPromo = promos[imageIndex];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setPage([page + 1, 1]);
    }, 4500); // 4.5 seconds per slide
    return () => clearInterval(timer);
  }, [page, isPaused]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="w-full flex flex-col items-center px-4 pt-4 pb-2">
      <div
        className="relative w-full h-[160px] rounded-[20px] overflow-hidden shadow-md bg-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full flex flex-col justify-end p-5"
            style={{
              background: currentPromo.fallbackBg,
              backgroundImage: `url('${currentPromo.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full flex items-end justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-display text-white text-[18px] leading-tight font-bold mb-1 line-clamp-2">
                  {currentPromo.headline}
                </h3>
                <p className="font-body text-white/80 text-[12px] mb-4 truncate">
                  {currentPromo.subtext}
                </p>
                <button
                  onClick={() => onAction(currentPromo)}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-1.5 rounded-full font-body text-[12px] font-bold text-center active:scale-95 transition-transform hover:bg-white hover:text-black"
                >
                  {currentPromo.cta}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Progress Bar Indicators */}
      <div className="flex justify-center gap-2 mt-4 mb-2 w-full px-8">
        {promos.map((_, idx) => {
          const isActive = idx === imageIndex;
          return (
            <div
              key={idx}
              className="h-1.5 flex-1 bg-outline-light/30 rounded-full overflow-hidden cursor-pointer"
              onClick={() => {
                const newDirection = idx > imageIndex ? 1 : -1;
                setPage([page + (idx - imageIndex), newDirection]);
              }}
            >
              <motion.div
                className="h-full bg-royal-purple rounded-full"
                initial={{
                  width: isActive ? "0%" : idx < imageIndex ? "100%" : "0%",
                }}
                animate={{
                  width: isActive
                    ? isPaused
                      ? "100%"
                      : "100%"
                    : idx < imageIndex
                      ? "100%"
                      : "0%",
                }}
                transition={
                  isActive && !isPaused
                    ? { duration: 4.5, ease: "linear" }
                    : { duration: 0.1 }
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
