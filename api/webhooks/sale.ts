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
    const memberStatus = isCancelled ? 'suspended' : 'active';
    const plan = payload.product?.name || payload.subscription?.name || 'Aura Pro V.I.P';

    // Save/Update Member in Firestore via REST API
    const memberDocumentUrl = `${FIRESTORE_BASE_URL}/aurabio_members/${memberId}`;

    const memberFields = {
      fields: {
        id: { stringValue: memberId },
        email: { stringValue: email },
        name: { stringValue: name },
        slug: { stringValue: slug },
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
