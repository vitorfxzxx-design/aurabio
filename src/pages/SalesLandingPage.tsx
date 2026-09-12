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
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock
} from 'lucide-react';

export const SalesLandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleGoToApp = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Como funciona a cobrança de R$16/mês?',
      a: 'O plano anual é cobrado em 12x de apenas R$16 sem nenhum reajuste ou taxas ocultas. Você tem acesso ilimitado a todas as ferramentas, novos temas e atualizações.'
    },
    {
      q: 'Posso usar meu próprio domínio ou subdomínio?',
      a: 'Sim! Você recebe uma URL exclusiva e curta como aurabio.link/seunome, e pode também integrar seu subdomínio personalizado.'
    },
    {
      q: 'Quantos perfis posso criar na mesma conta?',
      a: 'Você pode criar e gerenciar até 3 páginas/perfis independentes dentro da mesma conta (ex: marca pessoal, agência, loja ou projeto paralelo).'
    },
    {
      q: 'O Meta Pixel e Google Analytics funcionam em tempo real?',
      a: 'Sim, basta colar o ID do seu Pixel ou Analytics na aba de rastreamento. Todos os eventos de pageview e cliques em links são disparados automaticamente para suas campanhas de retargeting.'
    },
    {
      q: 'Posso cancelar quando quiser?',
      a: 'Com certeza! O cancelamento pode ser feito a qualquer momento diretamente pelo painel em 1 clique, sem burocracia ou multas.'
    }
  ];

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
      name: 'Minimal',
      tag: 'FORMATO',
      gradient: 'from-zinc-100 via-zinc-200 to-zinc-400',
      border: 'border-zinc-300',
      textColor: 'text-zinc-900 font-mono'
    },
    {
      name: 'Neon',
      tag: 'FORMATO',
      gradient: 'from-cyan-400 via-blue-600 to-indigo-900',
      border: 'border-cyan-400/40',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-600 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* NAVBAR */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleGoToApp}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-black text-lg text-white">
                A
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">Aurabio</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#formatos" className="hover:text-white transition-colors">Exemplos</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGoToApp}
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
            >
              Entrar
            </button>
            <a 
              href="#precos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-98 cursor-pointer"
            >
              <span>Começar</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-pink-900/20 blur-[130px] rounded-full pointer-events-none" />

        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-zinc-300 mb-8 shadow-inner">
          <Sparkles size={13} className="text-purple-400" />
          <span>Nova geração de link na bio</span>
        </div>

        {/* Big Impact Headline */}
        <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-sm">
          Sua bio <br />
          profissional. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
            Impacto real.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          Página cinematográfica, cards estilo banner, cores 100% suas, trackeamento e Meta Pixel. Até <strong className="text-white font-bold">3 perfis diferentes</strong> na mesma conta.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#precos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-base transition-all shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Começar por R$16/mês</span>
            <ArrowRight size={18} />
          </a>

          <a
            href="#formatos"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-bold text-base border border-zinc-800 transition-all cursor-pointer"
          >
            Ver exemplos
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-zinc-400">
          <span className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400" />
            Sem taxa de setup
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400" />
            Cancele quando quiser
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400" />
            Até 3 perfis inclusos
          </span>
        </div>

        {/* 3 Phone Mockups Showcase */}
        <div className="mt-16 sm:mt-20 w-full max-w-5xl flex items-center justify-center gap-4 sm:gap-8 relative z-10 px-4">
          {/* Left Mockup */}
          <div className="w-1/3 max-w-[240px] aspect-[9/18] rounded-[28px] sm:rounded-[40px] p-2 sm:p-3 bg-zinc-950 border-2 border-zinc-800 shadow-2xl overflow-hidden transform -rotate-6 translate-y-6 opacity-75 hover:opacity-100 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hidden sm:block">
            <div className="w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-purple-600 via-pink-700 to-black p-4 flex flex-col justify-between">
              <div className="pt-2 text-center">
                <span className="text-[9px] uppercase tracking-widest text-pink-200 font-bold">FOTÓGRAFA & EDITORA</span>
                <h4 className="text-sm font-black text-white mt-0.5">@joana.creator</h4>
              </div>
              <div className="space-y-2 pb-2">
                <div className="w-full h-8 bg-black/50 rounded-xl border border-white/10" />
                <div className="w-full h-8 bg-black/50 rounded-xl border border-white/10" />
              </div>
            </div>
          </div>

          {/* Center Main Mockup */}
          <div className="w-full sm:w-1/3 max-w-[280px] aspect-[9/18] rounded-[36px] sm:rounded-[46px] p-2.5 sm:p-3.5 bg-zinc-950 border-4 border-zinc-700 shadow-[0_25px_70px_rgba(0,0,0,0.9)] ring-1 ring-white/15 overflow-hidden z-20 hover:scale-105 transition-all duration-500">
            <div className="w-full h-full rounded-[28px] sm:rounded-[38px] overflow-hidden bg-gradient-to-b from-cyan-400 via-blue-700 to-black p-4 flex flex-col justify-between">
              <div className="pt-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-cyan-200 font-bold">TRADER & EDUCADOR</span>
                <h4 className="text-base font-black text-white mt-0.5">@lucas.trader</h4>
              </div>
              <div className="space-y-2.5 pb-2">
                <div className="w-full h-10 bg-black/60 rounded-xl border border-white/15 shadow-md flex items-center justify-between px-3">
                  <span className="text-xs font-bold text-white">Mentoria V.I.P</span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </div>
                <div className="w-full h-10 bg-black/60 rounded-xl border border-white/15 shadow-md flex items-center justify-between px-3">
                  <span className="text-xs font-bold text-white">Canal no Telegram</span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="w-1/3 max-w-[240px] aspect-[9/18] rounded-[28px] sm:rounded-[40px] p-2 sm:p-3 bg-zinc-950 border-2 border-zinc-800 shadow-2xl overflow-hidden transform rotate-6 translate-y-6 opacity-75 hover:opacity-100 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hidden sm:block">
            <div className="w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-amber-500 via-orange-700 to-black p-4 flex flex-col justify-between">
              <div className="pt-2 text-center">
                <span className="text-[9px] uppercase tracking-widest text-amber-200 font-bold">AGÊNCIA CRIATIVA</span>
                <h4 className="text-sm font-black text-white mt-0.5">@studio.aura</h4>
              </div>
              <div className="space-y-2 pb-2">
                <div className="w-full h-8 bg-black/50 rounded-xl border border-white/10" />
                <div className="w-full h-8 bg-black/50 rounded-xl border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* METRICS / STATS BAR */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full border-y border-zinc-900 bg-zinc-950/60 backdrop-blur-md py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">+2.400</div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">CRIADORES USANDO</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">+890k</div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">CLIQUES TRACKEADOS/MÊS</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">3</div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">PERFIS POR CONTA</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">R$16</div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">POR MÊS. SÓ ISSO.</div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURES GRID SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="recursos" className="py-24 sm:py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">RECURSOS</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3 leading-tight">
            Tudo o que outras plataformas cobram <span className="text-zinc-600">R$50/mês.</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4">
            Só que aqui você paga R$16. E ainda tem mais recursos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Palette size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Design cinematográfico</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              5 formatos prontos: cinema, retrato, editorial, minimal e neon. Cores 100% customizáveis.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3 perfis por conta</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Marca pessoal, negócio, projeto paralelo — tudo separado, mesma assinatura.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Trackeamento real</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Visitas, cliques por link, CTR. Dados de verdade — não só do seu navegador.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Meta Pixel integrado</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Cole seu Pixel ID e faça retargeting em Instagram e Facebook Ads.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Link2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">URL exclusiva</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              aurabio.link/seunome — memorável, curta, sua.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl hover:border-zinc-700 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sem propaganda</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Zero marca d'água, zero anúncios. É a sua página, ponto final.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5 FORMATS SHOWCASE SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="formatos" className="py-20 sm:py-28 px-6 bg-zinc-950/40 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">FORMATOS</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3">
            5 estéticas. Uma escolha.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Escolha o formato que combina com a sua marca. Troque quantas vezes quiser.
          </p>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {formats.map((fmt, idx) => (
              <div 
                key={idx}
                className="group relative rounded-3xl p-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl overflow-hidden"
              >
                <div className={`w-full aspect-[9/16] rounded-[22px] bg-gradient-to-b ${fmt.gradient} p-4 flex flex-col justify-end text-left relative overflow-hidden shadow-inner`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      {fmt.tag}
                    </span>
                    <h3 className={`text-base font-black ${fmt.textColor}`}>
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
      {/* PRICING & CHECKOUT SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="precos" className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[140px] rounded-full pointer-events-none" />

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">PREÇO HONESTO</span>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3">
          Menos que um café. <span className="text-zinc-500">Todo mês.</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-3">
          Um plano. Todos os recursos. Cancele quando quiser.
        </p>

        {/* Pricing Card */}
        <div className="mt-12 max-w-md mx-auto p-8 rounded-3xl bg-zinc-950 border-2 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.15)] ring-1 ring-white/10 text-left relative z-10">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider mb-4 border border-purple-500/30">
            ANUAL
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">R$16</span>
            <span className="text-zinc-400 font-medium text-sm">/mês</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">12x de R$16 · sem reajuste no ano</p>

          <div className="w-full h-px bg-zinc-900 my-6" />

          {/* Feature List */}
          <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Até <strong>3 perfis / páginas</strong> diferentes</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Links <strong>ilimitados</strong> por página</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span><strong>5 formatos</strong> cinematográficos</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Trackeamento completo (visitas, cliques, CTR)</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Meta Pixel integrado</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>URL exclusiva <strong>aurabio.link/seunome</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Sem marca d'água, sem propaganda</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Upload de imagens e capas</span>
            </li>
          </ul>

          {/* Big CTA Button */}
          <button
            onClick={handleGoToApp}
            className="w-full mt-8 py-4 px-6 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>Assinar — 12x R$16</span>
            <ArrowRight size={18} />
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
            <Lock size={12} className="text-emerald-500" />
            <span>Pagamento seguro · Sem letras miúdas · Cancele em 1 clique</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ ACCORDION SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="py-20 sm:py-28 px-6 max-w-3xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">DÚVIDAS FREQUENTES</span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-2">
            Perguntas & Respostas
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp size={18} className="text-purple-400 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-zinc-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-900/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-zinc-900 bg-black py-12 px-6 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="font-bold text-zinc-300">Aurabio</span>
            <span>— Links de Alta Conversão</span>
          </div>

          <div>
            © {new Date().getFullYear()} Aurabio. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleGoToApp} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              Área de Membros
            </button>
            <a href="#/master" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Master Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
