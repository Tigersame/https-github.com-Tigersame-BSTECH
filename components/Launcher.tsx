
import React, { useState } from 'react';
import { TokenForm } from '../types';
import { 
  Upload, AlertTriangle, Wand2, Rocket, 
  ShieldCheck, Zap, UserCheck, Image as ImageIcon,
  Loader2, Sparkles, Activity, Info
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { sdk } from '@farcaster/miniapp-sdk';
import { Connected } from '@coinbase/onchainkit/connected';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface LauncherProps {
  form: TokenForm;
  setForm: React.Dispatch<React.SetStateAction<TokenForm>>;
  isVerified: boolean;
  onVerify: () => void;
  showConfirm: boolean;
  setShowConfirm: (val: boolean) => void;
  isDeploying: boolean;
  onConfirm: () => void;
}

const Launcher: React.FC<LauncherProps> = ({ 
  form, 
  setForm, 
  isVerified, 
  onVerify,
  showConfirm,
  setShowConfirm,
  isDeploying,
  onConfirm
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { context } = useMiniKit();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generateAIConcept = async () => {
    setIsGeneratingAI(true);
    (sdk.actions as any).haptics?.impact({ type: 'light' });
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Suggest a viral meme token for the Base blockchain. Provide a unique funny name, a 3-5 character ticker, and a short witty description. Output in JSON.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              ticker: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["name", "ticker", "description"]
          }
        }
      });
      
      const text = response.text || '{}';
      const data = JSON.parse(text);
      setForm(prev => ({
        ...prev,
        name: data.name || '',
        ticker: (data.ticker || '').toUpperCase().replace('$', ''),
        description: data.description || ''
      }));
      (sdk.actions as any).haptics?.impact({ type: 'medium' });
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAILogo = async () => {
    if (!form.name) {
      (sdk.actions as any).haptics?.notification({ type: 'error' });
      return;
    }
    setIsGeneratingImage(true);
    (sdk.actions as any).haptics?.impact({ type: 'medium' });
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional 2D flat minimalist logo or mascot for a crypto token named "${form.name}". Style: Vibrant, modern, vector art, suitable for a mobile app icon. ${form.description ? `Theme: ${form.description}` : ''}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64Data}`;
          setPreviewUrl(imageUrl);
          
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const file = new File([blob], `${form.ticker || 'token'}_logo.png`, { type: 'image/png' });
          setForm(prev => ({ ...prev, imageFile: file }));
          break;
        }
      }
      (sdk.actions as any).haptics?.notification({ type: 'success' });
    } catch (error) {
      console.error("Image generation failed", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setForm(prev => ({ ...prev, imageFile: file }));
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-base-blue text-[10px] font-black tracking-[0.25em] uppercase">
            <Activity size={12} className="text-emerald-500 animate-pulse" /> Factory Live
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-none italic">LAUNCHER</h1>
        </div>
        
        {context?.user && (
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full p-1.5 pr-4">
                <img src={context.user.pfpUrl} className="w-7 h-7 rounded-full bg-zinc-800 shadow-xl shadow-black/50 border border-zinc-700" alt="pfp" />
                <span className="text-[11px] font-bold text-zinc-300 truncate max-w-[90px]">@{context.user.username}</span>
             </div>
             <button 
               onClick={isVerified ? undefined : onVerify}
               className={`flex items-center gap-1.5 text-[10px] font-bold py-1 px-3 rounded-full border transition-all ${isVerified ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-700'}`}
             >
               {isVerified ? <><UserCheck size={11} /> Verified Agent</> : 'Get Verified'}
             </button>
          </div>
        )}
      </div>

      <Connected fallback={
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-[2.5rem] p-16 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-base-blue/20 text-base-blue rounded-3xl flex items-center justify-center animate-bounce shadow-2xl shadow-base-blue/30">
            <Rocket size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic text-white uppercase">CONNECT WALLET</h2>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto font-medium">Authorize deployment permissions to access the clanker factory.</p>
          </div>
        </div>
      }>
        <div className="bg-gradient-to-br from-zinc-900/5 to-zinc-950 border border-zinc-800/80 rounded-[2.5rem] p-7 space-y-7 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-base-blue/40 to-transparent" />
          
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-zinc-400">
               <Sparkles size={16} className="text-yellow-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">New Token Spec</span>
             </div>
             <button 
               onClick={generateAIConcept}
               disabled={isGeneratingAI}
               className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-[10px] font-bold transition-all active:scale-95 disabled:opacity-50"
             >
               {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
               AI DREAMER
             </button>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden transition-all hover:border-base-blue/50 group cursor-pointer shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Upload className="text-zinc-700" size={24} />
                  )}
                  {isGeneratingImage && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="text-base-blue animate-spin" size={28} />
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} title="Upload Image" disabled={isGeneratingImage} />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); generateAILogo(); }}
                  disabled={isGeneratingImage || !form.name}
                  className="absolute -bottom-2 -right-2 p-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-400 hover:text-base-blue hover:border-base-blue transition-all disabled:opacity-30 shadow-2xl"
                  title="Generate Logo"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <input 
                  type="text" name="name" value={form.name} onChange={handleInputChange}
                  placeholder="TOKEN NAME" 
                  className="w-full bg-transparent text-2xl font-black italic placeholder-zinc-800 focus:outline-none uppercase tracking-tight text-white"
                />
                <div className="flex items-center gap-2">
                  <span className="text-base-blue font-black">$</span>
                  <input 
                    type="text" name="ticker" value={form.ticker} onChange={handleInputChange}
                    placeholder="TICKER" 
                    className="w-full bg-transparent text-sm font-mono text-white placeholder-zinc-800 focus:outline-none uppercase tracking-widest"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  name="description" value={form.description} onChange={handleInputChange}
                  placeholder="DESCRIBE THE VIRALITY..."
                  className="w-full bg-zinc-950/30 border border-zinc-800/80 rounded-3xl p-5 text-sm font-medium focus:border-base-blue/50 transition-all h-32 resize-none placeholder:text-zinc-800 leading-relaxed text-white"
                />
                <div className="absolute bottom-4 right-4 text-[9px] font-black text-zinc-800 uppercase tracking-widest">Metadata</div>
              </div>
              
              <div className="bg-zinc-950/50 rounded-2xl p-5 border border-zinc-900/50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Initial LP Buy</span>
                  <p className="text-[9px] text-zinc-500 font-medium">Auto-seeds your own tokens</p>
                </div>
                <div className="flex items-center gap-3 bg-black rounded-xl px-4 py-2 border border-zinc-800/80">
                  <input 
                    type="number" name="initialBuy" value={form.initialBuy} onChange={handleInputChange}
                    className="bg-transparent text-right w-20 text-sm font-black italic focus:outline-none text-white"
                  />
                  <span className="text-[10px] font-black text-base-blue">ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Connected>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <h3 className="text-[11px] font-black italic uppercase tracking-widest text-zinc-600">Global Feed</h3>
          </div>
          <span className="text-[9px] font-bold text-zinc-700 uppercase">Clanker Protocol</span>
        </div>

        <div className="space-y-3 px-1">
          {[
            { id: "1", name: "BASE_CHAD", ticker: "CHAD", time: "5s", mcap: "$1.2M", hash: "0x789", growth: "+150%" },
            { id: "2", name: "COIN_GOAT", ticker: "GOAT", time: "12s", mcap: "$420K", hash: "0x123", growth: "+45%" },
            { id: "3", name: "CLANKER_BOT", ticker: "BOT", time: "45s", mcap: "$12K", hash: "0x456", growth: "+12%" },
          ].map((token, i) => (
            <div 
              key={token.id}
              className="bg-zinc-900/30 border border-zinc-900/50 rounded-3xl p-4 flex items-center justify-between group hover:border-base-blue/40 hover:bg-zinc-900/50 transition-all cursor-pointer shadow-sm"
              onClick={() => { (sdk.actions as any).haptics?.impact({ type: 'light' }); sdk.actions.viewCast({ hash: token.hash }); }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800/50 overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                  <img src={`https://picsum.photos/64/64?random=${i+200}`} className="w-full h-full object-cover" alt={token.name} />
                </div>
                <div>
                  <div className="text-sm font-black tracking-tight text-white">{token.name} <span className="text-base-blue font-mono text-[10px] ml-1 uppercase">${token.ticker}</span></div>
                  <div className="text-[10px] font-bold text-zinc-600 mt-0.5 uppercase tracking-tighter">deployed {token.time} ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-emerald-400">{token.mcap}</div>
                <div className="text-[9px] font-bold text-emerald-500/50 uppercase tracking-tighter">{token.growth}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-base-blue/5 border border-base-blue/10 rounded-[2rem] flex items-center gap-5">
           <ShieldCheck className="text-base-blue/40" size={36} strokeWidth={1.5} />
           <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
             BSTECH executes clanker-verified deployment logic. LP is automatically locked & burned. 
             BSTECH charges a <span className="text-white font-bold">1% fee</span> on creation. Powered by <span className="text-base-blue font-black tracking-tighter italic">OnchainKit</span>.
           </p>
        </div>

        <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl flex items-center gap-3">
           <Info size={14} className="text-zinc-600 shrink-0" />
           <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
             Compatible with Farcaster SDK & MiniKit frameworks.
           </p>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-9 w-full max-w-sm space-y-7 shadow-3xl">
             <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto rotate-12">
                <AlertTriangle size={40} />
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic uppercase leading-none text-white">FINAL CHECK</h3>
                <p className="text-zinc-500 text-sm font-medium px-4">Ready to deploy <span className="text-white font-bold">{form.name}</span> on Base? This action is permanent.</p>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => { (sdk.actions as any).haptics?.impact({ type: 'light' }); setShowConfirm(false); }} 
                  className="py-4 rounded-2xl bg-zinc-900 font-bold text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  ABORT
                </button>
                <button 
                  onClick={() => { setShowConfirm(false); onConfirm(); }} 
                  className="py-4 rounded-2xl bg-base-blue font-black text-sm italic shadow-2xl shadow-base-blue/20 active:scale-95 transition-all text-white"
                >
                  DEPLOY 🚀
                </button>
             </div>
          </div>
        </div>
      )}

      {isDeploying && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in zoom-in-95 duration-500">
           <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-base-blue/30 blur-3xl rounded-full animate-pulse" />
                <Rocket className="text-white animate-bounce relative z-10" size={80} strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-black italic uppercase tracking-tighter text-white">Broadcasting...</p>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Base Chain Network</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Launcher;
