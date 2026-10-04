'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { JobCard } from '@/components/JobCard';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { initialJobs, initialTestimonials, initialCompanyInfo } from '@/lib/data';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Filter } from 'lucide-react';

export default function HomePage() {
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [jobs] = useState(initialJobs);
  const [testimonials] = useState(initialTestimonials);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  // Hydrate companyInfo and listen to real-time changes from Admin Panel
  React.useEffect(() => {
    const syncInfo = () => {
      try {
        const saved = localStorage.getItem('ashoka-companyInfo');
        if (saved) {
          setCompanyInfo(JSON.parse(saved));
        }
      } catch {}
    };

    syncInfo();
    window.addEventListener('storage', syncInfo);
    return () => window.removeEventListener('storage', syncInfo);
  }, []);

  const departments = ['ALL', ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filteredJobs = selectedDepartment === 'ALL'
    ? jobs.filter((j) => j.status === 'ACTIVE')
    : jobs.filter((j) => j.status === 'ACTIVE' && j.department === selectedDepartment);

  return (
    <div className="min-h-screen bg-sky-950 text-white selection:bg-sky-400 selection:text-slate-950">
      
      {/* Levitating Glass Top Navbar */}
      <Navbar
        companyName={companyInfo.companyName}
        phoneNumber={companyInfo.phoneNumber}
        isLgbtqFriendly={companyInfo.isLgbtqFriendly}
      />

      {/* Feature 1: Antigravity Hero Page with Flight Animation */}
      <Hero
        heroTitle={companyInfo.heroTitle}
        heroSubtitle={companyInfo.heroSubtitle}
        phoneNumber={companyInfo.phoneNumber}
        isLgbtqFriendly={companyInfo.isLgbtqFriendly}
      />

      {/* Feature 2: About Section */}
      <About companyInfo={companyInfo} />

      {/* Feature 3: Levitating Job Cards Section */}
      <section id="careers" className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-900/20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-widest mb-4"
            >
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              <span>Career Horizons</span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
            >
              Levitating Job Opportunities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sky-200/80 text-base sm:text-lg"
            >
              Apply directly with 1-click WhatsApp payloads. Our recruitment team responds instantly.
            </motion.p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <div className="inline-flex items-center gap-1 text-xs text-sky-400 font-semibold mr-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  selectedDepartment === dept
                    ? 'bg-sky-400 text-slate-950 shadow-glow-sky scale-105'
                    : 'bg-sky-900/60 border border-sky-300/20 text-sky-200 hover:border-sky-300/50 hover:text-white'
                }`}
              >
                {dept === 'ALL' ? 'All Open Vacancies' : dept}
              </button>
            ))}
          </div>

          {/* Job Vacancies Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                whatsappNumber={companyInfo.whatsappNumber}
              />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 text-sky-300/70">
              No active job vacancies match the selected department filter.
            </div>
          )}
        </div>
      </section>

      {/* Feature 4: Success Stories (Testimonials) */}
      <Testimonials
        testimonials={testimonials}
        rating={companyInfo.rating}
        reviewCount={companyInfo.reviewCount}
      />

      {/* Feature 5: Contact Info & Social Footer */}
      <Footer companyInfo={companyInfo} />
    </div>
  );
}
