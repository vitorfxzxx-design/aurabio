import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc,
  increment,
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './client';
import type { BioPage } from '../../types/bio';

const COLLECTION = 'aurabio_pages';

export const firebasePagesService = {
  async getAllPages(): Promise<BioPage[]> {
    try {
      const colRef = collection(db, COLLECTION);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnap): BioPage => {
        const row = docSnap.data();
        return {
          id: row.id || docSnap.id,
          slug: row.slug || '',
          name: row.name || 'Sem nome',
          avatarUrl: row.avatarUrl || row.avatar_url || '',
          avatarZoom: Number(row.avatarZoom ?? row.avatar_zoom) || 1,
          avatarPosition: row.avatarPosition || row.avatar_position || { x: 50, y: 50 },
          verified: Boolean(row.verified),
          badgeColor: row.badgeColor || row.badge_color || '#dc2626',
          bio: row.bio || '',
          layout: row.layout || 'creator-portrait',
          theme: row.theme || 'cinema-noir',
          language: row.language || 'pt',
          customColors: row.customColors || row.custom_colors || {
            bgColor: '#000000',
            textColor: '#ffffff',
            secondaryTextColor: '#a3a3a3',
            cardBgColor: '#0a0a0a',
            accentColor: '#e11d2e',
          },
          hideBranding: Boolean(row.hideBranding ?? row.hide_branding),
          links: row.links || [],
          socialLinks: row.socialLinks || row.social_links || [],
          tracking: row.tracking || {},
          stats: row.stats || { views: 0, ctaClicks: 0, clicks: {} },
          createdAt: row.createdAt || row.created_at || new Date().toISOString(),
          updatedAt: row.updatedAt || row.updated_at || new Date().toISOString(),
        };
      });
    } catch (err) {
      console.warn('[aurabio:firebase] Error fetching pages:', err);
      return [];
    }
  },

  async getPageBySlug(slug: string): Promise<BioPage | null> {
    try {
      const colRef = collection(db, COLLECTION);
      const q = query(colRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();

      return {
        id: data.id || docSnap.id,
        slug: data.slug || '',
        name: data.name || '',
        avatarUrl: data.avatarUrl || data.avatar_url || '',
        avatarZoom: Number(data.avatarZoom ?? data.avatar_zoom) || 1,
        avatarPosition: data.avatarPosition || data.avatar_position || { x: 50, y: 50 },
        verified: Boolean(data.verified),
        badgeColor: data.badgeColor || data.badge_color || '#dc2626',
        bio: data.bio || '',
        layout: data.layout || 'creator-portrait',
        theme: data.theme || 'cinema-noir',
        language: data.language || 'pt',
        customColors: data.customColors || data.custom_colors,
        hideBranding: Boolean(data.hideBranding ?? data.hide_branding),
        links: data.links || [],
        socialLinks: data.socialLinks || data.social_links || [],
        tracking: data.tracking || {},
        stats: data.stats || { views: 0, ctaClicks: 0, clicks: {} },
        createdAt: data.createdAt || data.created_at,
        updatedAt: data.updatedAt || data.updated_at,
      };
    } catch (err) {
      console.warn('[aurabio:firebase] Error fetching page by slug:', err);
      return null;
    }
  },

  async upsertPage(page: BioPage, userEmail?: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, page.id);
      const payload: any = {
        id: page.id,
        slug: page.slug,
        name: page.name,
        avatarUrl: page.avatarUrl || '',
        avatarZoom: page.avatarZoom || 1,
        avatarPosition: page.avatarPosition || { x: 50, y: 50 },
        verified: page.verified || false,
        badgeColor: page.badgeColor || '#dc2626',
        bio: page.bio || '',
        layout: page.layout || 'creator-portrait',
        theme: page.theme || 'cinema-noir',
        language: page.language || 'pt',
        customColors: page.customColors || {},
        hideBranding: page.hideBranding || false,
        links: page.links || [],
        socialLinks: page.socialLinks || [],
        tracking: page.tracking || {},
        stats: page.stats || { views: 0, ctaClicks: 0, clicks: {} },
        updatedAt: new Date().toISOString(),
      };

      if (userEmail) {
        payload.userEmail = userEmail;
      }

      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error upserting page:', err);
      return false;
    }
  },

  async deletePage(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error deleting page:', err);
      return false;
    }
  },

  async incrementView(pageId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, pageId);
      await updateDoc(docRef, {
        'stats.views': increment(1),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[aurabio:firebase] Error incrementing view:', err);
    }
  },

  async incrementClick(pageId: string, linkId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, pageId);
      await updateDoc(docRef, {
        'stats.ctaClicks': increment(1),
        [`stats.clicks.${linkId}`]: increment(1),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[aurabio:firebase] Error incrementing click:', err);
    }
  }
};
