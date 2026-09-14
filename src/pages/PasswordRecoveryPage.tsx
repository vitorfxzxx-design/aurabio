import React, { useState } from 'react';
import { useBio } from '../context/BioContext';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Check } from 'lucide-react';

interface PasswordRecoveryPageProps {
  onBackToLogin: () => void;
}

export const PasswordRecoveryPage: React.FC<PasswordRecoveryPageProps> = ({ onBackToLogin }) => {
  const { masterBranding, notification, showNotification } = useBio();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showNotification('Digite um e-mail válido.');
      return;
    }

    setIsLoading(true);
    try {
      const subject = masterBranding?.recoveryEmailSubject || 'Redefinição de senha — Aurabio';
      const body = masterBranding?.recoveryEmailBody || 
        'Olá {nome},\n\nRecebemos uma solicitação para redefinir a senha da sua conta no Aurabio ({email}).\n\nPara cadastrar uma nova senha, acesse o link:\nhttps://aurabio.link/recuperar-senha?email={email}\n\nSe você não fez esta solicitação, desconsidere este e-mail.\n\nAtenciosamente,\nEquipe Aurabio.';

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.trim(),
          subject: subject,
          body: body,
          senderName: masterBranding?.senderName || 'Aurabio Suporte',
          senderEmail: masterBranding?.senderEmail || 'contato@aurabio.link',
          resendApiKey: masterBranding?.resendApiKey,
          name: email.split('@')[0],
          slug: email.split('@')[0],
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setIsSuccess(true);
        showNotification('Link de recuperação enviado com sucesso!');
      } else {
        // Direct Resend fallback if available
        if (masterBranding?.resendApiKey) {
          try {
            const parsedSubject = subject.replace(/\{nome\}/gi, email.split('@')[0]).replace(/\{email\}/gi, email.trim());
            const parsedBody = body.replace(/\{nome\}/gi, email.split('@')[0]).replace(/\{email\}/gi, email.trim());

            const directRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${masterBranding.resendApiKey.trim()}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: `${masterBranding?.senderName || 'Aurabio Suporte'} <contato@mail.aurabio.link>`,
                to: [email.trim().toLowerCase()],
                reply_to: masterBranding?.senderEmail || 'contato@aurabio.link',
                subject: parsedSubject,
                text: parsedBody,
              }),
            });

            if (directRes.ok) {
              setIsSuccess(true);
              showNotification('Link de recuperação enviado com sucesso!');
              return;
            }
          } catch (err) {
            console.warn('Fallback error:', err);
          }
        }
        
        // Show success screen anyway for security / customer confirmation
        setIsSuccess(true);
        showNotification('Se o e-mail estiver cadastrado, as instruções foram enviadas.');
      }
    } catch (err) {
      console.error('Erro na recuperação de senha:', err);
      setIsSuccess(true);
      showNotification('Se o e-mail estiver cadastrado, as instruções foram enviadas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-4 select-none relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-800/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img 
              src={masterBranding?.logoUrl || '/logo.png'} 
              alt={masterBranding?.appName || 'Aurabio'} 
              className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Recuperar Senha
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {isSuccess 
              ? 'Verifique a sua caixa de entrada para redefinir sua senha' 
              : 'Informe seu e-mail de cadastro para receber as instruções de acesso'}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white">
                E-mail de Recuperação Enviado!
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enviamos um link de redefinição para <strong className="text-zinc-200">{email}</strong>. Verifique sua caixa de entrada e também a pasta de spam.
              </p>
            </div>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-extrabold transition-all shadow-lg cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Voltar para o Login</span>
            </button>
          </div>
        ) : (
          /* Recovery Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder-zinc-600 disabled:opacity-50"
                />
                <div className="absolute left-3 text-zinc-500 pointer-events-none">
                  <Mail size={16} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 text-zinc-950 text-sm font-extrabold transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              {isLoading && <Loader2 size={16} className="animate-spin text-zinc-900" />}
              <span>{isLoading ? 'Enviando link...' : 'Enviar Link de Recuperação'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>

            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Lembrou sua senha? Voltar ao Login</span>
              </button>
            </div>
          </form>
        )}

        {/* Security badge footer */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-center text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            Ambiente Seguro · Aurabio
          </span>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-zinc-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={12} strokeWidth={3} />
          </div>
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};
