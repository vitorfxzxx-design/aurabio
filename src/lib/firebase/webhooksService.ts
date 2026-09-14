import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './client';
import type { WebhookIntegration } from '../../types/bio';

const COLLECTION = 'aurabio_webhooks';

export const firebaseWebhooksService = {
  async getAllWebhooks(): Promise<WebhookIntegration[]> {
    try {
      const colRef = collection(db, COLLECTION);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnap): WebhookIntegration => {
        const row = docSnap.data();
        return {
          id: row.id || docSnap.id,
          platform: row.platform || 'kiwify',
          name: row.name || '',
          webhookUrl: row.webhookUrl || row.webhook_url || '',
          secretToken: row.secretToken || row.secret_token || '',
          active: Boolean(row.active),
          totalEvents: row.totalEvents || row.total_events || 0,
          lastEventAt: row.lastEventAt || row.last_event_at,
        };
      });
    } catch (err) {
      console.warn('[aurabio:firebase] Error fetching webhooks:', err);
      return [];
    }
  },

  async upsertWebhook(webhook: WebhookIntegration): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, webhook.id);
      await setDoc(docRef, {
        id: webhook.id,
        platform: webhook.platform,
        name: webhook.name,
        webhookUrl: webhook.webhookUrl,
        secretToken: webhook.secretToken,
        active: webhook.active,
        totalEvents: webhook.totalEvents,
        lastEventAt: webhook.lastEventAt,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error saving webhook:', err);
      return false;
    }
  },

  async deleteWebhook(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('[aurabio:firebase] Error deleting webhook:', err);
      return false;
    }
  },

  async getWebhookLogs(): Promise<import('../../types/bio').WebhookLog[]> {
    try {
      const colRef = collection(db, 'aurabio_webhook_logs');
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) return [];

      const list = snapshot.docs.map((docSnap): import('../../types/bio').WebhookLog => {
        const row = docSnap.data();
        return {
          id: row.id || docSnap.id,
          event: row.event || 'subscription_event',
          email: row.email || '',
          name: row.name || '',
          slug: row.slug || '',
          status: row.status || 'success',
          memberStatus: row.memberStatus || 'active',
          plan: row.plan || 'Plano Guru',
          payload: row.payload,
          createdAt: row.createdAt || new Date().toISOString(),
        };
      });

      // Sort descending by date
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('[aurabio:firebase] Error fetching webhook logs:', err);
      return [];
    }
  }
};
