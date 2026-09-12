import React, { useState } from 'react';
import { useBio } from '../../../context/BioContext';
import { 
  Trash2, 
  Upload, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Image as ImageIcon,
  Square,
  RectangleHorizontal,
  ExternalLink,
  Flame
} from 'lucide-react';
import type { CardFormat } from '../../../types/bio';

export const LinksTab: React.FC = () => {
  const { activePage, addLink, updateLink, deleteLink, reorderLinks, showNotification } = useBio();

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newFormat] = useState<CardFormat>('rectangular');
  const [newImage, setNewImage] = useState<string>('');
  const [newIsFeatured, setNewIsFeatured] = useState<boolean>(false);

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      showNotification('Preencha ao menos o Título e a URL do novo card.');
      return;
    }

    addLink({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      url: newUrl.trim(),
      imageUrl: newImage || undefined,
      format: newFormat,
      active: true,
      isFeatured: newIsFeatured,
    });

    setNewTitle('');
    setNewUrl('');
    setNewSubtitle('');
    setNewImage('');
    setNewIsFeatured(false);
  };

  const handleCardImageUpload = (linkId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLink(linkId, { imageUrl: reader.result as string });
        showNotification('Imagem do card atualizada!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Cards de link</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Arraste ou use as setas para reordenar. Escolha o formato individual de cada card.
        </p>
      </div>

      {/* Existing Cards List */}
      <div className="space-y-4">
        {activePage.links.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-zinc-400 text-sm">
            Nenhum link cadastrado nesta página. Adicione um novo card abaixo!
          </div>
        ) : (
          activePage.links.map((link, index) => (
            <div
              key={link.id}
              className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-4 transition-all hover:border-zinc-300"
            >
              {/* Card Top Row: Drag handle / order / delete */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5 text-zinc-400">
                    <button
                      disabled={index === 0}
                      onClick={() => reorderLinks(index, index - 1)}
                      className="p-1 hover:text-zinc-800 disabled:opacity-20 hover:bg-zinc-100 rounded"
                      title="Mover para cima"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      disabled={index === activePage.links.length - 1}
                      onClick={() => reorderLinks(index, index + 1)}
                      className="p-1 hover:text-zinc-800 disabled:opacity-20 hover:bg-zinc-100 rounded"
                      title="Mover para baixo"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  {/* Thumbnail / Image with Upload */}
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                      {link.imageUrl ? (
                        <img
                          src={link.imageUrl}
                          alt={link.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-zinc-400" />
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer text-white">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCardImageUpload(link.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Card Fields: Title & Subtitle */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">
                      Título
                    </label>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, { title: e.target.value })}
                      placeholder="Título do link"
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">
                      Subtítulo (opcional)
                    </label>
                    <input
                      type="text"
                      value={link.subtitle || ''}
                      onChange={(e) => updateLink(link.id, { subtitle: e.target.value })}
                      placeholder="Uma linha curta explicativa"
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => {
                    if (confirm('Deseja excluir este card?')) {
                      deleteLink(link.id);
                    }
                  }}
                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir card"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* URL field */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">
                  URL
                </label>
                <div className="flex items-center rounded-lg border border-zinc-300 overflow-hidden focus-within:ring-1 focus-within:ring-zinc-900">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs text-zinc-800 font-mono focus:outline-none"
                  />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-zinc-400 hover:text-zinc-700"
                    title="Testar link"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Card Options: Format, Mais Acessado toggle, Link Active Switch */}
              <div className="pt-3 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Format buttons */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Formato do card
                  </label>
                  <div className="grid grid-cols-2 gap-2 w-full sm:w-60">
                    <button
                      type="button"
                      onClick={() => updateLink(link.id, { format: 'rectangular' })}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        link.format === 'rectangular'
                          ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow-sm'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <RectangleHorizontal size={16} className="mb-0.5" />
                      <span className="text-[11px]">Retangular</span>
                      <span className="text-[9px] opacity-70">1200 × 630 px</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateLink(link.id, { format: 'square' })}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        link.format === 'square'
                          ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow-sm'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <Square size={15} className="mb-0.5" />
                      <span className="text-[11px]">Quadrado</span>
                      <span className="text-[9px] opacity-70">1080 × 1080 px</span>
                    </button>
                  </div>
                </div>

                {/* Toggles: Mais acessado & Link ativo */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 sm:pt-0">
                  {/* Mais acessado (Destaque) Toggle */}
                  <div className="flex items-center gap-2.5 bg-amber-50/70 border border-amber-200/80 px-3 py-2 rounded-xl">
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <Flame size={13} className="text-amber-600 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-950">
                          Mais acessado
                        </span>
                      </div>
                      <span className="block text-[10px] text-amber-800/80">
                        {link.isFeatured ? 'Selo de destaque ativo' : 'Desativado'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-1">
                      <input
                        type="checkbox"
                        checked={!!link.isFeatured}
                        onChange={(e) => updateLink(link.id, { isFeatured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {/* Link active switch */}
                  <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl">
                    <div className="text-left">
                      <span className="block text-xs font-bold text-zinc-800">
                        Link ativo
                      </span>
                      <span className="block text-[10px] text-zinc-500">
                        {link.active ? 'Visível na bio' : 'Oculto'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-1">
                      <input
                        type="checkbox"
                        checked={link.active}
                        onChange={(e) => updateLink(link.id, { active: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Card Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-900">Adicionar novo card</h3>

        <form onSubmit={handleAddNewCard} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: MEU CURSO OU PRODUTO"
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              placeholder="Ex: Apenas hoje com 50% de desconto"
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              URL de Destino
            </label>
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://"
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Optional Image for new card & Featured toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Imagem do Card (opcional)
              </label>
              <div className="flex items-center gap-3">
                {newImage && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium inline-flex items-center gap-1.5">
                  <Upload size={13} />
                  <span>{newImage ? 'Trocar imagem' : 'Subir imagem'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewCardImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Toggle for new card isFeatured */}
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl self-start sm:self-auto">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <Flame size={13} className="text-amber-600 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-950">
                    Destacar como "Mais acessado"
                  </span>
                </div>
                <span className="block text-[10px] text-amber-800/80">
                  {newIsFeatured ? 'Selo de destaque ativo' : 'Sem selo'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-1">
                <input
                  type="checkbox"
                  checked={newIsFeatured}
                  onChange={(e) => setNewIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm mt-2"
          >
            <Plus size={16} />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => showNotification('Alterações salvas com sucesso!')}
          className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};
