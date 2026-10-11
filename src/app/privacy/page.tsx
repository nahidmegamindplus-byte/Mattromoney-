import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-xs text-dark leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-dark">গোপনীয়তা নীতি (Privacy Policy)</h1>
      <p className="text-dark-muted">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>

      <div className="bg-white p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-maroon-800">১. তথ্যের সংগ্রহ ও ব্যবহার</h3>
        <p>
          আমারবন্ধন প্ল্যাটফর্মে নিবন্ধনের সময় আমরা নাম, ইমেইল, মোবাইল নম্বর, জন্ম তারিখ, শিক্ষাগত ও পেশাগত তথ্যাবলী সংগ্রহ করি। এই তথ্য কেবলমাত্র উপযুক্ত জীবনসঙ্গী খোঁজার উদ্দেশ্যে সংরক্ষিত হয়।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">২. ছবি ও যোগাযোগের গোপনীয়তা</h3>
        <p>
          প্রার্থীর অনুমতি ব্যতিরেকে কোনো ব্যক্তিগত ছবি বা অভিভাবকের ফোন নম্বর সর্বসাধারণের কাছে উন্মুক্ত করা হয় না। অভিভাবকের নম্বর শুধুমাত্র অনুমোদিত প্রিমিয়াম সদস্য দেখতে পারেন।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">৩. আর্থিক তথ্যের নিরাপত্তা</h3>
        <p>
          আমরা কখনোই গ্রাহকদের বিকাশ, নগদ বা রকেটের পিন বা ওটিপি সংগ্রহ করি না। শুধুমাত্র ব্যবহারকারীর প্রদত্ত ট্রানজেকশন আইডি (TrxID) ম্যানুয়াল ভেরিফিকেশনের জন্য সংরক্ষণ করা হয়।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">৪. অ্যাকাউন্ট ডিলিট করার অধিকার</h3>
        <p>
          যেকোনো সময় ব্যবহারকারী তার ড্যাশবোর্ড থেকে স্থায়ীভাবে বায়োডাটা ও ব্যক্তিগত তথ্য মুছে ফেলার আবেদন করতে পারেন।
        </p>
      </div>
    </div>
  );
}
