import React, { useState } from 'react';
import { useBio } from '../context/BioContext';
import { 
  Users, 
  Zap, 
  Mail, 
  Palette, 
  RefreshCw, 
  LogOut, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  LayoutDashboard,
  Upload,
  Save,
  KeyRound
} from 'lucide-react';
import { MASTER_ADMIN_PASSWORD, DEFAULT_MASTER_BRANDING } from '../data/defaultData';
import type { MasterBrandingConfig } from '../types/bio';

interface MasterAdminPageProps {
  onBackToCreatorPanel: () => void;
}

export const MasterAdminPage: React.FC<MasterAdminPageProps> = ({ onBackToCreatorPanel }) => {
  const {
    isMasterAuthenticated,
    masterAdminEmail,
    loginMaster,
    logoutMaster,
    members,
    addMember,
    toggleMemberStatus,
    deleteMember,
    masterBranding,
    updateMasterBranding,
    totalMasterVisits,
    totalMasterClicks,
    showNotification
  } = useBio();

  const [activeTab, setActiveTab] = useState<'members' | 'webhooks' | 'emails' | 'branding'>('members');
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Branding Form Local State
  const [brandingForm, setBrandingForm] = useState<MasterBrandingConfig>(() => ({
    ...DEFAULT_MASTER_BRANDING,
    ...(masterBranding || {})
  }));

  React.useEffect(() => {
    if (masterBranding) {
      setBrandingForm(prev => ({
        ...DEFAULT_MASTER_BRANDING,
        ...masterBranding,
        ...prev
      }));
    }
  }, [masterBranding]);

  // New Member Modal State
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberSlug, setNewMemberSlug] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('PRO Anual');

  // Email Provider State
  const [emailProvider, setEmailProvider] = useState<'resend' | 'smtp'>('resend');
  const [resendApiKey, setResendApiKey] = useState('re_123456789_abcdefghijklmnopqrstuvwxyz');
  const [smtpHost, setSmtpHost] = useState('smtp.hostinger.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUser, setSmtpUser] = useState('suporte@aurabio.link');
  const [smtpPass, setSmtpPass] = useState('••••••••••••');
  const [senderName, setSenderName] = useState('Aurabio Suporte');
  const [senderEmail, setSenderEmail] = useState('suporte@aurabio.link');

  // Webhook URL (Guru default)
  const webhookUrl = "https://aurabio.link/api/webhooks/sale?secret=s15pzrtdw6AvUXzvjf4YInUafi0JW8MaOutKEQtTHz6Jnz7B";

  // Refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Administração Master atualizada com sucesso!');
    }, 500);
  };

  // Auth Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMaster(authEmailInput, authPasswordInput);
  };

  // Quick Master Fill
  const handleQuickMasterFill = () => {
    setAuthEmailInput(masterAdminEmail);
    setAuthPasswordInput(MASTER_ADMIN_PASSWORD);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !newMemberSlug.trim()) {
      showNotification('Preencha ao menos o e-mail e o slug.');
      return;
    }

    addMember({
      email: newMemberEmail.trim(),
      name: newMemberName.trim() || newMemberSlug.trim(),
      slug: newMemberSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      status: 'active',
      plan: newMemberPlan,
      visits: 0,
      clicks: 0,
    });

    setShowNewMemberModal(false);
    setNewMemberEmail('');
    setNewMemberName('');
    setNewMemberSlug('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`${label} copiado para a área de transferência!`);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateMasterBranding(brandingForm);
    showNotification('Branding & SEO salvos com sucesso!');
  };

  const handleImageUpload = (field: 'logoUrl' | 'faviconUrl' | 'ogImageUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandingForm(prev => ({ ...prev, [field]: reader.result as string }));
        showNotification('Imagem carregada!');
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------------------------------------------
  // 1. MASTER LOGIN SCREEN (Se não estiver autenticado)
  // -------------------------------------------------------------
  if (!isMasterAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Aurabio Logo" className="w-14 h-14 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 block mb-1">
              MASTER
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Administração
            </h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Área de acesso restrito ao proprietário do sistema.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                E-mail Master
              </label>
              <input
                type="email"
                required
                value={authEmailInput}
                onChange={(e) => setAuthEmailInput(e.target.value)}
                placeholder="vitorfxzxx@gmail.com"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Senha Master
              </label>
              <input
                type="password"
                required
                value={authPasswordInput}
                onChange={(e) => setAuthPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              Entrar na Administração Master
            </button>
          </form>

          {/* Quick Access Helper */}
          <div className="pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleQuickMasterFill}
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <KeyRound size={13} />
              <span>Preencher credenciais salvas</span>
            </button>

            <button
              type="button"
              onClick={onBackToCreatorPanel}
              className="text-xs text-zinc-500 hover:text-zinc-400 mt-3 block mx-auto cursor-pointer"
            >
              Voltar ao Painel Criador
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeMembersCount = members.filter(m => m.status === 'active').length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Aurabio Logo" className="w-9 h-9 object-contain" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                MASTER
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Administração
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onBackToCreatorPanel}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ir para o editor de página de bio"
            >
              <LayoutDashboard size={14} />
              <span className="hidden sm:inline">Painel Criador</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Atualizar dados"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={logoutMaster}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Encerrar sessão Master"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
              MEMBROS
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {members.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
              ATIVOS
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {activeMembersCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
              TOTAL DE VISITAS
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {totalMasterVisits}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm">
            <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
              TOTAL DE CLIQUES
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {totalMasterClicks}
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-1 border-b border-zinc-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'members'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Users size={16} />
            <span>Membros</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'webhooks'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Zap size={16} />
            <span>Webhooks de venda</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'emails'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Mail size={16} />
            <span>E-mails</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'branding'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Palette size={16} />
            <span>Branding</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: MEMBROS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowNewMemberModal(true)}
                className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>Novo membro</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-extrabold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">EMAIL</th>
                      <th className="px-5 py-3.5">SLUG</th>
                      <th className="px-5 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5">CRIADO</th>
                      <th className="px-5 py-3.5 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="px-5 py-4 font-medium text-zinc-900">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900">{member.email}</span>
                            <span className="text-[11px] text-zinc-400">{member.name} • {member.plan}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs">
                          <a
                            href={`/${member.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold"
                          >
                            <span>/{member.slug}</span>
                            <ExternalLink size={13} className="opacity-60" />
                          </a>
                        </td>

                        <td className="px-5 py-4">
                          {member.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                              active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800">
                              suspenso
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-zinc-500 text-xs">
                          {member.createdAt}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => toggleMemberStatus(member.id)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                member.status === 'active'
                                  ? 'border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                                  : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {member.status === 'active' ? (
                                <>
                                  <ShieldAlert size={13} />
                                  <span>Suspender</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck size={13} />
                                  <span>Ativar</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Deseja excluir o membro ${member.email}?`)) {
                                  deleteMember(member.id);
                                }
                              }}
                              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir membro"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: WEBHOOKS DE VENDA (GURU INTEGRATION) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'webhooks' && (
          <div className="space-y-5">
            {/* Card 1: Integrar Digital Manager Guru */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Integrar Digital Manager Guru</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Configure os webhooks da Guru para liberar e revogar o acesso automaticamente conforme o status da assinatura.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  URL do webhook (já com o seu segredo)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-700 bg-zinc-50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(webhookUrl, 'URL do Webhook')}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  Use esta mesma URL para Vendas e Assinaturas. Cole exatamente como está — já vem pronta.
                </p>
              </div>
            </div>

            {/* Card 2: 1) Webhook de Vendas */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-3">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">1) Webhook de Vendas (liberação inicial)</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Cria a conta do comprador na hora que a venda for aprovada.
                </p>
              </div>

              <ol className="text-xs text-zinc-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>No painel da Guru: <span className="font-semibold text-zinc-900">Configurações → Webhooks → Vendas → Adicionar</span>.</li>
                <li>Em <span className="font-semibold text-zinc-900">Nome:</span> <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">Vendas — AuraBio</code>.</li>
                <li>Em <span className="font-semibold text-zinc-900">URL:</span> cole a URL acima (com o segredo real).</li>
                <li>Em <span className="font-semibold text-zinc-900">Status:</span> marque pelo menos <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Aprovada</span>.</li>
                <li>Em <span className="font-semibold text-zinc-900">Filtrar por: Produtos</span> — selecione o produto do AuraBio.</li>
                <li>Deixe <span className="font-semibold text-zinc-900">Ativo</span>, salve e envie um teste. O log deve mostrar <code className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">success</code>.</li>
              </ol>
            </div>

            {/* Card 3: 2) Webhook de Assinaturas */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-3">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">2) Webhook de Assinaturas (renovação e cancelamento)</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Mantém o acesso liberado enquanto a assinatura estiver ativa e suspende automaticamente quando o cliente cancela ou a cobrança expira.
                </p>
              </div>

              <ol className="text-xs text-zinc-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>No painel da Guru: <span className="font-semibold text-zinc-900">Configurações → Webhooks → Assinaturas → Adicionar</span>.</li>
                <li>Em <span className="font-semibold text-zinc-900">Nome:</span> <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">Assinaturas — AuraBio</code>.</li>
                <li>Em <span className="font-semibold text-zinc-900">URL:</span> cole a mesma URL do webhook acima.</li>
                <li>
                  Em <span className="font-semibold text-zinc-900">Status</span>, marque estes quatro:
                  <div className="inline-flex items-center gap-1.5 ml-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Ativa</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Cancelada</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Expirada</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Inativa</span>
                  </div>
                </li>
                <li><span className="text-zinc-500">Ativa mantém/reativa o acesso. Cancelada, Expirada e Inativa suspendem automaticamente.</span></li>
                <li>Em <span className="font-semibold text-zinc-900">Filtrar por: Produtos</span> — selecione o produto do AuraBio.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: E-MAILS & INTEGRAÇÃO DE ENVIO */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'emails' && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900">E-mails Transacionais & Notificações</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Configure o serviço de disparo de e-mails para entrega automática de credenciais e boas-vindas aos clientes.
              </p>
            </div>

            {/* Provider Selection */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-4">
              <label className="block text-xs font-bold text-zinc-800">
                Provedor de Envio de E-mails
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Resend Option */}
                <div 
                  onClick={() => setEmailProvider('resend')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    emailProvider === 'resend'
                      ? 'border-zinc-950 bg-white shadow-md ring-2 ring-zinc-950/10'
                      : 'border-zinc-200 bg-white/70 hover:bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-zinc-900">Resend (Recomendado)</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">API Rápida</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Até 3.000 e-mails/mês grátis com altíssima taxa de entrega na caixa de entrada sem cair em spam.
                  </p>
                </div>

                {/* SMTP Option */}
                <div 
                  onClick={() => setEmailProvider('smtp')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    emailProvider === 'smtp'
                      ? 'border-zinc-950 bg-white shadow-md ring-2 ring-zinc-950/10'
                      : 'border-zinc-200 bg-white/70 hover:bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-zinc-900">SMTP Próprio</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-100 text-zinc-600">Servidor</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Hostinger, Gmail Workspace, SendGrid, Titan Mail ou Amazon SES.
                  </p>
                </div>
              </div>

              {/* Resend API Key Input */}
              {emailProvider === 'resend' ? (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Chave de API do Resend (API Key)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={resendApiKey}
                      onChange={(e) => setResendApiKey(e.target.value)}
                      placeholder="re_123456789_..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 text-xs font-bold text-zinc-700 bg-zinc-200/80 hover:bg-zinc-300 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <span>Obter Chave</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                /* SMTP Credentials Input */
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Servidor SMTP (Host)
                    </label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.hostinger.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Porta SMTP
                    </label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="465 ou 587"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Usuário SMTP
                    </label>
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="suporte@aurabio.link"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Senha SMTP
                    </label>
                    <input
                      type="password"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="Sua senha SMTP"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Template Fields */}
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nome do Remetente
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    E-mail de Envio (Remetente)
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Assunto do E-mail de Boas-Vindas
                </label>
                <input
                  type="text"
                  defaultValue="Seu link na bio Aurabio está pronto! Acesso imediato"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Corpo do E-mail
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    Tags dinâmicas: <code className="text-zinc-600 font-mono font-bold">{'{nome}'}</code>, <code className="text-zinc-600 font-mono font-bold">{'{slug}'}</code>, <code className="text-zinc-600 font-mono font-bold">{'{email}'}</code>
                  </span>
                </div>
                <textarea
                  rows={6}
                  defaultValue={`Olá {nome},\n\nSua conta no Aurabio foi ativada com sucesso!\nSeu endereço exclusivo: aurabio.link/{slug}\n\nPara acessar e personalizar sua bio:\nhttps://aurabio.link/painel\n\nQualquer dúvida, responda a este e-mail ou contate nosso time em Corefysystems@gmail.com.`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                />
              </div>

              {/* Test Sender */}
              <div className="p-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <span className="block text-xs font-bold text-zinc-800">Testar Disparo</span>
                  <span className="block text-[11px] text-zinc-500">Envie um e-mail de teste com este template para verificar a entrega.</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    defaultValue="vitorfxzxx@gmail.com"
                    placeholder="seuemail@gmail.com"
                    className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => showNotification('E-mail de teste enviado com sucesso!')}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    Enviar Teste
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => showNotification('Configurações de e-mail salvas com sucesso!')}
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Salvar Configurações de E-mail
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: BRANDING & SEO (Exact match of uploaded screenshot) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Branding & SEO</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Nome, logo, favicon e metadados que o Google e as redes sociais mostram sobre o site.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nome do app
                    </label>
                    <input
                      type="text"
                      value={brandingForm.appName || ''}
                      onChange={(e) => setBrandingForm(prev => ({ ...prev, appName: e.target.value }))}
                      placeholder="Aurabio"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Tagline curta
                    </label>
                    <input
                      type="text"
                      value={brandingForm.tagline || ''}
                      onChange={(e) => setBrandingForm(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Sua página de links, do seu jeito."
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                {/* Logo Section */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Logo
                  </label>
                  <div className="border border-dashed border-zinc-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="w-14 h-14 rounded-xl bg-zinc-950 flex items-center justify-center p-2 shrink-0 border border-zinc-800">
                      {brandingForm.logoUrl ? (
                        <img src={brandingForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">A</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload size={13} />
                        <span>Trocar logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('logoUrl', e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, logoUrl: '' }))}
                        className="px-3 py-2 text-xs text-zinc-500 hover:text-red-600 font-semibold cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    PNG transparente, largura ≥ 400px. Máx 500KB.
                  </p>
                </div>

                {/* Favicon Section */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Favicon
                  </label>
                  <div className="border border-dashed border-zinc-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center p-2 shrink-0 border border-zinc-800">
                      {brandingForm.faviconUrl ? (
                        <img src={brandingForm.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">A</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload size={13} />
                        <span>Trocar favicon</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('faviconUrl', e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, faviconUrl: '' }))}
                        className="px-3 py-2 text-xs text-zinc-500 hover:text-red-600 font-semibold cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    PNG quadrado 64x64 ou 128x128. Máx 200KB.
                  </p>
                </div>
              </div>

              {/* SEO Google Section */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                  SEO GOOGLE
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Título SEO (aparece no Google)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.seoTitle || ''}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {(brandingForm.seoTitle || '').length}/60 caracteres recomendados
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Descrição SEO
                  </label>
                  <textarea
                    rows={3}
                    value={brandingForm.seoDescription || ''}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {(brandingForm.seoDescription || '').length}/160 caracteres recomendados
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Palavras-chave (opcional)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.keywords || ''}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="link na bio, página de links, bio personalizada, aurabio"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Sharing Image (og:image) */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Imagem de compartilhamento (og:image)
                  </label>
                  <div className="border border-dashed border-zinc-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="w-24 h-14 rounded-xl bg-zinc-950 flex items-center justify-center p-1 shrink-0 overflow-hidden border border-zinc-800">
                      {brandingForm.ogImageUrl ? (
                        <img src={brandingForm.ogImageUrl} alt="OG" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-zinc-600 text-[10px]">1200 × 630</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload size={13} />
                        <span>Trocar imagem</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('ogImageUrl', e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, ogImageUrl: '' }))}
                        className="px-3 py-2 text-xs text-zinc-500 hover:text-red-600 font-semibold cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Recomendado 1200x630px. Máx 1MB.
                  </p>
                </div>

                <div className="flex justify-start pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Salvar branding</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Google Preview & Dicas */}
            <div className="space-y-4">
              {/* Google Preview Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-zinc-900">
                  Preview Google
                </h4>

                <div className="border border-zinc-200 rounded-xl p-3.5 bg-zinc-50/50 space-y-1 text-left">
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {brandingForm.customDomain || 'aurabio.link'}
                  </div>
                  <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer leading-tight">
                    {brandingForm.seoTitle || 'Aurabio — Link na Bio profissional'}
                  </div>
                  <div className="text-xs text-zinc-500 leading-relaxed line-clamp-2 pt-0.5">
                    {brandingForm.seoDescription || 'Crie sua página de link na bio profissional com trackeamento e temas cinematográficos.'}
                  </div>
                </div>
              </div>

              {/* Dicas Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-2.5 text-xs text-zinc-600">
                <h4 className="text-xs font-bold text-zinc-900">
                  Dicas
                </h4>
                <ul className="space-y-1.5 text-[11px] text-zinc-500 leading-relaxed">
                  <li>• <strong className="text-zinc-700">Favicon:</strong> PNG quadrado de 64x64 ou 128x128.</li>
                  <li>• <strong className="text-zinc-700">Logo:</strong> PNG transparente, largura ≥ 400px.</li>
                  <li>• <strong className="text-zinc-700">og:image:</strong> 1200x630 para redes sociais.</li>
                  <li>• <strong className="text-zinc-700">Título:</strong> até ~60 caracteres para não cortar no Google.</li>
                  <li>• <strong className="text-zinc-700">Descrição:</strong> até ~160 caracteres.</li>
                </ul>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: NOVO MEMBRO */}
      {/* ------------------------------------------------------------- */}
      {showNewMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900">Adicionar Novo Membro</h3>

            <form onSubmit={handleCreateMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  E-mail do Membro
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="cliente@exemplo.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nome / Marca
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Nome do Cliente"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Slug da Bio (/slug)
                </label>
                <input
                  type="text"
                  required
                  value={newMemberSlug}
                  onChange={(e) => setNewMemberSlug(e.target.value)}
                  placeholder="nomedocliente"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Plano
                </label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <option value="PRO Anual">PRO Anual</option>
                  <option value="PRO Mensal">PRO Mensal</option>
                  <option value="MASTER Vitalício">MASTER Vitalício</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Criar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
