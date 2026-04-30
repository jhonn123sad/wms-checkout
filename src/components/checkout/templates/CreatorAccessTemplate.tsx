 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, Zap, Lock, ArrowRight, User } from "lucide-react";
 import { InlinePixPanel } from "../InlinePixPanel";
 
 export const CreatorAccessTemplate: React.FC<CheckoutTemplateProps> = ({
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
     bg: theme.background || "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
     card: theme.card || "rgba(255, 255, 255, 0.03)",
     text: theme.text || "#FFFFFF",
     muted: theme.muted || "#94a3b8",
     button: theme.button || "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#ec4899",
     radius: theme.borderRadius || "24px"
   };
 
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden" style={{ background: styles.bg, color: styles.text }}>
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-16 flex flex-col items-center">
        
        <div className="w-full text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <Lock size={12} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">
              {content.badge || "Acesso reservado"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {content.heroTitle || project.headline || "Acesso Premium"}
          </h1>
          <p className="text-sm opacity-60 max-w-md mx-auto">
            {content.heroSubtitle || project.subheadline || "Finalize agora e receba acesso imediato."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
          {/* LEFT COLUMN: VISUAL HERO */}
          <div className="flex flex-col items-center lg:items-end space-y-6">
            {/* HERO IMAGE / PLACEHOLDER COMPACT */}
            <div className="w-full max-w-[340px] relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-[28px] blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative aspect-square rounded-[28px] overflow-hidden bg-black/40 border border-white/10 backdrop-blur-3xl flex items-center justify-center">
                {theme.heroImageUrl ? (
                  <img src={theme.heroImageUrl} alt="Acesso" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User size={32} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase">Premium Member</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white">A</div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider opacity-40">Status</p>
                      <p className="text-[11px] font-bold text-white">Conexão Segura</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK BENEFITS PILLS */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[340px]">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center text-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-pink-500 mb-1">Privacidade</p>
                <p className="text-[10px] font-medium opacity-60 leading-snug text-white">Discreto e seguro</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center text-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-purple-500 mb-1">Instantâneo</p>
                <p className="text-[10px] font-medium opacity-60 leading-snug text-white">Acesso imediato</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CHECKOUT CARD */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-[420px] p-6 md:p-8 rounded-[28px] border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl shadow-purple-500/10"
                 style={{ background: styles.card }}>
              
              {/* PRODUCT INFO COMPACT */}
              <div className="mb-6 flex justify-between items-center border-b border-white/5 pb-5">
                <div className="space-y-0.5">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Oferta:</h3>
                  <h2 className="text-lg font-bold text-white line-clamp-1">{offer.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white tracking-tighter">
                    {formatPrice(offer.price_cents)}
                  </p>
                </div>
              </div>

              {paymentData ? (
                <InlinePixPanel 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus || "waiting_payment"}
                  onReset={onResetPayment || (() => {})}
                  formatPrice={formatPrice}
                  theme={theme}
                />
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  {requiredFields.collect_name && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Nome completo</label>
                      <input 
                        type="text" required value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Para seu cadastro"
                        className="w-full h-14 px-5 rounded-2xl border border-white/10 bg-white/5 outline-none text-sm transition-all focus:border-pink-500/50 focus:bg-white/10"
                      />
                    </div>
                  )}
                  
                  {requiredFields.collect_email && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">E-mail</label>
                      <input 
                        type="email" required value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Onde receberá o acesso"
                        className="w-full h-14 px-5 rounded-2xl border border-white/10 bg-white/5 outline-none text-sm transition-all focus:border-pink-500/50 focus:bg-white/10"
                      />
                    </div>
                  )}
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredFields.collect_cpf && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">CPF</label>
                        <input 
                          type="text" required value={formData.cpf || ""}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          className="w-full h-14 px-5 rounded-2xl border border-white/10 bg-white/5 outline-none text-sm transition-all focus:border-pink-500/50 focus:bg-white/10"
                        />
                      </div>
                    )}
                    {requiredFields.collect_phone && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">WhatsApp</label>
                        <input 
                          type="tel" required value={formData.phone || ""}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-14 px-5 rounded-2xl border border-white/10 bg-white/5 outline-none text-sm transition-all focus:border-pink-500/50 focus:bg-white/10"
                        />
                      </div>
                    )}
                  </div>
    
                  {/* CTA BUTTON */}
                  <button
                    type="submit" disabled={isLoading}
                    className="w-full h-16 rounded-2xl font-black text-lg transition-all active:scale-[0.98] mt-6 disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 shadow-xl shadow-pink-500/20 hover:brightness-110"
                    style={{ background: styles.button, color: styles.buttonText }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Gerando Pix...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{content.ctaText || "Gerar Pix de acesso"}</span>
                        <ArrowRight size={22} />
                      </div>
                    )}
                  </button>
    
                  {isLoading && (
                    <p className="text-[10px] text-center font-bold animate-pulse text-pink-500 tracking-widest uppercase mt-4">
                      Preparando seu pagamento com segurança...
                    </p>
                  )}
    
                  <div className="flex flex-col items-center gap-3 mt-8">
                    <div className="flex items-center gap-2 opacity-30">
                      <ShieldCheck size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Pagamento 100% Criptografado</span>
                    </div>
                    {project.legal_text && (
                      <p className="text-[9px] text-center opacity-20 italic max-w-[200px] leading-relaxed">
                        {project.legal_text}
                      </p>
                    )}
                  </div>
                </form>
              )}
           </div>
         </div>
       </div>
 
      </div>

      {/* FOOTER NOTICE */}
      <footer className="py-8 px-4 border-t border-white/5 flex flex-col items-center">
        <div className="flex items-center gap-1.5 opacity-20 hover:opacity-40 transition-opacity">
          <ShieldCheck size={10} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Processado via Pushin Pay</span>
        </div>
      </footer>
    </div>
  );
};