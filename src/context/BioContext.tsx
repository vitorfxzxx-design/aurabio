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
import { 
  dbPagesService as pagesService, 
  dbMembersService as membersService, 
  dbWebhooksService as webhooksService, 
  dbMasterService as masterService 
} from '../lib/database';

interface BioContextType {
  pages: BioPage[];
  activePage: BioPage;
  activePageId: string;
  setActivePageId: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  updateActivePage: (updates: Partial<BioPage> | ((current: BioPage) => Partial<BioPage>)) => void;
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

  // User Authentication
  isUserAuthenticated: boolean;
  currentUserEmail: string;
  maxAllowedPages: number;
  currentMemberPlan: string;
  loginUser: (email: string, pass?: string) => boolean;
  logoutUser: () => void;

  // Master Admin Area
  isMasterAuthenticated: boolean;
  masterAdminEmail: string;
  loginMaster: (email: string, pass?: string) => boolean;
  logoutMaster: () => void;
  members: MasterMember[];
  addMember: (data: Omit<MasterMember, 'id' | 'createdAt'>) => void;
  updateMember: (memberId: string, updates: Partial<MasterMember>) => void;
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
const USER_AUTH_KEY = 'aurabio_user_auth_v2';
const USER_EMAIL_KEY = 'aurabio_user_email_v2';

const getStorageKeyForUser = (email: string) => {
  const clean = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `aurabio_pages_${clean}`;
};

const getActiveKeyForUser = (email: string) => {
  const clean = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `aurabio_active_page_${clean}`;
};

const BioContext = createContext<BioContextType | undefined>(undefined);

export const BioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Authentication State
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(() => {
    const auth = localStorage.getItem(USER_AUTH_KEY);
    return auth !== 'false';
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem(USER_EMAIL_KEY) || MASTER_ADMIN_EMAIL;
  });

  useEffect(() => {
    localStorage.setItem(USER_AUTH_KEY, isUserAuthenticated ? 'true' : 'false');
  }, [isUserAuthenticated]);

  useEffect(() => {
    localStorage.setItem(USER_EMAIL_KEY, currentUserEmail);
  }, [currentUserEmail]);

