'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  User,
  Heart,
  Bookmark,
  MessageSquare,
  CreditCard,
  ShieldCheck,
  Video,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, activeSubscription, loading } = useAuth();
  const { lang, t } = useLanguage();

  if (loading) {
    return <div className="p-12 text-center text-xs">Loading member dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold font-bengali">লগইন প্রয়োজন</h2>
        <p className="text-xs text-dark-muted">ড্যাশবোর্ড অ্যাক্সেস করতে অনুগ্রহ করে লগইন করুন।</p>
        <Link href="/login" className="inline-block bg-maroon-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          লগইন পেইজে যান
        </Link>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: lang === 'bn' ? 'ওভারভিউ ড্যাশবোর্ড' : 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/biodata', label: lang === 'bn' ? 'আমার বায়োডাটা' : 'My Biodata', icon: User },
    { href: '/dashboard/interests', label: lang === 'bn' ? 'আগ্রহ ও যোগাযোগ' : 'Interests', icon: Heart },
    { href: '/dashboard/shortlist', label: lang === 'bn' ? 'পছন্দের তালিকা' : 'Shortlisted', icon: Bookmark },
    { href: '/dashboard/chat', label: lang === 'bn' ? 'নিরাপদ চ্যাট' : 'Messages', icon: MessageSquare },
    { href: '/dashboard/payments', label: lang === 'bn' ? 'পেমেন্ট ও রসিদ' : 'Payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Member Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gold-400/30 p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* Member Card */}
          <div className="bg-ivory-200 p-4 rounded-2xl border border-gold-400/30 space-y-1.5">
            <span className="font-bold text-dark block text-sm">{user.name}</span>
            <span className="text-[11px] text-dark-muted block truncate">{user.email}</span>
            <div className="pt-1 flex items-center justify-between">
              <span className="bg-maroon-800 text-ivory text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {activeSubscription ? activeSubscription.plan.nameBn : 'ফ্রি মেম্বার'}
              </span>
              <span className="text-[10px] text-emerald-800 font-bold">ভেরিফাইড</span>
            </div>
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
                      ? 'bg-maroon-800 text-white shadow-sm'
                      : 'text-dark hover:bg-ivory-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-maroon-700'}`} />
                  <span className="font-bengali">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade card prompt if on free plan */}
        {(!activeSubscription || activeSubscription.plan.slug === 'FREE') && (
          <div className="bg-gradient-to-br from-maroon-900 to-maroon-800 text-white p-4 rounded-2xl space-y-2 text-xs border border-gold-400/30">
            <p className="font-bold font-bengali text-gold-300">প্রিমিয়ামে আপগ্রেড করুন</p>
            <p className="text-[11px] text-ivory-300 leading-snug">
              অভিভাবকের নম্বর আনলক ও আনলিমিটেড চ্যাট করতে গোল্ড প্যাকেজ বেছে নিন।
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-maroon-950 font-bold px-3 py-1.5 rounded-lg text-[11px] mt-1"
            >
              প্যাকেজ দেখুন →
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
