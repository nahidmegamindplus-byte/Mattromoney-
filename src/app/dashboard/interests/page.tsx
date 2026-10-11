'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, Check, X, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function UserInterestsPage() {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/interests?tab=${tab}`);
      const data = await res.json();
      if (data.success) {
        setInterests(data.interests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [tab]);

  const handleRespond = async (interestId: string, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      const res = await fetch('/api/interests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interestId, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInterests();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error updating interest request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
          আগ্রহ প্রকাশের অনুরোধসমূহ (Interest Requests)
        </h1>
        <p className="text-xs text-dark-muted">
          অন্যান্য প্রার্থীদের পাঠানো এবং আপনার কাছে আসা বৈবাহিক আগ্রহের তালিকা
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setTab('received')}
          className={`pb-3 text-xs font-bold transition-colors ${
            tab === 'received'
              ? 'border-b-2 border-maroon-800 text-maroon-800'
              : 'text-dark-muted hover:text-dark'
          }`}
        >
          প্রাপ্ত অনুরোধ (Received)
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`pb-3 text-xs font-bold transition-colors ${
            tab === 'sent'
              ? 'border-b-2 border-maroon-800 text-maroon-800'
              : 'text-dark-muted hover:text-dark'
          }`}
        >
          প্রেরিত অনুরোধ (Sent)
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs">Loading requests...</div>
        ) : interests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center text-xs text-dark-muted">
            কোনো অনুরোধ পাওয়া যায়নি।
          </div>
        ) : (
          interests.map((item) => {
            const member = tab === 'received' ? item.sender : item.receiver;
            const biodata = member?.biodata;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-gold-400/25 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-dark text-sm">{member?.name}</span>
                    {biodata && (
                      <span className="font-mono text-[10px] bg-ivory-200 text-maroon-900 font-bold px-2 py-0.5 rounded">
                        {biodata.biodataNumber}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.message && (
                    <p className="text-xs text-slate-600 italic">&quot;{item.message}&quot;</p>
                  )}

                  {biodata && (
                    <p className="text-[11px] text-dark-muted">
                      {biodata.occupationCategory} • {biodata.presentDistrict} • {biodata.age} বছর
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {biodata && (
                    <Link
                      href={`/profiles/${biodata.id}`}
                      className="text-xs font-bold text-maroon-800 bg-ivory-200 hover:bg-ivory-300 px-3 py-1.5 rounded-lg border border-gold-400/30"
                    >
                      বায়োডাটা দেখুন
                    </Link>
                  )}

                  {tab === 'received' && item.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleRespond(item.id, 'ACCEPTED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>গ্রহণ করুন</span>
                      </button>
                      <button
                        onClick={() => handleRespond(item.id, 'DECLINED')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>বাতিল</span>
                      </button>
                    </>
                  )}

                  {item.status === 'ACCEPTED' && (
                    <Link
                      href={`/dashboard/chat?partnerId=${member.id}`}
                      className="bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                      <span>চ্যাট করুন</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
