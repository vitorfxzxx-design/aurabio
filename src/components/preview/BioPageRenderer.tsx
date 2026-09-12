import React from 'react';
import type { BioPage, BioLink } from '../../types/bio';
import { useBio } from '../../context/BioContext';
import { SocialIcon } from '../ui/SocialIcons';
import { 
  CheckCircle, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ChevronRight, 
  Zap,
  User as UserIcon
} from 'lucide-react';
import { THEME_PRESETS } from '../../data/defaultData';
import { TRANSLATIONS, type Language } from '../../utils/translations';

interface BioPageRendererProps {
  page: BioPage;
  isInteractive?: boolean;
  onLinkClick?: (linkId: string) => void;
  scale?: number;
}

export const BioPageRenderer: React.FC<BioPageRendererProps> = ({
  page,
  isInteractive = true,
  onLinkClick,
}) => {
  const { language: currentGlobalLang } = useBio();
  const themePreset = THEME_PRESETS.find(t => t.id === page.theme) || THEME_PRESETS[0];

  const bgColor = page.customColors?.bgColor || themePreset.bg || '#000000';
  const cardBgColor = page.customColors?.cardBgColor || themePreset.cardBg || '#0a0a0a';
  const textColor = page.customColors?.textColor || themePreset.textColor || '#ffffff';
  const accentColor = page.customColors?.accentColor || themePreset.accentColor || '#e11d2e';
  const secondaryTextColor = page.customColors?.secondaryTextColor || '#a3a3a3';

  const lang: Language = (page.language || currentGlobalLang || 'pt') as Language;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.pt;

  const activeLinks = (page.links || []).filter(l => l.active);
  const activeSocials = (page.socialLinks || []).filter(s => s.active);

  const handleCardClick = (link: BioLink, e: React.MouseEvent) => {
    if (!isInteractive) {
      e.preventDefault();
      return;
    }
    if (onLinkClick) {
      onLinkClick(link.id);
    }
  };

  const layout = page.layout || 'creator-portrait';
  const isCinematic = layout === 'cinematic';
  const isEditorial = layout === 'editorial' || layout === 'editorial-clean';
  const isMinimal = layout === 'minimal-mono';
  const isNeon = layout === 'neon-glow';
  const isCreatorPortrait = (layout === 'creator-portrait') || (!isCinematic && !isEditorial && !isMinimal && !isNeon);

  const avatarUrl = page.avatarUrl;

  return (
    <div 
      className={`w-full flex-1 flex flex-col items-center select-none pb-12 transition-all duration-300 relative ${
        isMinimal ? 'font-mono' : isEditorial ? 'font-serif' : 'font-sans'
      }`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATOGRÁFICO LAYOUT */}
      {/* ------------------------------------------------------------- */}
      {isCinematic && (
        <header className="w-full relative">
          <div className="w-full relative h-72 sm:h-80 overflow-hidden shadow-2xl bg-zinc-900 flex items-center justify-center">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={page.name}
                className="w-full h-full object-cover object-top scale-105 transform hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-700">
                <UserIcon size={64} />
              </div>
            )}
            {/* Dark contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

            {/* Official Badge */}
            {page.verified && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <CheckCircle size={13} style={{ color: accentColor }} className="fill-current text-black" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-white font-sans">
                  {dict.official_badge}
                </span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-0 right-0 px-6 text-center">
              <span className="inline-block text-[9px] uppercase font-black tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white mb-1.5 border border-white/20">
                {dict.featured_profile}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {page.name || 'SEU NOME'}
              </h1>
            </div>
          </div>

          {page.bio && (
            <div className="px-6 pt-3 pb-1 text-center">
              <div 
                className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line max-w-sm mx-auto"
                style={{ color: secondaryTextColor }}
              >
                {page.bio}
              </div>
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. RETRATO CRIADOR LAYOUT (Padrão de Alta Autoridade) */}
      {/* ------------------------------------------------------------- */}
      {isCreatorPortrait && (
        <header className="w-full pt-8 pb-3 px-6 flex flex-col items-center text-center relative z-10 font-sans">
          {/* Avatar com Borda Iluminada e Selo Verificado */}
          <div className="relative mb-3.5 group">
            <div 
              className="p-1 rounded-full ring-2 shadow-2xl transition-transform duration-300 group-hover:scale-105 bg-black/40"
              style={{
                borderColor: accentColor,
                boxShadow: `0 8px 30px ${accentColor}40`
              }}
            >
              {avatarUrl ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden">
                  <img
                    src={avatarUrl}
                    alt={page.name}
                    className="w-full h-full object-cover shadow-inner"
                    style={{
                      objectPosition: `${page.avatarPosition?.x ?? 50}% ${page.avatarPosition?.y ?? 50}%`,
                      transform: `scale(${page.avatarZoom ?? 1})`
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                  <UserIcon size={36} />
                </div>
              )}
            </div>

            {page.verified && (
              <div 
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-zinc-950"
                style={{ backgroundColor: page.badgeColor || accentColor }}
                title={dict.official_badge}
              >
                <CheckCircle className="w-4 h-4 fill-white text-zinc-950 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Nome do Perfil */}
          <h1 
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm"
            style={{ color: textColor }}
          >
            {page.name || 'SEU NOME'}
          </h1>

          {/* Bio / Bullet Points */}
          {page.bio && (
            <div 
              className="mt-2.5 max-w-sm text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-center px-2"
              style={{ color: secondaryTextColor }}
            >
              {page.bio}
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. EDITORIAL CLEAN LAYOUT (Estilo Revista / Luxo / Serifa) */}
      {/* ------------------------------------------------------------- */}
      {isEditorial && (
        <header className="w-full pt-10 pb-4 px-6 flex flex-col items-center text-center relative z-10 font-serif">
          {/* Avatar com Moldura Suave / Squircle Editorial */}
          <div className="relative mb-4">
            <div 
              className="p-1.5 rounded-[30px] border shadow-2xl bg-white/5 backdrop-blur-md transition-transform duration-500 hover:scale-105"
              style={{ 
                borderColor: `${accentColor}80`,
                boxShadow: `0 12px 35px ${accentColor}25`
              }}
            >
              {avatarUrl ? (
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-[24px] overflow-hidden">
                  <img
                    src={avatarUrl}
                    alt={page.name}
                    className="w-full h-full object-cover shadow-sm"
                    style={{
                      objectPosition: `${page.avatarPosition?.x ?? 50}% ${page.avatarPosition?.y ?? 50}%`,
                      transform: `scale(${page.avatarZoom ?? 1})`
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-[24px] bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800 font-sans">
                  <UserIcon size={34} />
                </div>
              )}
            </div>

            {page.verified && (
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-sans font-black text-white shadow-lg border border-white/20 flex items-center gap-1"
                style={{ backgroundColor: accentColor }}
              >
                <CheckCircle size={10} className="fill-current text-white stroke-[2]" />
                <span>{dict.official_badge}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1.5 opacity-70">
            <div className="w-4 h-px" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] font-semibold">
              Curated Edition
            </span>
            <div className="w-4 h-px" style={{ backgroundColor: accentColor }} />
          </div>

          <h1 
            className="text-2xl sm:text-3xl font-serif font-normal tracking-wide drop-shadow-sm"
            style={{ color: textColor }}
          >
            {page.name || 'SEU NOME'}
          </h1>

          <div className="w-12 h-px my-3" style={{ backgroundColor: `${accentColor}70` }} />

          {page.bio && (
            <div 
              className="text-xs sm:text-sm font-sans font-normal opacity-90 leading-relaxed whitespace-pre-line max-w-sm px-4"
              style={{ color: secondaryTextColor }}
            >
              {page.bio}
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MINIMAL MONO LAYOUT */}
      {/* ------------------------------------------------------------- */}
      {isMinimal && (
        <header className="w-full pt-8 pb-4 px-6 flex flex-col items-center text-center relative z-10 font-mono">
          <div className="relative mb-3">
            <div className="w-18 h-18 rounded-full border-2 border-zinc-700 p-0.5 bg-zinc-900 shadow-md overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={page.name}
                  className="w-full h-full rounded-full object-cover grayscale contrast-125"
                  style={{
                    objectPosition: `${page.avatarPosition?.x ?? 50}% ${page.avatarPosition?.y ?? 50}%`,
                    transform: `scale(${page.avatarZoom ?? 1})`
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center text-zinc-600 bg-zinc-950">
                  <UserIcon size={24} />
                </div>
              )}
            </div>
            {page.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                <CheckCircle size={11} className="text-black stroke-[3]" />
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-1 text-[10px] text-zinc-500 mb-1">
            <span>root@aurabio:~#</span>
            <span className="w-1.5 h-3 bg-emerald-400 animate-pulse" />
          </div>

          <h1 
            className="text-lg sm:text-xl font-bold uppercase tracking-widest"
            style={{ color: textColor }}
          >
            {page.name || 'SEU NOME'}
          </h1>

          {page.bio && (
            <div className="mt-2 text-[11px] text-zinc-400 font-mono whitespace-pre-line max-w-xs leading-relaxed border-l-2 border-zinc-700 pl-3 text-left">
              {page.bio}
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. NEON GLOW LAYOUT */}
      {/* ------------------------------------------------------------- */}
      {isNeon && (
        <header className="w-full pt-10 pb-4 px-6 flex flex-col items-center text-center relative z-10">
          <div 
            className="absolute top-6 w-56 h-56 rounded-full opacity-40 blur-[80px] pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative mb-4 group">
            <div 
              className="p-1 rounded-2xl backdrop-blur-xl border transition-all duration-500 group-hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: accentColor,
                boxShadow: `0 0 35px ${accentColor}60, inset 0 0 15px ${accentColor}30`
              }}
            >
              {avatarUrl ? (
                <div className="w-24 h-24 rounded-xl overflow-hidden">
                  <img
                    src={avatarUrl}
                    alt={page.name}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `${page.avatarPosition?.x ?? 50}% ${page.avatarPosition?.y ?? 50}%`,
                      transform: `scale(${page.avatarZoom ?? 1})`
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                  <UserIcon size={34} />
                </div>
              )}
            </div>

            {page.verified && (
              <div 
                className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-black flex items-center gap-1 shadow-lg"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 15px ${accentColor}`
                }}
              >
                <Zap size={10} className="fill-current" />
                <span>PRO</span>
              </div>
            )}
          </div>

          <h1 
            className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            {page.name || 'SEU NOME'}
          </h1>

          {page.bio && (
            <div 
              className="mt-2 text-xs sm:text-sm font-medium opacity-90 leading-relaxed whitespace-pre-line max-w-sm text-center"
              style={{ color: secondaryTextColor }}
            >
              {page.bio}
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SOCIAL ICONS BAR */}
      {/* ------------------------------------------------------------- */}
      {activeSocials.length > 0 && (
        <nav className="w-full px-6 flex items-center justify-center gap-3 my-3.5 relative z-10 flex-wrap">
          {activeSocials.map(soc => (
            <a
              key={soc.id}
              href={isInteractive ? soc.url : '#'}
              target={isInteractive ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-115 active:scale-95 shadow-md flex items-center justify-center ${
                isNeon 
                  ? 'border border-white/10 backdrop-blur-md hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : isEditorial
                  ? 'rounded-full border border-zinc-700/40 hover:border-zinc-500'
                  : isMinimal
                  ? 'rounded-none border border-zinc-700 hover:bg-white hover:text-black'
                  : 'rounded-full border border-zinc-800/80 hover:border-zinc-600'
              }`}
              style={{
                backgroundColor: isMinimal ? '#000000' : cardBgColor,
                color: textColor,
              }}
              title={soc.platform}
            >
              <SocialIcon platform={soc.platform} size={18} />
            </a>
          ))}
        </nav>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HIGH CONVERSION LINK CARDS */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full max-w-[440px] px-4 flex flex-col gap-3.5 mt-2 relative z-10">
        {activeLinks.length === 0 ? (
          <div className="text-center py-8 opacity-40 text-xs font-medium">
            {dict.no_links}
          </div>
        ) : (
          activeLinks.map((link) => {
            const isRectangular = link.format === 'rectangular';
            const isFeatured = !!link.isFeatured;

            return (
              <a
                key={link.id}
                href={isInteractive ? link.url : '#'}
                target={isInteractive ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={(e) => handleCardClick(link, e)}
                className={`group relative w-full overflow-hidden transition-all duration-300 block cursor-pointer ${
                  isNeon
                    ? 'rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02]'
                    : isEditorial
                    ? 'rounded-2xl border border-zinc-800/60 shadow-md hover:border-zinc-500 hover:scale-[1.015]'
                    : isMinimal
                    ? 'rounded-none border border-zinc-700 hover:border-emerald-400 hover:bg-zinc-900/90'
                    : 'rounded-2xl border border-zinc-800/80 shadow-lg hover:border-zinc-600 hover:scale-[1.02]'
                }`}
                style={{
                  backgroundColor: cardBgColor,
                }}
              >
                {/* Visual Glow overlay on card hover for NEON */}
                {isNeon && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                  />
                )}

                {/* ---------------- FORMAT: RECTANGULAR BANNER ---------------- */}
                {isRectangular ? (
                  <div className="flex flex-col w-full">
                    {link.imageUrl && (
                      <div className="relative w-full h-44 overflow-hidden bg-black/40">
                        <img
                          src={link.imageUrl}
                          alt={link.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                        {/* Top-left Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {isFeatured && (
                            <span 
                              className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg text-white shadow-lg border border-white/20 animate-pulse"
                              style={{ backgroundColor: accentColor }}
                            >
                              <Flame size={11} className="fill-current" />
                              {dict.most_accessed}
                            </span>
                          )}
                        </div>

                        {/* Top-right Action Button Indicator */}
                        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-110 transition-all shadow-md">
                          <ExternalLink size={13} />
                        </div>

                        {/* Title text over image */}
                        <div className="absolute bottom-2.5 left-3.5 right-3.5 text-left">
                          <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-1">
                            {link.title}
                          </h3>
                        </div>
                      </div>
                    )}

                    {/* Card Subtitle & Call-to-Action Bar */}
                    <div className="p-3.5 flex items-center justify-between gap-3 text-left">
                      <div className="flex-1 min-w-0">
                        {!link.imageUrl && (
                          <div className="flex items-center gap-2">
                            {isFeatured && (
                              <span 
                                className="inline-flex items-center gap-0.5 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded text-white shadow-sm shrink-0" 
                                style={{ backgroundColor: accentColor }}
                              >
                                <Flame size={9} className="fill-current" />
                                {dict.most_accessed}
                              </span>
                            )}
                            <h3 className="text-sm sm:text-base font-extrabold tracking-tight truncate">
                              {link.title}
                            </h3>
                          </div>
                        )}
                        {link.subtitle && (
                          <p 
                            className="text-xs truncate mt-0.5 font-medium"
                            style={{ color: secondaryTextColor }}
                          >
                            {link.subtitle}
                          </p>
                        )}
                      </div>

                      {/* CTA button with hover animation */}
                      <div 
                        className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-extrabold shrink-0 transition-transform group-hover:translate-x-1"
                        style={{
                          backgroundColor: `${accentColor}20`,
                          color: accentColor,
                          border: `1px solid ${accentColor}40`
                        }}
                      >
                        <span>{dict.access_cta}</span>
                        <ChevronRight size={13} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ---------------- FORMAT: SQUARE COMPACT ---------------- */
                  <div className="flex items-center p-3 sm:p-3.5 gap-3.5">
                    {link.imageUrl && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black/40 relative shadow-md">
                        <img
                          src={link.imageUrl}
                          alt={link.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {isFeatured && (
                          <div 
                            className="absolute top-1 left-1 p-0.5 rounded-md text-white shadow"
                            style={{ backgroundColor: accentColor }}
                            title={dict.most_accessed}
                          >
                            <Flame size={10} className="fill-current" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        {isFeatured && (
                          <span 
                            className="inline-flex items-center gap-0.5 text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded text-white shadow-sm shrink-0"
                            style={{ backgroundColor: accentColor }}
                          >
                            <Flame size={8} className="fill-current" />
                            {dict.most_accessed}
                          </span>
                        )}
                        <h3 className="text-sm font-extrabold tracking-tight truncate">
                          {link.title}
                        </h3>
                      </div>
                      {link.subtitle && (
                        <p 
                          className="text-xs truncate mt-0.5 font-medium"
                          style={{ color: secondaryTextColor }}
                        >
                          {link.subtitle}
                        </p>
                      )}
                    </div>

                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-sm"
                      style={{ 
                        backgroundColor: `${accentColor}20`, 
                        color: accentColor,
                        border: `1px solid ${accentColor}40`
                      }}
                    >
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                )}
              </a>
            );
          })
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER BRANDING (Removível pelo painel) */}
      {/* ------------------------------------------------------------- */}
      {!page.hideBranding && (
        <footer className="mt-auto pt-8 flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
            <Sparkles size={12} style={{ color: accentColor }} />
            <span>{dict.made_with} <strong className="font-extrabold">Aurabio</strong></span>
          </div>
        </footer>
      )}
    </div>
  );
};
