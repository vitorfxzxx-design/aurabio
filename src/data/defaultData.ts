import type { BioPage } from '../types/bio';

export const DEFAULT_PAGES: BioPage[] = [
  {
    id: 'page-1',
    slug: 'andrewparker',
    name: 'ANDREW PARKER',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
    verified: true,
    badgeColor: '#dc2626',
    bio: '🩺 Weight Loss Specialist\n⚡ Metabolic Health & Weight Management Expert\n⭐ 37,000+ Patients guided worldwide',
    layout: 'creator-portrait',
    theme: 'cinema-noir',
    language: 'pt',
    customColors: {
      bgColor: '#000000',
      textColor: '#ffffff',
      secondaryTextColor: '#a3a3a3',
      cardBgColor: '#0a0a0a',
      accentColor: '#e11d2e',
    },
    hideBranding: false,
    links: [
      {
        id: 'link-1',
        title: 'Original Baking Soda Water Shot',
        subtitle: 'Receita rápida & protocolo diário de ativação metabólica',
        url: 'https://slimsodaoriginal.shop',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
        format: 'rectangular',
        active: true,
        isFeatured: true,
        clicks: 0,
      },
      {
        id: 'link-2',
        title: 'Protocolo de Jejum Guiado 21 Dias',
        subtitle: 'Acesse o e-book com o método comprovado',
        url: 'https://example.com/jejum-guiado',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop',
        format: 'square',
        active: true,
        isFeatured: false,
        clicks: 0,
      }
    ],
    socialLinks: [
      {
        id: 'soc-1',
        platform: 'instagram',
        url: 'https://instagram.com/dr.andrewparker',
        active: true,
      },
      {
        id: 'soc-2',
        platform: 'youtube',
        url: 'https://youtube.com/@dr.andrewparker',
        active: true,
      },
      {
        id: 'soc-3',
        platform: 'whatsapp',
        url: 'https://wa.me/5511999999999',
        active: true,
      }
    ],
    tracking: {
      metaPixelId: '',
    },
    stats: {
      views: 0,
      ctaClicks: 0,
      clicks: {}
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-2',
    slug: 'vitalix-store',
    name: 'VITALIX NUTRITION',
    avatarUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&auto=format&fit=crop',
    verified: true,
    badgeColor: '#10b981',
    bio: '🌿 Suplementos Premium 100% Naturais\n🚚 Frete Grátis acima de R$ 199\n⚡ Envio em até 24 horas úteis',
    layout: 'cinematic',
    theme: 'emerald-luxe',
    language: 'pt',
    customColors: {
      bgColor: '#06201b',
      textColor: '#ecfdf5',
      secondaryTextColor: '#6ee7b7',
      cardBgColor: '#0b332b',
      accentColor: '#10b981',
    },
    hideBranding: false,
    links: [
      {
        id: 'vital-link-1',
        title: 'Combo Emagrecimento Turbinado 3x',
        subtitle: 'Super oferta com 40% OFF hoje',
        url: 'https://example.com/combo',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
        format: 'rectangular',
        active: true,
        isFeatured: true,
        clicks: 0,
      }
    ],
    socialLinks: [
      {
        id: 'soc-v1',
        platform: 'instagram',
        url: 'https://instagram.com/vitalix',
        active: true,
      },
      {
        id: 'soc-v2',
        platform: 'whatsapp',
        url: 'https://wa.me/5511999999999',
        active: true,
      }
    ],
    tracking: {},
    stats: {
      views: 0,
      ctaClicks: 0,
      clicks: {}
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const THEME_PRESETS = [
  {
    id: 'cinema-noir',
    name: 'Cinema Noir',
    description: 'Preto absoluto com destaque vermelho — o clássico cinematográfico.',
    bg: '#000000',
    cardBg: '#0a0a0a',
    textColor: '#ffffff',
    accentColor: '#e11d2e',
    border: '#27272a',
    badge: 'ATIVO',
  },
  {
    id: 'midnight-indigo',
    name: 'Midnight Indigo',
    description: 'Fundo noturno com brilho elétrico índigo. Perfil tech premium.',
    bg: '#0b0f19',
    cardBg: '#111827',
    textColor: '#f9fafb',
    accentColor: '#6366f1',
    border: '#1f2937',
  },
  {
    id: 'paper-ink',
    name: 'Paper & Ink',
    description: 'Modo claro editorial — off-white com tinta preta e destaque vivo.',
    bg: '#fafaf9',
    cardBg: '#ffffff',
    textColor: '#1c1917',
    accentColor: '#e11d48',
    border: '#e7e5e4',
  },
  {
    id: 'emerald-luxe',
    name: 'Emerald Luxe',
    description: 'Verde profundo com dourado. Sensação de autoridade e luxo.',
    bg: '#06201b',
    cardBg: '#0b332b',
    textColor: '#ecfdf5',
    accentColor: '#10b981',
    border: '#134e4a',
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze',
    description: 'Grafite quente com laranja vibrante. Energia e movimento.',
    bg: '#18100e',
    cardBg: '#2c1b18',
    textColor: '#fff7ed',
    accentColor: '#f97316',
    border: '#432621',
  },
];

export const LAYOUT_PRESETS = [
  {
    id: 'cinematic',
    name: 'Cinematográfico',
    description: 'Foto grande em tela cheia, nome enorme em caixa alta. Impacto máximo.',
    icon: 'Maximize2',
  },
  {
    id: 'creator-portrait',
    name: 'Retrato Criador',
    description: 'Avatar redondo centralizado, selo verificado e cards com imagem grande.',
    icon: 'UserCheck',
  },
  {
    id: 'editorial-clean',
    name: 'Editorial Clean',
    description: 'Retrato central com cantos suaves, nome em serifa elegante e lista de links com divisores finos. Muito ar.',
    icon: 'Layout',
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    description: 'Tipografia monoespaçada, avatar pequeno e cards sóbrios sem imagens.',
    icon: 'Terminal',
  },
  {
    id: 'neon-glow',
    name: 'NEON GLOW',
    description: 'Fundo escuro com brilho, avatar quadrado e cards com efeito vidro.',
    icon: 'Sparkles',
  },
];

export const MASTER_ADMIN_EMAIL = 'vitorfxzxx@gmail.com';
export const MASTER_ADMIN_PASSWORD = '!Dark131409';

export const DEFAULT_MEMBERS = [
  {
    id: 'mem-1',
    email: 'vitor10dcompany@gmail.com',
    name: 'Luca Mendes',
    slug: 'lucamendesbr',
    status: 'active' as const,
    plan: 'PRO Anual',
    createdAt: '22/07/2026',
    visits: 24,
    clicks: 4,
  },
  {
    id: 'mem-2',
    email: 'vitorfxzxx@gmail.com',
    name: 'Andrew Parker',
    slug: 'andrewparker',
    status: 'active' as const,
    plan: 'MASTER Vitalício',
    createdAt: '22/07/2026',
    visits: 24,
    clicks: 2,
  },
];

export const DEFAULT_WEBHOOKS = [
  {
    id: 'wh-1',
    platform: 'kiwify' as const,
    name: 'Kiwify — Compra Aprovada',
    webhookUrl: 'https://aurabio.link/api/public/webhooks/sale?secret=s15pzrtdw6AvUXzvjf4YInUafi0JW8MaOutKEQtTHz6Jnz7B',
    secretToken: 's15pzrtdw6AvUXzvjf4YInUafi0JW8MaOutKEQtTHz6Jnz7B',
    active: true,
    totalEvents: 42,
    lastEventAt: 'Hoje às 11:42',
  },
  {
    id: 'wh-2',
    platform: 'hotmart' as const,
    name: 'Hotmart — Postback Global',
    webhookUrl: 'https://aurabio.link/api/public/webhooks/sale?secret=ht_sec_3391029381',
    secretToken: 'ht_sec_3391029381',
    active: true,
    totalEvents: 18,
    lastEventAt: 'Ontem às 19:15',
  },
  {
    id: 'wh-3',
    platform: 'perfectpay' as const,
    name: 'PerfectPay — Vendas & Upgrades',
    webhookUrl: 'https://aurabio.link/api/public/webhooks/sale?secret=pp_sec_1928374650',
    secretToken: 'pp_sec_1928374650',
    active: true,
    totalEvents: 12,
    lastEventAt: 'Há 2 dias',
  }
];

export const DEFAULT_MASTER_BRANDING = {
  appName: 'Aurabio',
  tagline: 'Sua página de links, do seu jeito.',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
  faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop',
  seoTitle: 'Aurabio — Link na Bio profissional',
  seoDescription: 'Crie sua página de link na bio profissional com trackeamento e temas cinematográficos.',
  keywords: 'link na bio, página de links, bio personalizada, linktree brasileiro, linktree alternativa, biolink, aurabio,',
  ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  footerText: 'Feito com Aurabio',
  supportEmail: 'Corefysystems@gmail.com',
  customDomain: 'aurabio.link',
};
