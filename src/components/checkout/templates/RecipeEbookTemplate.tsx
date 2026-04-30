 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, CheckCircle2, ShieldCheck, BookOpen, Utensils, Heart, Clock } from "lucide-react";
 import { InlinePixPanel } from "../InlinePixPanel";
 
 export const RecipeEbookTemplate: React.FC<CheckoutTemplateProps> = ({
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
     bg: theme.background || "#fdfbf7",
     card: theme.card || "#FFFFFF",
     text: theme.text || "#4a3b31",
     muted: theme.muted || "#8d7b6f",
     button: theme.button || "#e67e22",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#27ae60",
     radius: theme.borderRadius || "20px"
   };
 
  return (
    <div className="min-h-screen font-sans py-6 md:py-12 px-4 overflow-x-hidden" style={{ backgroundColor: styles.bg, color: styles.text }}>
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* HEADER */}
        <header className="text-center mb-8 space-y-3 max-w-2xl">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="Logo" className="h-10 mx-auto mb-4 object-contain" />
          ) : (
            <div className="flex justify-center mb-4">
              <div className="p-2.5 rounded-full bg-orange-100 text-orange-600">
                <Utensils size={24} />
              </div>
            </div>
          )}
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest mb-1">
            {content.badge || "Ebook digital"}
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            {content.heroTitle || project.headline || "Receitas Práticas"}
          </h1>
          <p className="text-sm opacity-70 px-4">
            {content.heroSubtitle || project.subheadline || "Organize sua rotina com sabor."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
          {/* LEFT: CONTENT & PROMISE */}
          <div className="space-y-6">
            {/* MOCKUP EBOOK COMPACT */}
            <div className="relative group max-w-sm mx-auto lg:mx-0">
              <div className="absolute -inset-3 bg-orange-500/5 rounded-[30px] blur-xl"></div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                {theme.heroImageUrl ? (
                  <img src={theme.heroImageUrl} alt="Ebook" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
                    <div className="w-full h-full border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center text-orange-300">
                      <BookOpen size={48} strokeWidth={1} />
                      <p className="mt-2 font-black uppercase tracking-[0.2em] text-[10px]">Ebook Mockup</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BENEFITS COMPACT */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto lg:mx-0">
              {[
                { icon: <Heart size={16} />, title: "Ingredientes simples" },
                { icon: <Clock size={16} />, title: "Preparo rápido" }
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white border border-orange-50 shadow-sm flex items-center gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-[11px] leading-tight">{item.title}</h4>
                </div>
              ))}
            </div>

            {/* TRUST SECTION COMPACT */}
            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-start gap-3 max-w-sm mx-auto lg:mx-0">
              <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-green-700/80 font-medium leading-relaxed">
                Acesso enviado automaticamente para o seu e-mail após o Pix.
              </p>
            </div>
          </div>

          {/* RIGHT: CHECKOUT */}
          <div className="flex justify-center lg:sticky lg:top-8">
            <div className="w-full max-w-[420px] bg-white p-6 md:p-8 rounded-[28px] shadow-2xl shadow-orange-900/5 border border-orange-50">
              {/* PRICE TAG COMPACT */}
              <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-100 flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-[10px] uppercase tracking-wider opacity-40">Investimento</h3>
                  <p className="font-bold text-xs">Vitalício</p>
                </div>
                <div className="text-2xl font-black text-orange-600 tracking-tighter">
                  {formatPrice(offer.price_cents)}
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
                  <form onSubmit={onSubmit} className="space-y-4">
                    {requiredFields.collect_name && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-orange-800/60 ml-1">Seu nome completo</label>
                        <input 
                          type="text" required value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-none text-sm focus:border-orange-300"
                        />
                      </div>
                    )}
                    
                    {requiredFields.collect_email && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-orange-800/60 ml-1">E-mail para entrega</label>
                        <input 
                          type="email" required value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-none text-sm focus:border-orange-300"
                        />
                      </div>
                    )}
    
                    <div className="grid grid-cols-1 gap-4">
                      {requiredFields.collect_cpf && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-orange-800/60 ml-1">CPF</label>
                          <input 
                            type="text" required value={formData.cpf || ""}
                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-none text-sm focus:border-orange-300"
                          />
                        </div>
                      )}
                      {requiredFields.collect_phone && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-orange-800/60 ml-1">WhatsApp</label>
                          <input 
                            type="tel" required value={formData.phone || ""}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-none text-sm focus:border-orange-300"
                          />
                        </div>
                      )}
                    </div>
    
                    <button
                      type="submit" disabled={isLoading}
                      className="w-full h-16 rounded-xl font-black text-lg transition-all active:scale-[0.98] mt-6 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                      style={{ backgroundColor: styles.button, color: styles.buttonText }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Gerando acesso...</span>
                        </>
                      ) : (
                        <span>{content.ctaText || "Quero meu ebook agora"}</span>
                      )}
                    </button>
    
                    <div className="flex flex-col items-center gap-4 mt-8 opacity-40">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Compra Segura & Privada</span>
                      </div>
                      {project.legal_text && (
                        <p className="text-[9px] text-center italic max-w-xs">{project.legal_text}</p>
                      )}
                    </div>
                  </form>
                )}
             </div>
           </div>
         </div>
       </div>
 
       <footer className="mt-16 text-center opacity-20">
         <p className="text-[9px] font-bold uppercase tracking-widest">Processado via Pushin Pay</p>
       </footer>
     </div>
   );
 };