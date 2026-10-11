'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Edit3, Check, X, CreditCard, Save } from 'lucide-react';

export default function PaymentMethodsSettingsPage() {
  const { lang } = useLanguage();
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments/methods');
      const data = await res.json();
      if (data.success) {
        setMethods(data.paymentMethods);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;

    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/payments/methods', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMethod),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('পেমেন্ট একাউন্ট কনফিগারেশন সফলভাবে আপডেট হয়েছে!');
        setEditingMethod(null);
        fetchMethods();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error updating payment method');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark font-bengali">
          পেমেন্ট মাধ্যম কনফিগারেশন (Payment Methods Settings)
        </h1>
        <p className="text-xs text-dark-muted">
          বিকাশ, নগদ ও রকেটের প্রাপক একাউন্ট নম্বর, ধরণ ও নির্দেশিকা পরিচালনা করুন
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {methods.map((pm) => (
          <div
            key={pm.id}
            className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between space-y-4 ${
              pm.isEnabled ? 'border-gold-400/40' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold bg-maroon-100 text-maroon-800 px-2.5 py-0.5 rounded-full">
                  {pm.provider}
                </span>
                {pm.isDefault && (
                  <span className="text-[10px] bg-gold-400 text-maroon-950 font-bold px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-dark font-bengali">{pm.displayNameBn}</h3>
              <p className="text-xs text-dark-muted">{pm.displayNameEn}</p>

              <div className="bg-ivory-100 p-3 rounded-xl border border-gold-400/20 text-xs space-y-1">
                <div>
                  <span className="text-dark-muted block text-[10px]">প্রাপক একাউন্ট (Masked):</span>
                  <span className="font-mono font-bold text-maroon-900">{pm.maskedAccountNumber}</span>
                </div>
                <div>
                  <span className="text-dark-muted block text-[10px]">একাউন্ট টাইপ:</span>
                  <span className="font-semibold text-dark">{pm.accountType}</span>
                </div>
                <div>
                  <span className="text-dark-muted block text-[10px]">লেনদেন লিমিট:</span>
                  <span className="font-semibold text-dark">৳{pm.minAmountBdt} - ৳{pm.maxAmountBdt}</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setEditingMethod(pm)}
                className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>একাউন্ট সেটিংস পরিবর্তন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMethod && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-gold-400 space-y-5">
            <button
              onClick={() => setEditingMethod(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-dark rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-dark font-bengali">
                {editingMethod.displayNameBn} সেটিংস সম্পাদনা
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">প্রাপক অ্যাকাউন্ট নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={editingMethod.accountNumber}
                    onChange={(e) => setEditingMethod({ ...editingMethod, accountNumber: e.target.value })}
                    className="w-full bg-ivory-100 border p-2 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">একাউন্ট ধরণ (Account Type) *</label>
                  <select
                    value={editingMethod.accountType}
                    onChange={(e) => setEditingMethod({ ...editingMethod, accountType: e.target.value })}
                    className="w-full bg-ivory-100 border p-2 rounded-lg font-medium"
                  >
                    <option value="PERSONAL">Personal</option>
                    <option value="PERSONAL_RETAIL">Personal Retail Account (PRA)</option>
                    <option value="MERCHANT">Merchant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ডিসপ্লে নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={editingMethod.displayNameBn}
                    onChange={(e) => setEditingMethod({ ...editingMethod, displayNameBn: e.target.value })}
                    className="w-full bg-ivory-100 border p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ডিসপ্লে নাম (English)</label>
                  <input
                    type="text"
                    value={editingMethod.displayNameEn}
                    onChange={(e) => setEditingMethod({ ...editingMethod, displayNameEn: e.target.value })}
                    className="w-full bg-ivory-100 border p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">পেমেন্ট নির্দেশিকা (বাংলা) *</label>
                <textarea
                  rows={4}
                  required
                  value={editingMethod.instructionsBn}
                  onChange={(e) => setEditingMethod({ ...editingMethod, instructionsBn: e.target.value })}
                  className="w-full bg-ivory-100 border p-2 rounded-lg font-bengali"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingMethod.isEnabled}
                    onChange={(e) => setEditingMethod({ ...editingMethod, isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-maroon-700"
                  />
                  <span>সক্রিয় রাখুন (Enabled)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingMethod.isDefault}
                    onChange={(e) => setEditingMethod({ ...editingMethod, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-maroon-700"
                  />
                  <span>ডিফল্ট মাধ্যম হিসেবে সেট করুন</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingMethod(null)}
                  className="px-4 py-2 border rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-maroon-800 text-white font-bold rounded-xl"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
