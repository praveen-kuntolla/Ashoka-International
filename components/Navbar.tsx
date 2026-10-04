'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface NavbarProps {
  companyName?: string;
  phoneNumber?: string;
  isLgbtqFriendly?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  companyName = "ASHOKA INTERNATIONAL",
  phoneNumber = "+94 74231 0280",
  isLgbtqFriendly = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { themeMode, toggleThemeMode } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <nav className="max-w-7xl mx-auto rounded-2xl bg-sky-950/80 dark:bg-sky-950/85 light:bg-white/90 backdrop-blur-xl border border-sky-300/20 dark:border-sky-800/40 light:border-sky-200 shadow-antigravity px-4 sm:px-6 py-3 transition-all">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity (Cleaned - No Admin button near logo) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 border border-sky-400/40 shadow-glow-sky group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/logo.jpg"
                alt="Ashoka International Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white block">
                {companyName ?? 'ASHOKA INTERNATIONAL'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sky-600 dark:text-sky-300 font-semibold block">
                Secure Your Future &bull; Nizamabad HQ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-sky-100">
            <a href="#about" className="hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              About Overview
            </a>
            <a href="#careers" className="hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              Careers & Vacancies
            </a>
            <a href="#testimonials" className="hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              Success Stories
            </a>
            <a href="#contact" className="hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              Contact Us
            </a>

            {isLgbtqFriendly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>LGBTQ+ Friendly</span>
              </span>
            )}
          </div>

          {/* Right Controls: Light/Dark Theme Switcher + Direct WhatsApp Contact */}
          <div className="hidden md:flex items-center gap-3">
            {/* Full Light / Dark Theme Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/70 border border-sky-300/40 dark:border-sky-700/50 text-slate-800 dark:text-sky-200 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-sky-600" />
              )}
            </button>

            {/* Direct Contact Button */}
            <a
              href={`https://wa.me/${(phoneNumber ?? '').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 text-slate-950 font-extrabold text-xs shadow-glow-sky hover:shadow-antigravity hover:-translate-y-0.5 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact HQ</span>
            </a>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-xl bg-sky-900/60 border border-sky-700/50 text-sky-200"
              aria-label="Toggle Theme"
            >
              {themeMode === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-sky-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-sky-900/60 border border-sky-300/20 text-sky-200 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-sky-300/20 space-y-3 pb-2 text-slate-800 dark:text-sky-100">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-sky-400"
            >
              About Overview
            </a>
            <a
              href="#careers"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-sky-400"
            >
              Careers & Vacancies
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-sky-400"
            >
              Success Stories
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-sky-400"
            >
              Contact Us
            </a>

            <div className="pt-2">
              <a
                href={`https://wa.me/${(phoneNumber ?? '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 text-slate-950 text-sm font-bold shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact HQ via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
