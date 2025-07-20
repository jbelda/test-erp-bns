import { JWTPayload } from '../services/authService';

export const devHelpers = {
  // Simulate different user types for development/testing
  simulateUser(role: 'admin' | 'employee', companyId?: string): JWTPayload {
    if (role === 'admin') {
      return {
        userId: 'dev-admin-id',
        email: 'admin@example.com',
        role: 'admin',
        companyId: undefined,
      };
    } else {
      return {
        userId: 'dev-employee-id',
        email: 'employee@example.com',
        role: 'employee',
        companyId: companyId || 'dev-company-id',
      };
    }
  },

  // Generate headers for development requests
  getDevHeaders(role: 'admin' | 'employee' = 'admin', companyId?: string) {
    const headers: Record<string, string> = {
      'X-Dev-Admin': 'true',
    };

    if (role === 'employee' && companyId) {
      headers['X-Dev-Company-Id'] = companyId;
    }

    return headers;
  },

  // Check if we're in development mode
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  },
}; 