import { 
  firebasePagesService, 
  firebaseMembersService, 
  firebaseMasterService, 
  firebaseWebhooksService 
} from './firebase';
import type { BioPage, MasterMember, MasterBrandingConfig, WebhookIntegration } from '../types/bio';

export const dbPagesService = {
  async getAllPages(): Promise<BioPage[]> {
    return firebasePagesService.getAllPages();
  },

  async getPageBySlug(slug: string): Promise<BioPage | null> {
    return firebasePagesService.getPageBySlug(slug);
  },

  async upsertPage(page: BioPage, userEmail?: string): Promise<boolean> {
    return firebasePagesService.upsertPage(page, userEmail);
  },

  async deletePage(id: string): Promise<boolean> {
    return firebasePagesService.deletePage(id);
  },

  async incrementView(pageId: string): Promise<void> {
    return firebasePagesService.incrementView(pageId);
  },

  async incrementClick(pageId: string, linkId: string): Promise<void> {
    return firebasePagesService.incrementClick(pageId, linkId);
  }
};

export const dbMembersService = {
  async getAllMembers(): Promise<MasterMember[]> {
    return firebaseMembersService.getAllMembers();
  },

  async upsertMember(member: MasterMember): Promise<boolean> {
    return firebaseMembersService.upsertMember(member);
  },

  async deleteMember(id: string): Promise<boolean> {
    return firebaseMembersService.deleteMember(id);
  }
};

export const dbMasterService = {
  async getMasterBranding(): Promise<MasterBrandingConfig | null> {
    return firebaseMasterService.getMasterBranding();
  },

  async upsertMasterBranding(branding: MasterBrandingConfig): Promise<boolean> {
    return firebaseMasterService.upsertMasterBranding(branding);
  }
};

export const dbWebhooksService = {
  async getAllWebhooks(): Promise<WebhookIntegration[]> {
    return firebaseWebhooksService.getAllWebhooks();
  },

  async upsertWebhook(webhook: WebhookIntegration): Promise<boolean> {
    return firebaseWebhooksService.upsertWebhook(webhook);
  },

  async deleteWebhook(id: string): Promise<boolean> {
    return firebaseWebhooksService.deleteWebhook(id);
  }
};
