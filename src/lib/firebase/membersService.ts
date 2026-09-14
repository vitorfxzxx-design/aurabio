import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './client';
import type { MasterMember } from '../../types/bio';

const COLLECTION = 'aurabio_members';

export const firebaseMembersService = {
  async getAllMembers(): Promise<MasterMember[]> {
    try {
      const colRef = collection(db, COLLECTION);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnap): MasterMember => {
        const row = docSnap.data();
        return {
          id: row.id || docSnap.id,
          email: row.email || '',
          name: row.name || '',
          slug: row.slug || '',
          password: row.password || '',
          status: (row.status as 'active' | 'suspended') || 'active',
          plan: row.plan || 'Aura Pro V.I.P',
          createdAt: row.createdAt ? new Date(row.createdAt).toLocaleDateString('pt-BR') : '',
          visits: row.visits || 0,
          clicks: row.clicks || 0,
        };
      });
    } catch (err) {
      console.warn('[aurabio:firebase] Error fetching members:', err);
      return [];
    }
  },

  async upsertMember(member: MasterMember): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, member.id);
      const dataToSave: Record<string, any> = {
        id: member.id,
        email: member.email,
        name: member.name,
        slug: member.slug,
        status: member.status,
        plan: member.plan,
        visits: member.visits || 0,
        clicks: member.clicks || 0,
        updatedAt: new Date().toISOString(),
      };

      if (member.password !== undefined) {
        dataToSave.password = member.password;
      }

      await setDoc(docRef, dataToSave, { merge: true });

      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error saving member:', err);
      return false;
    }
  },

  async deleteMember(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error deleting member:', err);
      return false;
    }
  }
};
