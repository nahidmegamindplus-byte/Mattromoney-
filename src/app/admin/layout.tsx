'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Users,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-12 text-center text-xs">Checking administrative access permissions...</div>;
  }

  const isStaff = user && ['SUPER_ADMIN', 'FINANCE_ADMIN', 'MODERATOR'].includes(user.role);

  if (!isStaff) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-dark font-bengali">অ্যাক্সেস অনুমোদিত নয় (Access Denied)</h2>
        <p className="text-xs text-dark-muted">
          এই সেকশনটি শুধুমাত্র অনুমোদিত অ্যাডমিন ও ফাইন্যান্স কর্মকর্তাদের জন্য সংরক্ষিত।
        </p>
        <Link href="/" className="inline-block bg-maroon-800 text-white font-bold text-xs px-4 py-2 rounded-xl">
          মূল ওয়েবসাইটে ফিরে যান
        </Link>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'ওভারভিউ ড্যাশবোর্ড', icon: LayoutDashboard },
    { href: '/admin/finance/manual-payments', label: 'ম্যানুয়াল পেমেন্ট যাচাই', icon: FileCheck },
    { href: '/admin/finance/payment-methods', label: 'পেমেন্ট মেথড সেটিংস', icon: Settings },
    { href: '/admin/finance/reports', label: 'রাজস্ব অডিট রিপোর্ট', icon: TrendingUp },
    { href: '/admin/plans', label: 'মেম্বারশিপ প্ল্যান ম্যানেজমেন্ট', icon: CreditCard },
    { href: '/admin/users', label: 'ইউজার ও প্রোফাইল মডারেশন', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#29252A] text-ivory-200 border-r border-[#C8A45D]/30 p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="border-b border-dark-muted/40 pb-4">
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">
              Administrative Control
            </span>
            <h2 className="text-lg font-bold text-white font-bengali">আমারবন্ধন অ্যাডমিন</h2>
            <span className="inline-block bg-maroon-800 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
              {user.role}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-maroon-700 text-white shadow-md border-l-4 border-gold-400'
                      : 'text-ivory-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span className="font-bengali">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-dark-muted/40">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-ivory-300 hover:text-white font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-gold-400" />
            <span>মূল ওয়েবসাইটে ফিরুন</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
