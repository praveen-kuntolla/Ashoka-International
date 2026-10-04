'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Heart, Building2, ExternalLink, Star } from 'lucide-react';
import { CompanyDetails } from '@/lib/data';

interface AboutProps {
  companyInfo: CompanyDetails;
}

export const About: React.FC<AboutProps> = ({ companyInfo }) => {
  const address = companyInfo?.address ?? "opp. KAKATIYA KOC SCHOOL, Subhash Nagar, Nizamabad, Telangana 503002, India";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${companyInfo?.companyName ?? 'ASHOKA INTERNATIONAL'}, ${address}`
  )}`;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-900/10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -z-10 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-700/60 uppercase tracking-widest mb-4"
          >
            Corporate Overview
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Empowering Careers with Zero-Gravity Precision
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-sky-100/80 text-base sm:text-lg"
          >
            {companyInfo?.overview ?? ''}
          </motion.p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${(companyInfo?.isLgbtqFriendly ?? true) ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-white/70 dark:bg-sky-950/60 backdrop-blur-xl border border-sky-100 dark:border-sky-800/40 p-8 shadow-antigravity hover:shadow-antigravity-hover hover:-translate-y-2 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Corporate Office
            </h3>
            <p className="text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold mb-3">
              {companyInfo?.category ?? 'Corporate Office'}
            </p>
            <p className="text-sm text-slate-600 dark:text-sky-200/70">
              Registered corporate hub delivering standard-setting global staffing and business placement services.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-white/70 dark:bg-sky-950/60 backdrop-blur-xl border border-sky-100 dark:border-sky-800/40 p-8 shadow-antigravity hover:shadow-antigravity-hover hover:-translate-y-2 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Nizamabad Address
              </h3>
              <p className="text-sm text-slate-600 dark:text-sky-200/80 mb-4 leading-relaxed">
                {address}
              </p>
            </div>
            
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-300 hover:text-sky-400 pt-3 border-t border-sky-100 dark:border-sky-900/40 transition-colors"
            >
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Card 3: Updated Operating Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl bg-white/70 dark:bg-sky-950/60 backdrop-blur-xl border border-sky-100 dark:border-sky-800/40 p-8 shadow-antigravity hover:shadow-antigravity-hover hover:-translate-y-2 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Operating Schedule
            </h3>
            <div className="text-xs space-y-1 mb-4">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                Monday – Saturday: Opens 10:00 AM
              </div>
              <div className="font-semibold text-rose-600 dark:text-rose-400">
                Sunday: Closed
              </div>
            </div>
            <div className="pt-3 border-t border-sky-100 dark:border-sky-900/40 flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {companyInfo?.rating ?? 4.6} / 5.0
              </span>
              <span className="text-xs text-slate-400 dark:text-sky-300/60">
                ({companyInfo?.reviewCount ?? 5} Reviews)
              </span>
            </div>
          </motion.div>

          {/* Card 4: LGBTQ+ Friendly Card (Visible when isLgbtqFriendly is true) */}
          {(companyInfo?.isLgbtqFriendly ?? true) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-3xl bg-gradient-to-br from-sky-500/10 via-white/80 to-emerald-500/10 dark:from-sky-900/50 dark:via-sky-950/70 dark:to-emerald-950/40 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-800/40 p-8 shadow-antigravity hover:shadow-antigravity-hover hover:-translate-y-2 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 fill-emerald-500/30" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span>LGBTQ+ Friendly</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-sm text-slate-600 dark:text-sky-200/80 leading-relaxed mb-4">
                Committed to an equal, supportive, and inclusive corporate environment where every candidate is respected regardless of background.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-300/50">
                Certified Inclusive Employer
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
