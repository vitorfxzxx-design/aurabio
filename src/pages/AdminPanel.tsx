import React, { useState } from 'react';
import { Sidebar } from '../components/admin/Sidebar';
import type { AdminTab } from '../components/admin/Sidebar';
import { TopHeader } from '../components/admin/TopHeader';
import { PhoneFrame } from '../components/preview/PhoneFrame';
import { AccountsTab } from '../components/admin/tabs/AccountsTab';
import { ProfileHeroTab } from '../components/admin/tabs/ProfileHeroTab';
import { LinksTab } from '../components/admin/tabs/LinksTab';
import { SocialTab } from '../components/admin/tabs/SocialTab';
import { AppearanceTab } from '../components/admin/tabs/AppearanceTab';
import { TrackingTab } from '../components/admin/tabs/TrackingTab';
import { SupportTab } from '../components/admin/tabs/SupportTab';
import { useBio } from '../context/BioContext';
import { Check, Eye, X } from 'lucide-react';

interface AdminPanelProps {
  onOpenPublicView: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onOpenPublicView }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('profile');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const { notification } = useBio();

  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    setIsMobileSidebarOpen(false); // Auto close sidebar on mobile upon tab selection
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'accounts':
        return <AccountsTab />;
      case 'profile':
        return <ProfileHeroTab />;
      case 'links':
        return <LinksTab />;
      case 'social':
        return <SocialTab />;
      case 'appearance':
        return <AppearanceTab />;
      case 'tracking':
        return <TrackingTab />;
      case 'support':
        return <SupportTab />;
      default:
        return <ProfileHeroTab />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 font-sans text-zinc-900 antialiased">
      {/* Desktop Sidebar navigation */}
      <div className="hidden md:flex shrink-0">
        <Sidebar currentTab={currentTab} onSelectTab={handleSelectTab} />
      </div>

      {/* Mobile Drawer Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 w-4/5 max-w-xs h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <Sidebar currentTab={currentTab} onSelectTab={handleSelectTab} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main workspace (Center Edit Area + Right Live Phone Preview) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader 
          onOpenPublicView={onOpenPublicView} 
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
        />

        {/* Workspace Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left / Center Tab Content Form */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
            {renderActiveTab()}
          </main>

          {/* Right Live Preview Column (Desktop & Large Screens) */}
          <aside className="hidden lg:flex flex-1 min-w-[440px] max-w-[760px] bg-zinc-100 border-l border-zinc-200/80 items-center justify-center p-4 xl:p-8 shrink-0 overflow-y-auto overflow-x-hidden">
            <PhoneFrame />
          </aside>
        </div>
      </div>

      {/* Mobile Floating Preview Button */}
      <button
        onClick={() => setIsMobilePreviewOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full shadow-2xl border border-zinc-800 font-bold text-xs cursor-pointer active:scale-95 transition-all"
      >
        <Eye size={16} />
        <span>Ver Prévia</span>
      </button>

      {/* Mobile Live Preview Modal Sheet */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90 text-white">
            <span className="font-bold text-sm">Prévia em Tempo Real</span>
            <button
              onClick={() => setIsMobilePreviewOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            <PhoneFrame />
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-zinc-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={12} strokeWidth={3} />
          </div>
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};
