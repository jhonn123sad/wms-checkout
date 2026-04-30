 /**
  * CORE DE PAGAMENTO — NÃO ALTERAR SEM TESTE DE REGRESSÃO
  * Responsável pela coleta de dados do cliente e início do fluxo de pagamento.
  */
 import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

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

   const theme: any = project.theme_json || {};
  const bgColor = theme.backgroundColor || "#F5F5F7";
  const primaryColor = theme.primaryColor || "#000000";
  const btnColor = theme.buttonColor || "#000000";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6" style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-8 md:p-10 flex flex-col items-center">
        
        {/* Logo if exists */}
        {theme.logoUrl && (
          <img src={theme.logoUrl} alt={project.name} className="h-12 mb-6 object-contain" />
        )}

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-full mb-6">
          <ShieldCheck size={12} className="text-[#86868B]" />
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Pagamento seguro</span>
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-2" style={{ color: primaryColor }}>
          {project.headline || "Finalize seu acesso"}
        </h1>
        <p className="text-[#86868B] text-sm text-center mb-8 leading-relaxed">
          {project.subheadline || "Pague com Pix e receba a liberação rápida."}
        </p>

        {/* Product Box */}
        <div className="w-full bg-[#F5F5F7] rounded-2xl p-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-base">{offer.name}</h2>
            <p className="text-xs text-[#86868B] mt-0.5">{offer.description}</p>
          </div>
          <div className="text-lg font-bold">{formattedPrice}</div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleGeneratePix} className="w-full space-y-4 mb-8">
          {project.collect_name && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#86868B] ml-1">Nome completo</label>
              <input 
                type="text" 
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Como no seu documento"
                className="w-full h-12 px-4 rounded-xl border border-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
              />
            </div>
          )}
          {project.collect_cpf && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#86868B] ml-1">CPF</label>
              <input 
                type="text" 
                required
                value={formData.cpf || ""}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full h-12 px-4 rounded-xl border border-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
              />
            </div>
          )}
          {project.collect_email && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#86868B] ml-1">E-mail</label>
              <input 
                type="email" 
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-xl border border-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
              />
            </div>
          )}
          {project.collect_phone && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#86868B] ml-1">Telefone</label>
              <input 
                type="tel" 
                required
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full h-12 px-4 rounded-xl border border-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white h-14 rounded-xl font-semibold text-base transition-transform active:scale-[0.98] mb-6 disabled:opacity-50 flex items-center justify-center"
            style={{ backgroundColor: btnColor }}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Gerar Pix"}
          </button>
        </form>

        {project.legal_text && (
          <div className="w-full bg-[#F5F5F7] border border-[#D2D2D7]/50 rounded-xl p-4">
            <p className="text-[12px] text-[#86868B] text-center leading-relaxed italic">
              {project.legal_text}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-[500px] mt-10 px-4">
        <p className="text-[10px] md:text-[11px] text-[#86868B] text-center leading-relaxed">
          A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor.
        </p>
      </div>
    </div>
  );
}
