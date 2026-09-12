import React, { useState, useEffect } from 'react';
import { useBio } from '../../../context/BioContext';
import { Upload, Trash2, ShieldCheck, Image as ImageIcon, Save, Check } from 'lucide-react';

export const ProfileHeroTab: React.FC = () => {
  const { activePage, updateActivePage, showNotification } = useBio();
  const [slugInput, setSlugInput] = useState(activePage.slug);
  const [nameInput, setNameInput] = useState(activePage.name);
  const [bioInput, setBioInput] = useState(activePage.bio);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSlugInput(activePage.slug);
    setNameInput(activePage.name);
    setBioInput(activePage.bio);
  }, [activePage]);

  const handleSaveSlug = () => {
    const cleanSlug = slugInput.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanSlug.length < 3) {
      showNotification('O endereço deve ter no mínimo 3 caracteres.');
      return;
    }
    updateActivePage({ slug: cleanSlug });
    showNotification('Endereço da página atualizado com sucesso!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateActivePage({ avatarUrl: reader.result as string });
        showNotification('Foto de perfil atualizada!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Perfil & Hero</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          A parte de cima da sua página — imagem principal, nome e botão de destaque.
        </p>
      </div>

      {/* Card 1: Endereço da sua página */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-zinc-900">Endereço da sua página</h3>
        <p className="text-xs text-zinc-500">
          Escolha um nome curto para o link público da sua bio.
        </p>

        <div className="flex items-center gap-2 max-w-lg">
          <div className="flex-1 flex items-center rounded-xl border border-zinc-300 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900 bg-zinc-50">
            <span className="px-3 text-zinc-500 text-xs font-mono py-2.5 border-r border-zinc-200 select-none">
              /u/
            </span>
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="seunome"
              className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none font-mono text-zinc-900"
            />
          </div>
          <button
            onClick={handleSaveSlug}
            className="px-4 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Salvar
          </button>
        </div>
        <p className="text-[11px] text-zinc-400">
          3–40 caracteres. Apenas letras, números e hífens.
        </p>
      </div>

      {/* Card 2: Imagem principal */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">Imagem principal</h3>
          {activePage.avatarUrl && (
            <span className="text-[11px] text-zinc-400 font-medium">
              💡 Arraste o preview abaixo para reposicionar
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar with Interactive Drag Box */}
          <div 
            className={`w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative select-none ${
              activePage.avatarUrl ? 'cursor-grab active:cursor-grabbing ring-2 ring-zinc-900/10' : ''
            }`}
            onMouseDown={(e) => {
              if (!activePage.avatarUrl) return;
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;
              const initialPos = activePage.avatarPosition || { x: 50, y: 50 };

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = (moveEvent.clientX - startX) * 0.4;
                const deltaY = (moveEvent.clientY - startY) * 0.4;
                const newX = Math.max(0, Math.min(100, initialPos.x - deltaX));
                const newY = Math.max(0, Math.min(100, initialPos.y - deltaY));
                updateActivePage({ avatarPosition: { x: Math.round(newX), y: Math.round(newY) } });
              };

              const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
              };

              window.addEventListener('mousemove', onMouseMove);
              window.addEventListener('mouseup', onMouseUp);
            }}
            onTouchStart={(e) => {
              if (!activePage.avatarUrl) return;
              const touch = e.touches[0];
              const startX = touch.clientX;
              const startY = touch.clientY;
              const initialPos = activePage.avatarPosition || { x: 50, y: 50 };

              const onTouchMove = (moveEvent: TouchEvent) => {
                const moveTouch = moveEvent.touches[0];
                const deltaX = (moveTouch.clientX - startX) * 0.4;
                const deltaY = (moveTouch.clientY - startY) * 0.4;
                const newX = Math.max(0, Math.min(100, initialPos.x - deltaX));
                const newY = Math.max(0, Math.min(100, initialPos.y - deltaY));
                updateActivePage({ avatarPosition: { x: Math.round(newX), y: Math.round(newY) } });
              };

              const onTouchEnd = () => {
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
              };

              window.addEventListener('touchmove', onTouchMove);
              window.addEventListener('touchend', onTouchEnd);
            }}
          >
            {activePage.avatarUrl ? (
              <img
                src={activePage.avatarUrl}
                alt={activePage.name}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
                style={{
                  objectPosition: `${activePage.avatarPosition?.x ?? 50}% ${activePage.avatarPosition?.y ?? 50}%`,
                  transform: `scale(${activePage.avatarZoom ?? 1})`
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <ImageIcon size={28} />
              </div>
            )}

            {activePage.avatarUrl && (
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent pointer-events-none transition-colors" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5">
                <Upload size={14} />
                <span>Escolher imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {activePage.avatarUrl && (
                <button
                  onClick={() => updateActivePage({ avatarUrl: '', avatarZoom: 1, avatarPosition: { x: 50, y: 50 } })}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Remover</span>
                </button>
              )}
            </div>

            {/* Interactive Zoom & Position Sliders */}
            {activePage.avatarUrl && (
              <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                {/* Zoom control */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-zinc-600 w-14 shrink-0">Zoom:</span>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={activePage.avatarZoom || 1}
                    onChange={(e) => updateActivePage({ avatarZoom: parseFloat(e.target.value) })}
                    className="flex-1 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                  />
                  <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">
                    {Math.round((activePage.avatarZoom || 1) * 100)}%
                  </span>
                </div>

                {/* Vertical Position (Y) control */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-zinc-600 w-14 shrink-0">Posição:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={activePage.avatarPosition?.y ?? 50}
                    onChange={(e) => updateActivePage({ 
                      avatarPosition: { 
                        x: activePage.avatarPosition?.x ?? 50, 
                        y: parseInt(e.target.value, 10) 
                      } 
                    })}
                    className="flex-1 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                  />
                  <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">
                    {activePage.avatarPosition?.y ?? 50}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Identidade */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-900">Identidade</h3>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Nome / Marca
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              updateActivePage({ name: e.target.value });
            }}
            placeholder="ANDREW PARKER"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            Use um espaço para quebrar em duas linhas.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-zinc-700">
              Chamada acima dos cards
            </label>
            <span className="text-[11px] text-zinc-400 font-mono">
              {bioInput.length}/200
            </span>
          </div>
          <textarea
            rows={4}
            maxLength={200}
            value={bioInput}
            onChange={(e) => {
              setBioInput(e.target.value);
              updateActivePage({ bio: e.target.value });
            }}
            placeholder={`🩺 Weight Loss Specialist\n⚡ Metabolic Health & Weight Management Expert\n⭐ 37,000+ Patients guided worldwide`}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            Use o "Enter" para quebrar linhas.
          </p>
        </div>

        {/* Verified Badge Option */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-zinc-600" />
            <div>
              <p className="text-xs font-bold text-zinc-800">Selo de Verificado</p>
              <p className="text-[11px] text-zinc-500">Exibe o ícone de credibilidade na foto</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={activePage.verified}
            onChange={(e) => updateActivePage({ verified: e.target.checked })}
            className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <div className="pt-3 border-t border-zinc-100">
          <button
            onClick={() => {
              updateActivePage({
                name: nameInput,
                bio: bioInput,
              });
              setIsSaved(true);
              showNotification('Alterações salvas com sucesso!');
              setTimeout(() => setIsSaved(false), 2500);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {isSaved ? <Check size={15} className="text-emerald-400" /> : <Save size={15} />}
            <span>{isSaved ? 'Alterações salvas!' : 'Salvar alterações'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
