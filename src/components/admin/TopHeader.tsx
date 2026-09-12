import React from 'react';
import { useBio } from '../../context/BioContext';
import { Copy, ExternalLink, Menu, Eye } from 'lucide-react';

interface TopHeaderProps {
  onOpenPublicView?: () => void;
  onOpenMobileMenu?: () => void;
  onOpenMobilePreview?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu, onOpenMobilePreview }) => {
  const { activePage, showNotification, t } = useBio();

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/#/u/${activePage.slug}`;
    navigator.clipboard.writeText(fullUrl);
    showNotification(`${t('link_copied')} ${fullUrl}`);
  };

  const handleOpenPage = () => {
    const fullUrl = `${window.location.origin}/#/u/${activePage.slug}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-2 rounded-xl text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 overflow-hidden">
          <span className="hidden sm:inline text-xs font-semibold text-zinc-400 shrink-0">{t('current_page')}</span>
          <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2 sm:px-2.5 py-1 rounded-md truncate max-w-[150px] sm:max-w-none">
            aurabio.link/u/{activePage.slug}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile Preview Icon */}
        <button
          onClick={onOpenMobilePreview}
          className="lg:hidden p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 cursor-pointer text-xs font-bold flex items-center gap-1"
          title="Ver prévia"
        >
          <Eye size={15} />
          <span className="hidden xs:inline">Prévia</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Copy size={13} />
          <span className="hidden sm:inline">{t('copy_link')}</span>
        </button>

        <button
          onClick={handleOpenPage}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">{t('view_page')}</span>
        </button>
      </div>
    </header>
  );
};
