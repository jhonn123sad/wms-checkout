 import React, { useState } from "react";
 import { User, Lock, Star, Utensils, Heart, Sparkles, Terminal } from "lucide-react";
 
 interface CheckoutVisualAssetProps {
   slug: string;
   theme: any;
   content: any;
   className?: string;
 }
 
 interface CheckoutVisualAssetProps {
   slug: string;
   theme: CheckoutTheme;
   content: CheckoutContent;
   className?: string;
 }
 
 export const CheckoutVisualAsset: React.FC<CheckoutVisualAssetProps> = ({ 
   slug, 
   theme, 
   content, 
   className = "" 
 }) => {
   const [imgError, setImgError] = useState(false);
   
   // Check for debug mode in URL
   const isDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('assetDebug');
   
   // 1. Logic for picking the image/asset
   const heroUrl = theme.heroImageUrl || theme.coverImageUrl;
   const visualAssetKey = theme.visualAsset || "";
   
   let source = "fallback";
   let usedAsset = "default";
 
   // Determine which internal asset to use based on slug or visualAsset property
   const getInternalAssetType = () => {
     if (slug === "acesso-reservado" || visualAssetKey === "creator-access") return "creator";
     if (slug === "receitas-praticas" || visualAssetKey === "recipe-ebook") return "recipe";
     if (slug === "visagismo-ia" || visualAssetKey === "visagismo-ai") return "visagismo";
     if (slug === "comunidade-wms" || visualAssetKey === "wms-ai-community") return "wms";
     return "default";
   };
 
   const assetType = getInternalAssetType();
 
   // Render logic
   const renderContent = () => {
     // Try to render external image if available and not errored
     if (heroUrl && !imgError) {
       source = theme.heroImageUrl ? "heroImageUrl" : "coverImageUrl";
       return (
         <img 
           src={heroUrl} 
           alt={content.heroTitle || "Product Image"} 
           className="w-full h-full object-cover"
           onError={() => setImgError(true)}
         />
       );
     }
 
     // Internal Assets
     source = "builtin";
     usedAsset = assetType;
 
     switch (assetType) {
       case "creator":
         return (
           <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/40 opacity-60"></div>
             <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
               <div className="relative">
                 <div className="absolute -inset-4 bg-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-xl bg-white/5">
                   <Lock size={32} className="text-pink-500" />
                   <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center border-2 border-black">
                     <Star size={14} className="text-white" fill="currentColor" />
                   </div>
                 </div>
               </div>
               <div className="space-y-1">
                 <div className="inline-block px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
                   <span className="text-[9px] font-black tracking-[0.2em] text-pink-500 uppercase">PRIVATE ACCESS</span>
                 </div>
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Premium Collection</p>
               </div>
             </div>
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.3),transparent_70%)]"></div>
           </div>
         );
 
       case "recipe":
         return (
           <div className="relative w-full h-full bg-[#fdfbf7] flex items-center justify-center p-6 md:p-10">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-100/50"></div>
             <div className="relative w-36 h-48 md:w-44 md:h-60 shadow-2xl rounded-r-lg bg-white border-y border-r border-orange-100 flex flex-col">
               <div className="absolute left-0 top-0 w-3 h-full bg-orange-600 rounded-l-sm"></div>
               <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                   <Utensils size={20} />
                 </div>
                 <div className="space-y-1">
                   <h3 className="font-serif text-lg font-bold text-orange-900 leading-tight">Receitas Práticas</h3>
                   <div className="w-6 h-0.5 bg-orange-200 mx-auto"></div>
                   <p className="text-[7px] uppercase tracking-widest text-orange-400 font-bold">Dia a dia com sabor</p>
                 </div>
               </div>
               <div className="h-8 border-t border-orange-50 bg-orange-50/30 flex items-center justify-center">
                 <Heart size={10} className="text-orange-300" fill="currentColor" />
               </div>
             </div>
           </div>
         );
 
       case "visagismo":
         return (
           <div className="relative w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ 
               backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', 
               backgroundSize: '20px 20px' 
             }}></div>
             <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 gap-4">
               <div className="relative w-32 md:w-40 aspect-[4/5] border border-indigo-100 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-inner">
                 <svg viewBox="0 0 100 120" className="w-full h-full p-6 text-indigo-200 overflow-visible">
                   <path d="M50 20 C30 20 15 40 15 70 C15 100 30 115 50 115 C70 115 85 100 85 70 C85 40 70 20 50 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                   <line x1="50" y1="20" x2="50" y2="115" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
                   <line x1="15" y1="70" x2="85" y2="70" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
                   <circle cx="35" cy="55" r="1" fill="#6366f1" className="animate-pulse" />
                   <circle cx="65" cy="55" r="1" fill="#6366f1" className="animate-pulse" />
                   <circle cx="50" cy="85" r="1" fill="#6366f1" className="animate-pulse" />
                   <rect x="0" y="0" width="100" height="0.5" fill="#6366f1">
                     <animate attributeName="y" from="20" to="115" dur="3s" repeatCount="indefinite" />
                   </rect>
                 </svg>
                 <div className="absolute -right-2 top-1/4 p-1.5 rounded-lg bg-white shadow-md border border-indigo-50 flex flex-col gap-1">
                   <div className="w-6 h-1 bg-indigo-500 rounded-full"></div>
                   <div className="w-4 h-1 bg-indigo-200 rounded-full"></div>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="px-2 py-0.5 rounded bg-indigo-50 text-[7px] font-black text-indigo-400 border border-indigo-100">HARMONIA</div>
                 <div className="px-2 py-0.5 rounded bg-indigo-50 text-[7px] font-black text-indigo-400 border border-indigo-100">PROPORÇÃO</div>
               </div>
             </div>
           </div>
         );
 
       case "wms":
         return (
           <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e08_1px,transparent_1px),linear-gradient(to_bottom,#22c55e08_1px,transparent_1px)] bg-[size:16px_16px]"></div>
             <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 gap-4">
               <div className="text-xl font-black tracking-tighter text-green-500 border-b-2 border-green-500 px-1 italic">WMS</div>
               <div className="grid grid-cols-2 gap-2 w-full max-w-[160px]">
                 <div className="p-1.5 border border-neutral-800 bg-neutral-900/50 flex flex-col items-center">
                   <div className="text-[7px] font-black text-green-500/50 mb-1">PROMPTS</div>
                   <div className="w-full h-0.5 bg-green-500/20"></div>
                 </div>
                 <div className="p-1.5 border border-neutral-800 bg-neutral-900/50 flex flex-col items-center">
                   <div className="text-[7px] font-black text-green-500/50 mb-1">AVATARES</div>
                   <div className="w-full h-0.5 bg-green-500/20"></div>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Terminal size={12} className="text-green-500 animate-pulse" />
                 <span className="text-[8px] font-mono text-green-500/40 uppercase tracking-widest">System_Online</span>
               </div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none"></div>
           </div>
         );
 
       default:
         return (
           <div className="w-full h-full bg-slate-100 flex items-center justify-center">
             <User size={32} className="text-slate-200" />
           </div>
         );
     }
   };
 
   return (
     <div className={`relative rounded-[inherit] overflow-hidden ${className}`}>
       {renderContent()}
       
       {isDebug && (
         <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-white/70 border border-white/10 z-20 pointer-events-none">
           src: {source} | asset: {usedAsset}
         </div>
       )}
     </div>
   );
 };