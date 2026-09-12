import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Sparkles } from 'lucide-react';
import { useBio } from '../../context/BioContext';
import { BioPageRenderer } from './BioPageRenderer';

export const PhoneFrame: React.FC = () => {
  const { activePage } = useBio();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 select-none">
      {/* Viewport switcher toggle */}
      <div className="flex items-center bg-zinc-900/90 backdrop-blur border border-zinc-800 p-1 rounded-xl mb-6 shadow-md text-xs font-semibold text-zinc-400">
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
            viewMode === 'mobile'
              ? 'bg-zinc-800 text-white shadow-sm font-bold'
              : 'hover:text-zinc-200'
          }`}
        >
          <Smartphone size={14} />
          <span>Mobile</span>
        </button>
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
            viewMode === 'desktop'
              ? 'bg-zinc-800 text-white shadow-sm font-bold'
              : 'hover:text-zinc-200'
          }`}
        >
          <Monitor size={14} />
          <span>Desktop</span>
        </button>
      </div>

      {/* Frame Container */}
      <div className="relative flex items-center justify-center transition-all duration-500 max-h-[82vh]">
        {viewMode === 'mobile' ? (
          /* Realistic Smartphone Mockup */
          <div className="relative w-[340px] sm:w-[370px] h-[680px] bg-zinc-950 rounded-[46px] p-3 shadow-phone border-4 border-zinc-800/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
            {/* Speaker & Dynamic Island / Camera */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800/50" />
              <div className="w-2 h-2 rounded-full bg-blue-950/70" />
            </div>

            {/* Mobile Status Bar */}
            <div className="w-full pt-1.5 px-6 pb-1 flex justify-between items-center text-[10px] text-zinc-400 font-medium z-20 shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi size={11} />
                <div className="flex items-center gap-0.5">
                  <Battery size={13} className="fill-current" />
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="w-full flex-1 overflow-y-auto rounded-[36px] relative scrollbar-none">
              <BioPageRenderer page={activePage} isInteractive={false} />
            </div>

            {/* Home Indicator Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-30 pointer-events-none" />
          </div>
        ) : (
          /* Desktop Browser Mockup */
          <div className="relative w-full max-w-[540px] xl:max-w-[620px] h-[680px] bg-zinc-950 rounded-2xl p-2 shadow-2xl border border-zinc-800 flex flex-col overflow-hidden transition-all duration-300">
            {/* Browser Header Bar */}
            <div className="w-full px-3 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0 rounded-t-xl">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="bg-zinc-950 px-4 py-1 rounded-md text-[11px] text-zinc-300 font-mono flex items-center gap-2 border border-zinc-800/60">
                <Sparkles size={11} className="text-red-500" />
                <span>aurabio.link/u/{activePage.slug}</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Desktop Screen Content */}
            <div className="w-full flex-1 overflow-y-auto relative scrollbar-thin">
              <div className="w-full max-w-sm sm:max-w-md mx-auto min-h-full py-4">
                <BioPageRenderer page={activePage} isInteractive={false} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
