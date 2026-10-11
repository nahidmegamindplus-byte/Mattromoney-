import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-xs text-dark leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-dark">শর্তাবলী (Terms & Conditions)</h1>
      <p className="text-dark-muted">কার্যকর: ২০২৬</p>

      <div className="bg-white p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-maroon-800">১. আইনি যোগ্যতা ও বাল্যবিয়ে নিষেধ</h3>
        <p>
          বাংলাদেশ বাল্যবিয়ে নিরোধ আইন ২০১৭ অনুযায়ী, পাত্রের সর্বনিম্ন বয়স ২১ এবং পাত্রীর সর্বনিম্ন বয়স ১৮ হতে হবে। এই বয়সের নিচে কোনো প্রোফাইল খোলা কঠোরভাবে নিষিদ্ধ।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">২. তথ্যের সততা</h3>
        <p>
          ব্যবহারকারীকে অবশ্যই সত্য ও নির্ভুল শিক্ষাগত ও পারিবারিক তথ্য প্রদান করতে হবে। জালিয়াতি বা ভুয়া তথ্য পাওয়া গেলে সাথে সাথে একাউন্ট বাতিল করা হবে।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">৩. মেম্বারশিপ ও পেমেন্ট</h3>
        <p>
          প্রিমিয়াম মেম্বারশিপ সুবিধা এককালীন পরিশোধযোগ্য। যথাযথ পেমেন্ট যাচাইকরণের পরই শুধুমাত্র মেম্বারশিপ কার্যকর হয়।
        </p>
      </div>
    </div>
  );
}
