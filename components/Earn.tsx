
import React from 'react';
import { Earn } from '@coinbase/onchainkit/earn';
import { Connected } from '@coinbase/onchainkit/connected';
import { TrendingUp, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

const EarnTab: React.FC = () => {
  const vaultAddress = "0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A";

  const DisconnectedFallback = (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-500/15 text-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/10">
        <TrendingUp size={36} strokeWidth={2.5} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black italic uppercase">YIELD ENGINE</h3>
        <p className="text-zinc-500 text-sm font-medium max-w-[220px] mx-auto leading-relaxed">
          Connect your wallet to deposit into institutional-grade USDC vaults on Base.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32">
       <div className="flex justify-between items-end mb-2">
          <div className="space-y-0.5">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">TREASURY</h2>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Morpho Optimized</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase">Live APY</span>
          </div>
       </div>

       <div className="p-6 bg-gradient-to-br from-base-blue to-blue-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-base-blue/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rotate-45 translate-x-16 -translate-y-16" />
            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-black italic text-xl text-white">STEAKHOUSE USDC</h3>
                    <p className="text-xs text-white/60 font-medium">Verified Morpho Blue Vault</p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <TrendingUp size={24} className="text-white" />
                </div>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-black italic text-white leading-none">~12.4%</span>
                <span className="text-xs font-bold text-white/50 uppercase">Projected APY</span>
            </div>
       </div>

       <div className="earn-container mt-2">
         <Connected fallback={DisconnectedFallback}>
            <div className="bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900 p-2 shadow-inner overflow-hidden">
              <Earn vaultAddress={vaultAddress} />
            </div>
         </Connected>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-3xl space-y-3">
             <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit">
               <ShieldCheck size={20} />
             </div>
             <div className="space-y-0.5">
               <h4 className="text-xs font-black italic text-white uppercase tracking-tight">Insured Vault</h4>
               <p className="text-[10px] text-zinc-500 font-medium leading-tight">Steakhouse curated risk management.</p>
             </div>
          </div>
          <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-3xl space-y-3">
             <div className="p-2 bg-base-blue/10 text-base-blue rounded-xl w-fit">
               <Zap size={20} />
             </div>
             <div className="space-y-0.5">
               <h4 className="text-xs font-black italic text-white uppercase tracking-tight">Instant Exit</h4>
               <p className="text-[10px] text-zinc-500 font-medium leading-tight">No lockup period for your USDC capital.</p>
             </div>
          </div>
       </div>

       <div className="mt-4 p-6 text-center space-y-4 bg-zinc-950 border border-zinc-900 rounded-[2.5rem]">
            <p className="text-zinc-500 text-[11px] font-medium leading-relaxed max-w-xs mx-auto">
                All yields are variable and market-dependent. Deposit funds at your own risk. 
                Vaults are provided by <span className="text-white font-bold underline">Morpho Labs</span>.
            </p>
            <button className="flex items-center gap-2 mx-auto text-[10px] font-black text-base-blue uppercase tracking-widest hover:brightness-125 transition-all">
                Audit Reports <ArrowUpRight size={14} />
            </button>
       </div>
    </div>
  );
};

export default EarnTab;
