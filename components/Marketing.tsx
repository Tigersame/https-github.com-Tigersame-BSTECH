
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Download, Share2, Palette, Image as ImageIcon, 
  Loader2, CheckCircle2, Layout, Sparkles, Megaphone
} from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useComposeCast } from '@coinbase/onchainkit/minikit';

const Marketing: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  
  const { composeCast } = useComposeCast();

  const generateAsset = async (type: 'logo' | 'banner') => {
    const isLogo = type === 'logo';
    isLogo ? setIsGeneratingLogo(true) : setIsGeneratingBanner(true);
    (sdk.actions as any).haptics?.impact({ type: 'medium' });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = isLogo 
        ? "A professional high-tech ultra-minimalist 3D logo icon for 'BSTECH'. Metallic blue and silver finish, premium dark background, futuristic vector style, 8k resolution, photorealistic metallic textures."
        : "A cinematic 16:9 wide marketing banner for 'BSTECH' on the Base blockchain. A futuristic blue rocket launching from a dark digital cityscape at night, neon blue streaks of light, 'BSTECH' branding integrated into the rocket, photorealistic, ultra-high resolution, 8k.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: isLogo ? "1:1" : "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64Data}`;
          isLogo ? setLogoUrl(imageUrl) : setBannerUrl(imageUrl);
          break;
        }
      }
      (sdk.actions as any).haptics?.notification({ type: 'success' });
    } catch (error) {
      console.error(`Asset generation failed: ${type}`, error);
    } finally {
      isLogo ? setIsGeneratingLogo(false) : setIsGeneratingBanner(false);
    }
  };

  const handleShare = (type: 'logo' | 'banner') => {
    (sdk.actions as any).haptics?.impact({ type: 'medium' });
    
    const message = type === 'logo' 
      ? "🎨 Just created a sleek new AI logo for my Base project using BSTECH Identity Studio! Check out these futuristic vibes. 🔵"
      : "🚀 My new marketing banner is live! Generated in seconds with BSTECH's AI Identity Studio on Base. 🔵";
      
    composeCast({
      text: message,
      embeds: [window.location.origin]
    });
  };

  const handleDownload = (imageUrl: string, fileName: string) => {
    (sdk.actions as any).haptics?.impact({ type: 'light' });
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-base-blue text-[10px] font-black tracking-[0.25em] uppercase">
          <Palette size={12} className="text-purple-500" /> Identity Studio
        </div>
        <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-none">BRAND KIT</h1>
        <p className="text-zinc-500 text-xs font-medium">Generate professional assets for your casts.</p>
      </div>

      <div className="grid gap-8">
        {/* LOGO SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
              <Sparkles size={14} /> Brand Identity
            </h2>
            <button 
              onClick={() => generateAsset('logo')}
              disabled={isGeneratingLogo}
              className="px-4 py-2 bg-base-blue/10 border border-base-blue/20 rounded-xl text-[10px] font-black text-base-blue uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingLogo ? <Loader2 size={12} className="animate-spin" /> : 'Re-Generate'}
            </button>
          </div>

          <div className="relative group aspect-square rounded-[3rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden flex items-center justify-center shadow-2xl">
            {logoUrl ? (
              <>
                <img src={logoUrl} className="w-full h-full object-cover" alt="BSTECH Logo" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    onClick={() => handleDownload(logoUrl, 'bstech_logo.png')}
                    className="p-4 bg-white text-black rounded-2xl hover:scale-110 transition-transform shadow-xl"
                   >
                    <Download size={24} />
                   </button>
                   <button 
                    onClick={() => handleShare('logo')}
                    className="p-4 bg-base-blue text-white rounded-2xl hover:scale-110 transition-transform shadow-xl"
                   >
                    <Share2 size={24} />
                   </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-zinc-700">
                <ImageIcon size={48} strokeWidth={1} />
                <button 
                  onClick={() => generateAsset('logo')}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-bold text-zinc-400 transition-all"
                >
                  Create BSTECH Logo
                </button>
              </div>
            )}
            {isGeneratingLogo && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                  <Loader2 className="text-base-blue animate-spin" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Forging Metal...</span>
               </div>
            )}
          </div>
        </section>

        {/* BANNER SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
              <Layout size={14} /> Marketing Banner
            </h2>
            <button 
              onClick={() => generateAsset('banner')}
              disabled={isGeneratingBanner}
              className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] font-black text-purple-400 uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingBanner ? <Loader2 size={12} className="animate-spin" /> : 'Re-Generate'}
            </button>
          </div>

          <div className="relative group aspect-video rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden flex items-center justify-center shadow-2xl">
            {bannerUrl ? (
              <>
                <img src={bannerUrl} className="w-full h-full object-cover" alt="Marketing Banner" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    onClick={() => handleDownload(bannerUrl, 'bstech_banner.png')}
                    className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-all"
                   >
                    <Download size={20} />
                   </button>
                   <button 
                    onClick={() => handleShare('banner')}
                    className="p-3 bg-base-blue text-white rounded-xl hover:scale-110 transition-all"
                   >
                    <Share2 size={20} />
                   </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-zinc-700">
                <Megaphone size={48} strokeWidth={1} />
                <button 
                  onClick={() => generateAsset('banner')}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-bold text-zinc-400 transition-all"
                >
                  Create Cast Banner
                </button>
              </div>
            )}
            {isGeneratingBanner && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                  <Loader2 className="text-purple-500 animate-spin" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Rendering Skyline...</span>
               </div>
            )}
          </div>
        </section>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tighter leading-none italic">PRO QUALITY</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Ready for Production</p>
          </div>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          BSTECH uses <span className="text-white font-bold">Gemini 2.5 Flash Image</span> to generate high-fidelity PNG marketing assets directly in-app. These are optimized for Farcaster embeds and high-engagement social sharing.
        </p>
      </div>
    </div>
  );
};

export default Marketing;
