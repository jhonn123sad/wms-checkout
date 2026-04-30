 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, CheckCircle2, Shield, Zap, Lock, ArrowRight } from "lucide-react";
 
 export const DarkPremiumTemplate: React.FC<CheckoutTemplateProps> = ({
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
     bg: theme.background || "#0A0A0B",
     card: theme.card || "#161618",
     text: theme.text || "#FFFFFF",
     muted: theme.muted || "#86868B",
     button: theme.button || "#0071E3",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#0071E3",
     radius: theme.borderRadius || "24px"
   };
 
   const inputStyle = {
     backgroundColor: "rgba(255,255,255,0.05)",
     borderColor: "rgba(255,255,255,0.1)",
     color: styles.text
   };
 
   return (
     <div className="min-h-screen flex flex-col items-center py-8 px-4 md:py-12" style={{ backgroundColor: styles.bg, color: styles.text }}>
       <div className="w-full max-w-[440px] mb-8 flex flex-col items-center text-center">
         {theme.logoUrl && <img src={theme.logoUrl} alt="Logo" className="h-12 mb-8 object-contain" />}
         
         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 bg-white/5 border border-white/10">
           <Zap size={12} className="text-orange-500 fill-orange-500" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
             {content.badge || "Acesso Premium"}
           </span>
         </div>
 
         <h1 className="text-4xl font-black tracking-tight mb-3">{content.heroTitle || project.headline}</h1>
         <p className="text-sm opacity-60 mb-4">{content.heroSubtitle || project.subheadline}</p>
       </div>
 
       <div className="w-full max-w-[480px] p-8 md:p-10 shadow-2xl border relative overflow-hidden"
            style={{ backgroundColor: styles.card, borderRadius: styles.radius, borderColor: "rgba(255,255,255,0.05)" }}>
         
         <div className="w-full rounded-2xl p-5 mb-8 flex justify-between items-center bg-white/5 border border-white/5">
           <div className="flex-1 pr-4">
             <h2 className="font-bold text-base">{offer.name}</h2>
             <p className="text-xs mt-0.5 opacity-50">{offer.description}</p>
           </div>
           <div className="text-xl font-black" style={{ color: styles.accent }}>{formatPrice(offer.price_cents)}</div>
         </div>
 
         <form onSubmit={onSubmit} className="space-y-4">
           {requiredFields.collect_name && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-50">Nome completo</label>
               <input type="text" required value={formData.name || ""}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border outline-none text-sm" style={inputStyle} />
             </div>
           )}
           {requiredFields.collect_email && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-50">E-mail</label>
               <input type="email" required value={formData.email || ""}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border outline-none text-sm" style={inputStyle} />
             </div>
           )}
           {requiredFields.collect_cpf && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-50">CPF</label>
               <input type="text" required value={formData.cpf || ""}
                 onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border outline-none text-sm" style={inputStyle} />
             </div>
           )}
           {requiredFields.collect_phone && (
             <div className="space-y-1.5">
               <label className="text-xs font-semibold ml-1 opacity-50">Telefone</label>
               <input type="tel" required value={formData.phone || ""}
                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border outline-none text-sm" style={inputStyle} />
             </div>
           )}
 
           <button type="submit" disabled={isLoading}
             className="w-full h-14 rounded-xl font-bold text-lg transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 shadow-xl shadow-black/20"
             style={{ backgroundColor: styles.button, color: styles.buttonText }}>
             {isLoading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2">{content.ctaText || "Assinar Agora"} <ArrowRight size={18} /></div>}
           </button>
         </form>
 
         {theme.showBenefits !== false && content.benefits && (
           <div className="mt-8 space-y-3 opacity-80">
             {content.benefits.map((b: string, i: number) => (
               <div key={i} className="flex gap-2 text-sm"><CheckCircle2 size={16} className="shrink-0 text-blue-400" /> {b}</div>
             ))}
           </div>
         )}
 
         <div className="mt-8 pt-8 border-t border-white/5 text-center">
           <div className="flex items-center justify-center gap-2 opacity-30 mb-4"><Lock size={12} /> <span className="text-[10px] uppercase font-bold">Secure checkout</span></div>
           {project.legal_text && <p className="text-[9px] opacity-20 italic">{project.legal_text}</p>}
         </div>
       </div>
     </div>
   );
 };