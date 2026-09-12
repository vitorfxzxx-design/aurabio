import React, { useState, useEffect } from 'react';
import { useBio } from '../../../context/BioContext';
import { Upload, Trash2, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export const ProfileHeroTab: React.FC = () => {
  const { activePage, updateActivePage, showNotification } = useBio();
  const [slugInput, setSlugInput] = useState(activePage.slug);
  const [nameInput, setNameInput] = useState(activePage.name);
  const [bioInput, setBioInput] = useState(activePage.bio);

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
        <h3 className="text-sm font-bold text-zinc-900">Imagem principal</h3>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
            {activePage.avatarUrl ? (
              <img
                src={activePage.avatarUrl}
                alt={activePage.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <ImageIcon size={28} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer px-4 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5">
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
                onClick={() => updateActivePage({ avatarUrl: '' })}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Remover</span>
              </button>
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
      </div>
    </div>
  );
};
