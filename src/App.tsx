import { useState, useEffect } from 'react';
import { BioProvider } from './context/BioContext';
import { AdminPanel } from './pages/AdminPanel';
import { PublicBioPage } from './pages/PublicBioPage';
import { MasterAdminPage } from './pages/MasterAdminPage';
import { SalesLandingPage } from './pages/SalesLandingPage';
import { UpsellPage } from './pages/UpsellPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { PasswordRecoveryPage } from './pages/PasswordRecoveryPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<'admin' | 'master' | 'public' | 'pv' | 'upsell' | 'obrigado' | 'recuperar-senha'>('admin');
  const [routeSlug, setRouteSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleRouteChange = () => {
      const cleanPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
      const rawHash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();

      // Check for Password Recovery (/recuperar-senha)
      if (cleanPath === '/recuperar-senha' || cleanPath.startsWith('/recuperar-senha') || rawHash === 'recuperar-senha' || rawHash.startsWith('recuperar-senha') || cleanPath === '/esqueci-senha' || rawHash === 'esqueci-senha') {
        setCurrentRoute('recuperar-senha');
        setRouteSlug(undefined);
        return;
      }

      // Check for Thank You Page (/obrigado)
      if (cleanPath === '/obrigado' || cleanPath.startsWith('/obrigado') || rawHash === 'obrigado' || rawHash.startsWith('obrigado') || cleanPath === '/thank-you' || rawHash === 'thank-you') {
        setCurrentRoute('obrigado');
        setRouteSlug(undefined);
        return;
      }

      // Check for Upsell Page
      if (cleanPath === '/upsell' || cleanPath.startsWith('/upsell') || rawHash === 'upsell' || rawHash.startsWith('upsell')) {
        setCurrentRoute('upsell');
        setRouteSlug(undefined);
        return;
      }

      // Check for Sales Page
      if (cleanPath === '/pv' || cleanPath.startsWith('/pv') || rawHash === 'pv' || rawHash.startsWith('pv')) {
        setCurrentRoute('pv');
        setRouteSlug(undefined);
        return;
      }

      // Check for Master Admin
      if (cleanPath === '/master' || cleanPath.startsWith('/master') || rawHash === 'master' || rawHash.startsWith('master')) {
        setCurrentRoute('master');
        setRouteSlug(undefined);
        return;
      }

      // Check for Dashboard / Admin
      if (cleanPath === '/painel' || cleanPath === '/admin' || rawHash === 'painel' || rawHash === 'admin') {
        setCurrentRoute('admin');
        setRouteSlug(undefined);
        return;
      }

      // Check if hash has a slug (e.g. #/jonathanbrooks or #/u/jonathanbrooks)
      if (rawHash && rawHash !== 'painel' && rawHash !== '') {
        const slugFromHash = rawHash.replace(/^u\//, '');
        setCurrentRoute('public');
        setRouteSlug(slugFromHash);
        return;
      }

      // Check if pathname has a slug (e.g. /jonathanbrooks or /u/jonathanbrooks)
      if (cleanPath && cleanPath !== '' && cleanPath !== '/' && cleanPath !== '/index.html') {
        const slugFromPath = cleanPath.replace(/^\/u\//, '').replace(/^\//, '');
        if (slugFromPath) {
          setCurrentRoute('public');
          setRouteSlug(slugFromPath);
          return;
        }
      }

      // Default to Creator Admin Panel
      setCurrentRoute('admin');
      setRouteSlug(undefined);
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
      {currentRoute === 'recuperar-senha' ? (
        <PasswordRecoveryPage onBackToLogin={handleBackToAdmin} />
      ) : currentRoute === 'obrigado' ? (
        <ThankYouPage />
      ) : currentRoute === 'upsell' ? (
        <UpsellPage onDecline={handleBackToAdmin} />
      ) : currentRoute === 'pv' ? (
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
