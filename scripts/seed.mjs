import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing AmarBondhon Matrimony clean production database ---');

  const adminPassword = await bcrypt.hash('Admin@123456', 10);

  // 1. Seed Membership Plans (Exact Deenpuron packages)
  const plans = [
    {
      slug: 'FREE',
      nameEn: 'Free Starter',
      nameBn: 'ফ্রি প্যাকেজ',
      badgeEn: 'Free',
      priceBdt: 0,
      originalPriceBdt: 0,
      durationDays: 30,
      isPopular: false,
      isActive: true,
      searchLimit: 50,
      interestLimit: 5,
      biodataAccessLimit: 1,
      directChatAllowed: false,
      directCallAllowed: false,
      featuresJson: JSON.stringify([
        'বায়োডাটা তৈরি ও প্রকাশ ১০০% বিনামূল্যে',
        '১টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'সকল যাচাইকৃত পাত্র-পাত্রীর বায়োডাটা সার্চ',
        'পছন্দসই বায়োডাটাতে আগ্রহ প্রকাশের সুযোগ',
      ]),
      displayOrder: 0,
    },
    {
      slug: 'BASIC',
      nameEn: 'Basic Package',
      nameBn: 'বেসিক প্যাকেজ',
      badgeEn: 'Basic',
      priceBdt: 300,
      originalPriceBdt: 360,
      durationDays: 60,
      isPopular: false,
      isActive: true,
      searchLimit: 100,
      interestLimit: 15,
      biodataAccessLimit: 3,
      directChatAllowed: false,
      directCallAllowed: false,
      featuresJson: JSON.stringify([
        '৩টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ৬০ দিন (২ মাস)',
        'আনলিমিটেড বায়োডাটা সার্চ ফিল্টারিং',
        'বায়োডাটাতে পছন্দ ও আগ্রহ প্রকাশের সুযোগ',
        '২৪/৭ কাস্টমার সাপোর্ট সুবিধা',
      ]),
      displayOrder: 1,
    },
    {
      slug: 'STANDARD',
      nameEn: 'Standard Package',
      nameBn: 'স্ট্যান্ডার্ড প্যাকেজ',
      badgeEn: 'Most Popular',
      priceBdt: 550,
      originalPriceBdt: 720,
      durationDays: 120,
      isPopular: true,
      isActive: true,
      searchLimit: 500,
      interestLimit: 35,
      biodataAccessLimit: 6,
      directChatAllowed: true,
      directCallAllowed: false,
      featuresJson: JSON.stringify([
        '৬টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ১২০ দিন (৪ মাস)',
        'আনলিমিটেড বায়োডাটা সার্চ ও ফিল্টারিং',
        'সরাসরি নিরাপদ চ্যাট সুবিধা',
        'অগ্রাধিকার ভিত্তিক ভেরিফিকেশন ও সাপোর্ট',
      ]),
      displayOrder: 2,
    },
    {
      slug: 'PREMIUM',
      nameEn: 'Premium Package',
      nameBn: 'প্রিমিয়াম প্যাকেজ',
      badgeEn: 'Best Value',
      priceBdt: 850,
      originalPriceBdt: 1200,
      durationDays: 180,
      isPopular: false,
      isActive: true,
      searchLimit: 1500,
      interestLimit: 75,
      biodataAccessLimit: 10,
      directChatAllowed: true,
      directCallAllowed: true,
      featuresJson: JSON.stringify([
        '১০টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ১৮০ দিন (৬ মাস)',
        'সরাসরি চ্যাট ও অডিও/ভিডিও কল সুবিধা',
        'সার্চ ফলাফলে প্রোফাইল অগ্রাধিকার ভিত্তিক প্রদর্শন',
        'প্রিমিয়াম ডেডিকেটেড সাপোর্ট ও সহায়তা',
      ]),
      displayOrder: 3,
    },
    {
      slug: 'CUSTOM_VIP',
      nameEn: 'Customized VIP Package',
      nameBn: 'কাস্টমাইজড প্যাকেজ',
      badgeEn: 'VIP',
      priceBdt: 1200,
      originalPriceBdt: 1600,
      durationDays: 90,
      isPopular: false,
      isActive: true,
      searchLimit: 3000,
      interestLimit: 150,
      biodataAccessLimit: 15,
      directChatAllowed: true,
      directCallAllowed: true,
      featuresJson: JSON.stringify([
        '১৫টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ৯০ দিন (৩ মাস)',
        'সরাসরি চ্যাট ও কল সুবিধা',
        'বিশেষায়িত ঘটক ও পারিবারিক মধ্যস্থতাকারী সাপোর্ট',
        'প্রোফাইল ম্যানুয়াল ভেরিফিকেশন ও ভিআইপি রিকমেন্ডেশন',
      ]),
      displayOrder: 4,
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log('✓ Seeded official membership plans');

  // 2. Seed Configured Payment Methods
  const paymentMethods = [
    {
      provider: 'BKASH',
      displayNameEn: 'bKash Send Money',
      displayNameBn: 'বিকাশ সেন্ড মানি',
      accountNumber: '01700-123456',
      maskedAccountNumber: '01700-***456',
      accountType: 'PERSONAL_RETAIL',
      instructionsEn: '1. Go to your bKash Mobile App or dial *247#\n2. Select "Send Money"\n3. Enter Receiving Account Number: 01700-123456\n4. Enter exact amount for your chosen plan\n5. Enter Reference: Your Order Number (e.g. AB-ORD-xxxx)\n6. Enter PIN to confirm\n7. Save the Transaction ID (TrxID) and submit it below.',
      instructionsBn: '১. আপনার বিকাশ অ্যাপ ওপেন করুন অথবা *247# ডায়াল করুন\n২. "Send Money" নির্বাচন করুন\n৩. প্রাপক নম্বর দিন: 01700-123456\n৪. আপনার নির্বাচিত প্ল্যানের সঠিক টাকা দিন\n৫. রেফারেন্স হিসেবে আপনার অর্ডার নম্বর দিন (যেমন: AB-ORD-xxxx)\n৬. আপনার পিন দিয়ে সেন্ড মানি সম্পন্ন করুন\n৭. ট্রানজেকশন আইডি (TrxID) সংরক্ষণ করে নিচে জমা দিন।',
      transactionType: 'SEND_MONEY',
      referenceFormat: 'AB-ORD-XXXXXX',
      minAmountBdt: 100,
      maxAmountBdt: 25000,
      isEnabled: true,
      isDefault: true,
      requiresManualReview: true,
    },
    {
      provider: 'NAGAD',
      displayNameEn: 'Nagad Send Money',
      displayNameBn: 'নগদ সেন্ড মানি',
      accountNumber: '01800-654321',
      maskedAccountNumber: '01800-***321',
      accountType: 'PERSONAL',
      instructionsEn: '1. Open Nagad App or dial *167#\n2. Select "Send Money"\n3. Enter Receiving Account Number: 01800-654321\n4. Enter the exact payment amount\n5. Enter Reference: Your Order Number\n6. Enter PIN to confirm\n7. Copy the TrxID and submit here.',
      instructionsBn: '১. নগদ অ্যাপ খুলুন বা *167# ডায়াল করুন\n২. "Send Money" অপশন সিলেক্ট করুন\n৩. প্রাপক নম্বর দিন: 01800-654321\n৪. সঠিক টাকার পরিমাণ লিখুন\n৫. রেফারেন্স ঘরে আপনার অর্ডার আইডি লিখুন\n৬. পিন দিয়ে কনফার্ম করুন\n৭. ট্রানজেকশন আইডি কপি করে জমা দিন।',
      transactionType: 'SEND_MONEY',
      referenceFormat: 'AB-ORD-XXXXXX',
      minAmountBdt: 100,
      maxAmountBdt: 25000,
      isEnabled: true,
      isDefault: false,
      requiresManualReview: true,
    },
    {
      provider: 'ROCKET',
      displayNameEn: 'Rocket Transfer',
      displayNameBn: 'রকেট পার্সোনাল ট্রান্সফার',
      accountNumber: '01900-789012-4',
      maskedAccountNumber: '01900-***012-4',
      accountType: 'PERSONAL',
      instructionsEn: '1. Dial *322# or open Rocket App\n2. Select Send Money\n3. Enter Account Number: 01900-789012-4\n4. Enter the plan amount & Order Reference\n5. Complete transaction and note down the TxnId.',
      instructionsBn: '১. রকেট অ্যাপ খুলুন বা *322# চাপুন\n২. Send Money নির্বাচন করুন\n৩. অ্যাকাউন্ট নম্বর দিন: 01900-789012-4\n৪. টাকার পরিমাণ ও রেফারেন্স নম্বর দিন\n৫. লেনদেন সম্পন্ন করে ট্রানজেকশন আইডি নোট করুন।',
      transactionType: 'SEND_MONEY',
      referenceFormat: 'AB-ORD-XXXXXX',
      minAmountBdt: 100,
      maxAmountBdt: 25000,
      isEnabled: true,
      isDefault: false,
      requiresManualReview: true,
    },
  ];

  for (const pm of paymentMethods) {
    const existing = await prisma.paymentMethodConfig.findFirst({
      where: { provider: pm.provider },
    });
    if (!existing) {
      await prisma.paymentMethodConfig.create({ data: pm });
    }
  }
  console.log('✓ Seeded official payment methods');

  // 3. Seed Administrative Staff Users (Necessary to operate and manage the platform)
  await prisma.user.upsert({
    where: { email: 'admin@amarbondhon.com' },
    update: {},
    create: {
      email: 'admin@amarbondhon.com',
      phone: '01710000001',
      name: 'Super Admin',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'finance@amarbondhon.com' },
    update: {},
    create: {
      email: 'finance@amarbondhon.com',
      phone: '01710000002',
      name: 'Finance Controller',
      passwordHash: adminPassword,
      role: 'FINANCE_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'moderator@amarbondhon.com' },
    update: {},
    create: {
      email: 'moderator@amarbondhon.com',
      phone: '01710000003',
      name: 'Content Moderator',
      passwordHash: adminPassword,
      role: 'MODERATOR',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });
  console.log('✓ Seeded platform administration accounts');

  // 4. Seed CMS content (Guidelines & Policies)
  const cmsItems = [
    {
      key: 'safety_guidelines',
      titleEn: 'Safe Matrimony Guidelines',
      titleBn: 'নিরাপদ পাত্র-পাত্রী নির্বাচনের নির্দেশিকা',
      contentEn: '1. Never share confidential financial or OTP details.\n2. Always involve guardians and respectable family members during communication.\n3. Verify educational certificates and national identity credentials.\n4. Meet in public or family presence for initial discussions.',
      contentBn: '১. কোনো অবস্থাতেই গোপন আর্থিক পিন বা ওটিপি কারো সাথে শেয়ার করবেন না।\n২. যোগাযোগের প্রতিটি ধাপে অভিভাবক ও মুরুব্বিদের সম্পৃক্ত রাখুন।\n৩. শিক্ষাগত ও কর্মক্ষেত্রের তথ্য নিজ দায়িত্বে যাচাই করে নিন।\n৪. প্রাথমিক সাক্ষাতের জন্য পারিবারিক বা প্রকাশ্য স্থান বেছে নিন।',
    },
    {
      key: 'how_it_works',
      titleEn: 'How AmarBondhon Works',
      titleBn: 'আমারবন্ধন কীভাবে কাজ করে',
      contentEn: 'Step 1: Register and create your 100% free verified biodata.\nStep 2: Filter profiles according to religious, educational, and district preferences.\nStep 3: Send interest requests or request guardian contact permissions.\nStep 4: Communicate securely with verified life partner candidates.',
      contentBn: 'ধাপ ১: ফ্রিতে নিবন্ধন করে আপনার সম্পূর্ণ ও ভেরিফাইড বায়োডাটা তৈরি করুন।\nধাপ ২: জেলা, শিক্ষাগত যোগ্যতা ও ধর্মীয় পছন্দ অনুযায়ী পাত্র-পাত্রী খুঁজুন।\nধাপ ৩: আগ্রহ প্রকাশ করুন অথবা সরাসরি অভিভাবকের যোগাযোগ তথ্যের অনুরোধ পাঠান।\nধাপ ৪: উভয় পক্ষের সম্মতিক্রমে নিরাপদ ও সম্মানজনক আলাপচারিতার মাধ্যমে চূড়ান্ত সিদ্ধান্ত নিন।',
    },
  ];

  for (const cms of cmsItems) {
    await prisma.cmsContent.upsert({
      where: { key: cms.key },
      update: cms,
      create: cms,
    });
  }
  console.log('✓ Seeded platform CMS guidelines');
  console.log('Clean database setup complete - NO demo profiles or candidate data exist.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
