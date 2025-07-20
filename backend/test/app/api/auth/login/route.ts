import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/userService';
import { authService } from '../../../services/authService';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
      );
    }

    // In a real app, you would verify the password against a hashed version
    // For now, we'll just check if the user exists
    const users = await userService.getAllWithCompany();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
      );
    }

    // In a real app, you would verify the password here
    // For demo purposes, we'll accept any password
    if (password !== 'demo123') {
      return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
      );
    }

    const token = authService.generateToken(user);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
    );
  }
}