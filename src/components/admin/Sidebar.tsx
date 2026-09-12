import React from 'react';
import { useBio } from '../../context/BioContext';
import { 
  Users, 
  User, 
  Link2, 
  Share2, 
  Palette, 
  BarChart2, 
  Headphones,
  RotateCcw, 
  LogOut
} from 'lucide-react';

export type AdminTab = 'accounts' | 'profile' | 'links' | 'social' | 'appearance' | 'tracking' | 'support';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { activePage, restoreDefaults, t } = useBio();

  const menuItems: { id: AdminTab; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'accounts',
      title: t('nav_accounts'),
      subtitle: t('nav_accounts_sub'),
      icon: <Users size={18} />,
    },
    {
      id: 'profile',
      title: t('nav_profile'),
      subtitle: t('nav_profile_sub'),
      icon: <User size={18} />,
    },
    {
      id: 'links',
      title: t('nav_links'),
      subtitle: t('nav_links_sub'),
      icon: <Link2 size={18} />,
    },
    {
      id: 'social',
      title: t('nav_social'),
      subtitle: t('nav_social_sub'),
      icon: <Share2 size={18} />,
    },
    {
      id: 'appearance',
      title: t('nav_appearance'),
      subtitle: t('nav_appearance_sub'),
      icon: <Palette size={18} />,
    },
    {
      id: 'tracking',
      title: t('nav_tracking'),
      subtitle: t('nav_tracking_sub'),
      icon: <BarChart2 size={18} />,
    },
    {
      id: 'support',
      title: t('nav_support'),
      subtitle: t('nav_support_sub'),
      icon: <Headphones size={18} />,
    },
  ];

  return (
    <aside className="w-64 sm:w-72 bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div>
        {/* Logo and Header */}
        <div className="p-6 pb-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            {t('panel')}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-black text-xs">
              A
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
              Aurabio
            </h1>
          </div>
        </div>

        {/* Current Active Page Badge / Indicator */}
        <div className="mx-4 mb-4 p-3 rounded-xl border border-zinc-200 bg-zinc-50/70">
          <div className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">
            {t('editing')}
          </div>
          <div className="text-xs font-bold text-zinc-900 uppercase truncate mt-0.5">
            {activePage.name}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono truncate">
            /u/{activePage.slug}
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-left group cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className={`shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-900'
                }`}>
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate leading-tight">
                    {item.title}
                  </div>
                  <div className={`text-[10px] truncate leading-tight mt-0.5 ${
                    isActive ? 'text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-500'
                  }`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-zinc-200 space-y-1">
        <a
          href="#/master"
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl transition-all cursor-pointer shadow-2xs mb-1"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Área Master (Admin)</span>
        </a>

        <button
          onClick={() => {
            if (confirm('Deseja restaurar todas as configurações para o padrão original?')) {
              restoreDefaults();
            }
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{t('restore_defaults')}</span>
        </button>

        <button
          onClick={() => {
            alert(t('session_ended'));
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};
