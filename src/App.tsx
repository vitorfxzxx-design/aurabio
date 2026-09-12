import { useState, useEffect } from 'react';
import { BioProvider } from './context/BioContext';
import { AdminPanel } from './pages/AdminPanel';
import { PublicBioPage } from './pages/PublicBioPage';
import { MasterAdminPage } from './pages/MasterAdminPage';
import { SalesLandingPage } from './pages/SalesLandingPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<'admin' | 'master' | 'public' | 'pv'>('admin');
  const [routeSlug, setRouteSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();

      if (pathname === '/pv' || pathname.startsWith('/pv') || hash === 'pv' || hash.startsWith('pv')) {
        setCurrentRoute('pv');
        setRouteSlug(undefined);
      } else if (hash === 'master' || hash.startsWith('master')) {
        setCurrentRoute('master');
        setRouteSlug(undefined);
      } else if (hash && hash !== 'painel' && hash !== '') {
        setCurrentRoute('public');
        setRouteSlug(hash.replace('u/', ''));
      } else {
        setCurrentRoute('admin');
        setRouteSlug(undefined);
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleOpenPublicView = () => {
    setCurrentRoute('public');
  };

  const handleBackToAdmin = () => {
    window.location.hash = '';
    setCurrentRoute('admin');
  };

  return (
    <BioProvider>
      {currentRoute === 'pv' ? (
        <SalesLandingPage />
      ) : currentRoute === 'master' ? (
        <MasterAdminPage onBackToCreatorPanel={handleBackToAdmin} />
      ) : currentRoute === 'admin' ? (
        <AdminPanel onOpenPublicView={handleOpenPublicView} />
      ) : (
        <PublicBioPage slug={routeSlug} onBackToAdmin={handleBackToAdmin} />
      )}
    </BioProvider>
  );
}

export default App;
