import { 
  firebasePagesService, 
  firebaseMembersService, 
  firebaseMasterService, 
  firebaseWebhooksService 
} from './firebase';
import { 
  pagesService as supabasePages, 
  membersService as supabaseMembers, 
  masterService as supabaseMaster, 
  webhooksService as supabaseWebhooks 
} from './supabase';
import type { BioPage, MasterMember, MasterBrandingConfig, WebhookIntegration } from '../types/bio';

export const dbPagesService = {
  async getAllPages(): Promise<BioPage[]> {
    try {
      const fbPages = await firebasePagesService.getAllPages();
      if (fbPages && fbPages.length > 0) return fbPages;
    } catch (err) {
      console.warn('[aurabio] Firebase fetch error, trying supabase fallback:', err);
    }
    return supabasePages.getAllPages();
  },

  async getPageBySlug(slug: string): Promise<BioPage | null> {
    try {
      const fbPage = await firebasePagesService.getPageBySlug(slug);
      if (fbPage) return fbPage;
    } catch (err) {
      console.warn('[aurabio] Firebase slug fetch error, trying supabase fallback:', err);
    }
    return supabasePages.getPageBySlug(slug);
  },

  async upsertPage(page: BioPage, userEmail?: string): Promise<boolean> {
    // Save to Firebase (primary) and Supabase (secondary backup)
    const fbPromise = firebasePagesService.upsertPage(page, userEmail);
    const sbPromise = supabasePages.upsertPage(page, userEmail);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  },

  async deletePage(id: string): Promise<boolean> {
    const fbPromise = firebasePagesService.deletePage(id);
    const sbPromise = supabasePages.deletePage(id);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  }
};

export const dbMembersService = {
  async getAllMembers(): Promise<MasterMember[]> {
    try {
      const fbMembers = await firebaseMembersService.getAllMembers();
      if (fbMembers && fbMembers.length > 0) return fbMembers;
    } catch (err) {
      console.warn('[aurabio] Firebase members error:', err);
    }
    return supabaseMembers.getAllMembers();
  },

  async upsertMember(member: MasterMember): Promise<boolean> {
    const fbPromise = firebaseMembersService.upsertMember(member);
    const sbPromise = supabaseMembers.upsertMember(member);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  },

  async deleteMember(id: string): Promise<boolean> {
    const fbPromise = firebaseMembersService.deleteMember(id);
    const sbPromise = supabaseMembers.deleteMember(id);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  }
};

export const dbMasterService = {
  async getMasterBranding(): Promise<MasterBrandingConfig | null> {
    try {
      const fbBranding = await firebaseMasterService.getMasterBranding();
      if (fbBranding) return fbBranding;
    } catch (err) {
      console.warn('[aurabio] Firebase branding error:', err);
    }
    return supabaseMaster.getMasterBranding();
  },

  async upsertMasterBranding(branding: MasterBrandingConfig): Promise<boolean> {
    const fbPromise = firebaseMasterService.upsertMasterBranding(branding);
    const sbPromise = supabaseMaster.upsertMasterBranding(branding);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  }
};

export const dbWebhooksService = {
  async getAllWebhooks(): Promise<WebhookIntegration[]> {
    try {
      const fbWebhooks = await firebaseWebhooksService.getAllWebhooks();
      if (fbWebhooks && fbWebhooks.length > 0) return fbWebhooks;
    } catch (err) {
      console.warn('[aurabio] Firebase webhooks error:', err);
    }
    return supabaseWebhooks.getAllWebhooks();
  },

  async upsertWebhook(webhook: WebhookIntegration): Promise<boolean> {
    const fbPromise = firebaseWebhooksService.upsertWebhook(webhook);
    const sbPromise = supabaseWebhooks.upsertWebhook(webhook);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  },

  async deleteWebhook(id: string): Promise<boolean> {
    const fbPromise = firebaseWebhooksService.deleteWebhook(id);
    const sbPromise = supabaseWebhooks.deleteWebhook(id);
    const results = await Promise.allSettled([fbPromise, sbPromise]);
    return results.some(r => r.status === 'fulfilled' && r.value === true);
  }
};
