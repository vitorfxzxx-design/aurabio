import React, { useEffect, useRef, useState } from 'react';
import { useBio } from '../context/BioContext';
import { BioPageRenderer } from '../components/preview/BioPageRenderer';
import { THEME_PRESETS } from '../data/defaultData';
import { dbPagesService as pagesService } from '../lib/database';
import type { BioPage } from '../types/bio';

interface PublicBioPageProps {
  slug?: string;
  onBackToAdmin?: () => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({ slug }) => {
  const { pages, activePage, recordView, recordClick } = useBio();
  const recordedRef = useRef(false);
  const [cloudPage, setCloudPage] = useState<BioPage | null>(null);

  // Match by slug or id, fallback to activePage or first page
  const cleanSlug = (slug || '').toLowerCase().replace(/^u\//, '').replace(/^\//, '');
  const localPage = cleanSlug ? pages.find(p => p.slug.toLowerCase() === cleanSlug || p.id === cleanSlug) : null;
  const page = localPage || cloudPage || activePage || pages[0];

  useEffect(() => {
    if (cleanSlug && !localPage) {
      pagesService.getPageBySlug(cleanSlug).then((fetched) => {
        if (fetched) setCloudPage(fetched);
      });
    }
  }, [cleanSlug, localPage]);

  const themePreset = THEME_PRESETS.find(t => t.id === page?.theme) || THEME_PRESETS[0];
  const bgColor = page?.customColors?.bgColor || themePreset.bg;

  useEffect(() => {
    if (page && !recordedRef.current) {
      recordedRef.current = true;
      recordView(page.id);
      document.title = `${page.name} | Aurabio`;
    }
  }, [page?.id, recordView]);

  const handleLinkClick = (linkId: string) => {
    if (page) {
      recordClick(page.id, linkId);
    }
  };

  if (!page) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-zinc-400 text-sm mb-6">O link que você está procurando não existe ou foi alterado.</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-300 relative overflow-x-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* 100% Clean Public Bio Page (No admin buttons for public visitors) */}
      <main className="w-full max-w-[480px] min-h-screen flex flex-col items-center">
        <BioPageRenderer 
          page={page} 
          isInteractive={true} 
          onLinkClick={handleLinkClick}
        />
      </main>
    </div>
  );
};
