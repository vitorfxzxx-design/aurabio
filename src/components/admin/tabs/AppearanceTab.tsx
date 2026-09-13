import React from 'react';
import { useBio } from '../../../context/BioContext';
import { LAYOUT_PRESETS, THEME_PRESETS } from '../../../data/defaultData';
import { SUPPORTED_LANGUAGES, type Language } from '../../../utils/translations';
import type { PageLayout, PageTheme } from '../../../types/bio';
import { Globe } from 'lucide-react';

export const AppearanceTab: React.FC = () => {
  const { activePage, updateActivePage, language, setLanguage, t, showNotification } = useBio();

  const handleSelectLayout = (layoutId: PageLayout) => {
    updateActivePage(() => ({ layout: layoutId }));
    showNotification(`Layout alterado para "${LAYOUT_PRESETS.find(l => l.id === layoutId)?.name}"!`);
  };

  const handleSelectTheme = (themeId: PageTheme) => {
    const preset = THEME_PRESETS.find(t => t.id === themeId);
    if (preset) {
      updateActivePage(() => ({
        theme: themeId,
        customColors: {
          bgColor: preset.bg,
          textColor: preset.textColor,
          secondaryTextColor: '#a3a3a3',
          cardBgColor: preset.cardBg,
          accentColor: preset.accentColor,
        }
      }));
      showNotification(`Tema alterado para "${preset.name}"!`);
    }
  };

  const currentColors = activePage.customColors || {
    bgColor: '#000000',
    textColor: '#ffffff',
    secondaryTextColor: '#a3a3a3',
    cardBgColor: '#0a0a0a',
    accentColor: '#e11d2e',
  };

  const updateColor = (key: keyof typeof currentColors, val: string) => {
    updateActivePage(curr => {
      const prevColors = curr.customColors || currentColors;
      return {
        customColors: {
          ...prevColors,
          [key]: val,
        }
      };
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{t('appearance_title')}</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          {t('appearance_sub')}
        </p>
      </div>

      {/* NEW Section: Idioma do site */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-zinc-700" />
          <div>
            <h3 className="text-sm font-bold text-zinc-900">{t('language_section_title')}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {t('language_section_sub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code as Language)}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-md ring-2 ring-zinc-950/10'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100/80 text-zinc-800'
                }`}
              >
                <span className="text-2xl select-none">{lang.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">
                    {lang.nativeName}
                  </div>
                  <div className={`text-[10px] uppercase font-mono tracking-wider ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {lang.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Formato da página */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{t('page_format_title')}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t('page_format_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {LAYOUT_PRESETS.map((layout) => {
            const isActive = (activePage.layout || 'creator-portrait') === layout.id;

            return (
              <div
                key={layout.id}
                onClick={() => handleSelectLayout(layout.id as PageLayout)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isActive
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-xl ring-2 ring-zinc-950/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md text-zinc-900'
                }`}
              >
                {/* Visual miniature mockup */}
                <div className={`w-full h-28 rounded-xl mb-3 flex flex-col items-center justify-center p-3 relative overflow-hidden border shadow-inner ${
                  isActive ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-100/90 border-zinc-200'
                }`}>
                  {layout.id === 'cinematic' && (
                    <div className="w-full h-full flex flex-col justify-between">
                      <div className="w-full h-14 bg-zinc-700/80 rounded-lg flex items-end justify-center pb-1 relative overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="w-20 h-2 bg-white rounded font-extrabold relative z-10" />
                      </div>
                      <div className="w-full space-y-1.5 pt-1">
                        <div className="w-full h-3 bg-zinc-400/40 rounded-md" />
                      </div>
                    </div>
                  )}

                  {layout.id === 'creator-portrait' && (
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 h-8 rounded-full bg-zinc-400/80 ring-2 ring-red-500 shadow-md relative">
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border border-black" />
                      </div>
                      <div className="w-20 h-2 bg-zinc-400/90 rounded" />
                      <div className="w-full h-5 bg-zinc-400/30 rounded-lg border border-zinc-400/30" />
                    </div>
                  )}

                  {layout.id === 'editorial-clean' && (
                    <div className="flex flex-col items-center gap-1.5 w-full font-serif">
                      <div className="w-7 h-7 rounded-xl bg-zinc-400/50 border border-amber-500/50" />
                      <div className="w-24 h-1.5 bg-zinc-500/80 rounded" />
                      <div className="w-8 h-px bg-zinc-400 my-0.5" />
                      <div className="w-full h-4 bg-zinc-400/20 rounded-lg" />
                    </div>
                  )}

                  {layout.id === 'minimal-mono' && (
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-7 h-7 rounded-xl bg-zinc-300 ring-2 ring-zinc-700/60 shadow-lg" />
                      <div className="w-20 h-1.5 bg-zinc-300 rounded-full" />
                      <div className="w-full h-4 bg-zinc-800/80 rounded-lg border border-zinc-700" />
                    </div>
                  )}

                  {layout.id === 'neon-glow' && (
                    <div className="flex flex-col items-center gap-1.5 w-full relative">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500 shadow-[0_0_12px_#6366f1] ring-1 ring-white/50" />
                      <div className="w-16 h-1.5 bg-indigo-200 rounded shadow-[0_0_8px_#6366f1]" />
                      <div className="w-full h-5 bg-indigo-950/80 rounded-lg border border-indigo-500/50 shadow-[0_0_10px_#6366f125]" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      {layout.name}
                    </h4>
                    {isActive && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {t('active_badge')}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {layout.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Temas prontos */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{t('ready_themes_title')}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t('ready_themes_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {THEME_PRESETS.map((tPreset) => {
            const isThemeActive = activePage.theme === tPreset.id;

            return (
              <div
                key={tPreset.id}
                onClick={() => handleSelectTheme(tPreset.id as PageTheme)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isThemeActive
                    ? 'border-zinc-950 ring-2 ring-zinc-950/10 shadow-lg'
                    : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
                }`}
              >
                {/* Visual Palette Preview Card */}
                <div 
                  className="w-full h-24 rounded-xl mb-3 p-3 flex flex-col justify-between border shadow-inner"
                  style={{ backgroundColor: tPreset.bg, borderColor: tPreset.border }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-2 rounded" style={{ backgroundColor: tPreset.textColor, opacity: 0.8 }} />
                    <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: tPreset.accentColor }} />
                  </div>
                  <div 
                    className="w-full h-9 rounded-lg p-1.5 flex items-center gap-2 border"
                    style={{ backgroundColor: tPreset.cardBg, borderColor: tPreset.border }}
                  >
                    <div className="w-6 h-6 rounded-md" style={{ backgroundColor: tPreset.accentColor, opacity: 0.35 }} />
                    <div className="w-20 h-2 rounded" style={{ backgroundColor: tPreset.textColor, opacity: 0.8 }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900">{tPreset.name}</h4>
                    {isThemeActive && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-900 text-white">
                        {t('active_badge')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                    {tPreset.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Cores da página (Ajuste fino) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{t('fine_tune_colors_title')}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t('fine_tune_colors_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Cor de fundo */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700">{t('bg_color')}</label>
            <span className="block text-[10px] text-zinc-400 mb-1.5">{t('bg_color_sub')}</span>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-300 bg-white">
              <input
                type="color"
                value={currentColors.bgColor}
                onChange={(e) => updateColor('bgColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <input
                type="text"
                value={currentColors.bgColor.toUpperCase()}
                onChange={(e) => updateColor('bgColor', e.target.value)}
                className="flex-1 text-xs font-mono uppercase focus:outline-none"
              />
            </div>
          </div>

          {/* Cor do texto */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700">{t('text_color')}</label>
            <span className="block text-[10px] text-zinc-400 mb-1.5">{t('text_color_sub')}</span>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-300 bg-white">
              <input
                type="color"
                value={currentColors.textColor}
                onChange={(e) => updateColor('textColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <input
                type="text"
                value={currentColors.textColor.toUpperCase()}
                onChange={(e) => updateColor('textColor', e.target.value)}
                className="flex-1 text-xs font-mono uppercase focus:outline-none"
              />
            </div>
          </div>

          {/* Texto secundário */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700">{t('sec_text_color')}</label>
            <span className="block text-[10px] text-zinc-400 mb-1.5">{t('sec_text_color_sub')}</span>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-300 bg-white">
              <input
                type="color"
                value={currentColors.secondaryTextColor}
                onChange={(e) => updateColor('secondaryTextColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <input
                type="text"
                value={currentColors.secondaryTextColor.toUpperCase()}
                onChange={(e) => updateColor('secondaryTextColor', e.target.value)}
                className="flex-1 text-xs font-mono uppercase focus:outline-none"
              />
            </div>
          </div>

          {/* Cor dos cards */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700">{t('card_bg_color')}</label>
            <span className="block text-[10px] text-zinc-400 mb-1.5">{t('card_bg_color_sub')}</span>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-300 bg-white">
              <input
                type="color"
                value={currentColors.cardBgColor}
                onChange={(e) => updateColor('cardBgColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <input
                type="text"
                value={currentColors.cardBgColor.toUpperCase()}
                onChange={(e) => updateColor('cardBgColor', e.target.value)}
                className="flex-1 text-xs font-mono uppercase focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Cor de destaque */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{t('accent_color_title')}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t('accent_color_sub')}
          </p>
        </div>

        <div className="max-w-xs">
          <label className="block text-[11px] font-semibold text-zinc-700 mb-1.5">{t('accent_color_label')}</label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-300 bg-white">
            <input
              type="color"
              value={currentColors.accentColor}
              onChange={(e) => updateColor('accentColor', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
            />
            <input
              type="text"
              value={currentColors.accentColor.toUpperCase()}
              onChange={(e) => updateColor('accentColor', e.target.value)}
              className="flex-1 text-xs font-mono uppercase focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Marca no rodapé */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{t('footer_branding_title')}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t('footer_branding_sub')}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block text-xs font-bold text-zinc-800">
              {t('hide_branding')}
            </span>
            <span className="block text-[11px] text-zinc-400">
              {t('hide_branding_sub')}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={activePage.hideBranding || false}
              onChange={(e) => updateActivePage({ hideBranding: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => showNotification(t('changes_saved') || 'Alterações salvas com sucesso!')}
          className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
        >
          {t('save_changes') || 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};
