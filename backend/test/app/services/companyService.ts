import admin from '../firebaseAdmin';
import { Company, CompanyODT } from '../types/firestore';

const db = admin.firestore();
const companiesCollection = db.collection('companies');

const mapToCompanyODT = (company: Company): CompanyODT => ({
  id: company.id,
  name: company.name,
  address: company.address,
  email: company.email,
  phone: company.phone
});

export const companyService = {
  async getAll(): Promise<Company[]> {
    const snapshot = await companiesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
  },

  async create(data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await companiesCollection.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Omit<Company, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> {
    const now = new Date();
    await companiesCollection.doc(id).update({
      ...data,
      updatedAt: now,
    });
  },

  async getById(id: string): Promise<Company | null> {
    const doc = await companiesCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as Company;
  },
}; 