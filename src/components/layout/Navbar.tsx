'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Search,
  ShieldCheck,
  CreditCard,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminOrStaff = user && ['SUPER_ADMIN', 'FINANCE_ADMIN', 'MODERATOR'].includes(user.role);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-200">
      {/* Top micro bar for hotline and language switch */}
      <div className="bg-[#FAF8F5] px-4 py-1.5 text-xs text-slate-600 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-slate-700 font-medium text-[11px] sm:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#7A1735]" />
              {lang === 'bn' ? '১০০% বিশ্বস্ত ও নিরাপদ বাংলাদেশি পাত্র-পাত্রীর বায়োডাটা' : 'Trusted & Verified Bangladeshi Matrimony'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1.5 text-slate-700 hover:text-[#7A1735] bg-white hover:bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs transition-colors text-[11px] font-semibold"
            >
              <Globe className="w-3 h-3 text-[#7A1735]" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7A1735] to-[#9E1B46] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#7A1735] font-bengali">
                {lang === 'bn' ? 'আমারবন্ধন' : 'AmarBondhon'}
              </span>
              <span className="block text-[10px] text-amber-700 uppercase tracking-widest font-bold">
                Matrimony
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/'
                  ? 'text-[#7A1735] font-bold bg-amber-50/70 border border-amber-200/50'
                  : 'text-slate-600 hover:text-[#7A1735] hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/search"
              className={`flex items-center px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/search'
                  ? 'text-[#7A1735] font-bold bg-amber-50/70 border border-amber-200/50'
                  : 'text-slate-600 hover:text-[#7A1735] hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 mr-1 text-[#7A1735]" />
              {t('findPartner')}
            </Link>
            <Link
              href="/pricing"
              className={`flex items-center px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/pricing'
                  ? 'text-[#7A1735] font-bold bg-amber-50/70 border border-amber-200/50'
                  : 'text-slate-600 hover:text-[#7A1735] hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-1 text-[#7A1735]" />
              {t('pricing')}
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/how-it-works'
                  ? 'text-[#7A1735] font-bold bg-amber-50/70 border border-amber-200/50'
                  : 'text-slate-600 hover:text-[#7A1735] hover:bg-slate-50'
              }`}
            >
              {t('howItWorks')}
            </Link>
            <Link
              href="/safety"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/safety'
                  ? 'text-[#7A1735] font-bold bg-amber-50/70 border border-amber-200/50'
                  : 'text-slate-600 hover:text-[#7A1735] hover:bg-slate-50'
              }`}
            >
              {t('safety')}
            </Link>
            <Link
              href="/stories"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/stories'
                  ? 'text-[#7A1735] font-bold bg-amber-50/70 border border-amber-200/50'
                  : 'text-slate-600 hover:text-[#7A1735] hover:bg-slate-50'
              }`}
            >
              {t('stories')}
            </Link>
          </nav>

          {/* Desktop User / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-[#7A1735] px-3.5 py-1.5 rounded-xl text-sm font-bold border border-slate-200 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#7A1735]" />
                  <span>{t('dashboard')}</span>
                </Link>

                {isAdminOrStaff && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-sm border border-amber-300 shadow-xs transition-all"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-800" />
                    <span>{t('admin')}</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-[#7A1735] font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-[#7A1735] hover:bg-[#601027] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('register')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger & quick action button */}
          <div className="flex md:hidden items-center space-x-2">
            {!user ? (
              <Link
                href="/register"
                className="bg-[#7A1735] text-white font-bold px-3 py-1.5 rounded-full text-[11px] shadow-sm font-bengali active:scale-95 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>ফ্রি বায়োডাটা</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="bg-slate-100 text-[#7A1735] font-bold px-3 py-1.5 rounded-full text-[11px] border border-slate-200 active:scale-95"
              >
                ড্যাশবোর্ড
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#7A1735] hover:bg-slate-100 rounded-xl focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#7A1735]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>🏠</span>
            <span>{t('home')}</span>
          </Link>
          <Link
            href="/search?gender=MALE"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>👳‍♂️</span>
            <span>পাত্রের বায়োডাটা (Grooms)</span>
          </Link>
          <Link
            href="/search?gender=FEMALE"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>🧕</span>
            <span>পাত্রীর বায়োডাটা (Brides)</span>
          </Link>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>🔍</span>
            <span>{t('findPartner')}</span>
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>💎</span>
            <span>{t('pricing')}</span>
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>📖</span>
            <span>{t('howItWorks')}</span>
          </Link>
          <Link
            href="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#7A1735] py-2 px-3 rounded-xl hover:bg-slate-50 font-medium font-bengali"
          >
            <span>🛡️</span>
            <span>শরীয়াহ ও নিরাপত্তা নীতিমালা</span>
          </Link>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-slate-100 text-[#7A1735] text-center py-2.5 rounded-xl font-bold font-bengali border border-slate-200"
                >
                  {t('dashboard')}
                </Link>
                {isAdminOrStaff && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-amber-100 text-amber-900 border border-amber-300 text-center py-2.5 rounded-xl font-bold font-bengali"
                  >
                    {t('admin')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-rose-600 font-bold font-bengali hover:bg-rose-50 rounded-xl"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold font-bengali border border-slate-200"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-[#7A1735] hover:bg-[#601027] text-white rounded-xl font-bold font-bengali shadow-md"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
