import React from 'react';
import type { BioPage, BioLink } from '../../types/bio';
import { useBio } from '../../context/BioContext';
import { SocialIcon } from '../ui/SocialIcons';
import { 
  CheckCircle, 
  ExternalLink, 
  Flame, 
  ArrowRight, 
  ArrowUpRight,
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
      className={`w-full min-h-full flex-1 flex flex-col justify-between items-center select-none pb-6 transition-all duration-300 relative ${
        isMinimal ? 'font-mono' : isEditorial ? 'font-editorial' : 'font-sans'
      }`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Upper Content Area */}
      <div className="w-full flex-1 flex flex-col items-center">
      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATOGRÁFICO LAYOUT (Impacto Máximo com Foto de Alta Resolução) */}
      {/* ------------------------------------------------------------- */}
      {isCinematic && (
        <header className="w-full relative select-none">
          {/* Hero Image Container (Tall Portrait Hero) */}
          <div className="w-full relative h-[420px] sm:h-[460px] overflow-hidden bg-zinc-950 flex items-center justify-center">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={page.name}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  objectPosition: `${page.avatarPosition?.x ?? 50}% ${page.avatarPosition?.y ?? 50}%`,
                  transform: `scale(${page.avatarZoom ?? 1})`
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-700">
                <UserIcon size={72} />
              </div>
            )}

            {/* Smooth Cinematic Edge Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Top Official Badge */}
            {page.verified && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl z-20">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: page.badgeColor || accentColor }} />
                <span className="text-[10px] font-black tracking-widest uppercase text-white font-sans">
                  {dict.official_badge}
                </span>
              </div>
            )}

            {/* Bottom Floating Title Overlay */}
            <div className="absolute bottom-6 left-0 right-0 px-6 text-center z-20 flex flex-col items-center">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight">
                {page.name || 'SEU NOME'}
              </h1>
            </div>
          </div>

          {/* Bio Description below hero */}
          {page.bio && (
            <div className="px-5 pt-2 pb-1 text-center">
              <div 
                className="text-[11px] sm:text-xs font-normal leading-snug whitespace-pre-line max-w-[300px] mx-auto opacity-85"
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
        <header className="w-full pt-6 pb-2 px-5 flex flex-col items-center text-center relative z-10 font-sans">
          {/* Avatar com Borda Iluminada e Selo Verificado */}
          <div className="relative mb-2.5 group">
            <div 
              className="p-1 rounded-full ring-2 shadow-xl transition-transform duration-300 group-hover:scale-105 bg-black/40"
              style={{
                borderColor: accentColor,
                boxShadow: `0 6px 20px ${accentColor}30`
              }}
            >
              {avatarUrl ? (
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden">
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
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                  <UserIcon size={30} />
                </div>
              )}
            </div>

            {page.verified && (
              <div 
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-zinc-950"
                style={{ backgroundColor: page.badgeColor || accentColor }}
                title={dict.official_badge}
              >
                <CheckCircle className="w-3.5 h-3.5 fill-white text-zinc-950 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Nome do Perfil */}
          <h1 
            className="text-xl sm:text-2xl font-black uppercase tracking-tight drop-shadow-sm"
            style={{ color: textColor }}
          >
            {page.name || 'SEU NOME'}
          </h1>

          {/* Bio / Bullet Points */}
          {page.bio && (
            <div 
              className="mt-2 max-w-[300px] text-[11px] sm:text-xs font-normal leading-snug whitespace-pre-line text-center px-2 opacity-85"
              style={{ color: secondaryTextColor }}
            >
              {page.bio}
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. EDITORIAL CLEAN LAYOUT (Estilo Revista / Doctor / Autoridade) */}
      {/* ------------------------------------------------------------- */}
      {isEditorial && (
        <header className="w-full pt-8 pb-4 px-6 flex flex-col items-center text-center relative z-10 font-editorial">
          {/* Foto Principal em Card Retangular com Cantos Arredondados */}
          <div className="w-[88%] max-w-[310px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl bg-zinc-900 mx-auto relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={page.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  objectPosition: `${page.avatarPosition?.x ?? 50}% ${page.avatarPosition?.y ?? 50}%`,
                  transform: `scale(${page.avatarZoom ?? 1})`
                }}
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                <UserIcon size={56} />
              </div>
            )}

            {page.verified && (
              <div 
                className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-black"
                style={{ backgroundColor: page.badgeColor || accentColor }}
                title={dict.official_badge}
              >
                <CheckCircle className="w-4 h-4 fill-white text-zinc-950 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Nome em Tipografia Serifa Elegante */}
          <h1 
            className="font-editorial text-2xl sm:text-[28px] font-bold uppercase tracking-[0.06em] text-white text-center mt-5 leading-tight"
          >
            {page.name || 'SEU NOME'}
          </h1>

          {/* Linha Vermelha de Destaque Abaixo do Nome */}
          <div 
            className="w-10 h-[2px] rounded-full mx-auto my-3" 
            style={{ backgroundColor: page.badgeColor || accentColor || '#dc2626' }} 
          />

          {/* Bio / Credenciais */}
          {page.bio && (
            <div 
              className="text-[11px] sm:text-xs font-editorial leading-snug text-zinc-300 max-w-[280px] mx-auto text-center px-2 whitespace-pre-line opacity-90"
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
            <div className="mt-2 text-[10px] sm:text-[11px] text-zinc-400 font-mono whitespace-pre-line max-w-[270px] leading-snug border-l-2 border-zinc-700 pl-2.5 text-left opacity-85">
              {page.bio}
            </div>
          )}
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. NEON GLOW LAYOUT (Halo Radiante & Tipografia Dual-Tone Neon) */}
      {/* ------------------------------------------------------------- */}
      {isNeon && (
        <header className="w-full pt-8 pb-4 px-6 flex flex-col items-center text-center relative z-10 font-sans">
          {/* Ambient Neon Radial Halo Background */}
          <div 
            className="absolute -top-10 inset-x-0 h-[380px] pointer-events-none opacity-90 blur-[60px]"
            style={{ 
              background: `radial-gradient(circle at 50% 35%, ${accentColor}80 0%, ${accentColor}30 45%, transparent 75%)` 
            }} 
          />

          {/* Avatar com Neon Glow Ring */}
          <div className="relative mb-3.5 group z-10">
            <div 
              className="p-1 rounded-full ring-2 shadow-2xl transition-transform duration-300 group-hover:scale-105 bg-black"
              style={{
                borderColor: accentColor,
                boxShadow: `0 0 25px ${accentColor}, inset 0 0 15px ${accentColor}40`
              }}
            >
              {avatarUrl ? (
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden">
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
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-600 border border-zinc-900">
                  <UserIcon size={32} />
                </div>
              )}
            </div>

            {page.verified && (
              <div 
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-black"
                style={{ backgroundColor: page.badgeColor || accentColor }}
                title={dict.official_badge}
              >
                <CheckCircle className="w-3.5 h-3.5 fill-white text-black stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Nome do Perfil com Tipografia Neon Dual-Tone */}
          <div className="relative z-10">
            {(() => {
              const nameParts = (page.name || 'SEU NOME').trim().split(' ');
              if (nameParts.length >= 2) {
                const firstName = nameParts[0];
                const restName = nameParts.slice(1).join(' ');
                return (
                  <h1 className="flex flex-col items-center leading-tight tracking-tight uppercase">
                    <span 
                      className="text-2xl sm:text-[28px] font-black text-transparent bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, #ffffff 40%, ${accentColor || '#dc2626'} 100%)`,
                        filter: `drop-shadow(0 0 12px ${accentColor || '#dc2626'}80)`
                      }}
                    >
                      {firstName}
                    </span>
                    <span 
                      className="text-xl sm:text-[22px] font-extrabold tracking-wider mt-0.5 text-transparent bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, ${accentColor || '#dc2626'} 20%, #ffffff 100%)`,
                        filter: `drop-shadow(0 0 16px ${accentColor || '#dc2626'})`
                      }}
                    >
                      {restName}
                    </span>
                  </h1>
                );
              }
              return (
                <h1 
                  className="text-2xl sm:text-[28px] font-black uppercase tracking-tight text-center leading-tight text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, #ffffff 30%, ${accentColor || '#dc2626'} 100%)`,
                    filter: `drop-shadow(0 0 18px ${accentColor || '#dc2626'}90)`
                  }}
                >
                  {page.name || 'SEU NOME'}
                </h1>
              );
            })()}
          </div>

          {/* Bio Description */}
          {page.bio && (
            <div 
              className="mt-2 text-[11px] sm:text-xs font-normal opacity-85 leading-snug whitespace-pre-line max-w-[290px] text-center z-10"
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
                    ? 'rounded-[26px] border border-zinc-800/80 shadow-2xl hover:border-zinc-500 hover:scale-[1.015]'
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

                {/* ---------------- FORMAT: RECTANGULAR FULL BANNER (EDGE-TO-EDGE) ---------------- */}
                {isRectangular ? (
                  <div className={`relative w-full aspect-4/3 sm:aspect-16/10 overflow-hidden bg-black/60 shadow-xl group ${isEditorial ? 'rounded-[26px]' : 'rounded-2xl'}`}>
                    {link.imageUrl ? (
                      <img
                        src={link.imageUrl}
                        alt={link.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[180px] bg-zinc-900 flex items-center justify-center p-6 text-center">
                        <span className="text-zinc-600 font-bold text-sm">Sem imagem cadastrada</span>
                      </div>
                    )}

                    {/* Gradient shading for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Top-left Badges (MAIS ACESSADO / TOP CHOICE) */}
                    {isFeatured && (
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-20">
                        <span 
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg text-white shadow-lg border border-white/20 backdrop-blur-md animate-pulse"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Flame size={11} className="fill-current" />
                          {dict.most_accessed}
                        </span>
                      </div>
                    )}

                    {/* Top-right Direct Action Indicator Arrow */}
                    <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-110 transition-all shadow-md z-20">
                      {isEditorial ? <ArrowUpRight size={16} strokeWidth={2.5} /> : <ExternalLink size={13} />}
                    </div>

                    {/* Bottom Title & Subtitle overlaid directly on the image */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-left z-20">
                      <h3 className={`text-sm sm:text-base uppercase text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,1)] line-clamp-2 ${isEditorial ? 'font-editorial font-bold leading-snug' : 'font-black'}`}>
                        {link.title}
                      </h3>
                      {link.subtitle && (
                        <p className={`text-[11px] sm:text-xs text-zinc-300 line-clamp-1 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${isEditorial ? 'font-editorial' : 'font-medium'}`}>
                          {link.subtitle}
                        </p>
                      )}
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
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER BRANDING (Removível pelo painel) */}
      {/* ------------------------------------------------------------- */}
      {!page.hideBranding && (
        <footer className="w-full mt-auto pt-8 pb-3 flex flex-col items-center justify-center gap-1 opacity-60 hover:opacity-100 transition-opacity shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
            <img src="/logo.png" alt="Aurabio" className="w-3.5 h-3.5 object-contain" />
            <span>{dict.made_with} <strong className="font-extrabold">Aurabio</strong></span>
          </div>
        </footer>
      )}
    </div>
  );
};
