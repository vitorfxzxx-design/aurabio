import React, { useState } from 'react';
import { useBio } from '../../../context/BioContext';
import { Plus, Trash2, Info, Star, User } from 'lucide-react';

export const AccountsTab: React.FC = () => {
  const { pages, activePageId, setActivePageId, createPage, deletePage } = useBio();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;
    const ok = createPage(newName.trim(), newSlug.trim());
    if (ok) {
      setNewName('');
      setNewSlug('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Contas</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Você pode criar até 3 páginas dentro da mesma conta. Selecione a página que deseja editar.
        </p>
      </div>

      {/* Pages Container Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <span>Suas páginas</span>
          <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-mono">
            {pages.length}/3
          </span>
        </div>

        {/* List of Pages */}
        <div className="space-y-3">
          {pages.map(page => {
            const isEditing = page.id === activePageId;
            return (
              <div
                key={page.id}
                onClick={() => setActivePageId(page.id)}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  isEditing
                    ? 'border-zinc-900 bg-zinc-50/70 shadow-sm ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-1 ring-zinc-300 bg-zinc-900 flex items-center justify-center text-white">
                    {page.avatarUrl ? (
                      <img
                        src={page.avatarUrl}
                        alt={page.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-sm bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-300">
                        {page.name && page.name.trim() ? page.name.trim().charAt(0).toUpperCase() : <User size={18} />}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase truncate">
                        {page.name}
                      </h3>
                      {isEditing && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-amber-300 shadow-sm">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          EDITANDO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      /u/{page.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Tem certeza que deseja excluir a página "${page.name}"?`)) {
                          deletePage(page.id);
                        }
                      }}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir página"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create new page button */}
        {pages.length < 3 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3 px-4 border border-dashed border-zinc-300 rounded-xl hover:border-zinc-400 hover:bg-zinc-50 flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 transition-colors"
          >
            <Plus size={16} />
            <span>Criar nova página</span>
          </button>
        )}
      </div>

      {/* How it works info card */}
      <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/80 p-5 space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Info size={16} className="text-zinc-500" />
          Como funciona
        </h3>
        <ul className="space-y-2 text-xs text-zinc-600 list-disc list-inside leading-relaxed">
          <li>Cada conta pode ter até <strong className="text-zinc-900">3 páginas</strong> diferentes.</li>
          <li>Cada página tem seu próprio endereço (<span className="font-mono text-zinc-800">/u/nome</span>), links, cores e estatísticas.</li>
          <li>Selecione uma página aqui e edite nas abas ao lado — todas as mudanças são salvas automaticamente.</li>
        </ul>
      </div>

      {/* Modal for Creating New Page */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900">Criar nova página</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Defina o nome de exibição e a URL exclusiva da sua nova página de bio.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nome / Marca
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Ana Silva ou Minha Loja"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Endereço público (Slug)
                </label>
                <div className="flex items-center rounded-xl border border-zinc-300 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900">
                  <span className="px-3 bg-zinc-100 text-zinc-500 text-xs font-mono py-2.5 border-r border-zinc-200">
                    aurabio.app/u/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="draanasilva"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none font-mono text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm"
                >
                  Criar página
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
