
import React, { useState, useCallback, useMemo } from 'react';
import { SafeArea, usePrimaryButton, useComposeCast } from '@coinbase/onchainkit/minikit';
import { sdk } from '@farcaster/miniapp-sdk';
import Navbar from './components/Navbar';
import Launcher from './components/Launcher';
import Swap from './components/Swap';
import Earn from './components/Earn';
import Marketing from './components/Marketing';
import { TabType, TokenForm } from './types';
import { Rocket, Repeat, TrendingUp, Megaphone } from 'lucide-react';

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
    
    // Simulating deployment logic for the clanker-style launcher
    setTimeout(() => {
      setIsDeploying(false);
      (sdk.actions as any).haptics?.notification({ type: 'success' });
      
      composeCast({
        text: `🚀 I just launched ${launcherForm.name} ($${launcherForm.ticker}) on Base via @bstech!\n\nThe next big meme is here. Check it out! 🔵`,
        embeds: [window.location.origin]
      });

      setLauncherForm({
        name: '',
        ticker: '',
        description: '',
        imageFile: null,
        initialBuy: '0.01',
      });
    }, 3000);
  }, [launcherForm, composeCast]);

  const handleShareIdentity = useCallback(() => {
    (sdk.actions as any).haptics?.impact({ type: 'medium' });
    composeCast({
      text: "🎨 Just generated a new Brand Kit for my project on Base using BSTECH Identity Studio! \n\nCheck out the AI-powered designer at @bstech. 🔵",
      embeds: [window.location.origin]
    });
  }, [composeCast]);

  const handlePrimaryAction = useCallback(() => {
    switch (activeTab) {
      case 'launcher':
        if (!isVerified) {
          (sdk.actions as any).haptics?.impact({ type: 'light' });
          sdk.quickAuth.getToken().then(({ token }) => {
            if (token) {
              setIsVerified(true);
              (sdk.actions as any).haptics?.notification({ type: 'success' });
            }
          });
        } else if (showConfirm) {
          confirmDeployment();
        } else {
          setShowConfirm(true);
        }
        break;
      case 'market':
        handleShareIdentity();
        break;
      default:
        break;
    }
  }, [activeTab, isVerified, showConfirm, confirmDeployment, handleShareIdentity]);

  const primaryButtonConfig = useMemo(() => {
    // We only use the SDK Primary Button for Launcher and Market
    // Swap and Earn use OnchainKit's built-in buttons for better UX
    if (activeTab === 'launcher') {
      const text = showConfirm ? 'CONFIRM DEPLOY' : (isVerified ? 'LAUNCH TOKEN' : 'VERIFY TO LAUNCH');
      const disabled = isDeploying || (isVerified && (!launcherForm.name || !launcherForm.ticker));
      return { text, disabled, hidden: false };
    }
    
    if (activeTab === 'market') {
      return { text: 'SHARE BRAND KIT', disabled: false, hidden: false };
    }

    return { text: '', disabled: true, hidden: true };
  }, [activeTab, isVerified, showConfirm, launcherForm, isDeploying]);

  usePrimaryButton({ 
    text: primaryButtonConfig.text, 
    disabled: primaryButtonConfig.disabled,
    hidden: primaryButtonConfig.hidden
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
                onVerify={() => {}} // Handled by primary button but logic is shared
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                isDeploying={isDeploying}
                onConfirm={confirmDeployment}
              />
            )}
            {activeTab === 'swap' && <Swap />}
            {activeTab === 'earn' && <Earn />}
            {activeTab === 'market' && <Marketing />}
          </main>
          
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-md mx-auto bg-zinc-950/80 backdrop-blur-3xl border-t border-zinc-900 pb-safe">
              <div className="flex justify-around items-center px-4 py-5">
                {[
                  { id: 'launcher', icon: Rocket, label: 'Factory' },
                  { id: 'swap', icon: Repeat, label: 'Swap' },
                  { id: 'earn', icon: TrendingUp, label: 'Earn' },
                  { id: 'market', icon: Megaphone, label: 'Studio' }
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
