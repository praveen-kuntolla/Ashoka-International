'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Building,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  Palette,
  Check,
  Lock,
  LogOut,
  RefreshCw,
  Wand2,
  Save,
  RotateCcw,
  Download,
  Database,
  ExternalLink,
  MessageSquare,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Heart
} from 'lucide-react';
import {
  Role,
  JobItem,
  TestimonialItem,
  CompanyDetails,
  initialJobs,
  initialTestimonials,
  initialCompanyInfo,
  mockUsers,
  UserProfile,
  AccentColor
} from '@/lib/data';
import { Hero } from '@/components/Hero';
import { JobCard } from '@/components/JobCard';
import { About } from '@/components/About';
import { Testimonials } from '@/components/Testimonials';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useTheme } from '@/components/ThemeProvider';

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  requestedRole: Role;
  requestedAt: string;
}

export default function AdminDashboard() {
  const { themeMode, toggleThemeMode, accent, setAccent, contrast, setContrast, preset, applyPreset } = useTheme();

  // Active Role state (Defaults to corporate ADMIN)
  const [currentRole] = useState<Role>('ADMIN');

  // Active section tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'about' | 'testimonials' | 'users' | 'theme' | 'settings'>('jobs');

  // Split-Screen Preview Toggle
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);

  // Real-time app state
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [companyInfo, setCompanyInfo] = useState<CompanyDetails>(initialCompanyInfo);
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);

  // New Sign-Up Access Requests Queue
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([
    {
      id: 'req-1',
      name: 'Suresh Reddy',
      email: 'suresh.reddy@ashokainternational.com',
      requestedRole: 'HR',
      requestedAt: '12 mins ago',
    },
    {
      id: 'req-2',
      name: 'Kavita Rao',
      email: 'kavita.rao@ashokainternational.com',
      requestedRole: 'MANAGER',
      requestedAt: '45 mins ago',
    },
    {
      id: 'req-3',
      name: 'Arjun Varma',
      email: 'arjun.varma@ashokainternational.com',
      requestedRole: 'HR',
      requestedAt: '2 hours ago',
    },
  ]);

  // Selected role to grant on approval
  const [approvalRoles, setApprovalRoles] = useState<Record<string, Role>>({
    'req-1': 'HR',
    'req-2': 'MANAGER',
    'req-3': 'HR',
  });

  // Hydrate companyInfo from localStorage on mount with auto-migration
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ashoka-companyInfo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber?.includes('98666') || parsed.phoneNumber?.includes('98666')) {
          parsed.phoneNumber = '+94 74231 0280';
          parsed.whatsappNumber = '94742310280';
          localStorage.setItem('ashoka-companyInfo', JSON.stringify(parsed));
        }
        setCompanyInfo(parsed);
      }
    } catch {}
  }, []);

  // Active user matching current role
  const currentUser = users.find((u) => u.role === currentRole) || users[0];

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Job Editing Modal state
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [newRequirementText, setNewRequirementText] = useState<string>('');

  // Testimonial Modal state
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState<boolean>(false);

  // User Modal state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);

  // System Settings state
  const [dbSyncing, setDbSyncing] = useState<boolean>(false);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [whatsappForwarding, setWhatsappForwarding] = useState<boolean>(true);

  // Slogan index for rewrite rotation
  const [sloganIndex, setSloganIndex] = useState(0);

  /*
   * RBAC Alignment:
   * ADMIN & MANAGER have EQUAL FULL ACCESS.
   * HR is restricted strictly to Job Card CRUD operations.
   */
  const hasAccess = (section: 'jobs' | 'about' | 'testimonials' | 'users' | 'theme' | 'settings'): boolean => {
    if (currentRole === 'ADMIN' || currentRole === 'MANAGER') return true;
    if (currentRole === 'HR') return section === 'jobs';
    return false;
  };

  // ===================== JOB HANDLERS =====================
  const handleCreateOrUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    if (jobs.some((j) => j.id === editingJob.id)) {
      setJobs(jobs.map((j) => (j.id === editingJob.id ? editingJob : j)));
      showToast(`Updated job "${editingJob.title}"`);
    } else {
      setJobs([editingJob, ...jobs]);
      showToast(`Created new vacancy "${editingJob.title}"`);
    }
    setIsJobModalOpen(false);
    setEditingJob(null);
  };

  const handleToggleJobStatus = (id: string) => {
    if (!hasAccess('jobs')) return;
    setJobs(
      jobs.map((j) => {
        if (j.id === id) {
          const nextStatus = j.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`Job status changed to ${nextStatus}`);
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
  };

  const handleDeleteJob = (id: string) => {
    if (!hasAccess('jobs')) return;
    const target = jobs.find((j) => j.id === id);
    setJobs(jobs.filter((j) => j.id !== id));
    showToast(`Deleted job "${target?.title || id}"`);
  };

  const openNewJobModal = () => {
    setEditingJob({
      id: `job-${Date.now()}`,
      title: '',
      department: 'Corporate Operations',
      location: 'Nizamabad, Telangana',
      type: 'Full-Time',
      experience: '1-3 Years',
      salary: '₹3,50,000 - ₹5,00,000 / yr',
      requirements: [
        'Bachelor\'s degree in relevant discipline',
        'Proficiency in spoken Telugu & English communication',
        'Strong documentation & coordination abilities'
      ],
      description: 'Oversee corporate operations, international candidate onboarding, and client coordination at our Nizamabad headquarters.',
      status: 'ACTIVE',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    });
    setIsJobModalOpen(true);
  };

  // AI / Rewrite for Job Description
  const handleRewriteJobDescription = (style: 'executive' | 'concise' | 'impact') => {
    if (!editingJob) return;
    const title = editingJob.title || 'Corporate Specialist';
    const dept = editingJob.department || 'Operations';

    let rewritten = '';
    if (style === 'executive') {
      rewritten = `Spearhead mission-critical corporate operations as our ${title} in ${dept}. Champion rigorous document compliance, streamline overseas visa workflows, and nurture premier corporate relationships from our Nizamabad headquarters with zero-friction SLA execution.`;
    } else if (style === 'concise') {
      rewritten = `Lead daily ${dept} activities as ${title} in Nizamabad HQ. Manage international applicant documentation, visa processing schedules, and client coordination with exceptional clarity and efficiency.`;
    } else {
      rewritten = `Drive high-impact international placement pipelines as ${title}. Empower candidates with seamless documentation oversight, expedited visa clearing, and dedicated career advisory in an inclusive global workplace.`;
    }

    setEditingJob({ ...editingJob, description: rewritten });
    showToast(`Job description rewritten in ${style.toUpperCase()} style ✨`);
  };

  // ===================== REWRITE FOR COMPANY INFO =====================
  const handleRewriteOverview = (style: 'executive' | 'inspirational') => {
    let rewritten = '';
    if (style === 'executive') {
      rewritten = 'Ashoka International stands as Nizamabad\'s premier corporate operations hub and international talent consultancy. Headquartered opposite Kakatiya KOC School in Subhash Nagar, we deliver institutional-grade placement pipelines, documentation compliance, and an affirmative workplace built for global career mobility.';
    } else {
      rewritten = 'Empowering visionary careers from Nizamabad to the world. At Ashoka International, we break boundaries in global recruitment, delivering weightless upward mobility, transparent corporate guidance, and an inclusive workplace culture where every ambition takes flight.';
    }
    setCompanyInfo({ ...companyInfo, overview: rewritten });
    showToast(`Company overview rewritten in ${style.toUpperCase()} tone ✨`);
  };

  const handleRewriteHeroSlogans = () => {
    const slogans = [
      {
        title: 'ASHOKA INTERNATIONAL',
        subtitle: 'Elevating Corporate Operations & Global Career Horizons from Nizamabad to the World.'
      },
      {
        title: 'ASHOKA INTERNATIONAL',
        subtitle: 'Pioneering Weightless Corporate Mobility & World-Class Talent Placement.'
      },
      {
        title: 'ASHOKA INTERNATIONAL',
        subtitle: 'Your Gateway to Premier Overseas Careers, Fast Visas & Corporate Excellence.'
      },
      {
        title: 'ASHOKA INTERNATIONAL',
        subtitle: 'Transforming Career Aspirations into Global Opportunities with Zero Friction.'
      }
    ];

    const nextIdx = (sloganIndex + 1) % slogans.length;
    setSloganIndex(nextIdx);
    const updated = {
      ...companyInfo,
      heroTitle: slogans[nextIdx].title,
      heroSubtitle: slogans[nextIdx].subtitle
    };
    setCompanyInfo(updated);
    try {
      localStorage.setItem('ashoka-companyInfo', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast('Applied fresh Hero slogan variation ✨');
  };

  const handleToggleLgbtq = (checked: boolean) => {
    const updated = { ...companyInfo, isLgbtqFriendly: checked };
    setCompanyInfo(updated);
    try {
      localStorage.setItem('ashoka-companyInfo', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast(
      checked
        ? 'LGBTQ+ Friendly badge is now VISIBLE across Platform (Navbar, Hero, About, Footer) 🌈'
        : 'LGBTQ+ Friendly badge is now HIDDEN across Platform'
    );
  };

  const handleSaveCompanyInfo = () => {
    try {
      localStorage.setItem('ashoka-companyInfo', JSON.stringify(companyInfo));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast('Company details and branding saved successfully across Platform! 💾');
  };

  const handleResetCompanyInfo = () => {
    setCompanyInfo(initialCompanyInfo);
    try {
      localStorage.setItem('ashoka-companyInfo', JSON.stringify(initialCompanyInfo));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast('Reset company details to initial defaults ↺');
  };

  // ===================== TESTIMONIAL HANDLERS =====================
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    if (testimonials.some((t) => t.id === editingTestimonial.id)) {
      setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t)));
      showToast(`Updated review by ${editingTestimonial.author}`);
    } else {
      setTestimonials([editingTestimonial, ...testimonials]);
      showToast(`Added new review by ${editingTestimonial.author}`);
    }
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!hasAccess('testimonials')) return;
    setTestimonials(testimonials.filter((t) => t.id !== id));
    showToast('Testimonial deleted');
  };

  const openNewTestimonialModal = () => {
    setEditingTestimonial({
      id: `test-${Date.now()}`,
      author: '',
      role: 'Client / Candidate',
      rating: 5.0,
      comment: '',
      verified: true,
      date: 'Just now'
    });
    setIsTestimonialModalOpen(true);
  };

  const handlePolishTestimonial = () => {
    if (!editingTestimonial) return;
    const author = editingTestimonial.author || 'The candidate';
    const polished = `Ashoka International provided outstanding guidance throughout my corporate recruitment process in Nizamabad. Their transparent documentation verification and dedicated visa assistance made my international transition seamless and worry-free.`;
    setEditingTestimonial({ ...editingTestimonial, comment: polished });
    showToast('Testimonial copy professionally polished ✨');
  };

  // ===================== USER HANDLERS =====================
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (users.some((u) => u.id === editingUser.id)) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      showToast(`Updated user role for ${editingUser.name}`);
    } else {
      setUsers([...users, editingUser]);
      showToast(`Added new user ${editingUser.name}`);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      showToast('Cannot delete the last remaining user account.');
      return;
    }
    setUsers(users.filter((u) => u.id !== id));
    showToast('User removed');
  };

  const handleUpdateUserRole = (id: string, newRole: Role) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    showToast(`Role updated to ${newRole}`);
  };

  // Sign-Up Approval & Rejection Handlers (Admin & Manager Authorized)
  const handleApproveRequest = (request: AccessRequest) => {
    if (currentRole !== 'ADMIN' && currentRole !== 'MANAGER') {
      showToast('Unauthorized: Only Admin and Manager can approve sign-up access.');
      return;
    }
    const grantedRole = approvalRoles[request.id] || request.requestedRole;
    const approvedUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: request.name,
      email: request.email,
      role: grantedRole,
      avatar: '',
    };
    setUsers((prev) => [approvedUser, ...prev]);
    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
    showToast(`Access Approved: ${request.name} is now active as ${grantedRole} 🎉`);
  };

  const handleRejectRequest = (request: AccessRequest) => {
    if (currentRole !== 'ADMIN' && currentRole !== 'MANAGER') {
      showToast('Unauthorized: Only Admin and Manager can reject sign-up access.');
      return;
    }
    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
    showToast(`Access Rejected: Registration request for ${request.name} was declined.`);
  };

  // ===================== SYSTEM SETTINGS =====================
  const handleSimulateSync = () => {
    setDbSyncing(true);
    setTimeout(() => {
      setDbSyncing(false);
      showToast('Prisma PostgreSQL schema synchronized! ✅');
    }, 1200);
  };

  const handleExportBackup = () => {
    const backupData = {
      companyInfo,
      jobs,
      testimonials,
      users,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ashoka-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported successfully! 📥');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-sky-950 text-white flex flex-col h-screen overflow-hidden">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Controls Bar */}
        <header className="shrink-0 border-b border-sky-800/40 bg-sky-950/90 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 z-40">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-white px-3 py-1.5 rounded-xl bg-sky-900/60 border border-sky-700/50 hover:bg-sky-800/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Site</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-sky-400/40 shadow-glow-sky overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Ashoka International Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>ASHOKA INTERNATIONAL</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Admin CMS & RBAC
                </span>
              </h1>
            </div>
          </div>

          {/* Top Header Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Corporate Session Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-900/60 border border-sky-700/50 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold hidden sm:inline">{currentUser.name}</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
                {currentUser.role}
              </span>
            </div>

            {/* Split-Screen Preview Toggle */}
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                showLivePreview
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-sky-900/50 text-sky-300 border-sky-700/50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{showLivePreview ? 'Live Preview ON' : 'Form Only'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-xl bg-sky-900/60 border border-sky-700/50 text-sky-200 hover:text-white"
              title="Toggle Light/Dark Theme"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            {/* Gamified Auth Logout Button */}
            <Link
              href="/admin/auth"
              className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/80"
              title="Auth Page"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Fixed Left Sidebar Navigation */}
          <aside className="w-64 border-r border-sky-800/30 bg-sky-950 p-4 shrink-0 overflow-y-auto hidden md:block">
            
            {/* User Role Profile Badge */}
            <div className="p-4 rounded-2xl bg-sky-900/40 border border-sky-700/40 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                {currentUser.role.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-xs text-sky-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{currentUser.role} Level</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'jobs'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                    : 'text-sky-200 hover:bg-sky-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4" />
                  <span>Job Vacancies</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900/80 text-sky-200">
                  {jobs.length}
                </span>
              </button>

              <button
                onClick={() => hasAccess('about') && setActiveTab('about')}
                disabled={!hasAccess('about')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  !hasAccess('about')
                    ? 'opacity-40 cursor-not-allowed text-sky-400/50'
                    : activeTab === 'about'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                    : 'text-sky-200 hover:bg-sky-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building className="w-4 h-4" />
                  <span>Company Overview</span>
                </span>
                {!hasAccess('about') && <Lock className="w-3.5 h-3.5" />}
              </button>

              {/* Theme Customizer Navigation Tab */}
              <button
                onClick={() => hasAccess('theme') && setActiveTab('theme')}
                disabled={!hasAccess('theme')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  !hasAccess('theme')
                    ? 'opacity-40 cursor-not-allowed text-sky-400/50'
                    : activeTab === 'theme'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                    : 'text-sky-200 hover:bg-sky-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-amber-300" />
                  <span>Theme Customizer</span>
                </span>
                {!hasAccess('theme') && <Lock className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => hasAccess('testimonials') && setActiveTab('testimonials')}
                disabled={!hasAccess('testimonials')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  !hasAccess('testimonials')
                    ? 'opacity-40 cursor-not-allowed text-sky-400/50'
                    : activeTab === 'testimonials'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                    : 'text-sky-200 hover:bg-sky-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Star className="w-4 h-4" />
                  <span>Success Stories</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900/80 text-sky-200">
                  {testimonials.length}
                </span>
              </button>

              <button
                onClick={() => hasAccess('users') && setActiveTab('users')}
                disabled={!hasAccess('users')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  !hasAccess('users')
                    ? 'opacity-40 cursor-not-allowed text-sky-400/50'
                    : activeTab === 'users'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                    : 'text-sky-200 hover:bg-sky-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {pendingRequests.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                      {pendingRequests.length} Req
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900/80 text-sky-200">
                    {users.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => hasAccess('settings') && setActiveTab('settings')}
                disabled={!hasAccess('settings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  !hasAccess('settings')
                    ? 'opacity-40 cursor-not-allowed text-sky-400/50'
                    : activeTab === 'settings'
                    ? 'bg-sky-500 text-slate-950 shadow-glow-sky'
                    : 'text-sky-200 hover:bg-sky-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>System Settings</span>
                </span>
                {!hasAccess('settings') && <Lock className="w-3.5 h-3.5" />}
              </button>
            </nav>

            {/* RBAC Alignment Explanatory Box */}
            <div className="mt-8 p-4 rounded-2xl bg-sky-900/20 border border-sky-800/40 text-xs text-sky-200/80 space-y-2">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Aligned RBAC Permissions</span>
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li><strong className="text-emerald-300">Admin & Manager:</strong> Equal Full Access</li>
                <li><strong className="text-white">HR:</strong> Job Card CRUD Operations</li>
              </ul>
            </div>
          </aside>

          {/* Left Form Workspace (Scrollable) */}
          <main className={`flex-1 p-6 overflow-y-auto ${showLivePreview ? 'lg:w-1/2' : 'w-full'}`}>
            
            {/* ==================== TAB 1: JOB VACANCIES CRUD ==================== */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-sky-400" />
                      <span>Job Vacancies CRUD</span>
                    </h2>
                    <p className="text-xs text-sky-300">Manage placement opportunities and WhatsApp triggers</p>
                  </div>
                  {hasAccess('jobs') && (
                    <button
                      onClick={openNewJobModal}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-glow-sky transition-all hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Job</span>
                    </button>
                  )}
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl bg-sky-900/30 border border-sky-800/40 hover:border-sky-600/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">{job?.title ?? ''}</span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              job?.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {job?.status ?? 'INACTIVE'}
                          </span>
                        </div>
                        <div className="text-xs text-sky-300 flex items-center gap-3">
                          <span>{job?.department ?? ''}</span>
                          <span>&bull;</span>
                          <span>{job?.location ?? ''}</span>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-semibold">{job?.salary ?? ''}</span>
                        </div>
                        <p className="text-xs text-sky-200/70 line-clamp-1">{job?.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleJobStatus(job.id)}
                          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                            job.status === 'ACTIVE'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          }`}
                          title={job.status === 'ACTIVE' ? 'Set Inactive' : 'Set Active'}
                        >
                          {job.status === 'ACTIVE' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => {
                            setEditingJob({ ...job });
                            setIsJobModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-sky-800/50 border border-sky-600/40 text-sky-200 hover:text-white hover:bg-sky-700/60"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB 2: COMPANY OVERVIEW EDITING ==================== */}
            {activeTab === 'about' && hasAccess('about') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Building className="w-6 h-6 text-sky-400" />
                      <span>Company Overview & Slogans</span>
                    </h2>
                    <p className="text-xs text-sky-300">Live-edit header branding, address, phone numbers, and overview copy</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCompanyInfo}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700/60 text-xs font-semibold text-sky-300 hover:text-white hover:bg-sky-800/60"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleSaveCompanyInfo}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-sky-900/30 border border-sky-800/40 space-y-5">
                  {/* Hero Title & Subtitle with AI Rewrite */}
                  <div className="p-4 rounded-xl bg-sky-950/60 border border-sky-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-sky-300">
                        Hero Banner Heading & Slogan
                      </label>
                      <button
                        type="button"
                        onClick={handleRewriteHeroSlogans}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] font-bold hover:bg-sky-500/30 transition-colors"
                      >
                        <Wand2 className="w-3 h-3 text-amber-300" />
                        <span>Rewrite Slogan</span>
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={companyInfo?.heroTitle ?? ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, heroTitle: e.target.value })}
                        placeholder="Hero Title (e.g. ASHOKA INTERNATIONAL)"
                        className="w-full px-4 py-2 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none mb-2 font-bold"
                      />
                      <textarea
                        rows={2}
                        value={companyInfo?.heroSubtitle ?? ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, heroSubtitle: e.target.value })}
                        placeholder="Hero Tagline / Subtitle"
                        className="w-full px-4 py-2 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-xs focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                      Company Brand Name
                    </label>
                    <input
                      type="text"
                      value={companyInfo?.companyName ?? ''}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                        Contact Phone Number
                      </label>
                      <input
                        type="text"
                        value={companyInfo?.phoneNumber ?? ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                        WhatsApp Number (No + sign)
                      </label>
                      <input
                        type="text"
                        value={companyInfo?.whatsappNumber ?? ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, whatsappNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                        Operating Hours
                      </label>
                      <input
                        type="text"
                        value={companyInfo?.hours ?? ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, hours: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                        Office Category
                      </label>
                      <input
                        type="text"
                        value={companyInfo?.category ?? 'Corporate Office'}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                      Full Nizamabad Address
                    </label>
                    <input
                      type="text"
                      value={companyInfo?.address ?? ''}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  {/* Corporate Overview with Rewrite Options */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-sky-300">
                        Corporate Overview Text
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-sky-400 font-semibold">Rewrite:</span>
                        <button
                          type="button"
                          onClick={() => handleRewriteOverview('executive')}
                          className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold hover:bg-sky-500/30 transition-colors"
                        >
                          Executive
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRewriteOverview('inspirational')}
                          className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold hover:bg-emerald-500/30 transition-colors"
                        >
                          Inspirational
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={companyInfo?.overview ?? ''}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, overview: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-sky-950 border border-sky-700/60 text-white text-sm focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  {/* Interactive LGBTQ+ Badge Platform Switcher */}
                  <div className="p-4 rounded-2xl bg-sky-950/70 border border-sky-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 hover:border-sky-500/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Heart className={`w-4 h-4 ${(companyInfo?.isLgbtqFriendly ?? true) ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
                        <span className="text-sm font-bold text-white">
                          "LGBTQ+ Friendly Workplace" Platform Badge
                        </span>
                        {(companyInfo?.isLgbtqFriendly ?? true) ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active / Visible Everywhere
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            Disabled / Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-200/70">
                        When enabled, displays certified inclusive employer badges in the Top Navbar, Hero section, About company cards, and Footer.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={companyInfo?.isLgbtqFriendly ?? true}
                      onClick={() => handleToggleLgbtq(!(companyInfo?.isLgbtqFriendly ?? true))}
                      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-md ${
                        (companyInfo?.isLgbtqFriendly ?? true) ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                          (companyInfo?.isLgbtqFriendly ?? true) ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: THEME CUSTOMIZER ==================== */}
            {activeTab === 'theme' && hasAccess('theme') && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Palette className="w-6 h-6 text-amber-300" />
                    <span>Dynamic Theme Customizer</span>
                  </h2>
                  <p className="text-xs text-sky-300">
                    Dynamically change global accent palettes, contrast ratios, and visual presets in real time.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-sky-900/30 border border-sky-800/40 space-y-6">
                  {/* Preset Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-3">
                      Preset Design Language
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'antigravity-sky', name: 'Antigravity Sky Blue', color: 'bg-sky-500' },
                        { id: 'emerald-inclusive', name: 'Emerald Inclusive', color: 'bg-emerald-500' },
                        { id: 'indigo-corporate', name: 'Indigo Corporate', color: 'bg-indigo-500' },
                        { id: 'amber-sunset', name: 'Sunset Amber', color: 'bg-amber-500' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            applyPreset(p.id);
                            showToast(`Applied preset: ${p.name}`);
                          }}
                          className={`p-4 rounded-xl border flex items-center justify-between font-bold text-xs transition-all ${
                            preset === p.id
                              ? 'bg-sky-800/80 border-sky-400 text-white shadow-lg scale-102'
                              : 'bg-sky-950/60 border-sky-800 text-sky-200 hover:border-sky-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${p.color}`} />
                            <span>{p.name}</span>
                          </span>
                          {preset === p.id && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Palette Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-3">
                      Primary Accent Color Palette
                    </label>
                    <div className="flex items-center gap-4">
                      {(['sky', 'emerald', 'indigo', 'amber'] as AccentColor[]).map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setAccent(col);
                            showToast(`Selected ${col.toUpperCase()} accent palette`);
                          }}
                          className={`w-12 h-12 rounded-2xl border-2 transition-all flex items-center justify-center ${
                            col === 'sky'
                              ? 'bg-sky-500 border-sky-300'
                              : col === 'emerald'
                              ? 'bg-emerald-500 border-emerald-300'
                              : col === 'indigo'
                              ? 'bg-indigo-500 border-indigo-300'
                              : 'bg-amber-500 border-amber-300'
                          } ${accent === col ? 'scale-110 shadow-glow-sky border-white' : 'opacity-70 hover:opacity-100'}`}
                        >
                          {accent === col && <Check className="w-5 h-5 text-slate-950" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast Adjustment */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-3">
                      Visual Contrast Ratio Mode
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setContrast('normal');
                          showToast('Standard Soft Glass contrast activated');
                        }}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          contrast === 'normal'
                            ? 'bg-sky-500 text-slate-950 border-sky-400'
                            : 'bg-sky-950 border-sky-800 text-sky-200'
                        }`}
                      >
                        Standard Soft Glass Contrast
                      </button>
                      <button
                        onClick={() => {
                          setContrast('high');
                          showToast('High Contrast mode activated');
                        }}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          contrast === 'high'
                            ? 'bg-sky-500 text-slate-950 border-sky-400'
                            : 'bg-sky-950 border-sky-800 text-sky-200'
                        }`}
                      >
                        High Contrast Accessibility Mode
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 4: TESTIMONIALS MANAGER ==================== */}
            {activeTab === 'testimonials' && hasAccess('testimonials') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Star className="w-6 h-6 text-amber-300" />
                      <span>Success Stories & Reviews</span>
                    </h2>
                    <p className="text-xs text-sky-300">Manage client reviews, star ratings, and candidate testimonials</p>
                  </div>
                  <button
                    onClick={openNewTestimonialModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-glow-sky transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-2xl bg-sky-900/30 border border-sky-800/40 hover:border-sky-600/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-base">{t?.author ?? ''}</span>
                          <span className="text-xs text-sky-300 bg-sky-900/60 px-2 py-0.5 rounded-full border border-sky-700/40">
                            {t?.role ?? 'Candidate'}
                          </span>
                          <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>{t?.rating ?? 5} / 5</span>
                          </span>
                        </div>
                        <p className="text-xs text-sky-200/90 italic">"{t?.comment ?? ''}"</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingTestimonial({ ...t });
                            setIsTestimonialModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-sky-800/50 border border-sky-600/40 text-sky-200 hover:text-white"
                          title="Edit Review"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB 5: USER MANAGEMENT & SIGN-UP APPROVALS ==================== */}
            {activeTab === 'users' && hasAccess('users') && (
              <div className="space-y-8">
                {/* Tab Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Users className="w-6 h-6 text-sky-400" />
                      <span>User Management & Access Control</span>
                    </h2>
                    <p className="text-xs text-sky-300">
                      Multi-tenant role permissions & sign-up request authorization
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin & Manager Authorized</span>
                    </span>
                    <button
                      onClick={() => {
                        setEditingUser({
                          id: `user-${Date.now()}`,
                          name: '',
                          email: '',
                          role: 'HR',
                          avatar: ''
                        });
                        setIsUserModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-sky transition-all hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                </div>

                {/* 1. SIGN-UP ACCESS APPROVALS QUEUE (Admin & Manager Controlled) */}
                <div className="p-6 rounded-3xl bg-sky-900/30 border border-sky-800/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-300" />
                        <span>Pending Sign-Up Access Requests</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                          {pendingRequests.length} Pending
                        </span>
                      </h3>
                      <p className="text-xs text-sky-300/80">
                        Admin & Manager authority: approve or reject newly submitted registrations.
                      </p>
                    </div>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-sky-950/60 border border-sky-800/40 text-center text-xs text-sky-300/80">
                      ✨ All sign-up requests have been reviewed. No pending access requests.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-sky-950/70 border border-sky-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-500/40 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{req.name}</span>
                              <span className="text-[10px] text-sky-400 bg-sky-900/60 px-2 py-0.5 rounded-full border border-sky-700/40">
                                Requested {req.requestedRole}
                              </span>
                              <span className="text-[10px] text-sky-300/60 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{req.requestedAt}</span>
                              </span>
                            </div>
                            <div className="text-xs text-sky-300 font-mono">{req.email}</div>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Role Selection on Approval */}
                            <div className="flex items-center gap-1.5">
                              <label className="text-[11px] text-sky-300 font-semibold">Assign Role:</label>
                              <select
                                value={approvalRoles[req.id] || req.requestedRole}
                                onChange={(e) =>
                                  setApprovalRoles({
                                    ...approvalRoles,
                                    [req.id]: e.target.value as Role
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-xl bg-sky-900/80 border border-sky-600 text-xs font-bold text-white focus:outline-none focus:border-sky-400"
                              >
                                <option value="ADMIN">ADMIN (Full Access)</option>
                                <option value="MANAGER">MANAGER (Full Operational)</option>
                                <option value="HR">HR (Restricted to Jobs)</option>
                              </select>
                            </div>

                            {/* Approve Button */}
                            <button
                              onClick={() => handleApproveRequest(req)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => handleRejectRequest(req)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-bold text-xs transition-all"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. ACTIVE PLATFORM USERS LIST */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-400" />
                      <span>Active Platform Accounts ({users.length})</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="p-4 rounded-2xl bg-sky-900/30 border border-sky-800/40 flex items-center justify-between gap-4 flex-wrap"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                            {u.role.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{u?.name ?? ''}</div>
                            <div className="text-xs text-sky-300">{u?.email ?? ''}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Interactive Role Selector Dropdown */}
                          <div className="flex items-center gap-1.5">
                            <label className="text-[11px] text-sky-400 font-semibold">Role:</label>
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value as Role)}
                              className="px-3 py-1.5 rounded-xl bg-sky-950 border border-sky-700 text-xs font-bold text-sky-200 focus:outline-none focus:border-sky-400"
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="HR">HR</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 6: SYSTEM SETTINGS ==================== */}
            {activeTab === 'settings' && hasAccess('settings') && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-sky-400" />
                    <span>System Settings & Database Controls</span>
                  </h2>
                  <p className="text-xs text-sky-300">Global API configs, backup export, and PostgreSQL synchronizer</p>
                </div>

                <div className="p-6 rounded-2xl bg-sky-900/30 border border-sky-800/40 space-y-5 text-xs text-sky-200">
                  <div className="flex items-center justify-between pb-4 border-b border-sky-800/40">
                    <div>
                      <div className="font-bold text-white text-sm">Prisma PostgreSQL Database Connection</div>
                      <div className="text-sky-300/80">Active pool connection to relational database schema</div>
                    </div>
                    <button
                      onClick={handleSimulateSync}
                      disabled={dbSyncing}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hover:bg-emerald-500/30 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${dbSyncing ? 'animate-spin' : ''}`} />
                      <span>{dbSyncing ? 'Syncing...' : 'Sync Database'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-sky-800/40">
                    <div>
                      <div className="font-bold text-white text-sm">WhatsApp Business Payload Forwarder</div>
                      <div className="text-sky-300/80">Route candidate 1-click apply payloads to: +{companyInfo.whatsappNumber}</div>
                    </div>
                    <button
                      onClick={() => {
                        setWhatsappForwarding(!whatsappForwarding);
                        showToast(`WhatsApp routing ${!whatsappForwarding ? 'Enabled' : 'Disabled'}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                        whatsappForwarding
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {whatsappForwarding ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-sky-800/40">
                    <div>
                      <div className="font-bold text-white text-sm">Maintenance Mode</div>
                      <div className="text-sky-300/80">Temporarily display a corporate maintenance banner to public visitors</div>
                    </div>
                    <button
                      onClick={() => {
                        setMaintenanceMode(!maintenanceMode);
                        showToast(`Maintenance mode ${!maintenanceMode ? 'Enabled' : 'Disabled'}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                        maintenanceMode
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {maintenanceMode ? 'Maintenance ON' : 'Off'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="font-bold text-white text-sm">Export System JSON Backup</div>
                      <div className="text-sky-300/80">Download complete dataset of jobs, reviews, and corporate details</div>
                    </div>
                    <button
                      onClick={handleExportBackup}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ==================== RIGHT SIDE: LIVE PREVIEW PANEL WITH CLICKABLE EDIT OVERLAYS ==================== */}
          {showLivePreview && (
            <aside className="w-full lg:w-1/2 border-l border-sky-800/40 bg-sky-950 p-6 h-[calc(100vh-73px)] overflow-y-auto scrollbar-thin shrink-0">
              <div className="sticky top-0 z-20 mb-4 pb-3 border-b border-sky-800/40 flex items-center justify-between bg-sky-950/90 backdrop-blur-md">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Live Real-Time Visual Preview Panel
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-sky-300/80 hidden sm:inline">LGBTQ+ Badge:</span>
                  {(companyInfo?.isLgbtqFriendly ?? true) ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Visible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Live Preview Container with Clickable Section Overlays */}
              <div className="space-y-8 rounded-3xl border border-sky-700/50 bg-sky-900/20 p-4 shadow-antigravity overflow-hidden">
                
                {/* 1. HERO PREVIEW WITH CLICKABLE EDIT */}
                <div className="relative group rounded-2xl overflow-hidden border border-sky-700/40">
                  <div className="absolute top-4 right-4 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setActiveTab('about');
                        showToast('Switched to Company & Hero Editor');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-sky hover:scale-105 transition-transform"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Hero & Slogans</span>
                    </button>
                  </div>
                  <div className="transform scale-[0.95] origin-top">
                    <Hero
                      heroTitle={companyInfo?.heroTitle}
                      heroSubtitle={companyInfo?.heroSubtitle}
                      phoneNumber={companyInfo?.phoneNumber}
                      isLgbtqFriendly={companyInfo?.isLgbtqFriendly ?? true}
                    />
                  </div>
                </div>

                {/* 2. ABOUT PREVIEW WITH CLICKABLE EDIT */}
                <div className="relative group rounded-2xl overflow-hidden border border-sky-700/40">
                  <div className="absolute top-4 right-4 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setActiveTab('about');
                        showToast('Switched to Company Details Editor');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-sky hover:scale-105 transition-transform"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Company Details</span>
                    </button>
                  </div>
                  <div className="transform scale-[0.95] origin-top">
                    <About companyInfo={companyInfo} />
                  </div>
                </div>

                {/* 3. ACTIVE JOBS PREVIEW WITH INDIVIDUAL CLICKABLE EDIT BUTTONS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-sky-200 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-sky-400" />
                      <span>Active Opportunity Cards Preview ({jobs.filter(j => j.status === 'ACTIVE').length})</span>
                    </h3>
                    <button
                      onClick={() => {
                        setActiveTab('jobs');
                        openNewJobModal();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Vacancy</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {jobs
                      .filter((j) => j.status === 'ACTIVE')
                      .map((job) => (
                        <div key={job.id} className="relative group">
                          {/* Direct Clickable Edit Button Overlay from Preview */}
                          <div className="absolute top-4 right-4 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingJob({ ...job });
                                setIsJobModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-sky hover:scale-105 transition-transform"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit This Vacancy</span>
                            </button>
                          </div>
                          <JobCard job={job} whatsappNumber={companyInfo?.whatsappNumber} />
                        </div>
                      ))}
                  </div>
                </div>

                {/* 4. TESTIMONIALS PREVIEW WITH CLICKABLE EDIT */}
                <div className="relative group rounded-2xl overflow-hidden border border-sky-700/40">
                  <div className="absolute top-4 right-4 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setActiveTab('testimonials');
                        showToast('Switched to Success Stories Editor');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-sky hover:scale-105 transition-transform"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Success Stories</span>
                    </button>
                  </div>
                  <div className="transform scale-[0.95] origin-top">
                    <Testimonials
                      testimonials={testimonials}
                      rating={companyInfo?.rating}
                      reviewCount={companyInfo?.reviewCount}
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* ==================== JOB EDIT MODAL WITH REWRITE ASSISTANT ==================== */}
        {isJobModalOpen && editingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl bg-sky-950 border border-sky-700/60 p-6 shadow-antigravity space-y-4 text-white max-h-[90vh] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between pb-2 border-b border-sky-800">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-400" />
                  <span>{jobs.some((j) => j.id === editingJob.id) ? 'Edit Job Vacancy' : 'Create New Job Vacancy'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="text-sky-300 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    placeholder="e.g. International Operations Executive"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Background Image URL</label>
                  <input
                    type="text"
                    value={editingJob.bgImage ?? ''}
                    onChange={(e) => setEditingJob({ ...editingJob, bgImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-sky-300 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={editingJob.department}
                      onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sky-300 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={editingJob.salary}
                      onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-sky-300 mb-1">Experience Required</label>
                    <input
                      type="text"
                      value={editingJob.experience}
                      onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sky-300 mb-1">Status</label>
                    <select
                      value={editingJob.status}
                      onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                      className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    >
                      <option value="ACTIVE">ACTIVE (Hiring)</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                {/* Job Description with Rewrite Options */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-sky-300">Job Description</label>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-sky-400 font-semibold">Rewrite:</span>
                      <button
                        type="button"
                        onClick={() => handleRewriteJobDescription('executive')}
                        className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold hover:bg-sky-500/30"
                      >
                        Executive
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRewriteJobDescription('concise')}
                        className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold hover:bg-emerald-500/30"
                      >
                        Concise
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRewriteJobDescription('impact')}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold hover:bg-amber-500/30"
                      >
                        Impact
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={editingJob.description}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                  />
                </div>

                {/* Requirements List */}
                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Requirements List</label>
                  <div className="space-y-2 mb-2 max-h-36 overflow-y-auto">
                    {(editingJob?.requirements ?? []).map((req, i) => (
                      <div key={i} className="flex items-center justify-between bg-sky-900/40 px-3 py-1.5 rounded-lg border border-sky-800">
                        <span>{req}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingJob({
                              ...editingJob,
                              requirements: editingJob.requirements.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-rose-400 hover:text-rose-300 font-bold text-sm"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRequirementText}
                      onChange={(e) => setNewRequirementText(e.target.value)}
                      placeholder="Add requirement..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-sky-900/60 border border-sky-700 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!newRequirementText.trim()) return;
                          setEditingJob({
                            ...editingJob,
                            requirements: [...editingJob.requirements, newRequirementText.trim()],
                          });
                          setNewRequirementText('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRequirementText.trim()) return;
                        setEditingJob({
                          ...editingJob,
                          requirements: [...editingJob.requirements, newRequirementText.trim()],
                        });
                        setNewRequirementText('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-sky-800">
                  <button
                    type="button"
                    onClick={() => setIsJobModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-sky-900 text-sky-200 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-md hover:bg-emerald-400"
                  >
                    Save Vacancy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TESTIMONIAL EDIT MODAL WITH REWRITE ==================== */}
        {isTestimonialModalOpen && editingTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-3xl bg-sky-950 border border-sky-700/60 p-6 shadow-antigravity space-y-4 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-sky-800">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-300" />
                  <span>{testimonials.some((t) => t.id === editingTestimonial.id) ? 'Edit Review' : 'Add New Review'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="text-sky-300 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.author}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-sky-300 mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={editingTestimonial.role}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                      placeholder="Candidate / Client"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sky-300 mb-1">Star Rating (1 - 5)</label>
                    <select
                      value={editingTestimonial.rating}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5.0 Stars)</option>
                      <option value="4.5">⭐⭐⭐⭐½ (4.5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4.0 Stars)</option>
                      <option value="3.5">⭐⭐⭐½ (3.5 Stars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-sky-300">Review Feedback</label>
                    <button
                      type="button"
                      onClick={handlePolishTestimonial}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold hover:bg-amber-500/30"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Polish Review</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={editingTestimonial.comment}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    placeholder="Enter candidate feedback..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-sky-800">
                  <button
                    type="button"
                    onClick={() => setIsTestimonialModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-sky-900 text-sky-200 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-md hover:bg-emerald-400"
                  >
                    Save Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== USER EDIT MODAL ==================== */}
        {isUserModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-3xl bg-sky-950 border border-sky-700/60 p-6 shadow-antigravity space-y-4 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-sky-800">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span>{users.some((u) => u.id === editingUser.id) ? 'Edit User' : 'Add New User'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="text-sky-300 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none"
                    placeholder="priya@ashokainternational.com"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sky-300 mb-1">Assigned Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                    className="w-full px-3 py-2 rounded-xl bg-sky-900/60 border border-sky-700 text-white focus:outline-none font-bold"
                  >
                    <option value="ADMIN">ADMIN (Full Access)</option>
                    <option value="MANAGER">MANAGER (Full Operational Access)</option>
                    <option value="HR">HR (Restricted to Job CRUD)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-sky-800">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-sky-900 text-sky-200 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-md hover:bg-emerald-400"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
