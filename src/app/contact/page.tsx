'use client';

import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dark font-bengali">যোগাযোগ ও সহায়তা (Contact Us)</h1>
        <p className="text-xs text-dark-muted">আমাদের কাস্টমার কেয়ার টিম সবসময় আপনার সহায়তায় প্রস্তুত</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-dark font-bengali">সরাসরি যোগাযোগ কেন্দ্র</h3>
          <div className="flex items-center space-x-3 text-dark">
            <Phone className="w-4 h-4 text-maroon-700" />
            <span>+880 1700-123456 (সকাল ১০টা - রাত ৮টা)</span>
          </div>
          <div className="flex items-center space-x-3 text-dark">
            <Mail className="w-4 h-4 text-maroon-700" />
            <span>support@amarbondhon.com</span>
          </div>
          <div className="flex items-center space-x-3 text-dark">
            <MapPin className="w-4 h-4 text-maroon-700" />
            <span>গুলশান-১, ঢাকা-১২১২, বাংলাদেশ</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-dark font-bengali">বার্তা পাঠান</h3>
          <form className="space-y-3 text-xs" onSubmit={(e) => { e.preventDefault(); alert('আপনার বার্তা সফলভাবে পাঠানো হয়েছে।'); }}>
            <input type="text" required placeholder="আপনার নাম" className="w-full bg-ivory-100 border p-2.5 rounded-xl" />
            <input type="email" required placeholder="ইমেইল বা ফোন" className="w-full bg-ivory-100 border p-2.5 rounded-xl" />
            <textarea rows={3} required placeholder="আপনার জিজ্ঞাসা লিখুন..." className="w-full bg-ivory-100 border p-2.5 rounded-xl" />
            <button type="submit" className="w-full bg-maroon-800 text-white font-bold py-2.5 rounded-xl">
              বার্তা পাঠান
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
