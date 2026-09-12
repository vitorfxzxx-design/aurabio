import React from 'react';
import { useBio } from '../../context/BioContext';
import { Copy, ExternalLink } from 'lucide-react';

interface TopHeaderProps {
  onOpenPublicView?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = () => {
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
    <header className="h-16 px-6 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400">{t('current_page')}</span>
        <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
          aurabio.app/u/{activePage.slug}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors shadow-sm cursor-pointer"
        >
          <Copy size={13} />
          <span>{t('copy_link')}</span>
        </button>

        <button
          onClick={handleOpenPage}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
        >
          <ExternalLink size={13} />
          <span>{t('view_page')}</span>
        </button>
      </div>
    </header>
  );
};
