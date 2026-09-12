import { supabase } from './client';
import type { MasterBrandingConfig } from '../../types/bio';
import { DEFAULT_MASTER_BRANDING } from '../../data/defaultData';

const TABLE = 'aurabio_master_settings';
const CONFIG_ID = 'global_master_config';

export const masterService = {
  async getMasterBranding(): Promise<MasterBrandingConfig | null> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', CONFIG_ID).single();
      if (error || !data) return null;

      return {
        appName: data.app_name || DEFAULT_MASTER_BRANDING.appName,
        tagline: data.tagline || DEFAULT_MASTER_BRANDING.tagline,
        logoUrl: data.logo_url,
        faviconUrl: data.favicon_url,
        seoTitle: data.seo_title || DEFAULT_MASTER_BRANDING.seoTitle,
        seoDescription: data.seo_description || DEFAULT_MASTER_BRANDING.seoDescription,
        keywords: data.keywords,
        ogImageUrl: data.og_image_url,
        footerText: data.footer_text || DEFAULT_MASTER_BRANDING.footerText,
        supportEmail: data.support_email || DEFAULT_MASTER_BRANDING.supportEmail,
        customDomain: data.custom_domain || DEFAULT_MASTER_BRANDING.customDomain,
      };
    } catch (err) {
      console.warn('[aurabio] Error fetching master branding:', err);
      return null;
    }
  },

  async upsertMasterBranding(branding: MasterBrandingConfig): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLE).upsert({
        id: CONFIG_ID,
        app_name: branding.appName,
        tagline: branding.tagline,
        logo_url: branding.logoUrl,
        favicon_url: branding.faviconUrl,
        seo_title: branding.seoTitle,
        seo_description: branding.seoDescription,
        keywords: branding.keywords,
        og_image_url: branding.ogImageUrl,
        footer_text: branding.footerText,
        support_email: branding.supportEmail,
        custom_domain: branding.customDomain,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.warn('[aurabio] Error saving master branding:', err);
      return false;
    }
  }
};
