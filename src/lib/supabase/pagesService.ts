import { supabase } from './client';
import type { BioPage } from '../../types/bio';

const TABLE = 'aurabio_pages';

export const pagesService = {
  async getAllPages(): Promise<BioPage[]> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*');
      if (error || !data) return [];
      
      return data.map((row: any): BioPage => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        avatarUrl: row.avatar_url || '',
        avatarZoom: Number(row.avatar_zoom) || 1,
        avatarPosition: row.avatar_position || { x: 50, y: 50 },
        verified: Boolean(row.verified),
        badgeColor: row.badge_color || '#dc2626',
        bio: row.bio || '',
        layout: row.layout || 'creator-portrait',
        theme: row.theme || 'cinema-noir',
        language: row.language || 'pt',
        customColors: row.custom_colors || {
          bgColor: '#000000',
          textColor: '#ffffff',
          secondaryTextColor: '#a3a3a3',
          cardBgColor: '#0a0a0a',
          accentColor: '#e11d2e',
        },
        hideBranding: Boolean(row.hide_branding),
        links: row.links || [],
        socialLinks: row.social_links || [],
        tracking: row.tracking || {},
        stats: row.stats || { views: 0, ctaClicks: 0, clicks: {} },
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('[aurabio] Error fetching pages from Supabase:', err);
      return [];
    }
  },

  async getPageBySlug(slug: string): Promise<BioPage | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) return null;
      
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        avatarUrl: data.avatar_url || '',
        avatarZoom: Number(data.avatar_zoom) || 1,
        avatarPosition: data.avatar_position || { x: 50, y: 50 },
        verified: Boolean(data.verified),
        badgeColor: data.badge_color || '#dc2626',
        bio: data.bio || '',
        layout: data.layout || 'creator-portrait',
        theme: data.theme || 'cinema-noir',
        language: data.language || 'pt',
        customColors: data.custom_colors,
        hideBranding: Boolean(data.hide_branding),
        links: data.links || [],
        socialLinks: data.social_links || [],
        tracking: data.tracking || {},
        stats: data.stats || { views: 0, ctaClicks: 0, clicks: {} },
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.warn('[aurabio] Error fetching page by slug:', err);
      return null;
    }
  },

  async upsertPage(page: BioPage, userEmail?: string): Promise<boolean> {
    try {
      const payload: any = {
        id: page.id,
        slug: page.slug,
        name: page.name,
        avatar_url: page.avatarUrl,
        avatar_zoom: page.avatarZoom || 1,
        avatar_position: page.avatarPosition || { x: 50, y: 50 },
        verified: page.verified,
        badge_color: page.badgeColor || '#dc2626',
        bio: page.bio,
        layout: page.layout,
        theme: page.theme,
        language: page.language,
        custom_colors: page.customColors,
        hide_branding: page.hideBranding,
        links: page.links,
        social_links: page.socialLinks,
        tracking: page.tracking,
        stats: page.stats,
        updated_at: new Date().toISOString(),
      };

      if (userEmail) {
        payload.user_email = userEmail;
      }

      const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('[aurabio] Supabase upsert error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[aurabio] Exception upserting page:', err);
      return false;
    }
  },

  async deletePage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('[aurabio] Exception deleting page:', err);
      return false;
    }
  }
};
