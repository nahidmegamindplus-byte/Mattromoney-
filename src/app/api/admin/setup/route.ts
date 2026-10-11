import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const adminPassword = await bcrypt.hash('Admin@123456', 10);

    // 1. Ensure Membership Plans
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
          'ব্যক্তিগত পছন্দ অনুযায়ী কাস্টম আনলক সুবিধা',
          'সরাসরি চ্যাট ও কল পারমিশন',
          'বিশেষ ঘটক ও প্রাতিষ্ঠানিক সহায়তা',
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

    // 2. Ensure Payment Methods
    const paymentMethods = [
      {
        provider: 'BKASH',
        displayNameEn: 'bKash Send Money',
        displayNameBn: 'বিকাশ সেন্ড মানি',
        accountNumber: '01700-123456',
        maskedAccountNumber: '01700-***456',
        accountType: 'PERSONAL_RETAIL',
        instructionsEn: 'Send Money to personal bKash number and submit TrxID',
        instructionsBn: 'বিকাশ পার্সোনাল নম্বরে সেন্ড মানি করে TrxID সাবমিট করুন',
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
        instructionsEn: 'Send Money to personal Nagad number and submit TrxID',
        instructionsBn: 'নগদ পার্সোনাল নম্বরে সেন্ড মানি করে TrxID সাবমিট করুন',
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

    // 3. Ensure Super Admin Account
    const adminUser = await prisma.user.upsert({
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

    const plansCount = await prisma.membershipPlan.count();
    const pmCount = await prisma.paymentMethodConfig.count();

    return NextResponse.json({
      success: true,
      message: 'ম্যাট্রিমনি ডাটাবেজ সফলভাবে রেডি করা হয়েছে।',
      environment: process.env.NODE_ENV,
      status: 'HEALTHY',
      plansCount,
      paymentMethodsCount: pmCount,
      adminEmail: adminUser.email,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'ডাটাবেজ সংযোগে সমস্যা: ' + err.message,
        hint: 'Please check DATABASE_URL in Vercel Environment Variables.',
      },
      { status: 500 }
    );
  }
}
