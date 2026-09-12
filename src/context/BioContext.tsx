import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  BioPage, 
  BioLink, 
  SocialLink, 
  SocialPlatform, 
  MasterMember, 
  WebhookIntegration, 
  MasterBrandingConfig 
} from '../types/bio';
import { 
  DEFAULT_PAGES, 
  DEFAULT_MEMBERS, 
  DEFAULT_WEBHOOKS, 
  DEFAULT_MASTER_BRANDING, 
  MASTER_ADMIN_EMAIL,
  MASTER_ADMIN_PASSWORD
} from '../data/defaultData';
import { TRANSLATIONS, type Language } from '../utils/translations';

interface BioContextType {
  pages: BioPage[];
  activePage: BioPage;
  activePageId: string;
  setActivePageId: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  updateActivePage: (updates: Partial<BioPage>) => void;
  createPage: (name: string, slug: string) => boolean;
  deletePage: (id: string) => void;
  addLink: (link: Omit<BioLink, 'id'>) => void;
  updateLink: (id: string, updates: Partial<BioLink>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (fromIndex: number, toIndex: number) => void;
  addSocialLink: (platform: SocialPlatform, url: string) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;
  restoreDefaults: () => void;
  resetStats: () => void;
  recordView: (slugOrId: string) => void;
  recordClick: (slugOrId: string, linkId: string) => void;
  notification: string | null;
  showNotification: (msg: string) => void;

  // Master Admin Area
  isMasterAuthenticated: boolean;
  masterAdminEmail: string;
  loginMaster: (email: string, pass?: string) => boolean;
  logoutMaster: () => void;
  members: MasterMember[];
  addMember: (data: Omit<MasterMember, 'id' | 'createdAt'>) => void;
  toggleMemberStatus: (memberId: string) => void;
  deleteMember: (memberId: string) => void;
  webhooks: WebhookIntegration[];
  addWebhook: (data: Omit<WebhookIntegration, 'id' | 'totalEvents'>) => void;
  toggleWebhook: (id: string) => void;
  deleteWebhook: (id: string) => void;
  masterBranding: MasterBrandingConfig;
  updateMasterBranding: (updates: Partial<MasterBrandingConfig>) => void;
  totalMasterVisits: number;
  totalMasterClicks: number;
}

const STORAGE_KEY = 'aurabio_pages_v2';
const ACTIVE_KEY = 'aurabio_active_page_v2';
const LANG_KEY = 'aurabio_lang_v2';
const MEMBERS_KEY = 'aurabio_members_v2';
const WEBHOOKS_KEY = 'aurabio_webhooks_v2';
const MASTER_BRANDING_KEY = 'aurabio_master_branding_v2';
const MASTER_AUTH_KEY = 'aurabio_master_auth_v2';

const BioContext = createContext<BioContextType | undefined>(undefined);

export const BioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<BioPage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved pages:', e);
      }
    }
    return DEFAULT_PAGES;
  });

  const [activePageId, setActivePageIdState] = useState<string>(() => {
    const savedId = localStorage.getItem(ACTIVE_KEY);
    if (savedId && pages.some(p => p.id === savedId)) {
      return savedId;
    }
    return pages[0]?.id || 'page-1';
  });

  const activePage = pages.find(p => p.id === activePageId) || pages[0] || DEFAULT_PAGES[0];

  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem(LANG_KEY) as Language;
    if (savedLang && ['pt', 'en', 'es', 'fr', 'de', 'it'].includes(savedLang)) {
      return savedLang;
    }
    return activePage.language || 'pt';
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Master State
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState<boolean>(() => {
    const auth = localStorage.getItem(MASTER_AUTH_KEY);
    return auth === 'true';
  });

  const [members, setMembers] = useState<MasterMember[]>(() => {
    const saved = localStorage.getItem(MEMBERS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved members:', e);
      }
    }
    return DEFAULT_MEMBERS;
  });

  const [webhooks, setWebhooks] = useState<WebhookIntegration[]>(() => {
    const saved = localStorage.getItem(WEBHOOKS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse saved webhooks:', e);
      }
    }
    return DEFAULT_WEBHOOKS;
  });

  const [masterBranding, setMasterBranding] = useState<MasterBrandingConfig>(() => {
    const saved = localStorage.getItem(MASTER_BRANDING_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_MASTER_BRANDING, ...parsed };
      } catch (e) {
        console.error('Failed to parse master branding:', e);
      }
    }
    return DEFAULT_MASTER_BRANDING;
  });

  useEffect(() => {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(webhooks));
  }, [webhooks]);

  useEffect(() => {
    localStorage.setItem(MASTER_BRANDING_KEY, JSON.stringify(masterBranding));
  }, [masterBranding]);

  useEffect(() => {
    localStorage.setItem(MASTER_AUTH_KEY, isMasterAuthenticated ? 'true' : 'false');
  }, [isMasterAuthenticated]);

  const loginMaster = (email: string, pass?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const isEmailValid = cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase();
    const isPassValid = pass === MASTER_ADMIN_PASSWORD;

    if (isEmailValid && isPassValid) {
      setIsMasterAuthenticated(true);
      showNotification('Acesso Master autenticado com sucesso!');
      return true;
    } else if (!isEmailValid) {
      showNotification('E-mail incorreto: Acesso exclusivo para o administrador.');
      return false;
    } else {
      showNotification('Senha Master incorreta.');
      return false;
    }
  };

  const logoutMaster = () => {
    setIsMasterAuthenticated(false);
    showNotification('Sessão Master encerrada.');
  };

  const addMember = (data: Omit<MasterMember, 'id' | 'createdAt'>) => {
    const newMember: MasterMember = {
      ...data,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      visits: 0,
      clicks: 0,
    };
    setMembers(prev => [newMember, ...prev]);
    showNotification(`Membro ${data.name} adicionado com sucesso!`);
  };

  const toggleMemberStatus = (memberId: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          const newStatus = m.status === 'active' ? 'suspended' : 'active';
          showNotification(`Membro ${m.name} agora está ${newStatus === 'active' ? 'ATIVO' : 'SUSPENSO'}.`);
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
  };

  const deleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    showNotification('Membro removido da base.');
  };

  const addWebhook = (data: Omit<WebhookIntegration, 'id' | 'totalEvents'>) => {
    const newWebhook: WebhookIntegration = {
      ...data,
      id: `wh-${Date.now()}`,
      totalEvents: 0,
    };
    setWebhooks(prev => [...prev, newWebhook]);
    showNotification('Novo webhook de integração adicionado!');
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev =>
      prev.map(w => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    showNotification('Webhook removido.');
  };

  const updateMasterBranding = (updates: Partial<MasterBrandingConfig>) => {
    setMasterBranding((prev: MasterBrandingConfig) => ({ ...prev, ...updates }));
    showNotification('Configurações de Branding Master atualizadas!');
  };

  const totalMasterVisits = pages.reduce((acc, p) => acc + (p.stats?.views || 0), 0) + 48;
  const totalMasterClicks = pages.reduce((acc, p) => acc + (p.stats?.ctaClicks || 0) + Object.values(p.stats?.clicks || {}).reduce((s, c) => s + c, 0), 0) + 6;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 3000);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === activePage.id
          ? { ...page, language: lang, updatedAt: new Date().toISOString() }
          : page
      )
    );
    const langNames: Record<Language, string> = {
      pt: 'Português',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano'
    };
    showNotification(`Language: ${langNames[lang] || lang.toUpperCase()}`);
  };

  const t = (key: string, fallback?: string): string => {
    const currentLangDict = TRANSLATIONS[language] || TRANSLATIONS.pt;
    if (currentLangDict[key]) {
      return currentLangDict[key];
    }
    const ptDict = TRANSLATIONS.pt;
    if (ptDict[key]) {
      return ptDict[key];
    }
    return fallback || key;
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activePageId);
  }, [activePageId]);

  const setActivePageId = (id: string) => {
    if (pages.some(p => p.id === id)) {
      setActivePageIdState(id);
      const targetPage = pages.find(p => p.id === id);
      if (targetPage?.language) {
        setLanguageState(targetPage.language);
      }
    }
  };

  const updateActivePage = (updates: Partial<BioPage>) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === activePage.id
          ? { ...page, ...updates, updatedAt: new Date().toISOString() }
          : page
      )
    );
  };

  const createPage = (name: string, slug: string): boolean => {
    if (pages.length >= 3) {
      showNotification('Limite de 3 páginas atingido no plano atual.');
      return false;
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanSlug) {
      showNotification('Endereço de página inválido.');
      return false;
    }

    if (pages.some(p => p.slug.toLowerCase() === cleanSlug)) {
      showNotification('Este endereço já está em uso por outra página.');
      return false;
    }

    const newPage: BioPage = {
      id: `page-${Date.now()}`,
      slug: cleanSlug,
      name: name || 'NOVA PÁGINA',
      avatarUrl: '',
      verified: false,
      badgeColor: '#dc2626',
      bio: '',
      layout: 'creator-portrait',
      theme: 'cinema-noir',
      language,
      customColors: {
        bgColor: '#000000',
        textColor: '#ffffff',
        secondaryTextColor: '#a3a3a3',
        cardBgColor: '#0a0a0a',
        accentColor: '#e11d2e',
      },
      hideBranding: false,
      links: [],
      socialLinks: [],
      tracking: {},
      stats: { views: 0, ctaClicks: 0, clicks: {} },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages(prev => [...prev, newPage]);
    setActivePageIdState(newPage.id);
    showNotification(`Página "${name}" criada com sucesso!`);
    return true;
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) {
      showNotification('Você precisa manter pelo menos uma página ativa.');
      return;
    }
    const remaining = pages.filter(p => p.id !== id);
    setPages(remaining);
    if (activePageId === id) {
      setActivePageIdState(remaining[0].id);
    }
    showNotification('Página excluída.');
  };

  const addLink = (linkData: Omit<BioLink, 'id'>) => {
    const newLink: BioLink = {
      ...linkData,
      id: `link-${Date.now()}`,
      clicks: 0,
    };
    updateActivePage({
      links: [newLink, ...activePage.links]
    });
    showNotification('Novo card de link adicionado!');
  };

  const updateLink = (id: string, updates: Partial<BioLink>) => {
    updateActivePage({
      links: activePage.links.map(link =>
        link.id === id ? { ...link, ...updates } : link
      )
    });
  };

  const deleteLink = (id: string) => {
    updateActivePage({
      links: activePage.links.filter(link => link.id !== id)
    });
    showNotification('Card removido.');
  };

  const reorderLinks = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= activePage.links.length || toIndex >= activePage.links.length) return;
    const newLinks = [...activePage.links];
    const [moved] = newLinks.splice(fromIndex, 1);
    newLinks.splice(toIndex, 0, moved);
    updateActivePage({ links: newLinks });
  };

  const addSocialLink = (platform: SocialPlatform, url: string) => {
    const newSocial: SocialLink = {
      id: `soc-${Date.now()}`,
      platform,
      url,
      active: true,
    };
    updateActivePage({
      socialLinks: [...activePage.socialLinks, newSocial]
    });
    showNotification('Rede social adicionada!');
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    updateActivePage({
      socialLinks: activePage.socialLinks.map(s =>
        s.id === id ? { ...s, ...updates } : s
      )
    });
  };

  const deleteSocialLink = (id: string) => {
    updateActivePage({
      socialLinks: activePage.socialLinks.filter(s => s.id !== id)
    });
    showNotification('Rede social removida.');
  };

  const restoreDefaults = () => {
    setPages(DEFAULT_PAGES);
    setActivePageIdState(DEFAULT_PAGES[0].id);
    setLanguageState('pt');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    localStorage.removeItem(LANG_KEY);
    showNotification('Configurações restauradas para o padrão inicial.');
  };

  const resetStats = () => {
    updateActivePage({
      stats: {
        views: 0,
        ctaClicks: 0,
        clicks: {},
      },
      links: activePage.links.map(l => ({ ...l, clicks: 0 }))
    });
    showNotification('Estatísticas zeradas para esta página.');
  };

  const recordView = (slugOrId: string) => {
    setPages(prev =>
      prev.map(p => {
        if (p.id === slugOrId || p.slug === slugOrId) {
          return {
            ...p,
            stats: {
              ...p.stats,
              views: (p.stats?.views || 0) + 1,
            }
          };
        }
        return p;
      })
    );
  };

  const recordClick = (slugOrId: string, linkId: string) => {
    setPages(prev =>
      prev.map(p => {
        if (p.id === slugOrId || p.slug === slugOrId) {
          const currentClicks = p.stats?.clicks || {};
          const updatedLinks = p.links.map(l => l.id === linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l);
          return {
            ...p,
            links: updatedLinks,
            stats: {
              ...p.stats,
              clicks: {
                ...currentClicks,
                [linkId]: (currentClicks[linkId] || 0) + 1,
              }
            }
          };
        }
        return p;
      })
    );
  };

  return (
    <BioContext.Provider
      value={{
        pages,
        activePage,
        activePageId,
        setActivePageId,
        language,
        setLanguage,
        t,
        updateActivePage,
        createPage,
        deletePage,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        restoreDefaults,
        resetStats,
        recordView,
        recordClick,
        notification,
        showNotification,

        // Master
        isMasterAuthenticated,
        masterAdminEmail: MASTER_ADMIN_EMAIL,
        loginMaster,
        logoutMaster,
        members,
        addMember,
        toggleMemberStatus,
        deleteMember,
        webhooks,
        addWebhook,
        toggleWebhook,
        deleteWebhook,
        masterBranding,
        updateMasterBranding,
        totalMasterVisits,
        totalMasterClicks,
      }}
    >
      {children}
    </BioContext.Provider>
  );
};

export const useBio = () => {
  const context = useContext(BioContext);
  if (!context) {
    throw new Error('useBio must be used within a BioProvider');
  }
  return context;
};
