export interface Company {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the company
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  companyId?: string; // Only for employees, null for admins
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface UserWithCompany extends User {
  company?: Company;
}

export type CompanyODT = Pick<Company, 'id' | 'name' | 'address' | 'email' | 'phone'>;