  // Initial pages scoped to currentUserEmail
  const [pages, setPages] = useState<BioPage[]>(() => {
    const userKey = getStorageKeyForUser(currentUserEmail || MASTER_ADMIN_EMAIL);
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved pages:', e);
      }
    }
    // Check legacy global storage if master
    if (currentUserEmail.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      const legacySaved = localStorage.getItem(STORAGE_KEY);
      if (legacySaved) {
        try {
          const parsed = JSON.parse(legacySaved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return [
      {
        ...DEFAULT_PAGES[0],
        id: `page_${Date.now()}`,
        userEmail: currentUserEmail.toLowerCase(),
      }
    ];
  });

  // Fetch and sync data with Firestore in Real-Time
  useEffect(() => {
    const cleanUserEmail = currentUserEmail.trim().toLowerCase();
    const userStorageKey = getStorageKeyForUser(cleanUserEmail);

    // 1. Subscribe to Real-Time Pages from Cloud and filter for CURRENT USER ONLY
    const unsubscribePages = pagesService.subscribeToAllPages((cloudPages) => {
      if (cloudPages && cloudPages.length > 0) {
        // Filter cloud pages specifically owned by this user
        const userCloudPages = cloudPages.filter(p => {
          if (!p.userEmail) {
            // Legacy pages without userEmail belong to MASTER admin
            return cleanUserEmail === MASTER_ADMIN_EMAIL.toLowerCase();
          }
          return p.userEmail.toLowerCase().trim() === cleanUserEmail;
        });

        if (userCloudPages.length > 0) {
          setPages(currentLocalPages => {
            const isLocalDefault = currentLocalPages.length === 1 && 
              (currentLocalPages[0].name === 'SEU NOME' || currentLocalPages[0].slug === 'suapagina');

            if (isLocalDefault) {
              try { localStorage.setItem(userStorageKey, JSON.stringify(userCloudPages)); } catch {}
              return userCloudPages;
            }

            // Merge by latest updated time
            const merged = currentLocalPages.map(localPage => {
              const cloudMatch = userCloudPages.find(cp => cp.id === localPage.id || cp.slug === localPage.slug);
              if (!cloudMatch) return localPage;
              
              const localTime = new Date(localPage.updatedAt || 0).getTime();
              const cloudTime = new Date(cloudMatch.updatedAt || 0).getTime();
              if (cloudTime >= localTime) {
                return cloudMatch;
              }
              return localPage;
            });

            userCloudPages.forEach(cp => {
              if (!merged.some(p => p.id === cp.id || p.slug === cp.slug)) {
                merged.push(cp);
              }
            });

            try { localStorage.setItem(userStorageKey, JSON.stringify(merged)); } catch {}
            return merged;
          });
        } else {
          // New user without cloud pages yet: initialize clean default page for this user
          setPages(currentLocalPages => {
            const hasUserPage = currentLocalPages.some(p => p.userEmail === cleanUserEmail);
            if (!hasUserPage && cleanUserEmail !== MASTER_ADMIN_EMAIL.toLowerCase()) {
              const defaultSlug = cleanUserEmail.split('@')[0].replace(/[^a-z0-9_-]/g, '').toLowerCase() || `bio_${Date.now()}`;
              const initialUserPage: BioPage = {
                ...DEFAULT_PAGES[0],
                id: `page_${Date.now()}`,
                slug: defaultSlug,
                name: 'MEU LINK NA BIO',
                userEmail: cleanUserEmail,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              };
              try { localStorage.setItem(userStorageKey, JSON.stringify([initialUserPage])); } catch {}
              pagesService.upsertPage(initialUserPage, cleanUserEmail);
              return [initialUserPage];
            }
            return currentLocalPages;
          });
        }
      }
    });

    // 2. Real-time Members subscription
    const unsubscribeMembers = membersService.subscribeToAllMembers((cloudMembers) => {
      if (cloudMembers && cloudMembers.length > 0) {
        // Ensure MASTER account is ALWAYS included in members
        const hasMaster = cloudMembers.some(m => m.email?.toLowerCase().trim() === MASTER_ADMIN_EMAIL.toLowerCase());
        let finalMembers = [...cloudMembers];
        if (!hasMaster) {
          const masterMember: MasterMember = {
            id: 'mem_master_admin',
            email: MASTER_ADMIN_EMAIL,
            name: 'Vitor (Master)',
            slug: 'vitor',
            password: MASTER_ADMIN_PASSWORD,
            status: 'active',
            plan: 'MASTER Vitalício (Ilimitado)',
            createdAt: '22/07/2026',
            visits: 53,
            clicks: 6,
          };
          finalMembers = [masterMember, ...cloudMembers];
          membersService.upsertMember(masterMember);
        }
        setMembers(finalMembers);
        try { localStorage.setItem(MEMBERS_KEY, JSON.stringify(finalMembers)); } catch {}
      }
    });

    async function loadInitialCloudData() {
      try {
        // Members initial fetch
        const cloudMembers = await membersService.getAllMembers();
        if (cloudMembers && cloudMembers.length > 0) {
          const hasMaster = cloudMembers.some(m => m.email?.toLowerCase().trim() === MASTER_ADMIN_EMAIL.toLowerCase());
          let finalMembers = [...cloudMembers];
          if (!hasMaster) {
            const masterMember: MasterMember = {
              id: 'mem_master_admin',
              email: MASTER_ADMIN_EMAIL,
              name: 'Vitor (Master)',
              slug: 'vitor',
              password: MASTER_ADMIN_PASSWORD,
              status: 'active',
              plan: 'MASTER Vitalício (Ilimitado)',
              createdAt: '22/07/2026',
              visits: 53,
              clicks: 6,
            };
            finalMembers = [masterMember, ...cloudMembers];
            membersService.upsertMember(masterMember);
          }
          setMembers(finalMembers);
          try { localStorage.setItem(MEMBERS_KEY, JSON.stringify(finalMembers)); } catch {}
        }

        // Webhooks
        const cloudWebhooks = await webhooksService.getAllWebhooks();
        if (cloudWebhooks && cloudWebhooks.length > 0) {
          setWebhooks(cloudWebhooks);
          try { localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(cloudWebhooks)); } catch {}
        }

        // Master Branding
        const cloudBranding = await masterService.getMasterBranding();
        if (cloudBranding) {
          setMasterBranding(cloudBranding);
          try { localStorage.setItem(MASTER_BRANDING_KEY, JSON.stringify(cloudBranding)); } catch {}
        }
      } catch (err) {
        console.warn('[aurabio] Initial cloud sync note:', err);
      }
    }

    loadInitialCloudData();

    return () => {
      unsubscribePages();
      unsubscribeMembers();
    };
  }, [currentUserEmail]);

  // Sync pages to Firestore
  const syncPageToCloud = async (pageToSync: BioPage) => {
    const pageWithEmail = {
      ...pageToSync,
      userEmail: currentUserEmail.trim().toLowerCase()
    };
    await pagesService.upsertPage(pageWithEmail, currentUserEmail.trim().toLowerCase());
  };

  const [activePageId, setActivePageIdState] = useState<string>(() => {
    const userActiveKey = getActiveKeyForUser(currentUserEmail || MASTER_ADMIN_EMAIL);
    const savedId = localStorage.getItem(userActiveKey) || localStorage.getItem(ACTIVE_KEY);
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
    return activePage?.language || 'pt';
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Master State
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState<boolean>(() => {
    const auth = localStorage.getItem(MASTER_AUTH_KEY);
    return auth === 'true';
  });

  useEffect(() => {
    localStorage.setItem(MASTER_AUTH_KEY, isMasterAuthenticated ? 'true' : 'false');
  }, [isMasterAuthenticated]);

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

    // Dynamically apply SEO and Branding to the browser <head>
    if (masterBranding) {
      if (masterBranding.seoTitle) {
        document.title = masterBranding.seoTitle;
      }

      if (masterBranding.seoDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', masterBranding.seoDescription);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', masterBranding.seoDescription);

        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', masterBranding.seoDescription);
      }

      if (masterBranding.seoTitle) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', masterBranding.seoTitle);

        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', masterBranding.seoTitle);
      }

      if (masterBranding.keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', masterBranding.keywords);
      }

      if (masterBranding.faviconUrl) {
        let faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
          faviconLink.setAttribute('href', masterBranding.faviconUrl);
        }
      }

      if (masterBranding.ogImageUrl) {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', masterBranding.ogImageUrl);
        let twImg = document.querySelector('meta[name="twitter:image"]');
        if (twImg) twImg.setAttribute('content', masterBranding.ogImageUrl);
      }
    }
  }, [masterBranding]);

  const loginUser = (email: string, pass?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showNotification('Por favor, informe seu e-mail de acesso.');
      return false;
    }

    if (!pass || pass.length < 6) {
      showNotification('A senha deve ter no mínimo 6 caracteres.');
      return false;
    }

    const foundMember = members.find(m => m.email?.toLowerCase().trim() === cleanEmail);
    if (foundMember) {
      if (foundMember.status === 'suspended') {
        showNotification('Esta conta está suspensa. Entre em contato com o suporte.');
        return false;
      }
      
      const expectedPassword = (foundMember.password && foundMember.password.trim().length > 0)
        ? foundMember.password.trim()
        : '123456';

      if (pass !== expectedPassword) {
        showNotification('Senha incorreta.');
        return false;
      }
    }

    setIsUserAuthenticated(true);
    setCurrentUserEmail(cleanEmail);
    showNotification(`Bem-vindo de volta!`);
    return true;
  };

  const logoutUser = () => {
    setIsUserAuthenticated(false);
    showNotification('Sessão encerrada com sucesso.');
  };

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
    membersService.upsertMember(newMember);
    showNotification(`Membro ${data.name} adicionado com sucesso!`);
  };

  const updateMember = (memberId: string, updates: Partial<MasterMember>) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          const updated = { ...m, ...updates };
          membersService.upsertMember(updated);
          showNotification(`Membro ${updated.name || updated.email} atualizado com sucesso!`);
          return updated;
        }
        return m;
      })
    );
  };

  const toggleMemberStatus = (memberId: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          const newStatus = m.status === 'active' ? 'suspended' : 'active';
          const updated = { ...m, status: newStatus as 'active' | 'suspended' };
          membersService.upsertMember(updated);
          showNotification(`Membro ${m.name} agora está ${newStatus === 'active' ? 'ATIVO' : 'SUSPENSO'}.`);
          return updated;
        }
        return m;
      })
    );
  };

  const deleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    membersService.deleteMember(memberId);
    showNotification('Membro removido da base.');
  };

  const addWebhook = (data: Omit<WebhookIntegration, 'id' | 'totalEvents'>) => {
    const newWebhook: WebhookIntegration = {
      ...data,
      id: `wh-${Date.now()}`,
      totalEvents: 0,
    };
    setWebhooks(prev => [...prev, newWebhook]);
    webhooksService.upsertWebhook(newWebhook);
    showNotification('Novo webhook de integração adicionado!');
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev =>
      prev.map(w => {
        if (w.id === id) {
          const updated = { ...w, active: !w.active };
          webhooksService.upsertWebhook(updated);
          return updated;
        }
        return w;
      })
    );
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    webhooksService.deleteWebhook(id);
    showNotification('Webhook removido.');
  };

  const updateMasterBranding = (updates: Partial<MasterBrandingConfig>) => {
    const updated = { ...masterBranding, ...updates };
    setMasterBranding(updated);
    masterService.upsertMasterBranding(updated);
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
    updateActivePage({
      language: lang
    });
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
    const userStorageKey = getStorageKeyForUser(currentUserEmail || MASTER_ADMIN_EMAIL);
    localStorage.setItem(userStorageKey, JSON.stringify(pages));
  }, [pages, currentUserEmail]);

  useEffect(() => {
    const userActiveKey = getActiveKeyForUser(currentUserEmail || MASTER_ADMIN_EMAIL);
    localStorage.setItem(userActiveKey, activePageId);
  }, [activePageId, currentUserEmail]);

  const setActivePageId = (id: string) => {
    if (pages.some(p => p.id === id)) {
      setActivePageIdState(id);
      const targetPage = pages.find(p => p.id === id);
      if (targetPage?.language) {
        setLanguageState(targetPage.language);
      }
    }
  };

  const updateActivePage = (updates: Partial<BioPage> | ((current: BioPage) => Partial<BioPage>)) => {
    setPages(prevPages => {
      const current = prevPages.find(p => p.id === activePageId) || prevPages[0] || DEFAULT_PAGES[0];
      const partial = typeof updates === 'function' ? updates(current) : updates;
      const updated: BioPage = { 
        ...current, 
        ...partial, 
        userEmail: currentUserEmail.trim().toLowerCase(),
        updatedAt: new Date().toISOString() 
      };
      const nextPages = prevPages.map(page => (page.id === current.id ? updated : page));
      const userStorageKey = getStorageKeyForUser(currentUserEmail || MASTER_ADMIN_EMAIL);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(nextPages));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      syncPageToCloud(updated);
      return nextPages;
    });
  };

  // Find current logged in member's plan & page limits
  const currentMember = members.find(
    m => m.email?.toLowerCase().trim() === currentUserEmail?.toLowerCase().trim()
  );
  const isProPlan = !!currentMember && (
    currentMember.plan?.toLowerCase().includes('pro') || 
    currentMember.plan?.toLowerCase().includes('10') || 
    currentMember.plan?.toLowerCase().includes('master')
  );
  const maxAllowedPages = isProPlan ? 10 : 3;
  const currentMemberPlan = currentMember?.plan || (isProPlan ? 'Plano PRO (Até 10 Perfis)' : 'Plano Creator (Até 3 Perfis)');

  const createPage = (name: string, slug: string): boolean => {
    if (pages.length >= maxAllowedPages) {
      showNotification(`Limite de ${maxAllowedPages} páginas atingido no ${currentMemberPlan}.`);
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
      userEmail: currentUserEmail.trim().toLowerCase(),
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
    syncPageToCloud(newPage);
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
    // Delete from Supabase/Firebase
    pagesService.deletePage(id);
    showNotification('Página excluída.');
  };

  const addLink = (linkData: Omit<BioLink, 'id'>) => {
    const newLink: BioLink = {
      ...linkData,
      id: `link-${Date.now()}`,
      active: linkData.active !== false,
      isFeatured: !!linkData.isFeatured,
      clicks: 0,
    };
    updateActivePage(curr => ({
      links: [newLink, ...(curr.links || [])]
    }));
    showNotification('Novo card de link adicionado!');
  };

  const updateLink = (id: string, updates: Partial<BioLink>) => {
    updateActivePage(curr => ({
      links: (curr.links || []).map(link =>
        link.id === id ? { ...link, ...updates } : link
      )
    }));
  };

  const deleteLink = (id: string) => {
    updateActivePage(curr => ({
      links: (curr.links || []).filter(link => link.id !== id)
    }));
    showNotification('Card removido.');
  };

  const reorderLinks = (fromIndex: number, toIndex: number) => {
    updateActivePage(curr => {
      const currentLinks = curr.links || [];
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= currentLinks.length || toIndex >= currentLinks.length) {
        return {};
      }
      const newLinks = [...currentLinks];
      const [moved] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, moved);
      return { links: newLinks };
    });
  };

  const addSocialLink = (platform: SocialPlatform, url: string) => {
    const newSocial: SocialLink = {
      id: `soc-${Date.now()}`,
      platform,
      url,
      active: true,
    };
    updateActivePage(curr => ({
      socialLinks: [...(curr.socialLinks || []), newSocial]
    }));
    showNotification('Rede social adicionada!');
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    updateActivePage(curr => ({
      socialLinks: (curr.socialLinks || []).map(s =>
        s.id === id ? { ...s, ...updates } : s
      )
    }));
  };

  const deleteSocialLink = (id: string) => {
    updateActivePage(curr => ({
      socialLinks: (curr.socialLinks || []).filter(s => s.id !== id)
    }));
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
          pagesService.incrementView(p.id);
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
          pagesService.incrementClick(p.id, linkId);
          const currentClicks = p.stats?.clicks || {};
          const updatedLinks = (p.links || []).map(l => l.id === linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l);
          return {
            ...p,
            links: updatedLinks,
            stats: {
              ...p.stats,
              ctaClicks: (p.stats?.ctaClicks || 0) + 1,
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

        // User Auth
        isUserAuthenticated,
        currentUserEmail,
        maxAllowedPages,
        currentMemberPlan,
        loginUser,
        logoutUser,

        // Master
        isMasterAuthenticated,
        masterAdminEmail: MASTER_ADMIN_EMAIL,
        loginMaster,
        logoutMaster,
        members,
        addMember,
        updateMember,
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
