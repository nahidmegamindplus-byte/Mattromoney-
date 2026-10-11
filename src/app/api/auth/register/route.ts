import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, gender, dateOfBirth } = body;

    if (!name || !email || !phone || !password || !gender || !dateOfBirth) {
      return NextResponse.json(
        { success: false, message: 'All registration fields are required.' },
        { status: 400 }
      );
    }

    const { user, token } = await AuthService.register({
      name,
      email,
      phone,
      password,
      gender,
      dateOfBirth,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('amarbondhon_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
