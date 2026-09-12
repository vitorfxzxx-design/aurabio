import React, { useState } from 'react';
import { useBio } from '../../../context/BioContext';
import { Calendar, RotateCcw } from 'lucide-react';

export const TrackingTab: React.FC = () => {
  const { activePage, updateActivePage, resetStats, showNotification } = useBio();

  const [dateFilter, setDateFilter] = useState('');
  const [pixelId, setPixelId] = useState(activePage.tracking?.metaPixelId || '');

  const views = activePage.stats?.views || 0;
  const linkClicks = activePage.links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const ctaClicks = activePage.stats?.ctaClicks || 0;
  const ctrMedio = views > 0 ? ((linkClicks / views) * 100).toFixed(1) : '0.0';

  const handleSavePixel = () => {
    updateActivePage({
      tracking: {
        ...activePage.tracking,
        metaPixelId: pixelId.trim(),
      }
    });
    showNotification('ID do Meta Pixel salvo com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Trackeamento</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Visitas e cliques da sua página pública (em tempo real).
        </p>
      </div>

      {/* Date Filter Input */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
          FILTRAR PERÍODO
        </label>
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Calendar size={15} />
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            VISITAS
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-mono">
            {views}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            CLIQUES EM LINKS
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-mono">
            {linkClicks}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            CLIQUES NO CTA
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-mono">
            {ctaClicks}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            CTR MÉDIO
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-mono">
            {ctrMedio}%
          </div>
        </div>
      </div>

      {/* Desempenho por link */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">Desempenho por link</h3>
          <button
            onClick={() => {
              resetStats();
            }}
            className="text-[11px] font-semibold text-zinc-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Zerar estatísticas</span>
          </button>
        </div>

        <div className="space-y-4 pt-1">
          {activePage.links.length === 0 ? (
            <p className="text-xs text-zinc-400">Nenhum link ativo</p>
          ) : (
            activePage.links.map((link) => {
              const clicks = link.clicks || 0;
              const linkCtr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';
              const totalPct = linkClicks > 0 ? ((clicks / linkClicks) * 100).toFixed(1) : '0.0';

              return (
                <div key={link.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 truncate max-w-[220px]">
                      {link.title}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-600">
                      <span>{clicks} cliques</span>
                      <span className="font-bold text-zinc-900">{linkCtr}%</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                      style={{ width: `${linkClicks > 0 ? Number(totalPct) : 0}%` }}
                    />
                  </div>

                  <span className="block text-[10px] text-zinc-400">
                    {totalPct}% do total
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Meta Pixel Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Meta Pixel</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cole o ID do seu Pixel da Meta para disparar PageView automaticamente.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-zinc-700">
            ID do Pixel
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              onBlur={handleSavePixel}
              placeholder="Ex.: 1234567890"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
            <button
              onClick={handleSavePixel}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
