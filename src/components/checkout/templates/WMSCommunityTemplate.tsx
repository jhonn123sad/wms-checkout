 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, Zap, ArrowRight, Bot, Code, Terminal, Users, Globe } from "lucide-react";
 import { InlinePixPanel } from "../InlinePixPanel";
 
 export const WMSCommunityTemplate: React.FC<CheckoutTemplateProps> = ({
   project,
   offer,
   theme,
   content,
   formData,
   setFormData,
   requiredFields,
   isLoading,
     onSubmit,
     formatPrice,
     paymentData,
     paymentStatus,
     onResetPayment
 }) => {
   const styles = {
     bg: theme.background || "#000000",
     card: theme.card || "#0a0a0a",
     text: theme.text || "#FFFFFF",
     muted: theme.muted || "#525252",
     button: theme.button || "#22c55e",
     buttonText: theme.buttonText || "#000000",
     accent: theme.accent || "#22c55e",
     radius: theme.borderRadius || "12px"
   };
 
   return (
     <div className="min-h-screen bg-black text-white font-mono selection:bg-green-500/30">
       {/* GRID OVERLAY */}
       <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       
       <div className="relative z-10">
         <main className="max-w-6xl mx-auto px-4 py-12 md:py-24">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
             
             {/* LEFT: TECH CONTENT */}
             <div className="lg:col-span-7 space-y-12">
               <div className="space-y-6">
                 {theme.logoUrl ? (
                   <img src={theme.logoUrl} alt="WMS" className="h-10 object-contain mb-8" />
                 ) : (
                   <div className="text-3xl font-black tracking-tighter text-green-500 mb-8 underline decoration-4 underline-offset-8 font-sans">WMS</div>
                 )}
                 
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-green-500/10 border border-green-500/20 text-green-500">
                   <Terminal size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{content.badge || "Comunidade WMS"}</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none italic uppercase font-sans">
                   {content.heroTitle || project.headline || "Crie ativos digitais com IA"}
                 </h1>
                 
                 <p className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed font-sans">
                   {content.heroSubtitle || project.subheadline || "Prompts, métodos, extensões e conteúdos para criar avatares, influenciadoras virtuais e transformar atenção em vendas."}
                 </p>
               </div>
 
               {/* TECH GRID / MODULES */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { icon: <Code size={20} />, title: "Prompts prontos", desc: "Copie e cole os melhores prompts de IA." },
                   { icon: <Terminal size={20} />, title: "Métodos de criação", desc: "Aprenda a criar avatares realistas." },
                   { icon: <Bot size={20} />, title: "IA Influencers", desc: "Domine o mercado que mais cresce." },
                   { icon: <Users size={20} />, title: "Comunidade", desc: "Focada em resultados e vendas." },
                 ].map((item, i) => (
                   <div key={i} className="p-6 border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm group hover:border-green-500/50 transition-colors">
                     <div className="text-green-500 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                     <h4 className="font-bold text-white mb-2 uppercase tracking-tight font-sans">{item.title}</h4>
                     <p className="text-xs text-neutral-500 font-sans leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
               </div>
 
               {/* TERMINAL BLOCK VISUAL */}
               <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-[10px] sm:text-xs">
                 <div className="flex gap-1.5 mb-4">
                   <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                 </div>
                 <div className="space-y-1 opacity-50">
                   <p className="text-green-500 tracking-tighter">$ wms-community --init-setup</p>
                   <p className="text-neutral-500">Checking AI influence modules...</p>
                   <p className="text-neutral-500">Loading prompt libraries [DONE]</p>
                   <p className="text-neutral-500">Connecting to sales gateway...</p>
                   <p className="text-green-500 tracking-tighter">$ Access authorized. Welcome back.</p>
                 </div>
               </div>
             </div>
 
             {/* RIGHT: CHECKOUT */}
             <div className="lg:col-span-5 relative">
               {/* GLOW EFFECT */}
               <div className="absolute -inset-0.5 bg-green-500/20 blur opacity-20"></div>
               
               <div className="relative p-8 md:p-12 border border-neutral-800 bg-black shadow-2xl">
                 {/* PRICE */}
                 <div className="mb-12 border-b border-neutral-800 pb-8 flex justify-between items-center">
                   <div>
                     <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Acesso à Comunidade</p>
                     <h2 className="text-2xl font-black italic uppercase tracking-tighter font-sans">{offer.name}</h2>
                   </div>
                   <div className="text-right">
                     <p className="text-4xl font-black text-white italic tracking-tighter font-sans">
                       {formatPrice(offer.price_cents)}
                     </p>
                   </div>
                 </div>
 
                  {paymentData ? (
                    <div className="relative z-10 py-4">
                      <InlinePixPanel 
                        paymentData={paymentData}
                        paymentStatus={paymentStatus || "waiting_payment"}
                        onReset={onResetPayment || (() => {})}
                        formatPrice={formatPrice}
                        theme={theme}
                      />
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="space-y-6 font-sans">
                      {requiredFields.collect_name && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Usuário / Nome</label>
                          <input 
                            type="text" required value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-14 px-5 border border-neutral-800 bg-neutral-900 outline-none text-sm focus:border-green-500 transition-all text-white font-mono"
                          />
                        </div>
                      )}
                      
                      {requiredFields.collect_email && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">E-mail</label>
                          <input 
                            type="email" required value={formData.email || ""}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-14 px-5 border border-neutral-800 bg-neutral-900 outline-none text-sm focus:border-green-500 transition-all text-white font-mono"
                          />
                        </div>
                      )}
    
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {requiredFields.collect_cpf && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">CPF</label>
                            <input 
                              type="text" required value={formData.cpf || ""}
                              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                              className="w-full h-14 px-5 border border-neutral-800 bg-neutral-900 outline-none text-sm focus:border-green-500 transition-all text-white font-mono"
                            />
                          </div>
                        )}
                        {requiredFields.collect_phone && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">WhatsApp</label>
                            <input 
                              type="tel" required value={formData.phone || ""}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full h-14 px-5 border border-neutral-800 bg-neutral-900 outline-none text-sm focus:border-green-500 transition-all text-white font-mono"
                            />
                          </div>
                        )}
                      </div>
    
                      <button
                        type="submit" disabled={isLoading}
                        className="w-full h-18 py-5 font-black text-xl italic uppercase tracking-tighter transition-all active:scale-[0.98] mt-8 flex items-center justify-center gap-2 hover:brightness-110 group font-sans"
                        style={{ backgroundColor: styles.button, color: styles.buttonText }}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{content.ctaText || "Entrar na WMS"}</span>
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </button>
    
                      <div className="flex flex-col items-center gap-4 mt-10 font-mono">
                        <div className="flex items-center gap-2 opacity-20 hover:opacity-40 transition-opacity">
                          <ShieldCheck size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Secure Connection Active</span>
                        </div>
                        {project.legal_text && (
                          <p className="text-[8px] text-center opacity-10 uppercase tracking-tighter leading-relaxed max-w-xs">{project.legal_text}</p>
                        )}
                      </div>
                    </form>
                  )}
               </div>
             </div>
           </div>
         </main>
 
         <footer className="py-12 border-t border-neutral-900 text-center opacity-10 grayscale font-mono">
           <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-white">Processado via Pushin Pay</p>
         </footer>
       </div>
     </div>
   );
 };