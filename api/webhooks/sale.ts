import type { VercelRequest, VercelResponse } from '@vercel/node';

// Firebase REST API endpoints for Firestore
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'aurabio-b8191';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow GET healthcheck
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'online', 
      service: 'Aurabio Webhook Receiver', 
      message: 'Webhook endpoint is active and listening for Digital Manager Guru postbacks.' 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const payload = req.body || {};
    
    // Guru sends events like:
    // status: "approved" | "canceled" | "expired" | "inactive" | "refunded" | "chargeback" | "active"
    // contact / doc / name / email
    // subscription data
    const contact = payload.contact || payload.buyer || payload.client || {};
    const email = (contact.email || payload.email || '').trim().toLowerCase();
    const name = contact.name || payload.name || email.split('@')[0] || 'Novo Membro';
    const status = (payload.status || payload.event || '').toLowerCase();
    
    // Determine action from status
    const isApproved = status.includes('approv') || status.includes('active') || status.includes('paid') || status.includes('paga') || status.includes('trial');
    const isCancelled = status.includes('cancel') || status.includes('expir') || status.includes('inact') || status.includes('refund') || status.includes('chargeback');

    if (!email) {
      console.warn('[Webhook] No email found in payload:', payload);
      return res.status(200).json({ 
        received: true, 
        warning: 'No email found in request payload, webhook acknowledged.' 
      });
    }

    const memberId = `mem_${email.replace(/[^a-z0-9]/g, '_')}`;
    const slug = email.split('@')[0].replace(/[^a-z0-9_-]/g, '').toLowerCase() || `user_${Date.now()}`;
    const rawPlanName = (payload.product?.name || payload.subscription?.name || payload.plan?.name || '').toLowerCase();
    let plan = 'Plano Creator (Até 3 Perfis)';
    if (rawPlanName.includes('10') || rawPlanName.includes('pro') || rawPlanName.includes('agencia') || rawPlanName.includes('agência')) {
      plan = 'Plano PRO (Até 10 Perfis)';
    } else if (payload.product?.name) {
      plan = payload.product.name;
    }

    // Determine member status
    let memberStatus: 'active' | 'suspended' = 'active';
    if (isCancelled && !isApproved) {
      memberStatus = 'suspended';
    }

    // Default password for new members
    const defaultPassword = '123456';

    // Save/Update Member in Firestore via REST API
    const memberDocumentUrl = `${FIRESTORE_BASE_URL}/aurabio_members/${memberId}`;

    const memberFields = {
      fields: {
        id: { stringValue: memberId },
        email: { stringValue: email },
        name: { stringValue: name },
        slug: { stringValue: slug },
        password: { stringValue: defaultPassword },
        status: { stringValue: memberStatus },
        plan: { stringValue: plan },
        updatedAt: { stringValue: new Date().toISOString() },
        createdAt: { stringValue: new Date().toISOString() }
      }
    };

    const memberResponse = await fetch(memberDocumentUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberFields)
    });

    if (!memberResponse.ok) {
      const errorText = await memberResponse.text();
      console.error('[Webhook] Firestore Member save error:', errorText);
    }

    // If new active/trial member, also ensure initial Bio Page is created in Firestore
    if (memberStatus === 'active') {
      const pageId = `page_${slug}`;
      const pageDocumentUrl = `${FIRESTORE_BASE_URL}/aurabio_pages/${pageId}`;
      
      const pageFields = {
        fields: {
          id: { stringValue: pageId },
          slug: { stringValue: slug },
          name: { stringValue: name.toUpperCase() },
          userEmail: { stringValue: email },
          avatarUrl: { stringValue: '' },
          bio: { stringValue: 'Bem-vindo ao meu link na bio oficial.' },
          layout: { stringValue: 'creator-portrait' },
          theme: { stringValue: 'cinema-noir' },
          language: { stringValue: 'pt' },
          verified: { booleanValue: false },
          hideBranding: { booleanValue: false },
          updatedAt: { stringValue: new Date().toISOString() },
          createdAt: { stringValue: new Date().toISOString() }
        }
      };

      await fetch(pageDocumentUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageFields)
      }).catch(err => console.warn('[Webhook] Page creation note:', err));

      // Attempt to dispatch Welcome Email via Resend if configured
      try {
        const configDocUrl = `${FIRESTORE_BASE_URL}/aurabio_master_settings/global_master_config`;
        const configResp = await fetch(configDocUrl);
        if (configResp.ok) {
          const configJson = await configResp.json();
          const f = configJson.fields || {};
          const resendApiKey = f.resendApiKey?.stringValue;
          const senderName = f.senderName?.stringValue || 'Aurabio';
          const senderEmail = f.senderEmail?.stringValue || 'onboarding@resend.dev';
          const subjectTemplate = f.welcomeEmailSubject?.stringValue || 'Seu acesso ao Aurabio está pronto!';
          const bodyTemplate = f.welcomeEmailBody?.stringValue || 'Olá {nome},\n\nSua conta no Aurabio foi ativada com sucesso!\n\nSeus dados de acesso:\nSite: https://aurabio.link/\nE-mail: {email}\nSenha: {senha}\n\nSeu endereço exclusivo: https://aurabio.link/{slug}\n\nQualquer dúvida, responda a este e-mail ou contate nosso time em Corefysystems@gmail.com.';

          if (resendApiKey && resendApiKey.startsWith('re_')) {
            const parsedSubj = subjectTemplate
              .replace(/\{nome\}/gi, name)
              .replace(/\{slug\}/gi, slug)
              .replace(/\{email\}/gi, email)
              .replace(/\{senha\}/gi, defaultPassword);

            const parsedBody = bodyTemplate
              .replace(/\{nome\}/gi, name)
              .replace(/\{slug\}/gi, slug)
              .replace(/\{email\}/gi, email)
              .replace(/\{senha\}/gi, defaultPassword);

            let fromAddress = `${senderName} <contato@mail.aurabio.link>`;
            let replyToAddress = senderEmail && senderEmail.includes('@') ? senderEmail.trim() : 'contato@aurabio.link';

            if (senderEmail && senderEmail.endsWith('@mail.aurabio.link')) {
              fromAddress = `${senderName} <${senderEmail.trim()}>`;
            } else if (senderEmail && senderEmail.includes('@') && !senderEmail.includes('resend.dev')) {
              const username = senderEmail.split('@')[0];
              fromAddress = `${senderName} <${username}@mail.aurabio.link>`;
            }

            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey.trim()}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: fromAddress,
                to: [email],
                reply_to: replyToAddress,
                subject: parsedSubj,
                text: parsedBody,
                html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #18181b;"><h2 style="font-weight: 800;">Aurabio</h2><div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${parsedBody}</div><hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" /><p style="font-size: 11px; color: #71717a;">Aurabio — Sua página de links profissional.</p></div>`
              })
            }).catch(e => console.warn('[Webhook] Resend delivery notice:', e));
          }
        }
      } catch (emailErr) {
        console.warn('[Webhook] Welcome email dispatch warning:', emailErr);
      }
    }

    // Save Webhook Log to Firestore
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const logDocumentUrl = `${FIRESTORE_BASE_URL}/aurabio_webhook_logs/${logId}`;
      const logFields = {
        fields: {
          id: { stringValue: logId },
          event: { stringValue: status || 'subscription_event' },
          email: { stringValue: email },
          name: { stringValue: name },
          slug: { stringValue: slug },
          status: { stringValue: 'success' },
          memberStatus: { stringValue: memberStatus },
          plan: { stringValue: plan },
          payload: { stringValue: JSON.stringify(payload).substring(0, 2000) },
          createdAt: { stringValue: new Date().toISOString() }
        }
      };
      await fetch(logDocumentUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logFields)
      }).catch(e => console.warn('[Webhook] Log save notice:', e));
    } catch (logErr) {
      console.warn('[Webhook] Log error:', logErr);
    }

    console.log(`[Webhook] Success: Access granted for ${email} with status "${memberStatus}"`);

    return res.status(200).json({
      success: true,
      member: {
        email,
        name,
        slug,
        status: memberStatus,
        plan
      }
    });
  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);
    return res.status(200).json({ 
      success: false, 
      error: error.message || 'Internal error', 
      note: 'Acknowledged with 200 for gateway retry prevention' 
    });
  }
}
