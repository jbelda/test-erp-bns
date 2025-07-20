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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { user, error } = authenticate(request);

    if (!user) {
      const response = NextResponse.json(
          { error: error || 'Autenticación requerida' },
          { status: 401 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    // Solo los administradores pueden ver todas las empresas
    if (user.role !== 'admin') {
      const response = NextResponse.json(
          { error: 'Permisos insuficientes' },
          { status: 403 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
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

    const response = NextResponse.json(companiesODT);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    const response = NextResponse.json(
        { error: 'Error al obtener empresas' },
        { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = authenticate(request);

    if (!user) {
      const response = NextResponse.json(
          { error: error || 'Autenticación requerida' },
          { status: 401 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    // Solo los administradores pueden crear empresas
    if (user.role !== 'admin') {
      const response = NextResponse.json(
          { error: 'Permisos insuficientes' },
          { status: 403 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    const body = await request.json();
    const { name, address, phone, email } = body;

    if (!name || !address || !phone || !email) {
      const response = NextResponse.json(
          { error: 'Campos requeridos faltantes' },
          { status: 400 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    const companyId = await companyService.create({
      name,
      address,
      phone,
      email,
      createdBy: user.userId,
    });

    const response = NextResponse.json({ id: companyId }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  } catch (error) {
    console.error('Error al crear empresa:', error);
    const response = NextResponse.json(
        { error: 'Error al crear empresa' },
        { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dev-Admin, X-Dev-Company-Id, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
}