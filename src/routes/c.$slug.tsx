 /**
  * CORE DE PAGAMENTO — NÃO ALTERAR SEM TESTE DE REGRESSÃO
  * Responsável pela coleta de dados do cliente e início do fluxo de pagamento.
  */
 import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
 import { Loader2, ShieldCheck, CheckCircle2, Shield, Zap, Info, ArrowRight, Lock } from "lucide-react";

export const Route = createFileRoute("/c/$slug")({
  loader: async ({ params }) => {
    const { data: project, error: pError } = await supabase
      .from("checkout_projects")
      .select("*")
      .eq("slug", params.slug)
      .eq("active", true)
      .maybeSingle();

    if (pError || !project) {
      throw new Error("Projeto não encontrado ou inativo.");
    }

    const { data: offer, error: oError } = await supabase
      .from("checkout_offers")
      .select("*")
      .eq("project_id", project.id)
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (oError || !offer) {
      throw new Error("Oferta ativa não encontrada para este projeto.");
    }

    return { project, offer };
  },
  component: DynamicCheckout,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-500 mb-6">{error.message}</p>
        <button 
          onClick={() => window.location.href = "/"}
          className="text-blue-600 font-semibold hover:underline"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  )
});

 interface ThemeConfig {
   template?: 'apple-clean' | 'dark-premium' | 'image-left' | 'longform-simple';
   background?: string;
   card?: string;
   text?: string;
   muted?: string;
   button?: string;
   buttonText?: string;
   accent?: string;
   logoUrl?: string;
   heroImageUrl?: string;
   coverImageUrl?: string;
   showHeroImage?: boolean;
   showBenefits?: boolean;
   showTestimonials?: boolean;
   showGuarantee?: boolean;
   showUrgency?: boolean;
   borderRadius?: string;
   layout?: 'centered' | 'wide';
 }
 
 interface ContentConfig {
   badge?: string;
   heroTitle?: string;
   heroSubtitle?: string;
   preFormText?: string;
   benefits?: string[];
   guaranteeTitle?: string;
   guaranteeText?: string;
   ctaText?: string;
   footerNote?: string;
   heroBullets?: string[];
   urgencyText?: string;
   securePaymentText?: string;
   imageCaption?: string;
 }
 
 function DynamicCheckout() {
   const { project, offer } = Route.useLoaderData();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/c/$slug" }) as any;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [utms, setUtms] = useState<Record<string, string>>({});

  useEffect(() => {
    // Capture UTMs from search params
    const capturedUtms: Record<string, string> = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmKeys.forEach(key => {
      if (searchParams[key]) capturedUtms[key] = String(searchParams[key]);
    });
    setUtms(capturedUtms);
  }, [searchParams]);

   const theme: ThemeConfig = (project as any).theme_json || {};
   const content: ContentConfig = (project as any).content_json || {};
 
   // Fallback values
   const styles = {
     bg: theme.background || (theme.template === 'dark-premium' ? '#0A0A0B' : '#F5F5F7'),
     card: theme.card || (theme.template === 'dark-premium' ? '#161618' : '#FFFFFF'),
     text: theme.text || (theme.template === 'dark-premium' ? '#FFFFFF' : '#1D1D1F'),
     muted: theme.muted || (theme.template === 'dark-premium' ? '#86868B' : '#86868B'),
     button: theme.button || (theme.template === 'dark-premium' ? '#0071E3' : '#000000'),
     buttonText: theme.buttonText || '#FFFFFF',
     accent: theme.accent || '#0071E3',
     radius: theme.borderRadius || '24px'
   };

  const handleGeneratePix = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validations based on project config
    if (project.collect_name && !formData.name) return toast.error("Preencha o nome completo");
    if (project.collect_cpf && !formData.cpf) return toast.error("Preencha o CPF");
    if (project.collect_email && !formData.email) return toast.error("Preencha o e-mail");
    if (project.collect_phone && !formData.phone) return toast.error("Preencha o telefone");

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: {
          project_slug: project.slug,
          customer_name: formData.name,
          customer_cpf: formData.cpf,
          customer_email: formData.email,
          customer_phone: formData.phone,
          offer_id: offer.id,
          ...utms
        },
      });

      if (error || !data || data.error) {
        throw new Error(data?.error || error?.message || "Erro ao gerar Pix");
      }

      console.log("[Dynamic] Pix gerado com sucesso, orderId:", data.orderId, "hasToken:", !!data.accessToken);
      navigate({ 
        to: `/pagamento/${data.orderId}`, 
        search: { token: data.accessToken } 
      } as any);
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

   const formattedPrice = (offer.price_cents / 100).toLocaleString('pt-BR', {
     style: 'currency',
     currency: 'BRL'
   });
 
   const renderBenefits = () => {
     if (!content.benefits || content.benefits.length === 0) return null;
     return (
       <div className="w-full space-y-3 my-8">
         {content.benefits.map((benefit, idx) => (
           <div key={idx} className="flex gap-3">
             <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: styles.accent }} />
             <span className="text-sm leading-snug" style={{ color: styles.text }}>{benefit}</span>
           </div>
         ))}
       </div>
     );
   };
 
   const renderGuarantee = () => {
     if (!content.guaranteeText) return null;
     return (
       <div className="w-full mt-8 p-6 rounded-2xl border flex flex-col items-center text-center gap-3" 
            style={{ borderColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
         <Shield size={32} style={{ color: styles.accent }} />
         <div>
           <h4 className="font-bold text-sm" style={{ color: styles.text }}>{content.guaranteeTitle || "Garantia de Satisfação"}</h4>
           <p className="text-xs mt-1 leading-relaxed" style={{ color: styles.muted }}>{content.guaranteeText}</p>
         </div>
       </div>
     );
   };
 
   const renderProductBox = () => (
     <div className="w-full rounded-2xl p-5 mb-8 flex justify-between items-center border" 
          style={{ 
            backgroundColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.03)' : '#F5F5F7',
            borderColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.05)' : 'transparent'
          }}>
       <div className="flex-1 pr-4">
         <h2 className="font-bold text-base" style={{ color: styles.text }}>{offer.name}</h2>
         <p className="text-xs mt-0.5 line-clamp-2" style={{ color: styles.muted }}>{offer.description}</p>
       </div>
       <div className="text-xl font-black shrink-0" style={{ color: styles.text }}>{formattedPrice}</div>
     </div>
   );

   const renderCheckoutForm = () => (
     <form onSubmit={handleGeneratePix} className="w-full space-y-4">
       {content.preFormText && (
         <p className="text-sm font-medium mb-2" style={{ color: styles.text }}>{content.preFormText}</p>
       )}
 
       {project.collect_name && (
         <div className="space-y-1.5">
           <label className="text-xs font-semibold ml-1" style={{ color: styles.muted }}>Nome completo</label>
           <input 
             type="text" 
             required
             value={formData.name || ""}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             placeholder="Como no seu documento"
             className="w-full h-12 px-4 rounded-xl border transition-all text-sm outline-none"
             style={{ 
               backgroundColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
               borderColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.1)' : '#D2D2D7',
               color: styles.text
             }}
           />
         </div>
       )}
       {project.collect_cpf && (
         <div className="space-y-1.5">
           <label className="text-xs font-semibold ml-1" style={{ color: styles.muted }}>CPF</label>
           <input 
             type="text" 
             required
             value={formData.cpf || ""}
             onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
             placeholder="000.000.000-00"
             className="w-full h-12 px-4 rounded-xl border transition-all text-sm outline-none"
             style={{ 
               backgroundColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
               borderColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.1)' : '#D2D2D7',
               color: styles.text
             }}
           />
         </div>
       )}
       {project.collect_email && (
         <div className="space-y-1.5">
           <label className="text-xs font-semibold ml-1" style={{ color: styles.muted }}>E-mail</label>
           <input 
             type="email" 
             required
             value={formData.email || ""}
             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
             placeholder="seu@email.com"
             className="w-full h-12 px-4 rounded-xl border transition-all text-sm outline-none"
             style={{ 
               backgroundColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
               borderColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.1)' : '#D2D2D7',
               color: styles.text
             }}
           />
         </div>
       )}
       {project.collect_phone && (
         <div className="space-y-1.5">
           <label className="text-xs font-semibold ml-1" style={{ color: styles.muted }}>Telefone</label>
           <input 
             type="tel" 
             required
             value={formData.phone || ""}
             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
             placeholder="(00) 00000-0000"
             className="w-full h-12 px-4 rounded-xl border transition-all text-sm outline-none"
             style={{ 
               backgroundColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
               borderColor: theme.template === 'dark-premium' ? 'rgba(255,255,255,0.1)' : '#D2D2D7',
               color: styles.text
             }}
           />
         </div>
       )}
 
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl font-bold text-lg transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-black/5"
          style={{ backgroundColor: styles.button, color: styles.buttonText }}
        >
          {loading ? (
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
        
        {loading && (
          <p className="text-[11px] font-medium text-center animate-pulse mt-2" style={{ color: styles.accent }}>
            Aguarde, estamos preparando seu pagamento com segurança.
          </p>
        )}
 
        {content.securePaymentText !== null && (
           <div className="flex items-center justify-center gap-1.5 mt-4 opacity-60">
             <Lock size={12} style={{ color: styles.muted }} />
             <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: styles.muted }}>
               {content.securePaymentText || "Pagamento 100% Seguro & Encriptado"}
             </span>
           </div>
        )}
      </form>
   );
}
