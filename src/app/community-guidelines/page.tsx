import React from 'react';

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-xs text-dark leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-dark">কমিউনিটি নীতিমালা (Community Guidelines)</h1>

      <div className="bg-white p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-maroon-800">১. পারস্পরিক সম্মান ও শালীনতা</h3>
        <p>
          সকল সদস্যকে কথাবার্তা ও চ্যাটিংয়ে শালীনতা ও ইসলামী শিষ্টাচার বজায় রাখতে হবে। কোনো ধরনের কটূক্তি বা অভদ্র আচরণ বরদাশত করা হবে না।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">২. আর্থিক লেনদেন নিষেধ</h3>
        <p>
          প্ল্যাটফর্মের কোনো সদস্যের সাথে ব্যক্তিগত আর্থিক ধারদেনা বা ব্যবসায়িক লেনদেন করা কঠোরভাবে নিষিদ্ধ।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">৩. হয়রানি ও ব্লক নীতি</h3>
        <p>
          কোনো প্রার্থী আগ্রহ প্রত্যাখ্যান করলে তাকে বারবার বার্তা পাঠানো বা অযথা বিরক্ত করা যাবে না। যেকোনো অপব্যবহার অবিলম্বে রিপোর্ট করা যাবে।
        </p>
      </div>
    </div>
  );
}
