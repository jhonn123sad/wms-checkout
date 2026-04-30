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
    <div className="min-h-screen bg-black text-white font-mono selection:bg-green-500/30 overflow-x-hidden flex flex-col items-center">
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* GRID OVERLAY */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#22c55e08_1px,transparent_1px),linear-gradient(to_bottom,#22c55e08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <div className="relative z-10 w-full max-w-5xl px-4 py-8 md:py-16 flex flex-col items-center">
        <header className="w-full text-center mb-10 space-y-4">
          <div className="flex justify-center">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="WMS" className="h-8 object-contain" />
            ) : (
              <div className="text-2xl font-black tracking-tighter text-green-500 border-b-4 border-green-500 inline-block px-1">WMS</div>
            )}
          </div>
          
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-green-500/10 border border-green-500/30 text-green-500">
            <Terminal size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">{content.badge || "WMS.PROTOCOL"}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase font-sans text-white">
            {content.heroTitle || project.headline || "ATIVOS DIGITAIS IA"}
          </h1>
          
          <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed font-sans">
            {content.heroSubtitle || project.subheadline || "Domine avatares e vendas automatizadas."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
          {/* LEFT: TECH CONTENT COMPACT */}
          <div className="flex flex-col items-center lg:items-end space-y-6">
            {/* TECH GRID COMPACT */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[340px]">
              {[
                { icon: <Code size={16} />, title: "PROMPTS" },
                { icon: <Terminal size={16} />, title: "MÉTODOS" },
                { icon: <Bot size={16} />, title: "AVATARES" },
                { icon: <Users size={16} />, title: "VENDAS" },
              ].map((item, i) => (
                <div key={i} className="p-4 border border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex flex-col items-center gap-2 group hover:border-green-500/50 transition-all text-center">
                  <div className="text-green-500 group-hover:animate-pulse">{item.icon}</div>
                  <h4 className="font-black text-[10px] text-neutral-300 tracking-widest font-sans">{item.title}</h4>
                </div>
              ))}
            </div>

            {/* TERMINAL BLOCK COMPACT */}
            <div className="p-4 border border-neutral-800 bg-[#0B1510] font-mono text-[10px] rounded-sm w-full max-w-[340px] shadow-[0_0_20px_rgba(34,197,94,0.05)]">
              <div className="flex gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800"></div>
              </div>
              <div className="space-y-1 text-green-500/40 italic">
                <p>$ auth_verified: true</p>
                <p>$ mode: protocol_wms</p>
                <p className="text-green-500 animate-pulse">$ status: system_ready</p>
              </div>
            </div>
          </div>

          {/* RIGHT: CHECKOUT COMPACT */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-[420px] relative">
              <div className="absolute -inset-1 bg-green-500/10 blur opacity-20"></div>
              
              <div className="relative p-6 md:p-8 border border-neutral-800 bg-[#0E1A12] backdrop-blur-xl shadow-2xl">
                {/* PRICE COMPACT */}
                <div className="mb-6 border-b border-neutral-800/50 pb-6 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1 opacity-70">OFERTA ATIVA</p>
                    <h2 className="text-lg font-black italic uppercase tracking-tighter font-sans text-white line-clamp-1">{offer.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white italic tracking-tighter font-sans">
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