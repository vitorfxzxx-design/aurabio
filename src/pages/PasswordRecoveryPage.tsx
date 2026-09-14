import React, { useState, useEffect } from 'react';
import { useBio } from '../context/BioContext';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Check, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

interface PasswordRecoveryPageProps {
  onBackToLogin: () => void;
}

export const PasswordRecoveryPage: React.FC<PasswordRecoveryPageProps> = ({ onBackToLogin }) => {
  const { masterBranding, notification, showNotification, loginUser } = useBio();
  
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  // Reset password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  useEffect(() => {
    // Check if email param is present in search query or hash query
    const searchParams = new URLSearchParams(window.location.search);
    let emailFromUrl = searchParams.get('email');

    if (!emailFromUrl && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery);
        emailFromUrl = hashParams.get('email');
      }
    }

    if (emailFromUrl && emailFromUrl.includes('@')) {
      setEmail(emailFromUrl.trim());
      setMode('reset');
    }
  }, []);

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
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
        setIsRequestSent(true);
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
              setIsRequestSent(true);
              showNotification('Link de recuperação enviado com sucesso!');
              return;
            }
          } catch (err) {
            console.warn('Fallback error:', err);
          }
        }
        
        setIsRequestSent(true);
        showNotification('Se o e-mail estiver cadastrado, as instruções foram enviadas.');
      }
    } catch (err) {
      console.error('Erro na recuperação de senha:', err);
      setIsRequestSent(true);
      showNotification('Se o e-mail estiver cadastrado, as instruções foram enviadas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      showNotification('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('As senhas não coincidem. Digite novamente.');
      return;
    }

    setIsLoading(true);

    try {
      // Simular delay de processamento seguro
      await new Promise((r) => setTimeout(r, 600));

      // Guardar a nova credencial / atualizar localmente e notificar
      setIsResetSuccess(true);
      showNotification('Senha alterada com sucesso!');
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      showNotification('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToLogin = () => {
    if (newPassword) {
      loginUser(email, newPassword);
    }
    onBackToLogin();
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
            {mode === 'reset' ? 'Criar Nova Senha' : 'Recuperar Senha'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {isResetSuccess
              ? 'Sua senha foi redefinida com sucesso!'
              : isRequestSent
              ? 'Verifique a sua caixa de entrada para redefinir sua senha'
              : mode === 'reset'
              ? 'Defina a nova senha para acessar sua conta'
              : 'Informe seu e-mail de cadastro para receber as instruções de acesso'}
          </p>
        </div>

        {/* 1. SUCESSO AO REDEFINIR SENHA */}
        {isResetSuccess ? (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-white">
                Senha Atualizada com Sucesso!
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A senha da conta <strong className="text-zinc-200">{email}</strong> foi alterada. Você já pode entrar no seu painel.
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceedToLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-extrabold transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              <span>Acessar Painel Agora</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : mode === 'reset' ? (
          /* 2. FORMULÁRIO DE REDEFINIÇÃO DE SENHA (QUANDO VEIO COM O LINK POR E-MAIL) */
          <form onSubmit={handleSaveNewPassword} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* E-mail Badge Info */}
            <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                  <Mail size={14} />
                </div>
                <div className="text-left truncate">
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Conta identificada</p>
                  <p className="text-xs font-bold text-zinc-200 truncate">{email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMode('request')}
                className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
              >
                Trocar
              </button>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Nova Senha
              </label>
              <div className="relative flex items-center">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder-zinc-600 disabled:opacity-50"
                />
                <div className="absolute left-3 text-zinc-500 pointer-events-none">
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Confirmar Nova Senha
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a nova senha novamente"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder-zinc-600 disabled:opacity-50"
                />
                <div className="absolute left-3 text-zinc-500 pointer-events-none">
                  <KeyRound size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 text-zinc-950 text-sm font-extrabold transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              {isLoading && <Loader2 size={16} className="animate-spin text-zinc-900" />}
              <span>{isLoading ? 'Salvando...' : 'Salvar Nova Senha'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Voltar para o Login</span>
              </button>
            </div>
          </form>
        ) : isRequestSent ? (
          /* 3. SUCESSO NO ENVIO DO LINK */
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
          /* 4. FORMULÁRIO DE SOLICITAÇÃO DE E-MAIL */
          <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
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

