import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './client';
import type { MasterBrandingConfig } from '../../types/bio';
import { DEFAULT_MASTER_BRANDING } from '../../data/defaultData';

const COLLECTION = 'aurabio_master_settings';
const CONFIG_ID = 'global_master_config';

export const firebaseMasterService = {
  async getMasterBranding(): Promise<MasterBrandingConfig | null> {
    try {
      const docRef = doc(db, COLLECTION, CONFIG_ID);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        appName: data.appName || DEFAULT_MASTER_BRANDING.appName,
        tagline: data.tagline || DEFAULT_MASTER_BRANDING.tagline,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        seoTitle: data.seoTitle || DEFAULT_MASTER_BRANDING.seoTitle,
        seoDescription: data.seoDescription || DEFAULT_MASTER_BRANDING.seoDescription,
        keywords: data.keywords,
        ogImageUrl: data.ogImageUrl,
        footerText: data.footerText || DEFAULT_MASTER_BRANDING.footerText,
        supportEmail: data.supportEmail || DEFAULT_MASTER_BRANDING.supportEmail,
        customDomain: data.customDomain || DEFAULT_MASTER_BRANDING.customDomain,
        emailProvider: data.emailProvider || 'resend',
        resendApiKey: data.resendApiKey || '',
        smtpHost: data.smtpHost || '',
        smtpPort: data.smtpPort || '',
        smtpUser: data.smtpUser || '',
        smtpPass: data.smtpPass || '',
        senderName: data.senderName || '',
        senderEmail: data.senderEmail || '',
        welcomeEmailSubject: data.welcomeEmailSubject || '',
        welcomeEmailBody: data.welcomeEmailBody || '',
        recoveryEmailSubject: data.recoveryEmailSubject || '',
        recoveryEmailBody: data.recoveryEmailBody || '',
      };
    } catch (err) {
      console.warn('[aurabio:firebase] Error fetching master branding:', err);
      return null;
    }
  },

  async upsertMasterBranding(branding: MasterBrandingConfig): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, CONFIG_ID);
      await setDoc(docRef, {
        id: CONFIG_ID,
        appName: branding.appName,
        tagline: branding.tagline,
        logoUrl: branding.logoUrl,
        faviconUrl: branding.faviconUrl,
        seoTitle: branding.seoTitle,
        seoDescription: branding.seoDescription,
        keywords: branding.keywords,
        ogImageUrl: branding.ogImageUrl,
        footerText: branding.footerText,
        supportEmail: branding.supportEmail,
        customDomain: branding.customDomain,
        emailProvider: branding.emailProvider,
        resendApiKey: branding.resendApiKey,
        smtpHost: branding.smtpHost,
        smtpPort: branding.smtpPort,
        smtpUser: branding.smtpUser,
        smtpPass: branding.smtpPass,
        senderName: branding.senderName,
        senderEmail: branding.senderEmail,
        welcomeEmailSubject: branding.welcomeEmailSubject,
        welcomeEmailBody: branding.welcomeEmailBody,
        recoveryEmailSubject: branding.recoveryEmailSubject,
        recoveryEmailBody: branding.recoveryEmailBody,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error saving master branding:', err);
      return false;
    }
  }
};
