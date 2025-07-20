import { NextRequest, NextResponse } from 'next/server';
import { authService, JWTPayload } from '../services/authService';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function authenticate(request: NextRequest): { user: JWTPayload | null; error?: string } {
  // Check for development admin simulation
  const isDevAdmin = request.headers.get('X-Dev-Admin') === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Auto-simulate admin in development or when X-Dev-Admin header is present
  if (isDevelopment || isDevAdmin) {
    const devCompanyId = request.headers.get('X-Dev-Company-Id');
    const devRole = devCompanyId ? 'employee' : 'admin';

    const simulatedUser: JWTPayload = {
      userId: devRole === 'admin' ? 'dev-admin-id' : 'dev-employee-id',
      email: devRole === 'admin' ? 'admin@example.com' : 'employee@example.com',
      role: devRole,
      companyId: devCompanyId || undefined,
    };
    return { user: simulatedUser };
  }

  // Normal JWT authentication
  const authHeader = request.headers.get('authorization');
  const token = authService.extractTokenFromHeader(authHeader);

  if (!token) {
    return { user: null, error: 'No token provided' };
  }

  const user = authService.verifyToken(token);
  if (!user) {
    return { user: null, error: 'Invalid token' };
  }

  return { user };
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const { user, error } = authenticate(request);

  if (!user) {
    return NextResponse.json(
        { error: error || 'Authentication required' },
        { status: 401 }
    );
  }

  return null; // Continue to the next handler
}

export function requireRole(role: 'admin' | 'employee') {
  return function(request: NextRequest): NextResponse | null {
    const { user, error } = authenticate(request);

    if (!user) {
      return NextResponse.json(
          { error: error || 'Authentication required' },
          { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
      );
    }

    return null; // Continue to the next handler
  };
}