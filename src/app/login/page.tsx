'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();
  const { lang, t } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        if (['SUPER_ADMIN', 'FINANCE_ADMIN', 'MODERATOR'].includes(data.user.role)) {
          router.push('/admin');
        } else {
          router.push(redirect);
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch {
      setError('Login connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gold-400/40 shadow-xl max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-500 to-amber-200 flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-6 h-6 text-maroon-900 fill-maroon-900" />
          </div>
          <h1 className="text-2xl font-bold text-dark font-bengali">
            {lang === 'bn' ? 'আমারবন্ধনে লগইন করুন' : 'Log in to AmarBondhon'}
          </h1>
          <p className="text-xs text-dark-muted">
            আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিয়ে সাইন ইন করুন
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-dark mb-1 font-bengali">
              ইমেইল বা মোবাইল নম্বর *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="example@mail.com বা 01711223344"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-medium focus:ring-2 focus:ring-maroon-700 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-dark mb-1 font-bengali">
              পাসওয়ার্ড *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-medium focus:ring-2 focus:ring-maroon-700 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>


        <div className="text-center text-xs text-dark-muted pt-2">
          <span>অ্যাকাউন্ট নেই? </span>
          <Link href="/register" className="text-maroon-800 font-bold underline">
            বিনামূল্যে বায়োডাটা খুলুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
