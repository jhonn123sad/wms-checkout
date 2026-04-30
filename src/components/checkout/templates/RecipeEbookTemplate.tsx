 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, CheckCircle2, ShieldCheck, BookOpen, Utensils, Heart, Clock } from "lucide-react";
 
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
   formatPrice
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
     <div className="min-h-screen font-sans py-8 md:py-16 px-4" style={{ backgroundColor: styles.bg, color: styles.text }}>
       <div className="max-w-5xl mx-auto">
         {/* HEADER */}
         <header className="text-center mb-12 space-y-4">
           {theme.logoUrl ? (
             <img src={theme.logoUrl} alt="Logo" className="h-12 mx-auto mb-6 object-contain" />
           ) : (
             <div className="flex justify-center mb-6">
               <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                 <Utensils size={32} />
               </div>
             </div>
           )}
           <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold uppercase tracking-wider mb-2">
             {content.badge || "Ebook digital"}
           </div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
             {content.heroTitle || project.headline || "Receitas práticas para todos os dias"}
           </h1>
           <p className="text-lg opacity-80 max-w-xl mx-auto">
             {content.heroSubtitle || project.subheadline || "Organize sua semana com receitas simples, gostosas e fáceis de preparar."}
           </p>
         </header>
 
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* LEFT: CONTENT & PROMISE */}
           <div className="lg:col-span-7 space-y-10">
             {/* MOCKUP EBOOK */}
             <div className="relative group">
               <div className="absolute -inset-4 bg-orange-500/5 rounded-[40px] blur-2xl"></div>
               <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-8 border-white bg-white">
                 {theme.heroImageUrl ? (
                   <img src={theme.heroImageUrl} alt="Ebook" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-12">
                     <div className="w-full h-full border-4 border-dashed border-orange-200 rounded-2xl flex flex-col items-center justify-center text-orange-300">
                       <BookOpen size={80} strokeWidth={1} />
                       <p className="mt-4 font-bold uppercase tracking-widest text-sm">Capa do Ebook</p>
                     </div>
                   </div>
                 )}
               </div>
             </div>
 
             {/* BENEFITS GRID */}
             <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Heart size={20} />, title: "Ingredientes simples", desc: "Tudo o que você já tem em casa" },
                 { icon: <Clock size={20} />, title: "Preparo fácil", desc: "Em até 30 minutos" },
                 { icon: <Utensils size={20} />, title: "Ideal para rotina", desc: "Organize seu dia a dia" },
                 { icon: <BookOpen size={20} />, title: "Acesso digital", desc: "No celular ou tablet" },
               ].map((item, i) => (
                 <div key={i} className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm flex flex-col gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                     {item.icon}
                   </div>
                   <div>
                     <h4 className="font-bold text-sm">{item.title}</h4>
                     <p className="text-xs opacity-60 leading-relaxed mt-1">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
 
             {/* TRUST SECTION */}
             <div className="p-6 rounded-2xl bg-green-50 border border-green-100 flex items-start gap-4">
               <div className="p-2 rounded-full bg-white text-green-600 shadow-sm">
                 <CheckCircle2 size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-green-800">Receba imediatamente</h4>
                 <p className="text-sm text-green-700/80 leading-relaxed">
                   O envio é automático para o seu e-mail logo após a confirmação do Pix.
                 </p>
               </div>
             </div>
           </div>
 
           {/* RIGHT: CHECKOUT */}
           <div className="lg:col-span-5">
             <div className="sticky top-8 bg-white p-8 md:p-10 rounded-[32px] shadow-2xl shadow-orange-900/5 border border-orange-50">
               {/* PRICE TAG */}
               <div className="mb-8 p-6 rounded-2xl bg-orange-50 border border-orange-100 flex justify-between items-center">
                 <div className="space-y-1">
                   <h3 className="font-bold text-sm opacity-60">Investimento único</h3>
                   <p className="font-medium text-xs leading-none">Acesso vitalício</p>
                 </div>
                 <div className="text-3xl font-black text-orange-600">
                   {formatPrice(offer.price_cents)}
                 </div>
               </div>
 
               {/* FORM */}
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