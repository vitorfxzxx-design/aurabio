import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  KeyRound, 
  Layers, 
  Smartphone, 
  Copy, 
  Check 
} from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const supportEmail = "corefysystems@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleGoToLogin = () => {
    window.location.href = '/#/admin';
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-600 selection:text-white font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-purple-900/25 via-indigo-950/20 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-[400px] h-[300px] bg-emerald-950/15 blur-[140px] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Aurabio Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">Aurabio</span>
          </div>

          <button 
            onClick={handleGoToLogin}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer active:scale-95"
          >
            <span>Ir para o Login</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-3xl mx-auto px-5 py-10 sm:py-16 flex flex-col items-center text-center">
        
        {/* Success Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-6 animate-in fade-in zoom-in-95 duration-500">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Assinatura Confirmada com Sucesso!</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          Bem-vindo ao <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
            Aurabio.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
          Seu acesso foi liberado! Siga os passos abaixo para entrar no painel e criar seu link na bio de alto impacto agora mesmo.
        </p>

        {/* Primary Action Card: Login Direct Button */}
        <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.12)] text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">PASSO 1: ACESSO IMEDIATO</span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Acesse sua Conta de Membro</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Utilize o e-mail que você cadastrou na hora do checkout.
              </p>
            </div>

            <button
              onClick={handleGoToLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>Entrar no Painel</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Quick Step Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-sm mb-3">
                1
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Faça Login</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Acesse o painel em <span className="text-zinc-200 font-mono">aurabio.link/#/admin</span> com seu e-mail e senha.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-sm mb-3">
                2
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Personalize sua Bio</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Escolha entre os 5 layouts (Cinema, Retrato, etc.), insira suas fotos e adicione seus links.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-black text-sm mb-3">
                3
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Cole no seu Perfil</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Copie seu link exclusivo e cole na bio do Instagram, TikTok, YouTube ou WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works & Included Features */}
        <div className="w-full mt-6 p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">O QUE ESTÁ LIBERADO NA SUA CONTA</span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1 mb-5">Tudo o que você pode fazer agora</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-zinc-300">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
              <Layers size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Até 3 Páginas Independentes</strong>
                <span className="text-zinc-400 text-[11px]">Crie links separados para marca pessoal, empresa ou projetos.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
              <Sparkles size={16} className="text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">5 Formatos Cinematográficos</strong>
                <span className="text-zinc-400 text-[11px]">Alterne a estética a qualquer momento sem perder seus links.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
              <Smartphone size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Sincronização em Tempo Real</strong>
                <span className="text-zinc-400 text-[11px]">Tudo o que você edita reflete no mesmo segundo para os visitantes.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
              <KeyRound size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Meta Pixel & Trackeamento Real</strong>
                <span className="text-zinc-400 text-[11px]">Dispare PageView e Lead automático para seus anúncios.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="w-full mt-6 p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0">
              <Mail size={22} className="text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SUPORTE & ATENDIMENTO</span>
              <h3 className="text-base font-bold text-white mt-0.5">Precisa de ajuda ou tem dúvidas?</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Nossa equipe está disponível por e-mail:
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-purple-300">
                <span>{supportEmail}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyEmail}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            {copiedEmail ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">E-mail Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-zinc-400" />
                <span>Copiar E-mail</span>
              </>
            )}
          </button>
        </div>

        {/* Final CTA Button */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={handleGoToLogin}
            className="px-9 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Ir para o Painel do Aurabio</span>
            <ArrowRight size={18} />
          </button>

          <p className="mt-3 text-[11px] text-zinc-500">
            Link direto de login: <span className="font-mono text-zinc-400">https://aurabio.link/#/admin</span>
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-black py-8 px-6 text-center text-xs text-zinc-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Aurabio" className="w-4 h-4 object-contain" />
            <span>© {new Date().getFullYear()} Aurabio. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Suporte: {supportEmail}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
