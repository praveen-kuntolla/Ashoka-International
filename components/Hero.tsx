'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck, PhoneCall } from 'lucide-react';

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  phoneNumber?: string;
  isLgbtqFriendly?: boolean;
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroTitle = "ASHOKA INTERNATIONAL",
  heroSubtitle = "Elevating Corporate Operations & Global Career Horizons from Nizamabad to the World.",
  phoneNumber = "+91 98666 03905",
  isLgbtqFriendly = true,
  onExploreClick,
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-950 via-sky-900 to-sky-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Antigravity Sky Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-400/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-sky-300/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px]" />

        {/* Floating Glass Clouds */}
        <motion.div
          animate={{
            y: [-10, 12, -10],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-[10%] w-64 h-24 bg-sky-200/10 backdrop-blur-md rounded-full border border-sky-300/10 shadow-lg"
        />
        <motion.div
          animate={{
            y: [12, -14, 12],
            x: [6, -6, 6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-44 right-[12%] w-80 h-28 bg-sky-300/10 backdrop-blur-md rounded-full border border-sky-300/10 shadow-lg hidden md:block"
        />

        {/* Subtle Zero-Gravity Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Dynamic SVG Airplane Takeoff & Zero-Gravity Continuous Float Animation */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div
          initial={{ x: '-20vw', y: '70vh', scale: 0.5, rotate: 15, opacity: 0 }}
          animate={{
            x: ['-10vw', '45vw', '110vw'],
            y: ['65vh', '25vh', '-20vh'],
            scale: [0.6, 1.1, 0.8],
            rotate: [22, 18, 28],
            opacity: [0, 1, 0.9, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatDelay: 2,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
          className="absolute w-40 h-40 sm:w-56 sm:h-56 filter drop-shadow-[0_15px_25px_rgba(56,189,248,0.5)]"
        >
          {/* Continuous Zero-Gravity Bobbing Keyframe Wrapper */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full transform -rotate-45"
            >
              <defs>
                <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                </linearGradient>
              </defs>

              <path
                d="M 50,256 Q 150,280 300,256"
                stroke="url(#trailGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                className="opacity-70"
              />

              <path
                d="M496 16L16 224L208 288L272 480L496 16Z"
                fill="url(#planeGrad)"
              />
              <path
                d="M208 288L496 16L272 480L208 288Z"
                fill="#0284c7"
                opacity="0.3"
              />
              <path
                d="M208 288L16 224L496 16L208 288Z"
                fill="#38bdf8"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Hero Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto text-center px-4">
        
        {/* Primary Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-100 via-white to-sky-300">
            {heroTitle ?? 'ASHOKA INTERNATIONAL'}
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-lg sm:text-xl md:text-2xl text-sky-100 max-w-3xl mx-auto font-light leading-relaxed mb-10 text-balance"
        >
          {heroSubtitle ?? 'Elevating Corporate Operations & Global Career Horizons from Nizamabad to the World.'}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#careers"
            onClick={(e) => {
              if (onExploreClick) {
                e.preventDefault();
                onExploreClick();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-600 text-slate-950 font-bold text-base shadow-glow-sky hover:shadow-antigravity-hover hover:-translate-y-2 hover:scale-[1.02] active:translate-y-0 transition-all duration-300 group"
          >
            <span>Explore Global Vacancies</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href={`https://wa.me/${(phoneNumber ?? '').replace(/[^0-9]/g, '')}?text=Hello%20Ashoka%20International,%20I%20would%20like%20to%20inquire%20about%20your%20corporate%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-sky-900/60 backdrop-blur-md border border-sky-300/30 text-sky-100 font-medium text-base shadow-lg hover:bg-sky-800/80 hover:border-sky-300/50 hover:-translate-y-2 transition-all duration-300"
          >
            <PhoneCall className="w-5 h-5 text-sky-300" />
            <span>Direct WhatsApp Inquiry</span>
          </a>
        </motion.div>

        {/* Quick Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="p-4 rounded-2xl bg-sky-900/40 backdrop-blur-lg border border-sky-300/10 hover:border-sky-300/30 hover:-translate-y-1.5 transition-all shadow-antigravity">
            <div className="text-2xl font-bold text-sky-300">4.6 / 5.0</div>
            <div className="text-xs text-sky-200/80 mt-1">Verified Client Score</div>
          </div>
          {isLgbtqFriendly ? (
            <div className="p-4 rounded-2xl bg-sky-900/40 backdrop-blur-lg border border-sky-300/10 hover:border-sky-300/30 hover:-translate-y-1.5 transition-all shadow-antigravity">
              <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-5 h-5" />
                <span>LGBTQ+</span>
              </div>
              <div className="text-xs text-sky-200/80 mt-1">Inclusive Workplace</div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-sky-900/40 backdrop-blur-lg border border-sky-300/10 hover:border-sky-300/30 hover:-translate-y-1.5 transition-all shadow-antigravity">
              <div className="text-2xl font-bold text-sky-300">500+</div>
              <div className="text-xs text-sky-200/80 mt-1">Global Placements</div>
            </div>
          )}
          <div className="p-4 rounded-2xl bg-sky-900/40 backdrop-blur-lg border border-sky-300/10 hover:border-sky-300/30 hover:-translate-y-1.5 transition-all shadow-antigravity">
            <div className="text-2xl font-bold text-sky-300">Nizamabad</div>
            <div className="text-xs text-sky-200/80 mt-1">Subhash Nagar HQ</div>
          </div>
          <div className="p-4 rounded-2xl bg-sky-900/40 backdrop-blur-lg border border-sky-300/10 hover:border-sky-300/30 hover:-translate-y-1.5 transition-all shadow-antigravity">
            <div className="text-2xl font-bold text-sky-300 flex items-center gap-1">
              <Compass className="w-5 h-5 text-sky-400" />
              <span>Global</span>
            </div>
            <div className="text-xs text-sky-200/80 mt-1">International Placements</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
