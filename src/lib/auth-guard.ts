import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { AuthSession, UserRole } from '@/types';

export function getSessionFromRequest(req: NextRequest): AuthSession | null {
  // Check cookie first
  const cookieToken = req.cookies.get('amarbondhon_token')?.value;
  if (cookieToken) {
    const session = AuthService.verifyToken(cookieToken);
    if (session) return session;
  }

  // Fallback to Authorization Header: Bearer <token>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return AuthService.verifyToken(token);
  }

  return null;
}

export function requireAuth(req: NextRequest): { session?: AuthSession; error?: NextResponse } {
  const session = getSessionFromRequest(req);
  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      ),
    };
  }
  return { session };
}

export function requireRole(req: NextRequest, allowedRoles: UserRole[]): { session?: AuthSession; error?: NextResponse } {
  const auth = requireAuth(req);
  if (auth.error) return auth;

  const session = auth.session!;
  if (!allowedRoles.includes(session.role)) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Forbidden. You lack sufficient administrative permissions.' },
        { status: 403 }
      ),
    };
  }

  return { session };
}
