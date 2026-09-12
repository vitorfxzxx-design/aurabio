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
import { Check } from 'lucide-react';

interface AdminPanelProps {
  onOpenPublicView: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onOpenPublicView }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('profile');
  const { notification } = useBio();

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
      {/* Sidebar navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main workspace (Center Edit Area + Right Live Phone Preview) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader onOpenPublicView={onOpenPublicView} />

        {/* Workspace Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left / Center Tab Content Form */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-2xl">
            {renderActiveTab()}
          </main>

          {/* Right Live Preview Column */}
          <aside className="hidden lg:flex flex-1 min-w-[440px] max-w-[760px] bg-zinc-100 border-l border-zinc-200/80 items-center justify-center p-4 xl:p-8 shrink-0 overflow-y-auto overflow-x-hidden">
            <PhoneFrame />
          </aside>
        </div>
      </div>

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
