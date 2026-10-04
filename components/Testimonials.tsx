'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle, ThumbsUp } from 'lucide-react';
import { TestimonialItem } from '@/lib/data';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
  rating?: number;
  reviewCount?: number;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  rating = 4.6,
  reviewCount = 5,
}) => {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-950 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-32 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with 4.6 / 5.0 Star Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-widest mb-4"
            >
              Success Stories & Reviews
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black text-white tracking-tight"
            >
              Trusted by Candidates & Clients
            </motion.h2>
          </div>

          {/* Dynamic 4.6 / 5 Stars Score Header Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 p-5 rounded-3xl bg-sky-900/60 backdrop-blur-xl border border-sky-300/20 shadow-antigravity"
          >
            <div className="text-center border-r border-sky-300/20 pr-4">
              <div className="text-3xl font-extrabold text-sky-200">{rating.toFixed(1)}</div>
              <div className="text-[10px] text-sky-300 uppercase tracking-wider">Out of 5.0</div>
            </div>
            <div>
              {/* Dynamic SVG Rating Stars */}
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isFull = starIndex <= Math.floor(rating);
                  const isHalf = !isFull && starIndex <= Math.ceil(rating) && rating % 1 !== 0;

                  return (
                    <div key={starIndex} className="relative">
                      {isFull ? (
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ) : isHalf ? (
                        <div className="relative">
                          <Star className="w-5 h-5 text-sky-700" />
                          <div className="absolute inset-0 overflow-hidden w-[60%]">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                      ) : (
                        <Star className="w-5 h-5 text-sky-800" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-sky-200">
                Based on <span className="font-bold text-white">{reviewCount} Raw Customer Reviews</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl bg-sky-900/40 backdrop-blur-xl border border-sky-300/15 p-8 shadow-antigravity hover:shadow-antigravity-hover hover:-translate-y-2 hover:border-sky-300/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Quote Icon & Rating Stars */}
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-8 h-8 text-sky-400/40 group-hover:text-sky-300 transition-colors" />
                  <div className="flex text-amber-400">
                    {Array.from({ length: Math.round(t.rating) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed font-light italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-sky-300/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {t.author}
                  </h4>
                  <p className="text-xs text-sky-300/70">{t.role}</p>
                </div>
                {t.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Banner */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-sky-900/30 border border-sky-300/10 text-sky-200 text-xs sm:text-sm">
            <ThumbsUp className="w-4 h-4 text-sky-400" />
            <span>100% Genuine Candidate Feedback directly from Nizamabad Office</span>
          </div>
        </div>
      </div>
    </section>
  );
};
