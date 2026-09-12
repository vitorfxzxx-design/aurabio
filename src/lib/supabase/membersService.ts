import { supabase } from './client';
import type { MasterMember } from '../../types/bio';

const TABLE = 'aurabio_members';

export const membersService = {
  async getAllMembers(): Promise<MasterMember[]> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
      if (error || !data) return [];

      return data.map((row: any): MasterMember => ({
        id: row.id,
        email: row.email,
        name: row.name,
        slug: row.slug,
        status: row.status as 'active' | 'suspended',
        plan: row.plan || 'Aura Pro V.I.P',
        createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : '',
        visits: row.visits || 0,
        clicks: row.clicks || 0,
      }));
    } catch (err) {
      console.warn('[aurabio] Error fetching members:', err);
      return [];
    }
  },

  async upsertMember(member: MasterMember): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLE).upsert({
        id: member.id,
        email: member.email,
        name: member.name,
        slug: member.slug,
        status: member.status,
        plan: member.plan,
        visits: member.visits || 0,
        clicks: member.clicks || 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.warn('[aurabio] Error saving member:', err);
      return false;
    }
  },

  async deleteMember(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('[aurabio] Error deleting member:', err);
      return false;
    }
  }
};
