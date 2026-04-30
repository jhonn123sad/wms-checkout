 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, CheckCircle2, Shield, Zap, Lock, ArrowRight } from "lucide-react";
 
 export const ImageLeftTemplate: React.FC<CheckoutTemplateProps> = ({
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
     <div className="min-h-screen py-8 px-4 md:py-20" style={{ backgroundColor: styles.bg, color: styles.text }}>
       <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
         
         {/* LEFT SIDE: PRODUCT IMAGE & INFO */}
         <div className="space-y-8">
           {theme.logoUrl && <img src={theme.logoUrl} alt="Logo" className="h-10 object-contain" />}
           
           <div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{content.heroTitle || project.headline}</h1>
             <p className="text-lg opacity-70 leading-relaxed">{content.heroSubtitle || project.subheadline}</p>
           </div>
 
           {(theme.heroImageUrl || theme.coverImageUrl) && (
             <div className="rounded-[32px] overflow-hidden shadow-2xl border border-black/5 aspect-video md:aspect-auto">
               <img src={theme.heroImageUrl || theme.coverImageUrl} alt="Product" className="w-full h-full object-cover" />
             </div>
           )}
 
           {content.benefits && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {content.benefits.map((b: string, i: number) => (
                 <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-white/50 border border-black/5">
                   <CheckCircle2 size={18} style={{ color: styles.accent }} />
                   <span className="text-sm font-medium">{b}</span>
                 </div>
               ))}
             </div>
           )}
 
           {theme.showGuarantee !== false && content.guaranteeText && (
             <div className="p-6 rounded-2xl bg-black/5 flex items-center gap-4">
               <Shield className="shrink-0" style={{ color: styles.accent }} size={32} />
               <p className="text-xs opacity-70 leading-relaxed">{content.guaranteeText}</p>
             </div>
           )}
         </div>
 
         {/* RIGHT SIDE: CHECKOUT CARD */}
         <div className="p-8 md:p-10 shadow-2xl border sticky top-12"
              style={{ backgroundColor: styles.card, borderRadius: styles.radius, borderColor: "rgba(0,0,0,0.05)" }}>
           
           <div className="flex justify-between items-center mb-8 pb-6 border-b border-black/5">
             <div>
               <h3 className="font-bold text-lg">{offer.name}</h3>
               <p className="text-xs opacity-50">{offer.description}</p>
             </div>
             <div className="text-2xl font-black">{formatPrice(offer.price_cents)}</div>
           </div>
 
           <form onSubmit={onSubmit} className="space-y-4">
             {requiredFields.collect_name && (
               <input type="text" required placeholder="Nome completo" value={formData.name || ""}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none text-sm" />
             )}
             {requiredFields.collect_email && (
               <input type="email" required placeholder="Seu melhor e-mail" value={formData.email || ""}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none text-sm" />
             )}
             {requiredFields.collect_cpf && (
               <input type="text" required placeholder="CPF" value={formData.cpf || ""}
                 onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none text-sm" />
             )}
             {requiredFields.collect_phone && (
               <input type="tel" required placeholder="WhatsApp" value={formData.phone || ""}
                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                 className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none text-sm" />
             )}
 
             <button type="submit" disabled={isLoading}
               className="w-full h-14 rounded-xl font-bold text-lg transition-all active:scale-[0.98] mt-4 flex flex-col items-center justify-center shadow-lg"
               style={{ backgroundColor: styles.button, color: styles.buttonText }}>
               {isLoading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2">{content.ctaText || "Gerar Pix"} <ArrowRight size={18} /></div>}
             </button>
             
             <div className="flex items-center justify-center gap-1.5 mt-6 opacity-30">
               <Lock size={12} /> <span className="text-[10px] font-bold uppercase tracking-widest">Pagamento Seguro</span>
             </div>
           </form>
         </div>
       </div>
     </div>
   );
 };