'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertTriangle, CheckCircle, Shield, User, KeyRound, Info } from 'lucide-react';
import Link from 'next/link';

interface CorporateAccount {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'HR';
}

const DEFAULT_CORPORATE_ACCOUNTS: Record<string, CorporateAccount> = {
  'admin@ashokainternational.com': {
    name: 'Ashoka Admin',
    email: 'admin@ashokainternational.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  'manager@ashokainternational.com': {
    name: 'Operations Manager',
    email: 'manager@ashokainternational.com',
    password: 'manager123',
    role: 'MANAGER',
  },
  'hr@ashokainternational.com': {
    name: 'HR Lead',
    email: 'hr@ashokainternational.com',
    password: 'hr123',
    role: 'HR',
  },
};

export default function AdminAuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@ashokainternational.com');
  const [password, setPassword] = useState('admin123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Form Submission with Strict Authentication
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthStatus('idle');
    setErrorMessage('');
    setSuccessMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    setTimeout(() => {
      // ==================== SIGN UP FLOW ====================
      if (authMode === 'signup') {
        if (!name.trim()) {
          setAuthStatus('failure');
          setErrorMessage('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }

        if (!normalizedEmail || !normalizedEmail.includes('@')) {
          setAuthStatus('failure');
          setErrorMessage('Please provide a valid corporate email address.');
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setAuthStatus('failure');
          setErrorMessage('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        if (password !== confirmPassword) {
          setAuthStatus('failure');
          setErrorMessage('Passwords do not match. Please verify your confirmation password.');
          setIsSubmitting(false);
          return;
        }

        // Check if user already exists
        const storedUsersRaw = localStorage.getItem('ashoka-registered-users');
        const storedUsers: CorporateAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        if (
          DEFAULT_CORPORATE_ACCOUNTS[normalizedEmail] ||
          storedUsers.some((u) => u.email.toLowerCase() === normalizedEmail)
        ) {
          setAuthStatus('failure');
          setErrorMessage('An account with this email already exists. Please Sign In instead.');
          setIsSubmitting(false);
          return;
        }

        // Register new user
        const newAccount: CorporateAccount = {
          name: name.trim(),
          email: normalizedEmail,
          password: password,
          role: 'HR', // Default pending role
        };

        storedUsers.push(newAccount);
        localStorage.setItem('ashoka-registered-users', JSON.stringify(storedUsers));

        // Add to pending sign-up requests queue in localStorage for Admin/Manager
        try {
          const pendingRaw = localStorage.getItem('ashoka-pending-requests');
          const pendingList = pendingRaw ? JSON.parse(pendingRaw) : [];
          pendingList.unshift({
            id: `req-${Date.now()}`,
            name: name.trim(),
            email: normalizedEmail,
            requestedRole: 'HR',
            requestedAt: 'Just now',
          });
          localStorage.setItem('ashoka-pending-requests', JSON.stringify(pendingList));
        } catch {}

        setAuthStatus('success');
        setSuccessMessage('Registration submitted successfully! Redirecting to Sign In...');
        setIsSubmitting(false);

        setTimeout(() => {
          setAuthMode('signin');
          setAuthStatus('idle');
          setSuccessMessage('');
          setConfirmPassword('');
        }, 1800);
        return;
      }

      // ==================== SIGN IN FLOW (STRICT VERIFICATION) ====================
      // 1. Check default corporate accounts
      const defaultAccount = DEFAULT_CORPORATE_ACCOUNTS[normalizedEmail];

      if (defaultAccount) {
        if (password === defaultAccount.password) {
          // Password is correct
          try {
            localStorage.setItem(
              'ashoka-current-user',
              JSON.stringify({
                name: defaultAccount.name,
                email: defaultAccount.email,
                role: defaultAccount.role,
              })
            );
          } catch {}

          setAuthStatus('success');
          setSuccessMessage('Credentials Authorized! Launching Antigravity Flight to Dashboard...');

          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1800);
          return;
        } else {
          // WRONG PASSWORD FOR DEFAULT ACCOUNT
          setAuthStatus('failure');
          setErrorMessage('Incorrect password. Please enter the valid corporate password for this account.');
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Check locally registered users
      try {
        const storedUsersRaw = localStorage.getItem('ashoka-registered-users');
        const storedUsers: CorporateAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        const registeredUser = storedUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

        if (registeredUser) {
          if (password === registeredUser.password) {
            // Password is correct
            localStorage.setItem(
              'ashoka-current-user',
              JSON.stringify({
                name: registeredUser.name,
                email: registeredUser.email,
                role: registeredUser.role,
              })
            );

            setAuthStatus('success');
            setSuccessMessage('Credentials Authorized! Launching Antigravity Flight to Dashboard...');

            setTimeout(() => {
              router.push('/admin/dashboard');
            }, 1800);
            return;
          } else {
            // WRONG PASSWORD FOR REGISTERED ACCOUNT
            setAuthStatus('failure');
            setErrorMessage('Incorrect password. Please enter your correct account password.');
            setIsSubmitting(false);
            return;
          }
        }
      } catch {}

      // 3. Email not found in any database
      setAuthStatus('failure');
      setErrorMessage('Account not found. No account exists with this corporate email. Please check your spelling or register via Sign Up.');
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950 via-sky-900 to-sky-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Radial Glow & Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-sky-400/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Gamified Flight Stage / Canvas */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Animated Flight Airplane Avatar */}
        <div className="relative h-28 w-full flex items-center justify-center mb-3 overflow-visible">
          <AnimatePresence mode="wait">
            {authStatus === 'idle' && (
              <motion.div
                key="idle-plane"
                animate={{
                  y: [-6, 6, -6],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-20 h-20 text-sky-300 drop-shadow-[0_10px_20px_rgba(56,189,248,0.4)]"
              >
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -rotate-45">
                  <path d="M496 16L16 224L208 288L272 480L496 16Z" fill="#38bdf8" />
                  <path d="M208 288L496 16L272 480L208 288Z" fill="#0284c7" opacity="0.4" />
                </svg>
              </motion.div>
            )}

            {authStatus === 'success' && (
              <motion.div
                key="success-plane"
                initial={{ scale: 1, x: 0, y: 0, rotate: -45 }}
                animate={{
                  x: [0, 150, 450],
                  y: [0, -120, -350],
                  scale: [1, 1.3, 0.6],
                  rotate: [-45, -30, -15],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="w-24 h-24 text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]"
              >
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M496 16L16 224L208 288L272 480L496 16Z" fill="#34d399" />
                  <path d="M208 288L496 16L272 480L208 288Z" fill="#059669" opacity="0.5" />
                </svg>
              </motion.div>
            )}

            {authStatus === 'failure' && (
              <motion.div
                key="failure-plane"
                initial={{ rotate: -45, y: 0 }}
                animate={{
                  x: [-12, 14, -16, 12, -6, 0],
                  y: [0, 15, 30, 45],
                  rotate: [-45, 15, 80, 140],
                  scale: [1, 1.1, 0.9, 0.8],
                }}
                transition={{ duration: 0.8, ease: 'bounce' }}
                className="w-20 h-20 text-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]"
              >
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M496 16L16 224L208 288L272 480L496 16Z" fill="#f43f5e" />
                  <path d="M208 288L496 16L272 480L208 288Z" fill="#be123c" opacity="0.6" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auth Card Form */}
        <motion.div
          animate={authStatus === 'failure' ? { x: [-14, 14, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-sky-950/80 backdrop-blur-xl border border-sky-300/20 p-8 shadow-antigravity space-y-6"
        >
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-sky-400/40 shadow-glow-sky overflow-hidden flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Ashoka International Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-400/30 text-sky-300">
              <Shield className="w-3.5 h-3.5" />
              <span>Ashoka Corporate Portal</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {authMode === 'signin' ? 'Admin Portal Sign In' : 'Create Admin Account'}
            </h1>
            <p className="text-xs text-sky-200/80">
              {authMode === 'signin'
                ? 'Enter your corporate credentials to launch dashboard controls.'
                : 'Register a new administrator profile for the portal.'}
            </p>
          </div>

          {/* Sign In / Sign Up Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-sky-900/60 p-1 border border-sky-700/60">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signin'
                  ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Warning Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 shadow-md">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 shadow-md">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input for Sign Up */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sky-900/50 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sky-900/50 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                  placeholder="admin@ashokainternational.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sky-900/50 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              {authMode === 'signup' && (
                <span className="text-[10px] text-sky-300/70 mt-1 block">Minimum 6 characters</span>
              )}
            </div>

            {/* Confirm Password for Sign Up */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sky-900/50 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 text-slate-950 font-extrabold text-sm shadow-glow-sky hover:shadow-antigravity hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Verifying Authentication...'
                  : authMode === 'signin'
                  ? 'Launch Dashboard Session'
                  : 'Create Admin Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          {authMode === 'signin' && (
            <div className="p-3.5 rounded-2xl bg-sky-900/30 border border-sky-800/40 text-[11px] text-sky-200/80 space-y-2">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Authorized Demo Credentials:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@ashokainternational.com');
                    setPassword('admin123');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-sky-900/70 border border-sky-700/60 text-sky-200 hover:text-white hover:border-sky-400 text-[10px] font-semibold transition-colors"
                >
                  Admin: <code className="text-emerald-400 font-mono">admin123</code>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('manager@ashokainternational.com');
                    setPassword('manager123');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-sky-900/70 border border-sky-700/60 text-sky-200 hover:text-white hover:border-sky-400 text-[10px] font-semibold transition-colors"
                >
                  Manager: <code className="text-emerald-400 font-mono">manager123</code>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('hr@ashokainternational.com');
                    setPassword('hr123');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-sky-900/70 border border-sky-700/60 text-sky-200 hover:text-white hover:border-sky-400 text-[10px] font-semibold transition-colors"
                >
                  HR: <code className="text-emerald-400 font-mono">hr123</code>
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-sky-300 hover:underline">
              &larr; Return to Public Website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
