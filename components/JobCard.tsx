'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, CheckCircle2, MessageCircle, Clock, DollarSign, Sparkles } from 'lucide-react';
import { JobItem } from '@/lib/data';

interface JobCardProps {
  job: JobItem;
  whatsappNumber?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  whatsappNumber = "919866603905",
}) => {
  const encodedTitle = encodeURIComponent(job?.title ?? 'Position');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Ashoka%20International,%20I%20am%20interested%20in%20applying%20for%20the%20${encodedTitle}%20position.`;

  const fallbackBgImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200";
  const bgImageUrl = job?.bgImage || fallbackBgImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col justify-between h-full min-h-[440px] rounded-3xl overflow-hidden p-6 sm:p-8 shadow-antigravity hover:shadow-antigravity-hover hover:-translate-y-2.5 transition-all duration-300 border border-sky-300/20 dark:border-sky-800/40"
    >
      {/* Background Photo Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      {/* Dynamic Dark Gradient Overlay for Maximum Readability in Light & Dark Modes */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60 group-hover:via-slate-950/75 transition-colors" />

      {/* Top Header Badge & Status (Positioned over gradient overlay) */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 backdrop-blur-md text-sky-200 border border-sky-300/30">
          <Briefcase className="w-3.5 h-3.5" />
          {job?.department ?? 'Department'}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
          job?.status === 'ACTIVE' 
            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
            : 'bg-slate-900/80 text-slate-400 border border-slate-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${job?.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
          {job?.status === 'ACTIVE' ? 'Actively Hiring' : 'Inactive'}
        </span>
      </div>

      {/* Job Title */}
      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
          {job?.title ?? 'Job Title'}
        </h3>

        {/* Location & Meta info */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm text-sky-200/90 mb-4 font-medium">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>{job?.location ?? 'Nizamabad, Telangana'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>{job?.type ?? 'Full-Time'} ({job?.experience ?? '1-2 Yrs'})</span>
          </div>
          {job?.salary && (
            <div className="flex items-center gap-1 font-bold text-emerald-400">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* Job Description */}
        <p className="text-xs sm:text-sm text-sky-100/80 mb-6 line-clamp-2 font-light">
          {job?.description ?? ''}
        </p>

        {/* Requirements Checklist */}
        <div className="mb-6 pt-3 border-t border-sky-400/20">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Key Requirements
          </h4>
          <ul className="space-y-1.5">
            {(job?.requirements ?? []).slice(0, 3).map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-sky-100/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* WhatsApp Application CTA Button */}
      <div className="relative z-10 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Apply via WhatsApp</span>
        </a>
      </div>
    </motion.div>
  );
};
