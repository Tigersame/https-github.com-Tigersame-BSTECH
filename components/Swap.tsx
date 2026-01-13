
import React from 'react';
import { 
  Swap, 
  SwapAmountInput, 
  SwapToggleButton, 
  SwapButton, 
  SwapMessage, 
  SwapToast,
  SwapSettings,
  SwapSettingsSlippageDescription,
  SwapSettingsSlippageInput,
  SwapSettingsSlippageTitle
} from '@coinbase/onchainkit/swap';
import { Connected } from '@coinbase/onchainkit/connected';
import { ArrowRightLeft, ShieldCheck, Zap } from 'lucide-react';
import type { Token } from '@coinbase/onchainkit/token';

const SwapTab: React.FC = () => {
  // Base Network Tokens
  const ETHToken: Token = {
    address: "", // Native ETH
    chainId: 8453,
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
    image: "https://dynamic-assets.coinbase.com/dbb4747c741e5a19b0d452F120da505ff9311447e0356414e59c6b3e230787f983a7f6f1f4a97401B76373A4315216124B9059B09644D29C232263539513AD2a/asset_icons/c0097E54461948A91023b6B0E235076e.png",
  };

  const USDCToken: Token = {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainId: 8453,
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    image: "https://dynamic-assets.coinbase.com/3c15df5e2Ac7d9435815593C375744f7943d0473070d65977922759330138B8f95671E2034371F1B58302197607F107077E8b449176B397399597405222099cc/asset_icons/97EE54461948A91023b6B0E235076e.png",
  };

  const DEGEN: Token = {
    address: "0x4ed4E241560a521f971f1bd8979fe5922E902806",
    chainId: 8453,
    decimals: 18,
    name: "Degen",
    symbol: "DEGEN",
    image: "https://basescan.org/token/images/degen_32.png",
  };

  const swappableTokens: Token[] = [ETHToken, USDCToken, DEGEN];

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
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase">Gas: Optimal</span>
          </div>
        </div>
      </div>

      <div className="swap-wrapper relative">
        <Connected fallback={DisconnectedFallback}>
          <div className="bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900 p-2 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-base-blue/10 blur-[60px] pointer-events-none group-hover:bg-base-blue/20 transition-all" />
            
            <Swap className="w-full bg-transparent p-4 border-none shadow-none" title="Swap Tokens">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Configure Route</span>
                <SwapSettings className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl overflow-hidden">
                  <SwapSettingsSlippageTitle className="text-white font-bold text-sm mb-1" />
                  <SwapSettingsSlippageDescription className="text-zinc-500 text-xs mb-3" />
                  <SwapSettingsSlippageInput className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-base-blue transition-all" />
                </SwapSettings>
              </div>

              <div className="space-y-1">
                <SwapAmountInput
                  label="Sell"
                  swappableTokens={swappableTokens}
                  token={ETHToken}
                  type="from"
                  className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-5 hover:border-zinc-700 transition-colors"
                />
                
                <div className="flex justify-center -my-4 relative z-10">
                  <SwapToggleButton className="bg-zinc-950 border-2 border-zinc-900 text-base-blue hover:text-white hover:border-base-blue transition-all p-3 rounded-2xl shadow-xl active:scale-90" />
                </div>

                <SwapAmountInput
                  label="Buy"
                  swappableTokens={swappableTokens}
                  token={USDCToken}
                  type="to"
                  className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-5 hover:border-zinc-700 transition-colors"
                />
              </div>

              <div className="mt-6">
                <SwapButton className="w-full py-5 rounded-3xl bg-base-blue hover:bg-blue-600 text-white font-black italic tracking-tighter uppercase text-lg shadow-2xl shadow-base-blue/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale" />
              </div>

              <SwapMessage className="mt-4 px-2" />
              <SwapToast />
            </Swap>
          </div>
        </Connected>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 space-y-2">
           <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Efficiency</div>
           <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap size={14} className="text-yellow-500" />
              Aggregated Route
           </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 space-y-2">
           <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Security</div>
           <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Audited Contract
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
