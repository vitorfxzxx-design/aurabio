import type { Language } from '../utils/translations';

export type PageLayout = 
  | 'cinematic' 
  | 'creator-portrait' 
  | 'editorial' 
  | 'editorial-clean'
  | 'minimal-mono' 
  | 'neon-glow';

export type PageTheme = 
  | 'cinema-noir' 
  | 'midnight-indigo' 
  | 'paper-ink' 
  | 'emerald-luxe' 
  | 'sunset-blaze' 
  | 'custom';

export type CardFormat = 'rectangular' | 'square';

export type SocialPlatform = 
  | 'instagram' 
  | 'tiktok' 
  | 'youtube' 
  | 'whatsapp' 
  | 'twitter' 
  | 'linkedin' 
  | 'telegram' 
  | 'facebook' 
  | 'email' 
  | 'website';

export interface BioLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  imageUrl?: string;
  format: CardFormat;
  active: boolean;
  isFeatured?: boolean; // Toggle for "🔥 MAIS ACESSADO" / "DESTACADO"
  clicks?: number;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  active: boolean;
}

export interface TrackingConfig {
  metaPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface CustomColors {
  bgColor: string;
  textColor: string;
  secondaryTextColor: string;
  cardBgColor: string;
  accentColor: string;
}

export interface BioPage {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  badgeColor?: string;
  bio: string;
  layout: PageLayout;
  theme: PageTheme;
  language?: Language;
  customColors?: CustomColors;
  hideBranding?: boolean;
  links: BioLink[];
  socialLinks: SocialLink[];
  tracking: TrackingConfig;
  stats: {
    views: number;
    ctaClicks?: number;
    clicks: Record<string, number>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MasterMember {
  id: string;
  email: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended';
  plan: string;
  createdAt: string;
  visits?: number;
  clicks?: number;
}

export interface WebhookIntegration {
  id: string;
  platform: 'kiwify' | 'hotmart' | 'perfectpay' | 'cakto' | 'stripe' | 'braip';
  name: string;
  webhookUrl: string;
  secretToken: string;
  active: boolean;
  totalEvents: number;
  lastEventAt?: string;
}

export interface MasterBrandingConfig {
  appName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  seoTitle: string;
  seoDescription: string;
  keywords?: string;
  ogImageUrl?: string;
  footerText: string;
  supportEmail: string;
  customDomain: string;
}
