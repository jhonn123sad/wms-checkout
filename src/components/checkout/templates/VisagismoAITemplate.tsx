 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, Sparkles, Zap, ArrowRight, Camera, Scissors, Palette, UserCheck } from "lucide-react";
 import { InlinePixPanel } from "../InlinePixPanel";
 import { CheckoutVisualAsset } from "../visuals/CheckoutVisualAsset";
 
 export const VisagismoAITemplate: React.FC<CheckoutTemplateProps> = ({
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
     bg: theme.background || "#f8fafc",
     card: theme.card || "#FFFFFF",
     text: theme.text || "#1e293b",
     muted: theme.muted || "#64748b",
     button: theme.button || "#6366f1",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#818cf8",
     radius: theme.borderRadius || "24px"
   };
 
  return (
    <div className="min-h-screen font-sans bg-[#fdfdff] flex flex-col overflow-x-hidden" style={{ color: styles.text }}>
      <header className="py-4 px-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="Logo" className="h-6 object-contain" />
          ) : (
            <div className="flex items-center gap-2 font-black text-indigo-600 text-sm italic">
              <Sparkles size={16} />
              <span>VISAGISMO IA</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full">
            <ShieldCheck size={10} />
            <span>Ambiente Seguro</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col items-center">
        <div className="w-full text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles size={12} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">{content.badge || "IA Visagismo"}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-slate-900">
            {content.heroTitle || project.headline || "Sua melhor versão"}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {content.heroSubtitle || project.subheadline || "Análise facial avançada com Inteligência Artificial."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
          {/* LEFT: CONTENT & TECH VISUAL COMPACT */}
          <div className="flex flex-col items-center lg:items-end space-y-6">
             {/* ÁREA VISUAL EDITÁVEL — pode substituir este asset/imagem sem alterar o Pix */}
             <div className="relative group w-full max-w-[340px]">
               <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-2xl opacity-40"></div>
               <div className="relative aspect-square rounded-3xl border border-white shadow-2xl overflow-hidden bg-slate-50 transition-transform duration-500 group-hover:scale-[1.02]">
                  <CheckoutVisualAsset 
                    slug={project.slug} 
                    theme={theme} 
                    content={content} 
                    className="w-full h-full" 
                  />
                 <div className="absolute top-4 left-4">
                   <div className="bg-indigo-600/10 backdrop-blur-md border border-indigo-600/20 px-2 py-1 rounded-lg">
                     <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Digital Scanner V2.0</p>
                   </div>
                 </div>
               </div>
             </div>

            {/* QUICK FEATURES GRID */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[340px]">
              {[
                { icon: <Sparkles size={14} />, label: "Estrutura" },
                { icon: <Scissors size={14} />, label: "Estilo" },
                { icon: <Palette size={14} />, label: "Harmonia" },
                { icon: <UserCheck size={14} />, label: "Dossiê" },
              ].map((card, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center gap-1.5 group hover:border-indigo-200 transition-colors">
                  <div className="text-indigo-500">{card.icon}</div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{card.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PREMIUM CHECKOUT CARD COMPACT */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-[420px] p-6 md:p-8 rounded-[32px] border border-gray-100 bg-white shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl"></div>
              
              {/* OFFER HEADER COMPACT */}
              <div className="relative mb-6 flex justify-between items-center border-b border-slate-50 pb-5">
                <div className="space-y-0.5 pr-4">
                  <h3 className="text-[8px] font-black uppercase tracking-widest text-indigo-400 opacity-70">Oferta:</h3>
                  <h2 className="text-lg font-black text-slate-800 line-clamp-1">{offer.name}</h2>
                </div>
                <div className="text-2xl font-black text-indigo-600 tracking-tighter shrink-0">
                  {formatPrice(offer.price_cents)}
                </div>
              </div>

               {/* NÃO ALTERAR onSubmit, formData, setFormData, isLoading ou lógica de pagamento */}
               {paymentData ? (
                   <div className="relative z-10">
                     <InlinePixPanel 
                       paymentData={paymentData}
                       paymentStatus={paymentStatus || "waiting_payment"}
                       onReset={onResetPayment || (() => {})}
                       formatPrice={formatPrice}
                       theme={theme}
                     />
                   </div>
                 ) : (
                   <form onSubmit={onSubmit} className="relative space-y-5">
                    {requiredFields.collect_name && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">Nome Completo</label>
                        <input 
                          type="text" required value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none text-sm focus:border-indigo-300 focus:bg-white transition-all"
                        />
                      </div>
                    )}
                    
                    {requiredFields.collect_email && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">E-mail</label>
                        <input 
                          type="email" required value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none text-sm focus:border-indigo-300 focus:bg-white transition-all"
                        />
                      </div>
                    )}
    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {requiredFields.collect_cpf && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 ml-1">CPF</label>
                          <input 
                            type="text" required value={formData.cpf || ""}
                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                            className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none text-sm focus:border-indigo-300 focus:bg-white transition-all"
                          />
                        </div>
                      )}
                      {requiredFields.collect_phone && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 ml-1">WhatsApp</label>
                          <input 
                            type="tel" required value={formData.phone || ""}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none text-sm focus:border-indigo-300 focus:bg-white transition-all"
                          />
                        </div>
                      )}
                    </div>
    
                    <button
                      type="submit" disabled={isLoading}
                      className="w-full h-16 rounded-2xl font-black text-lg transition-all active:scale-[0.98] mt-8 flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"
                      style={{ backgroundColor: styles.button, color: styles.buttonText }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{content.ctaText || "Gerar Pix da análise"}</span>
                          <ArrowRight size={22} />
                        </div>
                      )}
                    </button>
    
                    <div className="flex flex-col items-center gap-4 mt-10">
                      <div className="flex items-center gap-2 opacity-30">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Pagamento 100% Seguro</span>
                      </div>
                      {project.legal_text && (
                        <p className="text-[9px] text-center italic opacity-40 max-w-xs">{project.legal_text}</p>
                      )}
                    </div>
                  </form>
                )}
             </div>
           </div>
         </div>
       </main>
 
       <footer className="py-12 border-t border-slate-50 text-center opacity-20">
         <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Processado via Pushin Pay</p>
       </footer>
     </div>
   );
 };