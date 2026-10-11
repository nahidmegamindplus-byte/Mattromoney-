'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  CreditCard,
  Edit3,
  Trash2,
  Plus,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface MembershipPlan {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  badgeEn?: string | null;
  priceBdt: number;
  originalPriceBdt: number;
  durationDays: number;
  isPopular: boolean;
  isActive: boolean;
  searchLimit: number;
  interestLimit: number;
  biodataAccessLimit: number;
  directChatAllowed: boolean;
  directCallAllowed: boolean;
  featuresJson: string;
  displayOrder: number;
}

const DEFAULT_NEW_PLAN = {
  slug: '',
  nameEn: '',
  nameBn: '',
  badgeEn: '',
  priceBdt: 990,
  originalPriceBdt: 1490,
  durationDays: 30,
  isPopular: false,
  isActive: true,
  searchLimit: 150,
  interestLimit: 15,
  biodataAccessLimit: 10,
  directChatAllowed: false,
  directCallAllowed: false,
  featuresList: ['অভিভাবকের সরাসরি মোবাইল নম্বর আনলক', 'ভেরিফাইড বায়োডাটাতে আগ্রহ প্রকাশ', 'বিশেষ সাপোর্ট টিম'],
};

export default function AdminPlansPage() {
  const { lang } = useLanguage();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState<any>({ ...DEFAULT_NEW_PLAN });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New feature input temp states
  const [newFeatureText, setNewFeatureText] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/plans');
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const parseFeatures = (json: string): string[] => {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleStartEdit = (p: MembershipPlan) => {
    setEditingPlan({
      ...p,
      featuresList: parseFeatures(p.featuresJson),
    });
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setNewPlan({
      ...DEFAULT_NEW_PLAN,
      featuresList: [...DEFAULT_NEW_PLAN.featuresList],
    });
    setIsCreating(true);
    setEditingPlan(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        ...editingPlan,
        featuresJson: JSON.stringify(editingPlan.featuresList || []),
      };
      delete payload.featuresList;

      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'প্যাকেজটি সফলভাবে আপডেট করা হয়েছে!', type: 'success' });
        setEditingPlan(null);
        fetchPlans();
      } else {
        setMsg({ text: data.message || 'ত্রুটি হয়েছে', type: 'error' });
      }
    } catch {
      setMsg({ text: 'সার্ভার যোগাযোগে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        ...newPlan,
        featuresJson: JSON.stringify(newPlan.featuresList || []),
      };
      delete payload.featuresList;

      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'নতুন মেম্বারশিপ প্যাকেজ সফলভাবে তৈরি হয়েছে!', type: 'success' });
        setIsCreating(false);
        fetchPlans();
      } else {
        setMsg({ text: data.message || 'প্যাকেজ তৈরিতে ত্রুটি', type: 'error' });
      }
    } catch {
      setMsg({ text: 'সার্ভার যোগাযোগে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string, force = false) => {
    if (!confirm(force ? 'আপনি কি নিশ্চিতভাবে এই প্যাকেজটি স্থায়ীভাবে মুছে ফেলতে চান?' : 'আপনি কি এই প্যাকেজটি ডিলিট করতে চান?')) {
      return;
    }

    setDeletingId(id);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/plans?id=${encodeURIComponent(id)}${force ? '&force=true' : ''}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: data.message || 'প্যাকেজটি সফলভাবে সরানো হয়েছে!', type: 'success' });
        fetchPlans();
      } else {
        setMsg({ text: data.message || 'প্যাকেজ মুছতে সমস্যা হয়েছে', type: 'error' });
      }
    } catch {
      setMsg({ text: 'সার্ভার যোগাযোগে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-bengali flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#7A1735]" />
            <span>মেম্বারশিপ প্যাকেজ ও অধিকার ব্যবস্থাপনা</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            এডমিন প্যানেল থেকে যেকোনো প্যাকেজ যোগ করুন, পরিবর্তন করুন বা মুছে ফেলুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPlans}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleStartCreate}
            className="flex items-center space-x-1.5 bg-[#7A1735] hover:bg-[#601027] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্যাকেজ যোগ করুন</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between border ${
            msg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Plans List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">প্যাকেজ লোড হচ্ছে...</div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-medium text-slate-600">বর্তমানে কোনো প্যাকেজ পাওয়া যায়নি।</p>
            <button
              onClick={handleStartCreate}
              className="bg-[#7A1735] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              প্রথম প্যাকেজ তৈরি করুন
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-4">প্যাকেজ নাম (En / Bn)</th>
                  <th className="p-4">মূল্য (BDT)</th>
                  <th className="p-4">মেয়াদ (দিন)</th>
                  <th className="p-4">আগ্রহ লিমিট</th>
                  <th className="p-4">নম্বর আনলক লিমিট</th>
                  <th className="p-4">চ্যাট ও কল</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 block font-bengali text-sm">{p.nameBn}</span>
                        {p.isPopular && (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            জনপ্রিয়
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{p.nameEn} ({p.slug})</span>
                      {p.badgeEn && (
                        <span className="ml-1 text-[10px] text-slate-400">[{p.badgeEn}]</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-[#7A1735] text-sm">৳{p.priceBdt}</span>
                      {p.originalPriceBdt > p.priceBdt && (
                        <span className="text-[10px] text-slate-400 line-through block">৳{p.originalPriceBdt}</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{p.durationDays} দিন</td>
                    <td className="p-4 font-semibold text-slate-700">{p.interestLimit}টি</td>
                    <td className="p-4 font-semibold text-slate-700">{p.biodataAccessLimit}টি</td>
                    <td className="p-4">
                      <span className="block text-[11px] text-slate-600">চ্যাট: {p.directChatAllowed ? '✅ হ্যাঁ' : '❌ না'}</span>
                      <span className="block text-[11px] text-slate-600">কল: {p.directCallAllowed ? '✅ হ্যাঁ' : '❌ না'}</span>
                    </td>
                    <td className="p-4">
                      {p.isActive ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          নিষ্ক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="bg-slate-100 hover:bg-slate-200 text-[#7A1735] font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>সম্পাদনা</span>
                        </button>
                        <button
                          onClick={() => handleDeletePlan(p.id)}
                          disabled={deletingId === p.id}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                          title="মুছে ফেলুন / নিষ্ক্রিয় করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছুন</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New Plan */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 space-y-5 my-8">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-bengali flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#7A1735]" />
                <span>নতুন মেম্বারশিপ প্যাকেজ তৈরি করুন</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                নতুন প্যাকেজের মূল্য, মেয়াদ ও বিশেষ সুবিধা সেট করুন
              </p>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্যাকেজ নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ডায়মন্ড প্যাকেজ"
                    value={newPlan.nameBn}
                    onChange={(e) => setNewPlan({ ...newPlan, nameBn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diamond Package"
                    value={newPlan.nameEn}
                    onChange={(e) => setNewPlan({ ...newPlan, nameEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্লাগ / কোড (Unique Slug)</label>
                  <input
                    type="text"
                    placeholder="e.g. DIAMOND_PLAN (Optional)"
                    value={newPlan.slug}
                    onChange={(e) => setNewPlan({ ...newPlan, slug: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ব্যাজ লেবেল (Badge)</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Value / মোস্ট পপুলার"
                    value={newPlan.badgeEn}
                    onChange={(e) => setNewPlan({ ...newPlan, badgeEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={newPlan.priceBdt}
                    onChange={(e) => setNewPlan({ ...newPlan, priceBdt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আসল মূল্য / পূর্বের মূল্য (BDT)</label>
                  <input
                    type="number"
                    value={newPlan.originalPriceBdt}
                    onChange={(e) => setNewPlan({ ...newPlan, originalPriceBdt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মেয়াদ (দিন) *</label>
                  <input
                    type="number"
                    required
                    value={newPlan.durationDays}
                    onChange={(e) => setNewPlan({ ...newPlan, durationDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সার্চ লিমিট</label>
                  <input
                    type="number"
                    value={newPlan.searchLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, searchLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আগ্রহ প্রকাশের লিমিট *</label>
                  <input
                    type="number"
                    required
                    value={newPlan.interestLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, interestLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নম্বর আনলক লিমিট *</label>
                  <input
                    type="number"
                    required
                    value={newPlan.biodataAccessLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, biodataAccessLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              {/* Features List Section */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">প্যাকেজের প্রধান সুবিধাসমূহ (Features List):</label>
                <div className="space-y-1.5">
                  {(newPlan.featuresList || []).map((feat: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      <span className="text-slate-700">{feat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...newPlan.featuresList];
                          updated.splice(index, 1);
                          setNewPlan({ ...newPlan, featuresList: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="নতুন সুবিধা যোগ করুন..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newFeatureText.trim()) return;
                      setNewPlan({ ...newPlan, featuresList: [...(newPlan.featuresList || []), newFeatureText.trim()] });
                      setNewFeatureText('');
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-lg"
                  >
                    যোগ
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPlan.directChatAllowed}
                    onChange={(e) => setNewPlan({ ...newPlan, directChatAllowed: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>সরাসরি চ্যাট অনুমতি</span>
                </label>

                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPlan.directCallAllowed}
                    onChange={(e) => setNewPlan({ ...newPlan, directCallAllowed: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>অডিও/ভিডিও কল অনুমতি</span>
                </label>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPlan.isActive}
                    onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>প্যাকেজটি সক্রিয় রাখুন</span>
                </label>

                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPlan.isPopular}
                    onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>জনপ্রিয় ব্যাজ প্রদর্শন</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#7A1735] hover:bg-[#601027] text-white font-bold rounded-xl shadow-md"
                >
                  {saving ? 'তৈরি হচ্ছে...' : 'প্যাকেজ যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Plan */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 space-y-5 my-8">
            <button
              onClick={() => setEditingPlan(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-bengali flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#7A1735]" />
                <span>{editingPlan.nameBn} প্যাকেজ সেটিংস সম্পাদন করুন</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                প্যাকেজের মূল্য, মেয়াদ, সুবিধা ও স্ট্যাটাস পরিবর্তন করুন
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্যাকেজ নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.nameBn}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameBn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.nameEn}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্লাগ / কোড (Slug)</label>
                  <input
                    type="text"
                    value={editingPlan.slug}
                    onChange={(e) => setEditingPlan({ ...editingPlan, slug: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ব্যাজ লেবেল (Badge)</label>
                  <input
                    type="text"
                    value={editingPlan.badgeEn || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badgeEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.priceBdt}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceBdt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আসল মূল্য / পূর্বের মূল্য (BDT)</label>
                  <input
                    type="number"
                    value={editingPlan.originalPriceBdt}
                    onChange={(e) => setEditingPlan({ ...editingPlan, originalPriceBdt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মেয়াদ (দিন) *</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.durationDays}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সার্চ লিমিট</label>
                  <input
                    type="number"
                    value={editingPlan.searchLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, searchLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আগ্রহ প্রকাশের লিমিট *</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.interestLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, interestLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নম্বর আনলক লিমিট *</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.biodataAccessLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, biodataAccessLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7A1735]"
                  />
                </div>
              </div>

              {/* Features List Section */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">প্যাকেজের প্রধান সুবিধাসমূহ (Features List):</label>
                <div className="space-y-1.5">
                  {(editingPlan.featuresList || []).map((feat: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      <span className="text-slate-700">{feat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...editingPlan.featuresList];
                          updated.splice(index, 1);
                          setEditingPlan({ ...editingPlan, featuresList: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="নতুন সুবিধা যোগ করুন..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newFeatureText.trim()) return;
                      setEditingPlan({ ...editingPlan, featuresList: [...(editingPlan.featuresList || []), newFeatureText.trim()] });
                      setNewFeatureText('');
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-lg"
                  >
                    যোগ
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPlan.directChatAllowed}
                    onChange={(e) => setEditingPlan({ ...editingPlan, directChatAllowed: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>সরাসরি চ্যাট অনুমতি</span>
                </label>

                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPlan.directCallAllowed}
                    onChange={(e) => setEditingPlan({ ...editingPlan, directCallAllowed: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>অডিও/ভিডিও কল অনুমতি</span>
                </label>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>প্যাকেজটি সক্রিয় রাখুন</span>
                </label>

                <label className="flex items-center space-x-2 font-bold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7A1735]"
                  />
                  <span>জনপ্রিয় ব্যাজ প্রদর্শন</span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleDeletePlan(editingPlan.id)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>প্যাকেজটি মুছুন</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-[#7A1735] hover:bg-[#601027] text-white font-bold rounded-xl shadow-md"
                  >
                    {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
