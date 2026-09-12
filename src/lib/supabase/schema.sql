-- ==============================================================================
-- AURABIO - SUPABASE DATABASE SCHEMA
-- Multi-SaaS Architecture Isolation (Prefix: aurabio_)
-- ==============================================================================

-- 1. TABELA DE PÁGINAS (aurabio_pages)
CREATE TABLE IF NOT EXISTS aurabio_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  avatar_zoom NUMERIC DEFAULT 1,
  avatar_position JSONB DEFAULT '{"x": 50, "y": 50}',
  verified BOOLEAN DEFAULT false,
  badge_color TEXT DEFAULT '#dc2626',
  bio TEXT DEFAULT '',
  layout TEXT DEFAULT 'creator-portrait',
  theme TEXT DEFAULT 'cinema-noir',
  language TEXT DEFAULT 'pt',
  custom_colors JSONB DEFAULT '{
    "bgColor": "#000000",
    "textColor": "#ffffff",
    "secondaryTextColor": "#a3a3a3",
    "cardBgColor": "#0a0a0a",
    "accentColor": "#e11d2e"
  }',
  hide_branding BOOLEAN DEFAULT false,
  links JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  tracking JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{"views": 0, "ctaClicks": 0, "clicks": {}}'::jsonb,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABELA DE MEMBROS / USUÁRIOS (aurabio_members)
CREATE TABLE IF NOT EXISTS aurabio_members (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active' | 'suspended'
  plan TEXT DEFAULT 'Aura Pro V.I.P',
  visits INT DEFAULT 0,
  clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELA DE INTEGRAÇÃO DE WEBHOOKS (aurabio_webhooks)
CREATE TABLE IF NOT EXISTS aurabio_webhooks (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL, -- 'kiwify' | 'hotmart' | 'perfectpay' | 'cakto' | 'stripe' | 'braip'
  name TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  secret_token TEXT,
  active BOOLEAN DEFAULT true,
  total_events INT DEFAULT 0,
  last_event_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABELA DE CONFIGURAÇÕES MASTER & BRANDING (aurabio_master_settings)
CREATE TABLE IF NOT EXISTS aurabio_master_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_master_config',
  app_name TEXT DEFAULT 'AURABIO',
  tagline TEXT DEFAULT 'Crie páginas bio de alta conversão para criadores de conteúdo',
  logo_url TEXT,
  favicon_url TEXT,
  seo_title TEXT DEFAULT 'AURABIO — Links de Alta Conversão',
  seo_description TEXT DEFAULT 'Crie sua página bio minimalista com design cinematográfico e alta conversão.',
  keywords TEXT DEFAULT 'link in bio, biolink, biolink creator, aurabio',
  og_image_url TEXT,
  footer_text TEXT DEFAULT '© 2026 Aurabio. Todos os direitos reservados.',
  support_email TEXT DEFAULT 'suporte@aurabio.link',
  custom_domain TEXT DEFAULT 'aurabio.link',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABELA DE EVENTOS / ANALYTICS DETALHADOS (aurabio_analytics_events)
CREATE TABLE IF NOT EXISTS aurabio_analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT,
  page_slug TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view' | 'click' | 'cta_click' | 'social_click'
  target_id TEXT, -- link id or social platform
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- DESABILITAR ROW LEVEL SECURITY PARA ACESSO DIRETO VIA CLIENTE
-- ==============================================================================
ALTER TABLE aurabio_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE aurabio_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE aurabio_webhooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE aurabio_master_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE aurabio_analytics_events DISABLE ROW LEVEL SECURITY;

-- ÍNDICES DE ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_aurabio_pages_slug ON aurabio_pages(slug);
CREATE INDEX IF NOT EXISTS idx_aurabio_pages_user_email ON aurabio_pages(user_email);
CREATE INDEX IF NOT EXISTS idx_aurabio_members_email ON aurabio_members(email);
CREATE INDEX IF NOT EXISTS idx_aurabio_analytics_slug ON aurabio_analytics_events(page_slug);
