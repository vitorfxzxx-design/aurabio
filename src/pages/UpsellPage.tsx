import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Flame, 
  Sparkles, 
  Tag, 
  Check, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';

interface UpsellPageProps {
  onAccept?: () => void;
  onDecline?: () => void;
  checkoutUrl?: string;
}

export const UpsellPage: React.FC<UpsellPageProps> = ({ 
  onAccept, 
  onDecline,
  checkoutUrl = 'https://pay.kiwify.com.br'
}) => {
  // 15 minutes countdown timer (900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = sessionStorage.getItem('aurabio_upsell_timer');
    return saved ? parseInt(saved, 10) : 14 * 60 + 23;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        const nextTime = prev - 1;
        sessionStorage.setItem('aurabio_upsell_timer', nextTime.toString());
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCtaClick = () => {
    if (onAccept) {
      onAccept();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const targetUrl = urlParams.get('checkout') || urlParams.get('pay') || urlParams.get('url') || checkoutUrl;
      window.location.href = targetUrl;
    }
  };

  const handleDeclineClick = () => {
    if (onDecline) {
      onDecline();
    } else {
      window.location.href = '/painel';
    }
  };

  return (
    <div className="min-h-screen bg-[#070608] text-white flex flex-col items-center justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden relative">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP WARNING BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-gradient-to-r from-amber-950/40 via-amber-900/60 to-amber-950/40 border-b border-amber-500/20 py-2.5 px-4 text-center">
        <p className="text-[11px] sm:text-xs font-semibold text-amber-200/90 flex items-center justify-center gap-1.5 flex-wrap">
          <AlertTriangle size={13} className="text-amber-400 shrink-0 animate-pulse" />
          <span>ATENÇÃO: esta oferta aparece</span>
          <span className="underline font-bold text-amber-300">uma única vez</span>.
          <span>Se você sair, ela some para sempre.</span>
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND AMBIENT GLOWS */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[340px] sm:w-[650px] h-[300px] sm:h-[450px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-80 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-[300px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 flex flex-col items-center text-center">
        
        {/* TIMER PILL */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-xs text-rose-200 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <Clock size={13} className="text-rose-400" />
          <span className="font-medium">Oferta expira em</span>
          <span className="font-mono font-bold text-white tracking-widest bg-red-950/80 px-2 py-0.5 rounded border border-red-500/20">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* OPPORTUNITY TAG */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-medium text-amber-400/90 mb-6">
          <Flame size={12} className="text-amber-500 fill-amber-500/30" />
          <span>Oportunidade única · Somente agora</span>
        </div>

        {/* HEADLINE */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.12] max-w-2xl mb-4">
          Mais <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-200 to-yellow-100">1 ano inteiro</span> de Aurabio pela{' '}
          <span className="relative inline-block whitespace-nowrap">
            metade
            <span className="absolute left-0 bottom-1 sm:bottom-1.5 w-full h-[3px] sm:h-[4px] bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full" />
          </span>{' '}
          do preço.
        </h1>

        {/* SUBTITLE */}
        <p className="text-xs sm:text-base text-zinc-400 max-w-xl mb-8 sm:mb-10 leading-relaxed">
          Você acabou de assinar. Antes de continuar, temos <strong className="text-zinc-200 font-bold">uma única oferta</strong> pra você — e ela <strong className="text-zinc-200 font-bold">nunca mais vai aparecer</strong>.
        </p>

        {/* ------------------------------------------------------------- */}
        {/* MAIN OFFER CARD */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-[#181316] to-[#120f12] border border-amber-500/25 rounded-3xl p-6 sm:p-8 md:p-9 shadow-[0_0_50px_rgba(245,158,11,0.08)] relative overflow-hidden text-left mb-6">
          
          {/* Subtle gold top border light */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-600/40 text-[10px] sm:text-xs font-black tracking-wide text-rose-300 uppercase">
              <Tag size={11} className="text-rose-400" />
              SÓ AGORA · 50% OFF
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-600/40 text-[10px] sm:text-xs font-bold tracking-wide text-amber-300 uppercase">
              <Sparkles size={11} className="text-amber-400" />
              NÃO APARECERÁ NOVAMENTE
            </span>
          </div>

          {/* Price + CTA Header Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                + 12 MESES EXTRAS
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  12x de R$8
                </span>
                <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                  sem juros
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-400">ou <strong className="text-zinc-200">R$96</strong> à vista</span>
                <span className="text-xs text-zinc-500 line-through">R$192</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">
                Equivale a apenas <span className="text-amber-300 font-semibold">R$8/mês</span> — literalmente menos que um café.
              </p>
            </div>

            {/* CTA Button */}
            <div className="w-full md:w-auto shrink-0">
              <button
                onClick={handleCtaClick}
                className="w-full md:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-zinc-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>SIM! Quero aproveitar</span>
                <ArrowRight size={18} className="stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Features Checkmarks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-6 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Check size={10} className="text-emerald-400 stroke-[3]" />
              </div>
              <span>Mais 12 meses de Aurabio com todos os recursos</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Check size={10} className="text-emerald-400 stroke-[3]" />
              </div>
              <span>Até 3 perfis / páginas diferentes</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Check size={10} className="text-emerald-400 stroke-[3]" />
              </div>
              <span>Trackeamento completo e Meta Pixel</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Check size={10} className="text-emerald-400 stroke-[3]" />
              </div>
              <span>Sem reajuste durante todo o período</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Check size={10} className="text-emerald-400 stroke-[3]" />
              </div>
              <span>5 formatos cinematográficos inclusos</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Check size={10} className="text-emerald-400 stroke-[3]" />
              </div>
              <span>Garantia de 7 dias — devolvemos 100% se não gostar</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* LOWER VALUE CARDS (Sem risco & Some após sair) */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          
          {/* Card 1: Sem risco */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 text-left flex flex-col justify-start">
            <div className="w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <ShieldCheck size={16} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Sem risco
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Garantia incondicional de 7 dias. Não gostou, devolvemos tudo.
            </p>
          </div>

          {/* Card 2: Some após sair */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 text-left flex flex-col justify-start">
            <div className="w-8 h-8 rounded-xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Flame size={16} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Some após sair
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Essa página só carrega uma vez. Feche e ela desaparece de vez.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DECLINE LINK (Rodapé) */}
        {/* ------------------------------------------------------------- */}
        <button
          onClick={handleDeclineClick}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors cursor-pointer py-2"
        >
          Não, obrigado. Prefiro pagar o valor cheio depois.
        </button>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MINIMAL FOOTER BRANDING */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full border-t border-zinc-900/60 py-6 text-center text-xs text-zinc-600 flex items-center justify-center gap-2">
        <img src="/logo.png" alt="Aurabio" className="w-4 h-4 object-contain opacity-40" />
        <span>© {new Date().getFullYear()} Aurabio · Ambiente seguro com criptografia 256-bit</span>
      </footer>

    </div>
  );
};
