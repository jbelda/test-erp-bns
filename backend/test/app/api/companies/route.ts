import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '../../services/companyService';
import { CompanyODT } from '../../types/firestore';
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

    // Only admins can see all companies
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const companies = await companyService.getAll();
    
    const mapToCompanyODT = (company: any): CompanyODT => ({
      id: company.id,
      name: company.name,
      address: company.address,
      email: company.email,
      phone: company.phone
    });
    
    const companiesODT = companies.map(mapToCompanyODT);
    
    return NextResponse.json(companiesODT);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
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

    // Only admins can create companies
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, address, phone, email } = body;

    if (!name || !address || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const companyId = await companyService.create({
      name,
      address,
      phone,
      email,
      createdBy: user.userId,
    });

    return NextResponse.json({ id: companyId }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
} 