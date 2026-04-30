 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, CheckCircle2, Shield, Zap, Lock, ArrowRight } from "lucide-react";
 
 export const LongformSimpleTemplate: React.FC<CheckoutTemplateProps> = ({
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
     bg: theme.background || "#FFFFFF",
     card: theme.card || "#FFFFFF",
     text: theme.text || "#1D1D1F",
     muted: theme.muted || "#86868B",
     button: theme.button || "#000000",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#0071E3",
     radius: theme.borderRadius || "12px"
   };
 
   return (
     <div className="min-h-screen py-12 px-4" style={{ backgroundColor: styles.bg, color: styles.text }}>
       <div className="max-w-2xl mx-auto space-y-12">
         
         {/* CONTENT HEADLINE */}
         <div className="text-center space-y-4">
           {theme.logoUrl && <img src={theme.logoUrl} alt="Logo" className="h-10 mx-auto mb-8 object-contain" />}
           <h1 className="text-3xl md:text-5xl font-black tracking-tight">{content.heroTitle || project.headline}</h1>
           <p className="text-lg opacity-70">{content.heroSubtitle || project.subheadline}</p>
         </div>
 
         {/* HERO IMAGE */}
         {(theme.heroImageUrl || theme.coverImageUrl) && (
           <div className="rounded-2xl overflow-hidden shadow-lg border border-black/5">
             <img src={theme.heroImageUrl || theme.coverImageUrl} alt="Hero" className="w-full" />
           </div>
         )}
 
         {/* BENEFITS LIST */}
         {content.benefits && (
           <div className="space-y-6 py-8 border-y border-black/5">
             <h2 className="text-xl font-bold">Por que escolher este produto?</h2>
             <div className="grid grid-cols-1 gap-4">
               {content.benefits.map((b: string, i: number) => (
                 <div key={i} className="flex gap-4 items-start">
                   <CheckCircle2 size={24} style={{ color: styles.accent }} className="shrink-0 mt-0.5" />
                   <p className="font-medium">{b}</p>
                 </div>
               ))}
             </div>
           </div>
         )}
 
         {/* SIMPLE CHECKOUT BOX */}
         <div className="p-8 md:p-12 border-2 shadow-sm relative"
              style={{ backgroundColor: styles.card, borderRadius: styles.radius, borderColor: "rgba(0,0,0,0.05)" }}>
           
           <div className="text-center mb-8">
             <h3 className="text-2xl font-black mb-2">{offer.name}</h3>
             <p className="text-sm opacity-60 mb-4">{offer.description}</p>
             <div className="text-4xl font-black" style={{ color: styles.accent }}>{formatPrice(offer.price_cents)}</div>
           </div>
 
           <form onSubmit={onSubmit} className="space-y-6">
             <div className="grid grid-cols-1 gap-4">
               {requiredFields.collect_name && <input type="text" required placeholder="Nome completo" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-14 px-5 rounded-xl border bg-gray-50" />}
               {requiredFields.collect_email && <input type="email" required placeholder="E-mail" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-14 px-5 rounded-xl border bg-gray-50" />}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {requiredFields.collect_cpf && <input type="text" required placeholder="CPF" value={formData.cpf || ""} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} className="w-full h-14 px-5 rounded-xl border bg-gray-50" />}
                 {requiredFields.collect_phone && <input type="tel" required placeholder="WhatsApp" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full h-14 px-5 rounded-xl border bg-gray-50" />}
               </div>
             </div>
 
             <button type="submit" disabled={isLoading}
               className="w-full h-16 rounded-2xl font-black text-xl transition-all active:scale-[0.95] flex flex-col items-center justify-center shadow-xl"
               style={{ backgroundColor: styles.button, color: styles.buttonText }}>
               {isLoading ? <Loader2 className="animate-spin" /> : content.ctaText || "Gerar meu Pix Agora"}
             </button>
             
             <div className="flex items-center justify-center gap-2 opacity-30">
               <Lock size={14} /> <span className="text-xs font-bold uppercase tracking-widest">Pagamento Seguro</span>
             </div>
           </form>
         </div>
 
         {/* GUARANTEE & FOOTER */}
         <div className="text-center space-y-8 pb-12 opacity-60">
           {content.guaranteeText && <p className="text-sm italic">"{content.guaranteeText}"</p>}
           <div className="pt-8 border-t border-black/5">
             {content.footerNote && <p className="text-xs mb-4">{content.footerNote}</p>}
             {project.legal_text && <p className="text-[10px] leading-relaxed">{project.legal_text}</p>}
           </div>
         </div>
       </div>
     </div>
   );
 };