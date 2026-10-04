'use client';

import React from 'react';
import { PhoneCall, MapPin, Clock, Heart, Linkedin, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { CompanyDetails } from '@/lib/data';

interface FooterProps {
  companyInfo: CompanyDetails;
}

export const Footer: React.FC<FooterProps> = ({ companyInfo }) => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/${companyInfo?.whatsappNumber ?? '919866603905'}?text=Hello%20Ashoka%20International,`,
      color: 'hover:bg-emerald-600 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/ashoka-international',
      color: 'hover:bg-sky-600 hover:text-white',
    },
    {
      name: 'Twitter (X)',
      icon: Twitter,
      url: 'https://twitter.com/ashokaintl',
      color: 'hover:bg-sky-400 hover:text-slate-950',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/ashokainternational.nzb',
      color: 'hover:bg-sky-700 hover:text-white',
    },
  ];

  return (
    <footer id="contact" className="bg-sky-950 text-white border-t border-sky-900 pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-0.5 border border-sky-400/40 shadow-glow-sky overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Ashoka International Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                {companyInfo?.companyName ?? 'ASHOKA INTERNATIONAL'}
              </span>
            </div>

            <p className="text-sky-200/80 text-sm leading-relaxed max-w-md">
              {companyInfo?.overview ?? ''}
            </p>

            {/* Direct Specs List */}
            <div className="space-y-4 text-sm text-sky-100 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Headquarters Address</div>
                  <div className="text-sky-200/80">{companyInfo?.address ?? ''}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Phone Inquiry: </span>
                  <a href={`tel:${companyInfo?.phoneNumber ?? '+919866603905'}`} className="text-sky-300 hover:underline">
                    {companyInfo?.phoneNumber ?? '+91 98666 03905'}
                  </a>
                </div>
              </div>

              {/* Updated Operating Schedule */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Operating Hours</div>
                  <div className="text-xs text-emerald-300 font-semibold">Monday – Saturday: Opens 10:00 AM</div>
                  <div className="text-xs text-rose-300 font-medium">Sunday: Closed</div>
                </div>
              </div>

              {companyInfo?.isLgbtqFriendly && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>LGBTQ+ Friendly Workplace</span>
                  </span>
                </div>
              )}
            </div>

            {/* Social Pill Buttons */}
            <div className="pt-4">
              <div className="text-xs uppercase tracking-wider text-sky-300/70 font-semibold mb-3">
                Connect with Us Online
              </div>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-900/60 border border-sky-300/20 text-sky-200 text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Map */}
          <div className="lg:col-span-6 flex flex-col h-full justify-between">
            <div className="h-full min-h-[300px] rounded-3xl bg-sky-900/40 border border-sky-300/20 overflow-hidden relative shadow-antigravity group">
              <iframe
                title="Ashoka International Nizamabad Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  companyInfo?.address ?? 'Subhash Nagar Nizamabad'
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full min-h-[320px] filter contrast-125 saturate-50 opacity-90 group-hover:opacity-100 transition-opacity border-0"
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/90 text-sky-200 text-xs font-medium border border-sky-400/30 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Nizamabad, Telangana 503002
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-sky-900 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-300/60 gap-4">
          <p>© {new Date().getFullYear()} ASHOKA INTERNATIONAL. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Secure Your Future &bull; Antigravity Design System</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
