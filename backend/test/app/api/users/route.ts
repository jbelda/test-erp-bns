import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../services/userService';
import { authenticate } from '../../middleware/auth';

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

export async function GET(request: NextRequest) {
  try {
    const { user, error } = authenticate(request);

    if (!user) {
      return NextResponse.json(
          { error: error || 'Authentication required' },
          { status: 401 }
      );
    }

    let users;

    if (user.role === 'admin') {
      // Admins can see all users
      users = await userService.getAllWithCompany();
    } else if (user.role === 'employee' && user.companyId) {
      // Employees can only see users from their company
      users = await userService.getByCompanyId(user.companyId);
    } else {
      return NextResponse.json(
          { error: 'Invalid role or missing companyId' },
          { status: 400 }
      );
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = authenticate(request);

    if (!user) {
      return NextResponse.json(
          { error: error || 'Authentication required' },
          { status: 401 }
      );
    }

    // Only admins can create users
    if (user.role !== 'admin') {
      return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, role, companyId } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'employee'].includes(role)) {
      return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
      );
    }

    // Employees must have a companyId
    if (role === 'employee' && !companyId) {
      return NextResponse.json(
          { error: 'Employees must have a companyId' },
          { status: 400 }
      );
    }

    const userId = await userService.create({
      email,
      name,
      role,
      companyId: role === 'employee' ? companyId : undefined,
    });

    return NextResponse.json({ id: userId }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
    );
  }
}