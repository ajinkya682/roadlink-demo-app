'use client';
import { useState, useEffect } from 'react';
import { Download, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../../components/FadeIn';
import styles from './page.module.css';

const reviews = [
  { text: "Someone hit my parked car, but thanks to the RoadLink sticker, a passerby notified me immediately.", author: "Rahul M." },
  { text: "Love how I don't have to share my phone number. The privacy first approach is exactly what I needed.", author: "Priya S." },
  { text: "Keeping all my vehicle documents in one app and getting expiry reminders is super convenient.", author: "Amit K." }
];

export default function DownloadPage() {
  const [activeReview, setActiveReview] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleDownload = () => {
    setDownloaded(true);
    // In a real app, this would trigger the actual download or redirect to app store
    window.location.href = "http://localhost:3000/login"; // Redirect to app demo
  };

  return (
    <main className={styles.main}>
      <div className={styles.splitLayout}>
        
        {/* Left: Content */}
        <div className={styles.contentSide}>
          <FadeIn direction="up">
            <h1 className={styles.title}>Get RoadLink <br/>Today.</h1>
            <p className={styles.subtitle}>
              Available for iOS and Android. Start protecting your vehicle in minutes.
            </p>

            <div className={styles.rating}>
              <div className={styles.stars}>
                <Star fill="#F5A623" color="#F5A623" size={20} />
                <Star fill="#F5A623" color="#F5A623" size={20} />
                <Star fill="#F5A623" color="#F5A623" size={20} />
                <Star fill="#F5A623" color="#F5A623" size={20} />
                <Star fill="#F5A623" color="#F5A623" size={20} />
              </div>
              <span className={styles.ratingText}>4.9/5 from 10k+ reviews</span>
            </div>

            <button 
              className={styles.downloadBtn} 
              onClick={handleDownload}
              disabled={downloaded}
            >
              {downloaded ? <Check size={24} /> : <Download size={24} />}
              {downloaded ? 'Opening App...' : 'Download for Free'}
            </button>

            <div className={styles.reviewBox}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={styles.reviewText}>"{reviews[activeReview].text}"</p>
                  <p className={styles.reviewAuthor}>— {reviews[activeReview].author}</p>
                </motion.div>
              </AnimatePresence>
              <div className={styles.reviewDots}>
                {reviews.map((_, i) => (
                  <div key={i} className={`${styles.dot} ${i === activeReview ? styles.dotActive : ''}`} />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right: Visual */}
        <div className={styles.visualSide}>
          <div className={styles.qrBg} />
          <FadeIn direction="left" delay={0.2} className={styles.phoneWrapper}>
            <div className={styles.phone}>
              <div className={styles.phoneScreen}>
                {/* Mockup of splash screen */}
                <div className={styles.splashMock}>
                  <div className={styles.splashIcon}>RL</div>
                  <div className={styles.splashText}>RoadLink</div>
                  <motion.div 
                    className={styles.loader}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        
      </div>
    </main>
  );
}
