 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, CheckCircle2, Shield, Zap, Lock, ArrowRight, Star } from "lucide-react";
 
 /**
  * CUSTOM EDITABLE TEMPLATE
  * ÁREA VISUAL EDITÁVEL — SEGURO ALTERAR LAYOUT
  * Este template foi desenhado para ser facilmente editado no Lovable.
  */
 export const CustomEditableTemplate: React.FC<CheckoutTemplateProps> = ({
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
     card: theme.card || "#F9FAFB",
     text: theme.text || "#111827",
     muted: theme.muted || "#6B7280",
     button: theme.button || "#000000",
     buttonText: theme.buttonText || "#FFFFFF",
     accent: theme.accent || "#2563EB",
     radius: theme.borderRadius || "16px"
   };
 
   const inputStyle = {
     backgroundColor: "#FFFFFF",
     borderColor: "#E5E7EB",
     color: styles.text,
     borderRadius: "8px"
   };
 
   return (
     <div className="min-h-screen font-sans" style={{ backgroundColor: styles.bg, color: styles.text }}>
       {/* HERO SECTION */}
       <section className="pt-12 pb-8 px-4 text-center max-w-4xl mx-auto">
         {theme.logoUrl && (
           <img src={theme.logoUrl} alt="Logo" className="h-10 mx-auto mb-8 object-contain" />
         )}
         
         {content.badge && (
           <span className="inline-block px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border"
                 style={{ borderColor: styles.accent, color: styles.accent }}>
             {content.badge}
           </span>
         )}
 
         <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
           {content.heroTitle || project.headline || "Oferta Especial"}
         </h1>
         
         <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-8">
           {content.heroSubtitle || project.subheadline || "Aproveite esta oportunidade única."}
         </p>
 
         {theme.heroImageUrl && (
           <div className="relative max-w-3xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl">
             <img src={theme.heroImageUrl} alt="Hero" className="w-full object-cover aspect-video" />
             {content.imageCaption && (
               <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-sm backdrop-blur-sm">
                 {content.imageCaption}
               </div>
             )}
           </div>
         )}
       </section>
 
       <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">
         {/* COLUMN 1: BENEFITS & TRUST */}
         <div className="space-y-12">
           {theme.showBenefits !== false && content.benefits && content.benefits.length > 0 && (
             <div className="space-y-6">
               <h2 className="text-2xl font-bold flex items-center gap-2">
                 <Star className="text-yellow-400 fill-yellow-400" size={24} />
                 O que você vai receber:
               </h2>
               <ul className="grid grid-cols-1 gap-4">
                 {content.benefits.map((benefit: string, i: number) => (
                   <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-black/5 border border-black/5">
                     <CheckCircle2 className="mt-1 shrink-0" style={{ color: styles.accent }} size={20} />
                     <span className="font-medium">{benefit}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
 
           {theme.showGuarantee !== false && content.guaranteeText && (
             <div className="p-8 rounded-2xl border-2 border-dashed flex flex-col md:flex-row items-center gap-6"
                  style={{ borderColor: styles.accent + '40', backgroundColor: styles.accent + '05' }}>
               <Shield className="shrink-0" style={{ color: styles.accent }} size={64} />
               <div>
                 <h3 className="text-xl font-bold mb-2">{content.guaranteeTitle || "Sua Compra Protegida"}</h3>
                 <p className="opacity-70 text-sm leading-relaxed">{content.guaranteeText}</p>
               </div>
             </div>
           )}
         </div>
 
         {/* COLUMN 2: CHECKOUT FORM */}
         <div className="relative">
           <div className="sticky top-8 p-6 md:p-10 shadow-2xl border"
                style={{ backgroundColor: styles.card, borderRadius: styles.radius, borderColor: 'rgba(0,0,0,0.05)' }}>
             
             {/* PRODUCT INFO */}
             <div className="mb-8 p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex justify-between items-center">
               <div>
                 <h3 className="font-bold text-lg">{offer.name}</h3>
                 <p className="text-xs opacity-60">{offer.description}</p>
               </div>
               <div className="text-2xl font-black" style={{ color: styles.accent }}>
                 {formatPrice(offer.price_cents)}
               </div>
             </div>
 
             {content.preFormText && (
               <p className="text-sm font-bold mb-6 text-center underline decoration-2 underline-offset-4" 
                  style={{ textDecorationColor: styles.accent }}>
                 {content.preFormText}
               </p>
             )}
 
             {/* FORM */}
             <form onSubmit={onSubmit} className="space-y-4">
               {requiredFields.collect_name && (
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Nome Completo</label>
                   <input 
                     type="text" required
                     value={formData.name || ""}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     placeholder="Seu nome completo"
                     className="w-full h-12 px-4 border focus:ring-2 outline-none transition-all"
                     style={inputStyle}
                   />
                 </div>
               )}
               
               {requiredFields.collect_cpf && (
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">CPF</label>
                   <input 
                     type="text" required
                     value={formData.cpf || ""}
                     onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                     placeholder="000.000.000-00"
                     className="w-full h-12 px-4 border focus:ring-2 outline-none transition-all"
                     style={inputStyle}
                   />
                 </div>
               )}
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {requiredFields.collect_email && (
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">E-mail</label>
                     <input 
                       type="email" required
                       value={formData.email || ""}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       placeholder="seu@email.com"
                       className="w-full h-12 px-4 border focus:ring-2 outline-none transition-all"
                       style={inputStyle}
                     />
                   </div>
                 )}
                 
                 {requiredFields.collect_phone && (
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">WhatsApp</label>
                     <input 
                       type="tel" required
                       value={formData.phone || ""}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       placeholder="(00) 00000-0000"
                       className="w-full h-12 px-4 border focus:ring-2 outline-none transition-all"
                       style={inputStyle}
                     />
                   </div>
                 )}
               </div>
 
               {/* CTA BUTTON - NÃO ALTERAR onSubmit */}
               <button
                 type="submit"
                 disabled={isLoading}
                 className="w-full h-16 rounded-xl font-black text-xl transition-all active:scale-[0.98] mt-6 disabled:opacity-50 flex flex-col items-center justify-center gap-1 shadow-xl hover:brightness-110"
                 style={{ backgroundColor: styles.button, color: styles.buttonText }}
               >
                 {isLoading ? (
                   <div className="flex items-center gap-3">
                     <Loader2 className="h-6 w-6 animate-spin" />
                     <span>Gerando Pix...</span>
                   </div>
                 ) : (
                   <div className="flex items-center gap-2">
                     <span>{content.ctaText || "QUERO MEU ACESSO AGORA"}</span>
                     <ArrowRight size={22} />
                   </div>
                 )}
               </button>
 
               {isLoading && (
                 <p className="text-xs font-bold text-center animate-pulse mt-3" style={{ color: styles.accent }}>
                   Aguarde, estamos preparando seu pagamento com segurança.
                 </p>
               )}
 
               {theme.showUrgency !== false && content.urgencyText && (
                 <div className="flex items-center justify-center gap-2 mt-4 text-orange-600 font-bold text-sm animate-bounce">
                   <Zap size={16} fill="currentColor" />
                   {content.urgencyText}
                 </div>
               )}
 
               <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
                 <Lock size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-tighter">
                   Pagamento 100% Seguro & Encriptado
                 </span>
               </div>
             </form>
           </div>
         </div>
       </div>
 
       {/* FOOTER */}
       <footer className="py-12 px-4 border-t border-gray-100 text-center opacity-60">
         <div className="max-w-2xl mx-auto space-y-4">
           {content.footerNote && (
             <p className="text-xs font-medium">{content.footerNote}</p>
           )}
           
           {project.legal_text && (
             <p className="text-[10px] italic leading-relaxed">
               {project.legal_text}
             </p>
           )}
           
           {/* DISCREET PUSHIN PAY NOTICE */}
           <div className="flex items-center justify-center gap-1 mt-4">
             <ShieldCheck size={10} />
             <span className="text-[9px] uppercase tracking-widest font-bold">Processado via Pushin Pay</span>
           </div>
         </div>
       </footer>
     </div>
   );
 };