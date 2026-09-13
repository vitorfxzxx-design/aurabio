import React, { useEffect, useRef, useState } from 'react';
import { useBio } from '../context/BioContext';
import { BioPageRenderer } from '../components/preview/BioPageRenderer';
import { THEME_PRESETS } from '../data/defaultData';
import { dbPagesService as pagesService } from '../lib/database';
import { initMetaPixel, trackMetaPixelEvent } from '../utils/pixel';
import type { BioPage } from '../types/bio';

interface PublicBioPageProps {
  slug?: string;
  onBackToAdmin?: () => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({ slug }) => {
  const { pages, activePage, recordView, recordClick } = useBio();
  const recordedRef = useRef(false);
  const [cloudPage, setCloudPage] = useState<BioPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Match by slug or id, fallback to activePage or first page
  const cleanSlug = (slug || '').toLowerCase().replace(/^u\//, '').replace(/^\//, '');
  const localPage = cleanSlug ? pages.find(p => p.slug.toLowerCase() === cleanSlug || p.id === cleanSlug) : null;

  useEffect(() => {
    let isMounted = true;
    if (cleanSlug) {
      // If we already have a matching local page with real data, use it immediately so there's zero delay
      if (localPage && localPage.name !== 'SEU NOME') {
        setIsLoading(false);
      }
      pagesService.getPageBySlug(cleanSlug).then((fetched) => {
        if (isMounted) {
          if (fetched) {
            setCloudPage(fetched);
          }
          setIsLoading(false);
        }
      }).catch((err) => {
        console.warn('[aurabio] Error fetching slug from cloud:', err);
        if (isMounted) setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
    return () => { isMounted = false; };
  }, [cleanSlug, localPage]);

  // Determine final page to display
  const page = cloudPage || (localPage && localPage.name !== 'SEU NOME' ? localPage : null) || (cleanSlug ? (cloudPage || localPage) : (activePage || pages[0]));

  const themePreset = THEME_PRESETS.find(t => t.id === page?.theme) || THEME_PRESETS[0];
  const bgColor = page?.customColors?.bgColor || themePreset.bg;

  useEffect(() => {
    if (page && !recordedRef.current) {
      recordedRef.current = true;
      recordView(page.id);
      document.title = `${page.name} | Aurabio`;

      // Trigger Meta Pixel PageView if Pixel ID is configured
      if (page.tracking?.metaPixelId) {
        initMetaPixel(page.tracking.metaPixelId);
      }
    }
  }, [page?.id, page?.name, page?.tracking?.metaPixelId, recordView]);

  const handleLinkClick = (linkId: string) => {
    if (page) {
      recordClick(page.id, linkId);
      if (page.tracking?.metaPixelId) {
        const clickedLink = (page.links || []).find(l => l.id === linkId);
        trackMetaPixelEvent('Lead', {
          content_name: clickedLink?.title || 'Link Click',
          content_category: 'Bio Link',
          content_id: linkId
        });
      }
    }
  };

  if (isLoading && !page) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-5 h-5 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    );
  }

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
