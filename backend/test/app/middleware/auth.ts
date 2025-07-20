import { NextRequest, NextResponse } from 'next/server';
import { authService, JWTPayload } from '../services/authService';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function authenticate(request: NextRequest): { user: JWTPayload | null; error?: string } {
  // Verificar simulación de admin en desarrollo
  const isDevAdmin = request.headers.get('X-Dev-Admin') === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Auto-simular admin en desarrollo o cuando el header X-Dev-Admin está presente
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

  // Autenticación JWT normal
  const authHeader = request.headers.get('authorization');
  const token = authService.extractTokenFromHeader(authHeader);

  if (!token) {
    return { user: null, error: 'No se proporcionó token' };
  }

  const user = authService.verifyToken(token);
  if (!user) {
    return { user: null, error: 'Token inválido' };
  }

  return { user };
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const { user, error } = authenticate(request);

  if (!user) {
    return NextResponse.json(
        { error: error || 'Autenticación requerida' },
        { status: 401 }
    );
  }

  return null; // Continuar al siguiente handler
}

export function requireRole(role: 'admin' | 'employee') {
  return function(request: NextRequest): NextResponse | null {
    const { user, error } = authenticate(request);

    if (!user) {
      return NextResponse.json(
          { error: error || 'Autenticación requerida' },
          { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
          { error: 'Permisos insuficientes' },
          { status: 403 }
      );
    }

    return null; // Continuar al siguiente handler
  };
}