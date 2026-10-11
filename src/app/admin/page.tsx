'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Users,
  ShieldCheck,
  CreditCard,
  Clock,
  TrendingUp,
  ArrowRight,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { lang } = useLanguage();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics');
        const data = await res.json();
        if (data.success) {
          setMetrics(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-dark-muted">Loading administrative dashboard...</div>;
  }

  if (!metrics) {
    return <div className="p-12 text-center text-xs text-rose-600">Failed to load metrics.</div>;
  }

  const { overview, pendingReviews, recentUsers } = metrics;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
          অ্যাডমিন ড্যাশবোর্ড ওভারভিউ
        </h1>
        <p className="text-xs text-dark-muted">
          প্ল্যাটফর্মের সার্বিক কার্যক্রম, রেজিস্টার্ড ইউজার ও আর্থিক লেনদেনের অবস্থা
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gold-400/30 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-maroon-700">
            <span className="text-xs font-bold uppercase">মোট নিবন্ধিত সদস্য</span>
            <Users className="w-5 h-5 text-gold-600" />
          </div>
          <p className="text-3xl font-extrabold text-dark">{overview.totalUsers}</p>
          <span className="text-[11px] text-dark-muted">সক্রিয় matrimonial ইউজার</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold-400/30 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-700">
            <span className="text-xs font-bold uppercase">অনুমোদিত বায়োডাটা</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-dark">{overview.approvedBiodatas}</p>
          <span className="text-[11px] text-dark-muted">{overview.pendingBiodatas}টি অনুমোদনের অপেক্ষায়</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold-400/30 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-amber-700">
            <span className="text-xs font-bold uppercase">পেন্ডিং পেমেন্ট দাবি</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-800">{overview.pendingPaymentsCount}</p>
          <Link href="/admin/finance/manual-payments" className="text-[11px] text-maroon-800 font-bold underline block">
            যাচাইকরণ কিউ দেখুন →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-700">
            <span className="text-xs font-bold uppercase">অনুমোদিত মোট রাজস্ব</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-900">৳{overview.totalConfirmedRevenueBdt.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-700 font-medium">নিশ্চিত অর্জিত রাজস্ব</span>
        </div>
      </div>

      {/* Two Column Section: Pending Reviews Queue + Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Reviews Queue */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-dark font-bengali flex items-center">
              <FileCheck className="w-4 h-4 mr-1.5 text-maroon-700" />
              পেন্ডিং ম্যানুয়াল পেমেন্ট দাবি ({pendingReviews.length})
            </h3>
            <Link
              href="/admin/finance/manual-payments"
              className="text-xs text-maroon-800 font-bold hover:underline"
            >
              সকল দেখুন
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <p className="text-xs text-dark-muted py-6 text-center">কোনো পেন্ডিং দাবি নেই।</p>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map((sub: any) => (
                <div
                  key={sub.id}
                  className="bg-ivory-100 p-3.5 rounded-xl border border-gold-400/20 flex justify-between items-center text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-maroon-900 block">{sub.order.orderNumber}</span>
                    <span className="font-semibold text-dark">{sub.user.name} • {sub.provider}</span>
                    <span className="text-[10px] text-dark-muted block">TrxID: {sub.transactionId}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-extrabold text-maroon-800 block">৳{sub.amountSentBdt}</span>
                    <Link
                      href="/admin/finance/manual-payments"
                      className="inline-block bg-maroon-800 text-white font-bold px-3 py-1 rounded text-[10px]"
                    >
                      যাচাই করুন
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registered Users */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-dark font-bengali flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-maroon-700" />
              সাম্প্রতিক নিবন্ধিত সদস্যবৃন্দ
            </h3>
            <Link href="/admin/users" className="text-xs text-maroon-800 font-bold hover:underline">
              সকল ইউজার
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.map((u: any) => (
              <div
                key={u.id}
                className="bg-ivory-100 p-3.5 rounded-xl border border-gold-400/20 flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-bold text-dark block">{u.name}</span>
                  <span className="text-dark-muted text-[11px]">{u.email} • {u.phone}</span>
                </div>
                <div>
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
