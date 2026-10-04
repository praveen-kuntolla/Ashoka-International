'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem('ashoka-current-user');
      if (currentUser) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/auth');
      }
    } catch {
      router.replace('/admin/auth');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-sky-400/40 shadow-glow-sky overflow-hidden flex items-center justify-center animate-pulse">
          <img
            src="/logo.jpg"
            alt="Ashoka International Logo"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <div className="text-center">
          <h2 className="text-white text-lg font-bold tracking-tight">ASHOKA INTERNATIONAL</h2>
          <p className="text-sky-400 text-xs mt-1">Connecting to Corporate Admin Portal...</p>
        </div>
        <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mt-2" />
      </div>
    </div>
  );
}
