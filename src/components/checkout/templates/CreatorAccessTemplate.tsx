 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, Zap, Lock, ArrowRight, User } from "lucide-react";
 
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
   formatPrice
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
     <div className="min-h-screen flex flex-col font-sans" style={{ background: styles.bg, color: styles.text }}>
       <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
         
         {/* LEFT COLUMN: VISUAL HERO */}
         <div className="flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left">
           <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
               <Lock size={14} className="text-pink-500" />
               <span className="text-[11px] font-bold uppercase tracking-widest text-pink-500">
                 {content.badge || "Acesso reservado"}
               </span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
               {content.heroTitle || project.headline || "Acesso reservado liberado por Pix"}
             </h1>
             <p className="text-lg md:text-xl opacity-60 max-w-md">
               {content.heroSubtitle || project.subheadline || "Finalize em poucos segundos e receba a próxima etapa após a confirmação."}
             </p>
           </div>
 
           {/* HERO IMAGE / PLACEHOLDER */}
           <div className="w-full max-w-md relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-black/40 border border-white/10 backdrop-blur-3xl flex items-center justify-center">
               {theme.heroImageUrl ? (
                 <img src={theme.heroImageUrl} alt="Acesso" className="w-full h-full object-cover" />
               ) : (
                 <div className="flex flex-col items-center gap-4 opacity-20">
                   <User size={120} strokeWidth={1} />
                   <span className="text-sm font-medium tracking-widest uppercase">Premium Member</span>
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6">
                 <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">A</div>
                   <div>
                     <p className="text-xs font-bold uppercase tracking-wider opacity-60">Status</p>
                     <p className="text-sm font-bold">Aguardando seu acesso</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
 
           {/* QUICK BENEFITS */}
           <div className="grid grid-cols-2 gap-4 w-full max-w-md">
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-1">Privacidade</p>
               <p className="text-xs font-medium opacity-70 leading-snug">Pagamento discreto e seguro</p>
             </div>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-1">Instantâneo</p>
               <p className="text-xs font-medium opacity-70 leading-snug">Acesso logo após confirmação</p>
             </div>
           </div>
         </div>
 
         {/* RIGHT COLUMN: CHECKOUT CARD */}
         <div className="flex justify-center">
           <div className="w-full max-w-[440px] p-8 md:p-10 rounded-[32px] border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl shadow-purple-500/10"
                style={{ background: styles.card }}>
             
             {/* PRODUCT INFO */}
             <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-6">
               <div className="space-y-1">
                 <h3 className="text-sm font-bold uppercase tracking-widest opacity-40">Você está adquirindo:</h3>
                 <h2 className="text-xl font-bold">{offer.name}</h2>
               </div>
               <div className="text-right">
                 <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                   {formatPrice(offer.price_cents)}
                 </p>
               </div>
             </div>
 
             {/* FORM */}
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