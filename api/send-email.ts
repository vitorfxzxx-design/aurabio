import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const {
      to,
      subject,
      body,
      senderName = 'Aurabio',
      senderEmail = 'onboarding@resend.dev',
      resendApiKey,
      name = 'Cliente',
      slug = 'meulink',
    } = req.body || {};

    if (!to) {
      return res.status(400).json({ success: false, error: 'Destinatário (e-mail) é obrigatório.' });
    }

    if (!resendApiKey || !resendApiKey.startsWith('re_')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Chave de API do Resend inválida ou não configurada. Cole sua chave "re_..." no painel e salve.' 
      });
    }

    // Replace template variables
    const parsedSubject = (subject || 'Acesso liberado — Aurabio')
      .replace(/\{nome\}/gi, name)
      .replace(/\{slug\}/gi, slug)
      .replace(/\{email\}/gi, to);

    const parsedBodyText = (body || 'Olá {nome},\n\nSua conta no Aurabio foi criada com sucesso!')
      .replace(/\{nome\}/gi, name)
      .replace(/\{slug\}/gi, slug)
      .replace(/\{email\}/gi, to);

    // Convert newlines to HTML paragraphs/breaks
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #18181b; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #09090b; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Aurabio</h2>
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">
${parsedBodyText}
        </div>
        <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 28px 0 16px 0;" />
        <p style="font-size: 11px; color: #71717a; text-align: center; margin: 0;">
          Aurabio — Sua página de links profissional. Todos os direitos reservados.
        </p>
      </div>
    `;

    // Attempt 1: Send with configured sender email
    const fromAddress = senderEmail && senderEmail.includes('@') && !senderEmail.includes('resend.dev')
      ? `${senderName} <${senderEmail}>`
      : `${senderName} <onboarding@resend.dev>`;

    let resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to.trim().toLowerCase()],
        subject: parsedSubject,
        text: parsedBodyText,
        html: htmlContent,
      }),
    });

    let resendData = await resendResponse.json();

    // If failed due to unverified custom domain on Resend, try fallback to onboarding@resend.dev
    if (!resendResponse.ok && (resendData?.message?.includes('domain') || resendData?.name === 'validation_error')) {
      console.warn('[Resend API] Custom domain failed, trying fallback with onboarding@resend.dev...', resendData);
      
      const fallbackResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${senderName} <onboarding@resend.dev>`,
          to: [to.trim().toLowerCase()],
          subject: parsedSubject,
          text: parsedBodyText,
          html: htmlContent,
        }),
      });

      const fallbackData = await fallbackResponse.json();
      if (fallbackResponse.ok) {
        return res.status(200).json({
          success: true,
          id: fallbackData.id,
          note: 'E-mail enviado via onboarding@resend.dev (para usar seu próprio domínio @aurabio.link, verifique seu domínio no Resend).',
        });
      } else {
        return res.status(400).json({
          success: false,
          error: fallbackData.message || resendData.message || 'Erro ao enviar e-mail via Resend.',
        });
      }
    }

    if (!resendResponse.ok) {
      return res.status(400).json({
        success: false,
        error: resendData.message || 'Erro ao enviar e-mail via Resend. Verifique a chave de API.',
      });
    }

    return res.status(200).json({
      success: true,
      id: resendData.id,
      message: 'E-mail de teste enviado com sucesso!',
    });

  } catch (error: any) {
    console.error('[Send-Email Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno no servidor ao processar envio.',
    });
  }
}
