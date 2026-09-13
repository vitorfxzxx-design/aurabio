import React, { useState } from 'react';
import { useBio } from '../../../context/BioContext';
import { Plus, Trash2 } from 'lucide-react';
import type { SocialPlatform } from '../../../types/bio';
import { SocialIcon } from '../../ui/SocialIcons';

const PLATFORMS: { id: SocialPlatform; name: string; placeholder: string }[] = [
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/seuusuario' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/5511999999999' },
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@seucanal' },
  { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@seuusuario' },
  { id: 'twitter', name: 'Twitter / X', placeholder: 'https://x.com/seuusuario' },
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/seuusuario' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/seuusuario' },
  { id: 'email', name: 'Email', placeholder: 'mailto:contato@seusite.com' },
  { id: 'website', name: 'Website Oficial', placeholder: 'https://seusite.com' },
];

export const SocialTab: React.FC = () => {
  const { activePage, updateActivePage, addSocialLink, updateSocialLink, deleteSocialLink, showNotification } = useBio();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [urlInput, setUrlInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    addSocialLink(selectedPlatform, urlInput.trim());
    setUrlInput('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Redes sociais</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Ícones exibidos no topo da página.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        {activePage.socialLinks.length === 0 ? (
          <div className="py-12 border border-dashed border-zinc-200 rounded-xl text-center">
            <p className="text-xs text-zinc-400 font-medium">Nenhuma rede adicionada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activePage.socialLinks.map((soc) => (
              <div
                key={soc.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <SocialIcon platform={soc.platform} size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-zinc-800 capitalize">
                      {soc.platform}
                    </span>
                    <input
                      type="url"
                      value={soc.url}
                      onChange={(e) => updateSocialLink(soc.id, { url: e.target.value })}
                      className="w-full text-xs text-zinc-500 bg-transparent border-none p-0 focus:outline-none focus:text-zinc-900 font-mono truncate"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Active toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soc.active}
                      onChange={(e) => updateSocialLink(soc.id, { active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900"></div>
                  </label>

                  <button
                    onClick={() => deleteSocialLink(soc.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Remover rede"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Network Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 px-4 border border-dashed border-zinc-300 rounded-xl hover:border-zinc-400 hover:bg-zinc-50 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-700 transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Adicionar rede</span>
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            updateActivePage(curr => ({ ...curr }));
            showNotification('Redes sociais salvas com sucesso!');
          }}
          className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
        >
          Salvar Alterações
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900">Adicionar Rede Social</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Selecione o canal e informe o link completo do seu perfil ou contato.
            </p>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Plataforma
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((p) => {
                    const isSelected = selectedPlatform === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlatform(p.id);
                          if (!urlInput) setUrlInput(p.placeholder);
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                          isSelected
                            ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow-sm'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <SocialIcon platform={p.id} size={18} />
                        <span className="text-[11px] truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Link / URL
                </label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={PLATFORMS.find(p => p.id === selectedPlatform)?.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
