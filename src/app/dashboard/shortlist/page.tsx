'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ProfileCard from '@/components/ui/ProfileCard';
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react';

export default function UserShortlistPage() {
  const { lang } = useLanguage();
  const [shortlists, setShortlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shortlists');
      const data = await res.json();
      if (data.success) {
        setShortlists(data.shortlists);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlists();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
          পছন্দের বায়োডাটার তালিকা (Shortlisted Profiles)
        </h1>
        <p className="text-xs text-dark-muted">
          পরবর্তীতে দেখার জন্য আপনার সংরক্ষিত পাত্র-পাত্রীর প্রোফাইলসমূহ
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs">Loading shortlists...</div>
      ) : shortlists.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gold-400/30 space-y-3">
          <Bookmark className="w-10 h-10 text-gold-500 mx-auto" />
          <h3 className="font-bold text-base text-dark font-bengali">
            আপনার পছন্দের তালিকায় কোনো বায়োডাটা নেই
          </h3>
          <p className="text-xs text-dark-muted max-w-sm mx-auto">
            পাত্র-পাত্রী অনুসন্ধান পেইজ থেকে হার্ট আইকনে ক্লিক করে যেকোনো প্রোফাইল শর্টলিস্টে যোগ করতে পারবেন।
          </p>
          <Link
            href="/search"
            className="inline-block bg-maroon-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
          >
            পাত্র-পাত্রী খুঁজুন →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlists.map((s) => (
            <ProfileCard
              key={s.id}
              profile={s.biodata}
              onShortlistToggled={() => fetchShortlists()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
