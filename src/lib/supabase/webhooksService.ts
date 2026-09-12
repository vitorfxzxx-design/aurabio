import { supabase } from './client';
import type { WebhookIntegration } from '../../types/bio';

const TABLE = 'aurabio_webhooks';

export const webhooksService = {
  async getAllWebhooks(): Promise<WebhookIntegration[]> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*');
      if (error || !data) return [];

      return data.map((row: any): WebhookIntegration => ({
        id: row.id,
        platform: row.platform,
        name: row.name,
        webhookUrl: row.webhook_url,
        secretToken: row.secret_token || '',
        active: Boolean(row.active),
        totalEvents: row.total_events || 0,
        lastEventAt: row.last_event_at,
      }));
    } catch (err) {
      console.warn('[aurabio] Error fetching webhooks:', err);
      return [];
    }
  },

  async upsertWebhook(webhook: WebhookIntegration): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLE).upsert({
        id: webhook.id,
        platform: webhook.platform,
        name: webhook.name,
        webhook_url: webhook.webhookUrl,
        secret_token: webhook.secretToken,
        active: webhook.active,
        total_events: webhook.totalEvents,
        last_event_at: webhook.lastEventAt,
      }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.warn('[aurabio] Error saving webhook:', err);
      return false;
    }
  },

  async deleteWebhook(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('[aurabio] Error deleting webhook:', err);
      return false;
    }
  }
};
