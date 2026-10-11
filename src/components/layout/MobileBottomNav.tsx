'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, Search, UserCheck, LayoutDashboard, Heart } from 'lucide-react';

function MobileBottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const genderParam = searchParams ? searchParams.get('gender') : null;

  const navItems = [
    {
      label: 'হোম',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'পাত্র',
      href: '/search?gender=MALE',
      icon: Users,
      isActive: pathname === '/search' && genderParam === 'MALE',
    },
    {
      label: 'খুঁজুন',
      href: '/search',
      icon: Search,
      isActive: pathname === '/search' && !genderParam,
    },
    {
      label: 'পাত্রী',
      href: '/search?gender=FEMALE',
      icon: Heart,
      isActive: pathname === '/search' && genderParam === 'FEMALE',
    },
    {
      label: user ? 'ড্যাশবোর্ড' : 'একাউন্ট',
      href: user ? '/dashboard' : '/login',
      icon: user ? LayoutDashboard : UserCheck,
      isActive: pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/register',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                active ? 'text-[#7A1735]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5] text-[#7A1735]' : 'stroke-2'}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#7A1735]" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-bengali ${active ? 'font-bold text-[#7A1735]' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavContent />
    </Suspense>
  );
}
