export type Role = 'ADMIN' | 'MANAGER' | 'HR';

export type AccentColor = 'sky' | 'emerald' | 'indigo' | 'amber';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  requirements: string[];
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  bgImage?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface CompanyDetails {
  companyName: string;
  category: string;
  address: string;
  phoneNumber: string;
  whatsappNumber: string;
  hours: string;
  rating: number;
  reviewCount: number;
  isLgbtqFriendly: boolean;
  overview: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface ThemeConfig {
  accent: AccentColor;
  contrast: 'normal' | 'high';
  preset: 'antigravity-sky' | 'emerald-inclusive' | 'indigo-corporate' | 'amber-sunset';
}

export const initialCompanyInfo: CompanyDetails = {
  companyName: "ASHOKA INTERNATIONAL",
  category: "Corporate Office",
  address: "opp. KAKATIYA KOC SCHOOL, Subhash Nagar, Nizamabad, Telangana 503002, India",
  phoneNumber: "+94 74231 0280",
  whatsappNumber: "94742310280",
  hours: "Monday – Saturday: Opens 10:00 AM | Sunday: Closed",
  rating: 4.6,
  reviewCount: 5,
  isLgbtqFriendly: true,
  overview: "Ashoka International is a leading corporate hub and international talent acquisition partner located in Subhash Nagar, Nizamabad. We provide premier corporate solutions, career growth pathways, and an inclusive work culture designed for zero-gravity forward movement.",
  heroTitle: "ASHOKA INTERNATIONAL",
  heroSubtitle: "Pioneering Weightless Corporate Mobility & World-Class Talent Placement.",
};

export const initialJobs: JobItem[] = [
  {
    id: "job-1",
    title: "International Operations Executive",
    department: "Corporate Operations",
    location: "Nizamabad, Telangana",
    type: "Full-Time",
    experience: "1-3 Years",
    salary: "₹3,50,000 - ₹5,00,000 / yr",
    requirements: [
      "Bachelor's Degree in Business Admin or relevant field",
      "Fluent English & Telugu communication skills",
      "Expertise in document verification & visa process support",
      "Strong coordination capabilities with overseas clients"
    ],
    description: "Lead corporate client relations, documentation compliance, and client onboarding workflows in our Nizamabad headquarters.",
    status: "ACTIVE",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "job-2",
    title: "Senior HR Talent Specialist",
    department: "Human Resources",
    location: "Nizamabad, Telangana",
    type: "Full-Time",
    experience: "2-5 Years",
    salary: "₹4,00,000 - ₹6,50,000 / yr",
    requirements: [
      "Proven track record in candidate screening & interviews",
      "Knowledge of international labor recruitment standards",
      "Proficiency in HR management tools & CRM systems",
      "Empathetic, inclusive leadership approach"
    ],
    description: "Manage candidate pipelines for top global partner companies, driving ethical recruitment and inclusive workplace matching.",
    status: "ACTIVE",
    bgImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "job-3",
    title: "Corporate Client Manager",
    department: "Business Development",
    location: "Hybrid / Nizamabad",
    type: "Full-Time",
    experience: "3+ Years",
    salary: "₹6,00,000 - ₹8,50,000 / yr",
    requirements: [
      "Key account management experience in corporate services",
      "Strategic negotiation & proposal drafting skills",
      "Familiarity with Gulf & Southeast Asia corporate sectors",
      "High level of integrity & result-driven mindset"
    ],
    description: "Expand Ashoka International's corporate partnerships, securing high-value international placement contracts.",
    status: "ACTIVE",
    bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "job-4",
    title: "Documentation & Visa Assistant",
    department: "Administration",
    location: "Nizamabad, Telangana",
    type: "Full-Time",
    experience: "0-2 Years",
    salary: "₹2,50,000 - ₹3,60,000 / yr",
    requirements: [
      "Detail-oriented document verification specialist",
      "Basic computer proficiency & MS Office expertise",
      "Good interpersonal skills and phone etiquette"
    ],
    description: "Assist clients with embassy attestation, document translation, and passport compliance.",
    status: "INACTIVE",
    bgImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: "t-1",
    author: "SREEKAR",
    role: "Verified Client",
    rating: 5,
    comment: "Very good management",
    verified: true,
    date: "2 weeks ago"
  },
  {
    id: "t-2",
    author: "Bandari Ramlucky",
    role: "Verified Client",
    rating: 5,
    comment: "I want likishan",
    verified: true,
    date: "1 month ago"
  },
  {
    id: "t-3",
    author: "Rajesh Kumar",
    role: "Corporate Lead",
    rating: 5,
    comment: "Top notch professional guidance in Nizamabad. The process was transparent, fast, and weightless!",
    verified: true,
    date: "2 months ago"
  },
  {
    id: "t-4",
    author: "Priyanka G.",
    role: "Placement Candidate",
    rating: 4.5,
    comment: "Extremely welcoming and LGBTQ+ friendly staff. They truly value equality and professional excellence.",
    verified: true,
    date: "3 months ago"
  }
];

export const mockUsers: UserProfile[] = [
  {
    id: "u-admin",
    name: "Ashoka Admin",
    email: "admin@ashokainternational.com",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "u-manager",
    name: "Operations Manager",
    email: "manager@ashokainternational.com",
    role: "MANAGER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "u-hr",
    name: "HR Specialist",
    email: "hr@ashokainternational.com",
    role: "HR",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  }
];
