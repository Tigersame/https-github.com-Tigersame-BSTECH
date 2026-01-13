
import React, { useState, useCallback } from 'react';
import { SafeArea, useMiniKit, usePrimaryButton, useComposeCast } from '@coinbase/onchainkit/minikit';
import { sdk } from '@farcaster/miniapp-sdk';
import Navbar from './components/Navbar';
import Launcher from './components/Launcher';
import Swap from './components/Swap';
import Earn from './components/Earn';
import { TabType, TokenForm } from './types';
import { Rocket, Repeat, TrendingUp, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('launcher');
  const { composeCast } = useComposeCast();

  const [launcherForm, setLauncherForm] = useState<TokenForm>({
    name: '',
    ticker: '',
    description: '',
    imageFile: null,
    initialBuy: '0.01',
  });
  
  const [isVerified, setIsVerified] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleTabChange = (tabId: TabType) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);
      (sdk.actions as any).haptics?.selection();
    }
  };

  const confirmDeployment = useCallback(() => {
    setShowConfirm(false);
    setIsDeploying(true);
    (sdk.actions as any).haptics?.impact({ type: 'heavy' });
    
    setTimeout(() => {
      setIsDeploying(false);
      (sdk.actions as any).haptics?.notification({ type: 'success' });
      composeCast({
        text: `🚀 Just launched ${launcherForm.name} ($${launcherForm.ticker}) on Base via @bstech!\n\nCheck it out! 🔵`,
        embeds: [window.location.origin]
      });
      setLauncherForm({
        name: '',
        ticker: '',
        description: '',
        imageFile: null,
        initialBuy: '0.01',
      });
    }, 2500);
  }, [launcherForm, composeCast]);

  const handlePrimaryAction = useCallback(() => {
    (sdk.actions as any).haptics?.impact({ type: 'medium' });
    
    switch (activeTab) {
      case 'launcher':
        if (showConfirm) {
          confirmDeployment();
        } else {
          setShowConfirm(true);
        }
        break;
      case 'swap':
        break;
      case 'earn':
        break;
    }
  }, [activeTab, showConfirm, confirmDeployment]);

  const handleQuickAuth = useCallback(async () => {
    try {
      (sdk.actions as any).haptics?.impact({ type: 'light' });
      const { token } = await sdk.quickAuth.getToken();
      if (token) {
        setIsVerified(true);
        (sdk.actions as any).haptics?.notification({ type: 'success' });
      }
    } catch (e) {
      console.error("Quick Auth failed", e);
    }
  }, []);

  const isButtonEnabled = activeTab === 'launcher'
    ? (!!launcherForm.name && !!launcherForm.ticker && isVerified)
    : true;

  const getPrimaryButtonText = () => {
    if (activeTab === 'launcher') {
      if (showConfirm) return 'CONFIRM DEPLOYMENT 🚀';
      return isVerified ? 'LAUNCH TOKEN' : 'VERIFY AGENT';
    }
    if (activeTab === 'swap') return 'SWAP ON BASE';
    return 'DEPOSIT FOR YIELD';
  };

  usePrimaryButton({ 
    text: getPrimaryButtonText(), 
    disabled: !isButtonEnabled || isDeploying
  }, handlePrimaryAction);

  return (
    <SafeArea>
      <div className="bg-black min-h-screen flex flex-col font-sans text-white select-none">
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-zinc-950 border-x border-zinc-900 shadow-2xl relative">
          <Navbar />
          
          <main className="flex-1 px-5 pt-8 pb-32 overflow-y-auto scrollbar-hide">
            {activeTab === 'launcher' && (
              <Launcher 
                form={launcherForm} 
                setForm={setLauncherForm} 
                isVerified={isVerified} 
                onVerify={handleQuickAuth}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                isDeploying={isDeploying}
                onConfirm={confirmDeployment}
              />
            )}
            {activeTab === 'swap' && <Swap />}
            {activeTab === 'earn' && <Earn />}
          </main>
          
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-md mx-auto bg-zinc-950/80 backdrop-blur-3xl border-t border-zinc-900 pb-safe">
              <div className="flex justify-around items-center px-4 py-5">
                {[
                  { id: 'launcher', icon: Rocket, label: 'Factory' },
                  { id: 'swap', icon: Repeat, label: 'Swap' },
                  { id: 'earn', icon: TrendingUp, label: 'Treasury' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as TabType)}
                    className={`flex flex-col items-center gap-1.5 transition-all relative ${
                      activeTab === tab.id ? 'text-base-blue' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-base-blue/10 scale-110' : ''}`}>
                      <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-base-blue rounded-full shadow-lg shadow-base-blue/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeArea>
  );
};

export default App;
