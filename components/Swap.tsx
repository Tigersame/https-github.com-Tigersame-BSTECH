
import React from 'react';
import { Swap } from '@coinbase/onchainkit/swap';
import { Connected } from '@coinbase/onchainkit/connected';
import { Settings, Repeat, ArrowRightLeft } from 'lucide-react';

const SwapTab: React.FC = () => {
  const DisconnectedFallback = (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-base-blue/15 text-base-blue rounded-[2rem] flex items-center justify-center shadow-xl">
        <ArrowRightLeft size={36} strokeWidth={2.5} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black italic uppercase">BRIDGE & SWAP</h3>
        <p className="text-zinc-500 text-sm font-medium max-w-[220px] mx-auto leading-relaxed">
          Connect your wallet to trade thousands of tokens on Base with zero delay.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-32">
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">DEX HUB</h2>
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Universal Swaps</span>
        </div>
        <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-90">
            <Settings size={20} />
        </button>
      </div>

      <div className="swap-wrapper relative">
        <Connected fallback={DisconnectedFallback}>
          <div className="bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900 p-2 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-base-blue/10 blur-[60px] pointer-events-none group-hover:bg-base-blue/20 transition-all" />
            <Swap className="ock-swap-custom" />
          </div>
        </Connected>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 space-y-2">
           <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Protocol</div>
           <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Aerodrome & Uniswap
           </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 space-y-2">
           <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Security</div>
           <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              Smart Routed
           </div>
        </div>
      </div>

      <div className="bg-zinc-950/30 border border-zinc-900/50 rounded-3xl p-5 text-xs">
         <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Efficiency Engine</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">Active</span>
         </div>
         <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
           BSTECH leverages OnchainKit Swap to source liquidity from the most efficient pools on Base, ensuring minimum slippage and maximum output.
         </p>
      </div>
    </div>
  );
};

export default SwapTab;
