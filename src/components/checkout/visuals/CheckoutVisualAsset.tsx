import React from "react";
import { User, BookOpen, Camera, Terminal, Shield, Sparkles, Heart, Utensils, Star, Lock } from "lucide-react";

interface CheckoutVisualAssetProps {
  type: "creator" | "recipe" | "visagismo" | "wms";
  className?: string;
}

export const CheckoutVisualAsset: React.FC<CheckoutVisualAssetProps> = ({ type, className = "" }) => {
  switch (type) {
    case "creator":
      return (
        <div className={`relative w-full h-full overflow-hidden bg-black flex items-center justify-center ${className}`}>
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/40 opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ec4899 0%, transparent 70%)' }}></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6 p-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5 relative">
                <Lock size={40} className="text-pink-500" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center border-4 border-black">
                  <Star size={18} className="text-white" fill="currentColor" />
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30">
                <span className="text-[11px] font-black tracking-[0.3em] text-pink-500 uppercase">Acesso Reservado</span>
              </div>
              <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Premium Content</p>
            </div>
            
            <div className="flex gap-2 opacity-30">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
              ))}
            </div>
          </div>
          
          {/* Overlay glass glare */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent skew-y-12 transform -translate-y-1/2"></div>
        </div>
      );

    case "recipe":
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#fdfbf7] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-100/50"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-10">
            {/* Book Mockup */}
            <div className="relative w-48 h-64 shadow-2xl rounded-r-lg bg-white border-y border-r border-orange-100 flex flex-col">
              <div className="absolute left-0 top-0 w-4 h-full bg-orange-600 rounded-l-sm shadow-inner"></div>
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <Utensils size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-orange-900 leading-tight">Receitas Práticas</h3>
                  <div className="w-8 h-0.5 bg-orange-200 mx-auto"></div>
                  <p className="text-[8px] uppercase tracking-widest text-orange-400 font-bold">Dia a dia com sabor</p>
                </div>
              </div>
              <div className="h-10 border-t border-orange-50 bg-orange-50/30 flex items-center justify-center px-4">
                <Heart size={12} className="text-orange-300" fill="currentColor" />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-1/4 right-10 w-8 h-8 rounded-full bg-orange-200/20 blur-sm"></div>
            <div className="absolute bottom-1/4 left-10 w-12 h-12 rounded-full bg-orange-200/10 blur-md"></div>
          </div>
        </div>
      );

    case "visagismo":
      return (
        <div className={`relative w-full h-full overflow-hidden bg-slate-50 flex items-center justify-center ${className}`}>
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', 
            backgroundSize: '24px 24px' 
          }}></div>
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
            <div className="relative w-full max-w-[200px] aspect-[4/5] border border-indigo-100 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-inner">
              {/* Face Scanning Svg */}
              <svg viewBox="0 0 100 120" className="w-full h-full p-8 text-indigo-200 overflow-visible">
                {/* Abstract Face Shape */}
                <path d="M50 20 C30 20 15 40 15 70 C15 100 30 115 50 115 C70 115 85 100 85 70 C85 40 70 20 50 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                {/* Symmetry Lines */}
                <line x1="50" y1="20" x2="50" y2="115" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
                <line x1="15" y1="70" x2="85" y2="70" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
                {/* Scan dots */}
                <circle cx="35" cy="55" r="1" fill="#6366f1" className="animate-pulse" />
                <circle cx="65" cy="55" r="1" fill="#6366f1" className="animate-pulse" />
                <circle cx="50" cy="85" r="1" fill="#6366f1" className="animate-pulse" />
                <circle cx="50" cy="45" r="1" fill="#6366f1" className="animate-pulse" />
                
                {/* Scan Line */}
                <rect x="0" y="0" width="100" height="0.5" fill="#6366f1">
                  <animate attributeName="y" from="20" to="115" dur="3s" repeatCount="indefinite" />
                </rect>
              </svg>
              
              {/* HUD Elements */}
              <div className="absolute -right-4 top-1/4 p-2 rounded-lg bg-white shadow-lg border border-indigo-50 flex flex-col gap-1">
                <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
                <div className="w-5 h-1 bg-indigo-200 rounded-full"></div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-400"></div>)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">AI ANALYSIS ACTIVE</span>
            </div>
          </div>
        </div>
      );

    case "wms":
      return (
        <div className={`relative w-full h-full overflow-hidden bg-black flex items-center justify-center ${className}`}>
          {/* Cyber Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px),linear-gradient(to_bottom,#22c55e10_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 gap-6">
            <div className="relative">
              <div className="absolute -inset-10 bg-green-500/10 blur-3xl rounded-full"></div>
              <div className="w-20 h-20 border-2 border-green-500/50 flex items-center justify-center relative rotate-45">
                <div className="-rotate-45">
                  <Terminal size={32} className="text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="text-2xl font-black tracking-widest text-white italic border-b-2 border-green-500 inline-block px-2">WMS</div>
              <div className="flex flex-col gap-1 items-center">
                <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20">
                  <span className="text-[9px] font-mono font-bold text-green-500 uppercase tracking-widest">Digital Assets Hub</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <div className="w-1 h-3 bg-green-500/40"></div>
                  <div className="w-1 h-3 bg-green-500/20"></div>
                  <div className="w-1 h-3 bg-green-500/60 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Floating code-like elements */}
            <div className="absolute top-10 left-10 font-mono text-[8px] text-green-500/30">
              &gt; PROMPT_SYS_INIT
            </div>
            <div className="absolute bottom-10 right-10 font-mono text-[8px] text-green-500/30 text-right">
              &gt; STATUS_READY
            </div>
          </div>
          
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>
      );

    default:
      return (
        <div className={`w-full h-full bg-slate-100 flex items-center justify-center ${className}`}>
          <User size={32} className="text-slate-300" />
        </div>
      );
  }
};
