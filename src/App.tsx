import { useState, useEffect } from 'react';
import { BioProvider } from './context/BioContext';
import { AdminPanel } from './pages/AdminPanel';
import { PublicBioPage } from './pages/PublicBioPage';
import { MasterAdminPage } from './pages/MasterAdminPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<'admin' | 'master' | 'public'>('admin');
  const [routeSlug, setRouteSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'master' || hash.startsWith('master')) {
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

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
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
      {currentRoute === 'master' ? (
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
