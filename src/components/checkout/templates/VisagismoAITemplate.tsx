 import React from "react";
 import { CheckoutTemplateProps } from "../types";
 import { Loader2, ShieldCheck, Sparkles, Zap, ArrowRight, Camera, Scissors, Palette, UserCheck } from "lucide-react";
 
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
   formatPrice
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
     <div className="min-h-screen font-sans bg-[#fdfdff]" style={{ color: styles.text }}>
       {/* TOP NAV/HEADER */}
       <header className="py-6 px-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-6xl mx-auto flex justify-between items-center">
           {theme.logoUrl ? (
             <img src={theme.logoUrl} alt="Logo" className="h-8 object-contain" />
           ) : (
             <div className="flex items-center gap-2 font-bold text-indigo-600">
               <Sparkles size={20} />
               <span>Visagismo IA</span>
             </div>
           )}
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
             <ShieldCheck size={14} />
             <span className="hidden sm:inline">Checkout Seguro</span>
           </div>
         </div>
       </header>
 
       <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: CONTENT & TECH VISUAL */}
           <div className="lg:col-span-7 space-y-12">
             <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                 <Sparkles size={12} className="animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">{content.badge || "Análise personalizada"}</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                 {content.heroTitle || project.headline || "Descubra a imagem que mais valoriza você"}
               </h1>
               <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                 {content.heroSubtitle || project.subheadline || "Uma análise com IA para orientar seu corte de cabelo, estilo e apresentação visual baseada na sua estrutura facial."}
               </p>
             </div>
 
             {/* AI ANALYSIS VISUAL */}
             <div className="relative group max-w-2xl">
               <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-3xl opacity-50"></div>
               <div className="relative aspect-video rounded-[32px] border-2 border-white shadow-2xl overflow-hidden bg-slate-50">
                 {theme.heroImageUrl ? (
                   <img src={theme.heroImageUrl} alt="Análise IA" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center relative">
                     {/* Abstract AI Grid */}
                     <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-20">
                       {Array.from({ length: 24 }).map((_, i) => (
                         <div key={i} className="border-[0.5px] border-indigo-200"></div>
                       ))}
                     </div>
                     {/* Analysis Scan Effect */}
                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan shadow-[0_0_15px_indigo]"></div>
                     
                     <div className="z-10 flex flex-col items-center gap-4">
                       <div className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center">
                         <Camera size={40} className="text-indigo-400" />
                       </div>
                       <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">Scanning face structure...</p>
                     </div>
                   </div>
                 )}
               </div>
             </div>
 
             {/* HOW IT WORKS / STEPS */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
               {[
                 { icon: <UserCheck size={24} />, title: "1. Informe seus dados", desc: "Preencha o formulário e faça o pagamento via Pix." },
                 { icon: <Camera size={24} />, title: "2. Envie suas fotos", desc: "Siga o guia para capturar sua estrutura facial corretamente." },
                 { icon: <Sparkles size={24} />, title: "3. Receba a análise", desc: "Nossa IA processa e gera seu dossiê de imagem." },
               ].map((step, i) => (
                 <div key={i} className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                     {step.icon}
                   </div>
                   <h4 className="font-bold text-slate-800">{step.title}</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                 </div>
               ))}
             </div>
 
             {/* ANALYSIS CARDS */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                 { icon: <Sparkles size={16} />, label: "Estrutura facial" },
                 { icon: <Scissors size={16} />, label: "Cabelo e estilo" },
                 { icon: <Palette size={16} />, label: "Harmonia visual" },
                 { icon: <Zap size={16} />, label: "Plano de ação" },
               ].map((card, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                   <div className="text-indigo-500">{card.icon}</div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
                 </div>
               ))}
             </div>
           </div>
 
           {/* RIGHT: PREMIUM CHECKOUT CARD */}
           <div className="lg:col-span-5">
             <div className="sticky top-32 p-8 md:p-10 rounded-[40px] border border-gray-100 bg-white shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
               {/* BG GLOW */}
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
               
               {/* OFFER HEADER */}
               <div className="relative mb-10 flex justify-between items-start">
                 <div className="space-y-1">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Sua análise exclusiva:</h3>
                   <h2 className="text-2xl font-black">{offer.name}</h2>
                 </div>
                 <div className="text-3xl font-black text-indigo-600">
                   {formatPrice(offer.price_cents)}
                 </div>
               </div>
 
               {/* FORM */}
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