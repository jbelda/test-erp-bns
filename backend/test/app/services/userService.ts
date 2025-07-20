import admin from '../firebaseAdmin';
import { User, UserWithCompany } from '../types/firestore';

const db = admin.firestore();
const usersCollection = db.collection('users');
const companiesCollection = db.collection('companies');

export const userService = {
  async getAllWithCompany(): Promise<UserWithCompany[]> {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    
    // Get company data for each user
    const usersWithCompany = await Promise.all(
      users.map(async (user) => {
        if (user.companyId) {
          const companyDoc = await companiesCollection.doc(user.companyId).get();
          const company = companyDoc.exists ? { id: companyDoc.id, ...companyDoc.data() } as any : undefined;
          return { ...user, company };
        }
        return { ...user, company: undefined };
      })
    );
    
    return usersWithCompany;
  },

  async getByCompanyId(companyId: string): Promise<User[]> {
    const snapshot = await usersCollection.where('companyId', '==', companyId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<string> {
    const now = new Date();
    const docRef = await usersCollection.add({
      ...data,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    });
    return docRef.id;
  },
}; 