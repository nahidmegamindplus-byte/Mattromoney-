'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Search, UserCheck, Heart, MapPin, Calendar, Sparkles } from 'lucide-react';

const BD_DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'কুমিল্লা', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল',
  'রংপুর', 'ময়মনসিংহ', 'গাজীপুর', 'নারায়ণগঞ্জ', 'ব্রাহ্মণবাড়িয়া', 'নোয়াখালী',
  'ফেনী', 'কক্সবাজার', 'বগুড়া', 'পাবনা', 'যশোর', 'কুষ্টিয়া', 'দিনাজপুর',
  'টাঙ্গাইল', 'জামালপুর', 'নরসিংদী', 'মাদারীপুর', 'ফরিদপুর', 'সাতক্ষীরা'
];

export default function HomeHeroSearch() {
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [gender, setGender] = useState('FEMALE');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [minAge, setMinAge] = useState('18');
  const [maxAge, setMaxAge] = useState('35');
  const [district, setDistrict] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (gender) params.set('gender', gender);
    if (maritalStatus) params.set('maritalStatus', maritalStatus);
    if (minAge) params.set('minAge', minAge);
    if (maxAge) params.set('maxAge', maxAge);
    if (district) params.set('district', district);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl max-w-4xl mx-auto border-2 border-gold-400/50 text-dark relative">
      {/* DeenPuron-style Dual Toggle: পাত্রের বায়োডাটা / পাত্রীর বায়োডাটা */}
      <div className="flex items-center justify-center -mt-9 sm:-mt-11 mb-5">
        <div className="inline-flex bg-ivory-100 p-1.5 rounded-full border-2 border-gold-400 shadow-lg">
          <button
            type="button"
            onClick={() => setGender('FEMALE')}
            className={`flex items-center space-x-2 px-5 sm:px-7 py-2 rounded-full font-bold text-xs sm:text-sm font-bengali transition-all duration-300 ${
              gender === 'FEMALE'
                ? 'bg-gradient-to-r from-maroon-800 to-maroon-900 text-white shadow-md scale-105'
                : 'text-dark-muted hover:text-dark'
            }`}
          >
            <span className="text-base sm:text-lg">🧕</span>
            <span>{lang === 'bn' ? 'পাত্রীর বায়োডাটা' : "Bride's Biodata"}</span>
          </button>

          <button
            type="button"
            onClick={() => setGender('MALE')}
            className={`flex items-center space-x-2 px-5 sm:px-7 py-2 rounded-full font-bold text-xs sm:text-sm font-bengali transition-all duration-300 ${
              gender === 'MALE'
                ? 'bg-gradient-to-r from-maroon-800 to-maroon-900 text-white shadow-md scale-105'
                : 'text-dark-muted hover:text-dark'
            }`}
          >
            <span className="text-base sm:text-lg">👳‍♂️</span>
            <span>{lang === 'bn' ? 'পাত্রের বায়োডাটা' : "Groom's Biodata"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Marital Status */}
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1.5 font-bengali flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-gold-600" />
              <span>বৈবাহিক অবস্থা</span>
            </label>
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-maroon-700"
            >
              <option value="">সকল বৈবাহিক অবস্থা</option>
              <option value="NEVER_MARRIED">অবিবাহিত (Never Married)</option>
              <option value="DIVORCED">ডিভোর্সড (Divorced)</option>
              <option value="WIDOWED">বিধবা / বিপত্নীক (Widowed)</option>
              <option value="SEPARATED">আইনগতভাবে পৃথক (Separated)</option>
            </select>
          </div>

          {/* Permanent District */}
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1.5 font-bengali flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gold-600" />
              <span>স্থায়ী জেলা</span>
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-maroon-700"
            >
              <option value="">সকল জেলা (৬৪ জেলা)</option>
              {BD_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1.5 font-bengali flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-gold-600" />
              <span>বয়স সীমা</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="18"
                max="65"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                placeholder="১৮"
                className="w-1/2 bg-ivory-100 border border-slate-300 rounded-xl px-2 py-2.5 text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-maroon-700"
              />
              <span className="text-dark-muted text-xs font-bold">থেকে</span>
              <input
                type="number"
                min="18"
                max="75"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="৩৫"
                className="w-1/2 bg-ivory-100 border border-slate-300 rounded-xl px-2 py-2.5 text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-maroon-700"
              />
            </div>
          </div>

          {/* Submit Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-maroon-950 font-bold px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm active:scale-95"
            >
              <Search className="w-4 h-4 text-maroon-950 stroke-[2.5]" />
              <span className="font-bengali">বায়োডাটা অনুসন্ধান করুন</span>
            </button>
          </div>
        </div>

        {/* Popular Quick District Chips for Mobile & Desktop */}
        <div className="pt-2 border-t border-slate-100 flex items-center flex-wrap gap-1.5 text-[11px] text-dark-muted">
          <span className="font-bold text-maroon-900 flex items-center mr-1">
            <Sparkles className="w-3 h-3 mr-1 text-gold-600" />
            জনপ্রিয় জেলা:
          </span>
          {['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'কুমিল্লা', 'রাজশাহী', 'খুলনা', 'ময়মনসিংহ'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setDistrict(chip);
                const params = new URLSearchParams();
                if (gender) params.set('gender', gender);
                params.set('district', chip);
                router.push(`/search?${params.toString()}`);
              }}
              className="px-2.5 py-1 bg-ivory-200 hover:bg-gold-100 text-maroon-900 rounded-lg border border-gold-400/30 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
