import React, { useState } from 'react';
import { Mail, Copy, Check, Headphones, ExternalLink, HelpCircle } from 'lucide-react';
import { useBio } from '../../../context/BioContext';

export const SupportTab: React.FC = () => {
  const { showNotification, t } = useBio();
  const [copied, setCopied] = useState(false);
  const supportEmail = 'Corefysystems@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    showNotification(`${t('copied')} ${supportEmail}`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{t('support_title')}</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          {t('support_sub')}
        </p>
      </div>

      {/* Main Support Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-md">
            <Headphones size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900">
              {t('need_help')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {t('need_help_sub')}
            </p>
          </div>
        </div>

        {/* Highlighted Email Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shadow-sm shrink-0">
              <Mail size={18} />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t('official_email_label')}
              </span>
              <span className="text-sm sm:text-base font-mono font-extrabold text-zinc-900 truncate select-all">
                {supportEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors shadow-sm cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? t('copied') : t('copy')}</span>
            </button>

            <a
              href={`mailto:${supportEmail}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-bold text-white transition-colors shadow-sm"
            >
              <ExternalLink size={14} />
              <span>{t('send_email')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Response time info card */}
      <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/80 p-5 space-y-2.5">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <HelpCircle size={16} className="text-zinc-500" />
          {t('response_time_title')}
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed">
          {t('response_time_sub')}
        </p>
      </div>
    </div>
  );
};
