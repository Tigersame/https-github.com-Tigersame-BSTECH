
import React from 'react';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect,
  WalletDropdownLink 
} from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-base-blue flex items-center justify-center font-black text-white shadow-lg shadow-base-blue/20 rotate-3">
          BS
        </div>
        <div>
          <h1 className="font-black text-lg leading-none tracking-tighter">BSTECH</h1>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Base Hub</span>
        </div>
      </div>

      <div className="flex items-center">
        <Wallet>
          <ConnectWallet className="bg-white text-black hover:bg-zinc-200 transition-all font-bold rounded-full px-5 py-2 text-xs shadow-xl active:scale-95">
            <Avatar className="h-5 w-5" />
            <Name className="ml-1" />
          </ConnectWallet>
          <WalletDropdown className="bg-zinc-900 border border-zinc-800 rounded-3xl mt-2 overflow-hidden shadow-2xl">
            <Identity className="px-5 pt-4 pb-3 border-b border-zinc-800" hasCopyAddressOnClick>
              <Avatar className="h-10 w-10 rounded-xl" />
              <div className="ml-3">
                <Name className="font-bold text-white" />
                <Address className="text-zinc-500 text-xs" />
              </div>
            </Identity>
            <div className="p-2">
              <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com" className="rounded-xl hover:bg-zinc-800 text-sm font-medium">
                Manage Keys
              </WalletDropdownLink>
              <WalletDropdownDisconnect className="rounded-xl hover:bg-red-500/10 hover:text-red-400 text-sm font-medium mt-1" />
            </div>
          </WalletDropdown>
        </Wallet>
      </div>
    </header>
  );
};

export default Navbar;
