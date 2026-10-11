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
        badgeEn: 'Basic',
        priceBdt: 0,
        originalPriceBdt: 0,
        durationDays: 30,
        isPopular: false,
        isActive: true,
        searchLimit: 30,
        interestLimit: 3,
        biodataAccessLimit: 1,
        directChatAllowed: false,
        directCallAllowed: false,
        featuresJson: JSON.stringify([
          'বায়োডাটা তৈরি ও প্রকাশ সম্পূর্ণ ফ্রি',
          'যাচাইকৃত সকল পাত্র-পাত্রীর বায়োডাটা সার্চ',
          '৩টি বায়োডাটাতে আগ্রহ প্রকাশের সুযোগ',
          '১টি অভিভাবকের নম্বর দেখার সুযোগ',
          'সাধারণ সার্চ ফিল্টার ব্যবহার',
        ]),
        displayOrder: 1,
      },
      {
        slug: 'SILVER',
        nameEn: 'Silver Match',
        nameBn: 'সিলভার প্যাকেজ',
        badgeEn: 'Popular',
        priceBdt: 950,
        originalPriceBdt: 1200,
        durationDays: 30,
        isPopular: false,
        isActive: true,
        searchLimit: 150,
        interestLimit: 25,
        biodataAccessLimit: 10,
        directChatAllowed: true,
        directCallAllowed: false,
        featuresJson: JSON.stringify([
          'ফ্রি প্যাকেজের সকল সুবিধা',
          '২৫টি বায়োডাটাতে আগ্রহ প্রকাশ',
          '১০টি অভিভাবকের সরাসরি মোবাইল নম্বর আনলক',
          'সরাসরি চ্যাট মেসেজিং সুবিধা',
          'ছবির গোপনীয়তা নিয়ন্ত্রণ',
          'অগ্রাধিকার ভিত্তিক প্রোফাইল প্রদর্শন',
        ]),
        displayOrder: 2,
      },
      {
        slug: 'GOLD',
        nameEn: 'Gold Premium',
        nameBn: 'গোল্ড প্যাকেজ',
        badgeEn: 'Recommended',
        priceBdt: 1850,
        originalPriceBdt: 2500,
        durationDays: 90,
        isPopular: true,
        isActive: true,
        searchLimit: 500,
        interestLimit: 75,
        biodataAccessLimit: 35,
        directChatAllowed: true,
        directCallAllowed: true,
        featuresJson: JSON.stringify([
          'মেয়াদ ৩ মাস (৯০ দিন)',
          '৭৫টি বায়োডাটাতে আগ্রহ প্রকাশ',
          '৩৫টি অভিভাবকের যাচাইকৃত মোবাইল নম্বর',
          'সরাসরি চ্যাট ও অডিও/ভিডিও কল সুবিধা',
          'সার্চ রেজাল্টে সবার উপরে প্রদর্শন',
          'স্পেশাল ভেরিফিকেশন ব্যাজ',
        ]),
        displayOrder: 3,
      },
      {
        slug: 'PLATINUM',
        nameEn: 'Platinum Royal',
        nameBn: 'প্লাটিনাম রয়্যাল',
        badgeEn: 'VIP',
        priceBdt: 3450,
        originalPriceBdt: 4800,
        durationDays: 180,
        isPopular: false,
        isActive: true,
        searchLimit: 2000,
        interestLimit: 200,
        biodataAccessLimit: 100,
        directChatAllowed: true,
        directCallAllowed: true,
        featuresJson: JSON.stringify([
          'মেয়াদ ৬ মাস (১৮০ দিন)',
          '২০০টি বায়োডাটাতে আগ্রহ প্রকাশ',
          '১০০টি অভিভাবকের মোবাইল নম্বর আনলক',
          'আনলিমিটেড অডিও ও ভিডিও কল সুবিধা',
          'ডেডিকেটেড ঘটক ও সাপোর্ট টিম',
          'সর্বোচ্চ ভিআইপি প্রোফাইল স্ট্যাটাস',
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
