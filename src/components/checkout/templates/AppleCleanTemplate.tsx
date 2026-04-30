 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, CheckCircle2, Shield, Zap, Lock, ArrowRight } from "lucide-react";
 
 export const AppleCleanTemplate: React.FC<CheckoutTemplateProps> = ({
   project,
   offer,
   theme,
   content,
   formData,
   setFormData,
   requiredFields,
   isLoading,
   onSubmit,
   formatPrice
 }) => {
   const styles = {
     bg: theme.background || "#F5F5F7",
     card: theme.card || "#FFFFFF",
     text: theme.text || "#1D1D1F",
     muted: theme.muted || "#86868B",
     button: theme.button || "#000000",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#0071E3",
     radius: theme.borderRadius || "24px"
   };
 
   return (
     <div className="min-h-screen flex flex-col items-center py-8 px-4 md:py-12" style={{ backgroundColor: styles.bg, color: styles.text }}>
       {/* Header / Logo Section */}
       <div className="w-full max-w-[440px] mb-8 flex flex-col items-center">
         {theme.logoUrl && (
           <img src={theme.logoUrl} alt={project.name} className="h-12 mb-8 object-contain" />
         )}
 
         {(content.badge || theme.showUrgency !== false) && (
           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 bg-white border border-black/5">
             {content.urgencyText ? (
               <Zap size={12} className="text-orange-500 fill-orange-500" />
             ) : (
               <ShieldCheck size={12} style={{ color: styles.accent }} />
             )}
             <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: styles.muted }}>
               {content.badge || content.urgencyText || "Pagamento Seguro"}
             </span>
           </div>
         )}
 
         <h1 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-3 px-4">
           {content.heroTitle || project.headline || "Finalize seu acesso"}
         </h1>
         <p className="text-sm text-center px-6 leading-relaxed mb-4 opacity-70">
           {content.heroSubtitle || project.subheadline || "Pague com Pix e receba a liberação imediata."}
         </p>
       </div>
 
       {/* Checkout Card */}
       <div className="w-full max-w-[480px] p-8 md:p-10 shadow-2xl shadow-black/5 border relative overflow-hidden"
            style={{ backgroundColor: styles.card, borderRadius: styles.radius, borderColor: "rgba(0,0,0,0.05)" }}>
         
         {/* Product Info */}
         <div className="w-full rounded-2xl p-5 mb-8 flex justify-between items-center bg-[#F5F5F7]">
           <div className="flex-1 pr-4">
             <h2 className="font-bold text-base">{offer.name}</h2>
             <p className="text-xs mt-0.5 line-clamp-2 opacity-60">{offer.description}</p>
           </div>
           <div className="text-xl font-black shrink-0">{formatPrice(offer.price_cents)}</div>
         </div>
 
         {/* Form */}
         <form onSubmit={onSubmit} className="space-y-4">
           {content.preFormText && <p className="text-sm font-medium mb-2">{content.preFormText}</p>}
           
           {requiredFields.collect_name && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-60">Nome completo</label>
               <input 
                 type="text" required value={formData.name || ""}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-white outline-none text-sm"
                 style={{ borderColor: "#D2D2D7" }}
               />
             </div>
           )}
           {requiredFields.collect_cpf && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-60">CPF</label>
               <input 
                 type="text" required value={formData.cpf || ""}
                 onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-white outline-none text-sm"
                 style={{ borderColor: "#D2D2D7" }}
               />
             </div>
           )}
           {requiredFields.collect_email && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-60">E-mail</label>
               <input 
                 type="email" required value={formData.email || ""}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-white outline-none text-sm"
                 style={{ borderColor: "#D2D2D7" }}
               />
             </div>
           )}
           {requiredFields.collect_phone && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-60">Telefone</label>
               <input 
                 type="tel" required value={formData.phone || ""}
                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-white outline-none text-sm"
                 style={{ borderColor: "#D2D2D7" }}
               />
             </div>
           )}
 
           <button
             type="submit" disabled={isLoading}
             className="w-full h-14 rounded-xl font-bold text-lg transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-black/5"
             style={{ backgroundColor: styles.button, color: styles.buttonText }}
           >
             {isLoading ? (
               <div className="flex items-center gap-2">
                 <Loader2 className="h-5 w-5 animate-spin" />
                 <span>Gerando Pix...</span>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                 <span>{content.ctaText || "Gerar Pix"}</span>
                 <ArrowRight size={18} />
               </div>
             )}
           </button>
 
           <div className="flex items-center justify-center gap-1.5 mt-4 opacity-40">
             <Lock size={12} />
             <span className="text-[10px] font-medium uppercase tracking-wider">Pagamento 100% Seguro</span>
           </div>
         </form>
 
         {theme.showBenefits !== false && content.benefits && content.benefits.length > 0 && (
           <div className="w-full space-y-3 my-8 pt-8 border-t border-black/5">
             {content.benefits.map((benefit, idx) => (
               <div key={idx} className="flex gap-3">
                 <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: styles.accent }} />
                 <span className="text-sm leading-snug opacity-80">{benefit}</span>
               </div>
             ))}
           </div>
         )}
 
         {theme.showGuarantee !== false && content.guaranteeText && (
           <div className="w-full mt-4 p-6 rounded-2xl border flex flex-col items-center text-center gap-3 bg-black/5 border-transparent">
             <Shield size={32} style={{ color: styles.accent }} />
             <div>
               <h4 className="font-bold text-sm">{content.guaranteeTitle || "Garantia"}</h4>
               <p className="text-xs mt-1 leading-relaxed opacity-60">{content.guaranteeText}</p>
             </div>
           </div>
         )}
 
         {content.footerNote && <p className="text-[11px] text-center mt-8 px-4 opacity-50">{content.footerNote}</p>}
         {project.legal_text && <p className="text-[9px] text-center mt-6 opacity-30 italic">{project.legal_text}</p>}
       </div>
     </div>
   );
 };