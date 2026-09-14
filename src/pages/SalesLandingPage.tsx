import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Palette, 
  Layers, 
  BarChart3, 
  Zap, 
  Link2, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Crown
} from 'lucide-react';

export const SalesLandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleGoToApp = () => {
    // Navigate directly to the root members login / creator panel
    window.location.href = '/';
  };

  const formats = [
    {
      name: 'Cinema',
      tag: 'FORMATO',
      gradient: 'from-zinc-900 via-black to-zinc-950',
      border: 'border-zinc-800',
      textColor: 'text-white'
    },
    {
      name: 'Retrato',
      tag: 'FORMATO',
      gradient: 'from-pink-600 via-rose-700 to-pink-900',
      border: 'border-pink-500/40',
      textColor: 'text-white'
    },
    {
      name: 'Editorial',
      tag: 'FORMATO',
      gradient: 'from-amber-200 via-amber-300 to-amber-600',
      border: 'border-amber-400/40',
      textColor: 'text-zinc-950 font-serif'
    },
    {
      name: 'Obsidian Minimal',
      tag: 'FORMATO',
      gradient: 'from-zinc-900 via-zinc-950 to-black',
      border: 'border-zinc-700',
      textColor: 'text-white font-sans'
    },
    {
      name: 'Neon Glow',
      tag: 'FORMATO',
      gradient: 'from-cyan-400 via-blue-600 to-indigo-900',
      border: 'border-cyan-400/40',
      textColor: 'text-white'
    }
  ];

  const CHECKOUT_URL_3 = "https://checkout.aurabio.link/subscribe/aurabio-3-perfis";
  const CHECKOUT_URL_10 = "https://checkout.aurabio.link/subscribe/aurabio-10-perfis";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-600 selection:text-white font-sans antialiased overflow-x-hidden pb-20 sm:pb-0">
      
      {/* ------------------------------------------------------------- */}
      {/* NAVBAR */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={handleGoToApp}>
            <img src="/logo.png" alt="Aurabio Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">Aurabio</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#formatos" className="hover:text-white transition-colors">Exemplos</a>
            <a href="#precos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a 
              href="/"
              className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              Entrar
            </a>
            <a 
              href="#precos"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Testar 7 Dias Grátis</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 sm:pt-24 sm:pb-32 px-5 sm:px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-pink-900/20 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none" />

        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] sm:text-xs font-medium text-zinc-300 mb-6 sm:mb-8 shadow-inner animate-pulse">
          <Sparkles size={13} className="text-purple-400" />
          <span>7 Dias de Teste Grátis · Cancele Quando Quiser</span>
        </div>

        {/* Big Impact Headline */}
        <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-sm">
          Sua bio <br />
          profissional. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
            Impacto real.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 max-w-2xl text-sm sm:text-lg text-zinc-400 font-normal leading-relaxed px-2">
          Páginas cinematográficas, cards estilo banner, cores 100% suas, trackeamento e Meta Pixel. Escolha planos de <strong className="text-white font-bold">até 3 ou 10 perfis</strong> na mesma conta.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-9 flex flex-col items-center gap-3.5 w-full sm:w-auto">
          <a
            href="#precos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base transition-all shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span>Experimente 7 dias grátis</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <p className="mt-3 text-[11px] text-zinc-500">
          7 dias de teste gratuito sem cobrança imediata · Cancele em 1 clique a qualquer momento
        </p>

        {/* Trust Badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-sm font-medium text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Check size={15} className="text-emerald-400" />
            7 dias de teste grátis
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={15} className="text-emerald-400" />
            Cancele quando quiser
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={15} className="text-emerald-400" />
            Até 3 ou 10 perfis inclusos
          </span>
        </div>

        {/* 3 Phone Mockups Showcase with smooth float animations */}
        <div className="mt-12 sm:mt-20 w-full max-w-5xl flex items-center justify-center gap-4 sm:gap-8 relative z-10 px-2 sm:px-4">
          {/* Left Mockup */}
          <div className="w-1/3 max-w-[240px] aspect-[9/18] rounded-[28px] sm:rounded-[40px] p-2 sm:p-3 bg-zinc-950 border-2 border-zinc-800 shadow-2xl overflow-hidden transform -rotate-6 translate-y-6 opacity-75 hover:opacity-100 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hidden sm:block">
            <div className="w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-purple-600 via-pink-700 to-black p-4 flex flex-col justify-between">
              <div className="pt-2 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-1.5 ring-2 ring-pink-300 p-0.5 overflow-hidden bg-black shadow-md">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" alt="Joana" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-pink-200 font-bold">FOTÓGRAFA & EDITORA</span>
                <h4 className="text-sm font-black text-white mt-0.5">@joana.creator</h4>
              </div>
              <div className="space-y-2 pb-2">
                <div className="w-full h-8 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between px-2.5">
                  <span className="text-[10px] font-bold text-white">Preset Cinema Pack</span>
                  <ExternalLink size={10} className="text-pink-300" />
                </div>
                <div className="w-full h-8 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between px-2.5">
                  <span className="text-[10px] font-bold text-white">Portfólio 2026</span>
                  <ExternalLink size={10} className="text-pink-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Main Mockup (Active floating pulse) */}
          <div className="w-full sm:w-1/3 max-w-[290px] aspect-[9/18] rounded-[36px] sm:rounded-[46px] p-2.5 sm:p-3.5 bg-zinc-950 border-4 border-zinc-700 shadow-[0_25px_70px_rgba(0,0,0,0.9)] ring-1 ring-white/15 overflow-hidden z-20 hover:scale-105 transition-all duration-500 animate-in fade-in zoom-in-95">
            <div className="w-full h-full rounded-[28px] sm:rounded-[38px] overflow-hidden bg-gradient-to-b from-cyan-400 via-blue-700 to-black p-4 flex flex-col justify-between relative">
              <div className="pt-4 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-2 ring-2 ring-cyan-300 p-0.5 overflow-hidden bg-black shadow-lg">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" alt="Lucas Trader" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-200 font-bold">TRADER & EDUCADOR</span>
                <h4 className="text-base font-black text-white mt-0.5">@lucas.trader</h4>
              </div>
              <div className="space-y-2.5 pb-2">
                <div className="w-full h-10 bg-black/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md flex items-center justify-between px-3">
                  <span className="text-xs font-bold text-white">Mentoria V.I.P</span>
                  <ExternalLink size={12} className="text-cyan-300" />
                </div>
                <div className="w-full h-10 bg-black/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md flex items-center justify-between px-3">
                  <span className="text-xs font-bold text-white">Canal no Telegram</span>
                  <ExternalLink size={12} className="text-cyan-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="w-1/3 max-w-[240px] aspect-[9/18] rounded-[28px] sm:rounded-[40px] p-2 sm:p-3 bg-zinc-950 border-2 border-zinc-800 shadow-2xl overflow-hidden transform rotate-6 translate-y-6 opacity-75 hover:opacity-100 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hidden sm:block">
            <div className="w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-amber-500 via-orange-700 to-black p-4 flex flex-col justify-between">
              <div className="pt-2 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-1.5 ring-2 ring-amber-300 p-0.5 overflow-hidden bg-black shadow-md">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" alt="Studio Aura" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-amber-200 font-bold">AGÊNCIA CRIATIVA</span>
                <h4 className="text-sm font-black text-white mt-0.5">@studio.aura</h4>
              </div>
              <div className="space-y-2 pb-2">
                <div className="w-full h-8 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between px-2.5">
                  <span className="text-[10px] font-bold text-white">Orçamento WhatsApp</span>
                  <ExternalLink size={10} className="text-amber-300" />
                </div>
                <div className="w-full h-8 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between px-2.5">
                  <span className="text-[10px] font-bold text-white">Casos de Sucesso</span>
                  <ExternalLink size={10} className="text-amber-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* METRICS / STATS BAR */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full border-y border-zinc-900 bg-zinc-950/60 backdrop-blur-md py-10 sm:py-12 px-5 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">+2.400</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">CRIADORES ATIVOS</div>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">+890k</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">CLIQUES / MÊS</div>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">3 OU 10</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 mt-1">PERFIS POR CONTA</div>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">100%</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">SEM ANÚNCIOS</div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURES GRID SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="recursos" className="py-20 sm:py-32 px-5 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">RECURSOS COMPLETOS</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3 leading-tight">
            Tudo o que outras plataformas cobram <span className="text-zinc-600">R$50/mês.</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base mt-3">
            Design cinematográfico, múltiplas páginas, métricas completas e liberdade total.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Palette size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Design cinematográfico</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              5 formatos prontos: cinema, retrato, editorial, minimal e neon. Cores 100% customizáveis.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Múltiplos perfis por conta</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Marca pessoal, negócio, projetos paralelos ou clientes — tudo separado na mesma assinatura.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Trackeamento real</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Visitas, cliques por link, CTR. Dados atômicos gravados no banco de dados.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Meta Pixel integrado</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Cole seu Pixel ID e dispare PageView e Lead automático para seus anúncios.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Link2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">URL exclusiva</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              aurabio.link/seunome — memorável, rápida, curta e profissional.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sem propaganda</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Zero marca d'água, zero anúncios. É a sua página, 100% personalizada.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5 FORMATS SHOWCASE SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="formatos" className="py-20 sm:py-28 px-5 sm:px-6 bg-zinc-950/40 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">ESTILOS EXCLUSIVOS</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3">
            5 estéticas. Uma escolha.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base mt-3 max-w-xl mx-auto">
            Escolha o formato que combina com a sua marca. Troque quantas vezes quiser.
          </p>

          <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
            {formats.map((fmt, idx) => (
              <div 
                key={idx}
                className="group relative rounded-3xl p-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl overflow-hidden active:scale-95"
              >
                <div className={`w-full aspect-[9/16] rounded-[22px] bg-gradient-to-b ${fmt.gradient} p-4 flex flex-col justify-end text-left relative overflow-hidden shadow-inner`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      {fmt.tag}
                    </span>
                    <h3 className={`text-sm sm:text-base font-black ${fmt.textColor}`}>
                      {fmt.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PRICING & CHECKOUT SECTION (2 PLANS + 7 DIAS GRÁTIS) */}
      {/* ------------------------------------------------------------- */}
      <section id="precos" className="py-20 sm:py-32 px-5 sm:px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-purple-900/20 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles size={13} />
          <span>7 DIAS DE TESTE GRÁTIS · TESTE SEM RISCO</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
          Experimente por 7 Dias Grátis. <br className="hidden sm:inline" /> Escolha o plano ideal.
        </h2>
        <p className="text-zinc-400 text-xs sm:text-base mt-3 max-w-lg mx-auto">
          Crie seus perfis e teste todos os recursos sem pagar nada hoje. Cancele quando quiser com 1 clique.
        </p>

        {/* 2 PRICING CARDS GRID */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch relative z-10 text-left">
          
          {/* PLANO 1: ATÉ 3 PERFIS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 shadow-2xl flex flex-col justify-between relative transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  7 DIAS GRÁTIS
                </div>
                <span className="text-xs text-zinc-400 font-semibold">Até 3 Perfis</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Até 3 Perfis
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Ideal para criadores, freelancers e negócios individuais.
              </p>

              {/* Price */}
              <div className="mt-6 mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">R$ 0</span>
                  <span className="text-xs sm:text-sm text-emerald-400 font-bold">nos primeiros 7 dias</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mt-1.5">
                  Após os 7 dias: 12x de <strong className="text-white font-bold">R$ 19,70</strong> ou R$ 197/ano
                </p>
              </div>

              <div className="w-full h-px bg-zinc-900 my-6" />

              {/* Feature List */}
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>7 dias de teste 100% gratuito</strong> sem risco</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Até <strong>3 perfis / páginas</strong> independentes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Links e botões <strong>ilimitados</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>5 formatos</strong> cinematográficos & minimalistas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Trackeamento completo (visitas, cliques, CTR)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Meta Pixel integrado (PageView & Lead)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>URLs exclusivas <strong>aurabio.link/seunome</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Sem marca d'água e sem anúncios</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-4">
              <a
                href={CHECKOUT_URL_3}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-102 active:scale-98 cursor-pointer text-center"
              >
                <span>Experimente 7 dias grátis</span>
                <ArrowRight size={16} />
              </a>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
                <Lock size={12} className="text-emerald-500" />
                <span>Ambiente seguro · Cancele em 1 clique a qualquer momento</span>
              </div>
            </div>
          </div>

          {/* PLANO 2: ATÉ 10 PERFIS (DESTACADO) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border-2 border-purple-500/60 shadow-[0_0_60px_rgba(168,85,247,0.2)] ring-1 ring-purple-400/30 flex flex-col justify-between relative transition-all duration-300">
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Crown size={12} />
              <span>MAIS RECOMENDADO</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  7 DIAS GRÁTIS
                </div>
                <span className="text-xs text-purple-300 font-bold">Até 10 Perfis</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Até 10 Perfis
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Para quem gerencia múltiplos projetos, marcas ou clientes de agência.
              </p>

              {/* Price */}
              <div className="mt-6 mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">R$ 0</span>
                  <span className="text-xs sm:text-sm text-emerald-400 font-bold">nos primeiros 7 dias</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mt-1.5">
                  Após os 7 dias: 12x de <strong className="text-white font-bold">R$ 39,70</strong> ou R$ 397/ano
                </p>
              </div>

              <div className="w-full h-px bg-zinc-900 my-6" />

              {/* Feature List */}
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>7 dias de teste 100% gratuito</strong> sem risco</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Até <strong>10 perfis / páginas</strong> independentes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Links e botões <strong>ilimitados</strong> em cada página</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>5 formatos</strong> cinematográficos & minimalistas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Trackeamento individualizado nos 10 perfis</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Meta Pixel dedicado para cada perfil</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>10 URLs exclusivas</strong> aurabio.link/...</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Sem marca d'água e sem anúncios</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-purple-400 shrink-0" />
                  <span><strong>Suporte Prioritário VIP</strong></span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-4">
              <a
                href={CHECKOUT_URL_10}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:scale-102 active:scale-98 cursor-pointer text-center"
              >
                <span>Experimente 7 dias grátis</span>
                <ArrowRight size={16} />
              </a>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
                <Lock size={12} className="text-emerald-500" />
                <span>Ambiente seguro · Cancele em 1 clique a qualquer momento</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ ACCORDION SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="py-20 sm:py-32 px-5 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">DÚVIDAS FREQUENTES</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3 leading-tight">
            Respondemos antes de você <br />
            perguntar.
          </h2>
        </div>

        {/* Unified FAQ Card Container */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-900 divide-y divide-zinc-900 overflow-hidden shadow-2xl">
          {[
            {
              q: 'Como funciona o teste gratuito de 7 dias?',
              a: 'Você cria sua conta e tem 7 dias completos para testar todos os recursos, criar seus perfis e publicar seus links. Nenhuma cobrança é feita hoje. Se gostar, a assinatura continua no plano escolhido (3 perfis por 12x R$ 19,70 ou 10 perfis por 12x R$ 39,70). Se não quiser continuar, basta cancelar antes dos 7 dias em 1 clique sem pagar nada.'
            },
            {
              q: 'Qual a diferença entre o plano de 3 perfis e o de 10 perfis?',
              a: 'O plano de até 3 perfis permite gerenciar até 3 páginas/slugs na mesma conta (R$ 197/ano ou 12x de R$ 19,70 após os 7 dias). Já o plano de até 10 perfis permite até 10 páginas simultâneas e suporte VIP (R$ 397/ano ou 12x de R$ 39,70 após os 7 dias).'
            },
            {
              q: 'Como funcionam os múltiplos perfis na mesma conta?',
              a: 'Você cria suas páginas independentes na mesma conta do Aurabio — cada uma com seu próprio slug (aurabio.link/seunome), cores, fotos, links e trackeamento de cliques separado.'
            },
            {
              q: 'Posso cancelar quando quiser?',
              a: 'Sim. Um clique dentro do painel ou pelo suporte e sua assinatura é cancelada imediatamente sem qualquer burocracia.'
            },
            {
              q: 'Funciona no Instagram, TikTok, WhatsApp e YouTube?',
              a: 'Sim! Basta colar o link da sua bio (ex: aurabio.link/seunome) no perfil de qualquer rede social ou enviar por mensagem.'
            },
            {
              q: 'Precisa de conhecimento técnico ou programador?',
              a: 'Zero. O painel do Aurabio é totalmente visual, intuitivo e rápido: você clica, edita em tempo real e salva na hora com visualização idêntica ao celular.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="transition-colors">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-zinc-500 text-lg font-light shrink-0 ml-4">
                  {openFaq === idx ? '×' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 sm:px-8 pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL BIG CTA CARD SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-10 px-5 sm:px-6 max-w-4xl mx-auto">
        <div className="rounded-[32px] sm:rounded-[36px] bg-zinc-950 border border-zinc-900 p-8 sm:p-16 text-center shadow-[0_20px_70px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col items-center">
          {/* Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />

          {/* User Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6">
            <span>👥 Junte-se a +2.400 criadores</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Sua bio profissional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
              começa hoje.
            </span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-medium max-w-md">
            Planos anuais a partir de 12x de R$ 19,70. Até 3 ou 10 perfis. Trackeamento real e design cinematográfico.
          </p>

          {/* Big CTA Button */}
          <a
            href="#precos"
            className="mt-7 sm:mt-8 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            <span>Experimente 7 dias grátis</span>
            <ArrowRight size={18} />
          </a>

          <p className="mt-4 text-[11px] text-zinc-500">
            7 dias de teste gratuito · Cancele quando quiser com 1 clique
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE STICKY BOTTOM BAR (Floating Conversion CTA) */}
      {/* ------------------------------------------------------------- */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">7 DIAS GRÁTIS</span>
          <span className="text-xs font-extrabold text-white">3 ou até 10 perfis</span>
        </div>
        <a
          href="#precos"
          className="flex-1 py-3 px-4 rounded-full bg-white text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-all"
        >
          <span>Testar Grátis</span>
          <ArrowRight size={14} />
        </a>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-zinc-900 bg-black py-12 px-6 mt-16 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Aurabio" className="w-5 h-5 object-contain" />
            <span>© {new Date().getFullYear()} Aurabio · Feito com obsessão por design</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#precos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/" className="hover:text-white transition-colors cursor-pointer">
              Entrar
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

