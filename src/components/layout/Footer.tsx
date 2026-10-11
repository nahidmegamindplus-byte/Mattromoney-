'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7A1735] to-[#9E1B46] flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 font-bengali">
                  {lang === 'bn' ? 'আমারবন্ধন' : 'AmarBondhon'}
                </span>
                <span className="block text-[10px] text-amber-800 uppercase tracking-widest font-bold">
                  Matrimony Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed pr-6">
              {lang === 'bn'
                ? 'বাংলাদেশের নির্ভরযোগ্য, শরীয়াহ ও পারিবারিক মূল্যবোধসম্মত ম্যাট্রিমনি প্ল্যাটফর্ম। আমরা জাতীয় পরিচয়পত্র ও কঠোর নীতিমালার মাধ্যমে ভেরিফাইড জীবনসঙ্গী খুঁজে পেতে সহায়তা করি।'
                : 'Bangladesh’s premier dignified and family-oriented matrimonial platform. Connecting eligible individuals through verified biodatas with privacy and trust.'}
            </p>

            <div className="pt-2 text-xs text-[#7A1735] flex items-center space-x-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#7A1735]" />
              <span>
                {lang === 'bn'
                  ? 'বাল্যবিয়ে প্রতিরোধ আইন ও তথ্য নিরাপত্তা নীতি অনুসরণ করা হয়'
                  : 'Complies with Bangladesh Child Marriage Restraint Act'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/search" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'পাত্র-পাত্রী খুঁজুন' : 'Search Profiles'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'মেম্বারশিপ প্যাকেজ' : 'Membership Plans'}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'কীভাবে কাজ করে' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'সফলতার গল্প' : 'Success Stories'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              {lang === 'bn' ? 'নিরাপত্তা ও নীতিমালা' : 'Safety & Legal'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/safety" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'নিরাপত্তা কেন্দ্র' : 'Safety Center'}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'রিফান্ড পলিসি' : 'Refund Policy'}
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-[#7A1735] transition-colors">
                  {lang === 'bn' ? 'কমিউনিটি নীতিমালা' : 'Community Guidelines'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              {lang === 'bn' ? 'সাহায্য ও যোগাযোগ' : 'Help & Contact'}
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#7A1735]" />
                <span className="text-slate-700 font-medium">+880 1700-123456 (10am - 8pm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#7A1735]" />
                <span className="text-slate-700 font-medium">support@amarbondhon.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#7A1735]" />
                <span className="text-slate-700 font-medium">Gulshan-1, Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Supported Payment Providers Badge */}
            <div className="pt-3">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                {lang === 'bn' ? 'সমর্থিত পেমেন্ট মাধ্যম' : 'Supported Payment Methods'}
              </p>
              <div className="flex items-center space-x-2">
                <span className="bg-[#DF146E] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs">
                  bKash
                </span>
                <span className="bg-[#F7931E] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs">
                  Nagad
                </span>
                <span className="bg-[#8C3494] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs">
                  Rocket
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border & copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 AmarBondhon Matrimony. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">
            {lang === 'bn'
              ? 'একটি মূল বাংলাদেশি মেধা ও স্থাপত্যের সমন্বয়ে নির্মিত।'
              : 'Designed & Engineered for Bangladesh Matrimonial Excellence.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
