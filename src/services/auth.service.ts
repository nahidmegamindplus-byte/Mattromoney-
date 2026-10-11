import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { AuthSession, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'amarbondhon_jwt_secret_key_2026_bd_matrimony';

export class AuthService {
  /**
   * Enforces legal minimum marriage age according to Bangladeshi law:
   * Male: 21 years
   * Female: 18 years
   */
  static validateMarriageEligibility(gender: string, dob: Date): { isValid: boolean; message?: string } {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (gender.toUpperCase() === 'MALE' && age < 21) {
      return {
        isValid: false,
        message: 'According to Bangladesh Child Marriage Restraint Act, minimum marriage age for males is 21 years.',
      };
    }

    if (gender.toUpperCase() === 'FEMALE' && age < 18) {
      return {
        isValid: false,
        message: 'According to Bangladesh Child Marriage Restraint Act, minimum marriage age for females is 18 years.',
      };
    }

    return { isValid: true };
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(session: AuthSession): string {
    return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): AuthSession | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthSession;
    } catch {
      return null;
    }
  }

  static async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string | Date;
  }) {
    const dob = new Date(data.dateOfBirth);
    const eligibility = this.validateMarriageEligibility(data.gender, dob);
    if (!eligibility.isValid) {
      throw new Error(eligibility.message);
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedPhone = data.phone.trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        throw new Error('An account with this email address already exists.');
      }
      throw new Error('An account with this phone number already exists.');
    }

    const passwordHash = await this.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        role: 'USER',
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    });

    // Assign free starter subscription
    const freePlan = await prisma.membershipPlan.findUnique({ where: { slug: 'FREE' } });
    if (freePlan) {
      const now = new Date();
      const endDate = new Date(now.getTime() + freePlan.durationDays * 24 * 60 * 60 * 1000);
      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          startDate: now,
          endDate,
          status: 'ACTIVE',
          interestsRemaining: freePlan.interestLimit,
          biodataAccessRemaining: freePlan.biodataAccessLimit,
        },
      });
    }

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
    };

    const token = this.generateToken(session);
    return { user, token };
  }

  static async login(identifier: string, password: string) {
    const normalized = identifier.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalized }, { phone: normalized }],
      },
    });

    if (!user) {
      throw new Error('Invalid email/phone or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('This account has been suspended by administration.');
    }

    const passwordValid = await this.comparePassword(password, user.passwordHash);
    if (!passwordValid) {
      throw new Error('Invalid email/phone or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
    };

    const token = this.generateToken(session);
    return { user, token };
  }

  static async getUserFromToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    return prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        biodata: true,
        subscriptions: {
          where: { status: 'ACTIVE', endDate: { gte: new Date() } },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }
}
