'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, ShieldCheck, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { lang, t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [dateOfBirth, setDateOfBirth] = useState('2000-01-01');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-validate legal age in Bangladesh
    const age = calculateAge(dateOfBirth);
    if (gender === 'MALE' && age < 21) {
      setError('বাল্যবিয়ে প্রতিরোধ আইন অনুযায়ী বাংলাদেশে পাত্রের সর্বনিম্ন বয়স ২১ বছর হতে হবে।');
      return;
    }
    if (gender === 'FEMALE' && age < 18) {
      setError('বাল্যবিয়ে প্রতিরোধ আইন অনুযায়ী বাংলাদেশে পাত্রীর সর্বনিম্ন বয়স ১৮ বছর হতে হবে।');
      return;
    }

    if (!consent) {
      setError('বিবাহের উপযুক্ততা এবং অভিভাবকের সম্মতি সংক্রান্ত ঘোষণা প্রদান আবশ্যক।');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          gender,
          dateOfBirth,
        }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        router.push('/dashboard/biodata');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Network error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gold-400/40 shadow-xl max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-500 to-amber-200 flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-6 h-6 text-maroon-900 fill-maroon-900" />
          </div>
          <h1 className="text-2xl font-bold text-dark font-bengali">
            {lang === 'bn' ? 'বিনামূল্যে বায়োডাটা নিবন্ধন' : 'Create Free Biodata'}
          </h1>
          <p className="text-xs text-dark-muted">
            বাংলাদেশি আইন ও শরীয়াহ সম্মত মর্যাদাপূর্ণ ম্যাট্রিমনি সেবা
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-dark mb-1 font-bengali">
              পূর্ণ নাম (Full Name) *
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: মোঃ সাকিব চৌধুরী"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-maroon-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-dark mb-1 font-bengali">
                লিঙ্গ (Gender) *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 font-medium"
              >
                <option value="FEMALE">পাত্রী (নারী - সর্বনিম্ন ১৮ বছর)</option>
                <option value="MALE">পাত্র (পুরুষ - সর্বনিম্ন ২১ বছর)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-dark mb-1 font-bengali">
                জন্ম তারিখ (Date of Birth) *
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-dark mb-1 font-bengali">
                ইমেইল ঠিকানা *
              </label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-dark mb-1 font-bengali">
                সচল মোবাইল নম্বর *
              </label>
              <input
                type="tel"
                required
                placeholder="01711223344"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-dark mb-1 font-bengali">
              পাসওয়ার্ড নির্ধারণ করুন *
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 font-medium"
            />
          </div>

          {/* Legal Age & Guardian Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-2 text-[11px] text-dark cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 rounded text-maroon-700 mt-0.5"
              />
              <span className="leading-snug">
                আমি ঘোষণা করছি যে আমি বিবাহের আইনি বয়সের শর্ত পূরণ করেছি এবং প্রদত্ত তথ্য সত্য ও সঠিক।
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-maroon-950 font-bold py-3 rounded-xl shadow-md text-xs transition-all flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'নিবন্ধন সম্পন্ন হচ্ছে...' : 'বিনামূল্যে একাউন্ট তৈরি করুন'}</span>
            <ArrowRight className="w-4 h-4 text-maroon-950" />
          </button>
        </form>

        <div className="text-center text-xs text-dark-muted">
          <span>ইতিমধ্যে একাউন্ট আছে? </span>
          <Link href="/login" className="text-maroon-800 font-bold underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
