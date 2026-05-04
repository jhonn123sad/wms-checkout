/**
 * CHECKOUT PAGE CONTENT - DESIGN BASE 01 (PREMIUM DARK)
 * NÃO ALTERAR O FLUXO DE PAGAMENTO OU PERSISTÊNCIA AO MODIFICAR O DESIGN.
 * Rota: /c/:slug | Tabela: public.checkouts | Pix não depende de campos.
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MediaDisplay, MediaValue } from "@/components/public/MediaDisplay";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, Zap, Lock, CreditCard, ChevronRight, Star } from "lucide-react";

interface CheckoutPageContentProps {
  checkout: any;
}

import { InlinePixPanel } from "../checkout/InlinePixPanel";
import { ReceitasPraticasCheckout } from "./designs/ReceitasPraticasCheckout";

export function CheckoutPageContent({ checkout }: CheckoutPageContentProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("waiting_payment");
  const [isPolling, setIsPolling] = useState(false);

  // Polling logic for payment status
  useEffect(() => {
    if (!isPolling || !paymentData?.orderId || !paymentData?.accessToken || paymentStatus === 'paid') return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-order-status", {
          body: { 
            orderId: paymentData.orderId, 
            token: paymentData.accessToken 
          },
          method: 'POST'
        });

        if (!error && data?.status === 'paid') {
          setPaymentStatus('paid');
          setIsPolling(false);
          toast.success("Pagamento confirmado!");
          
          if (data.thank_you_url) {
            setTimeout(() => {
              window.location.href = data.thank_you_url;
            }, 1500);
          }
        }
      } catch (err) {
        console.error("[Checkout Polling] Erro:", err);
      }
    };

    const interval = setInterval(checkStatus, 7000);
    return () => clearInterval(interval);
  }, [isPolling, paymentData, paymentStatus]);

  /**
   * SUBMIT PIX (VALIDADO)
   * Envia o payload mínimo necessário para create-pix.
   * NÃO ALTERAR ESTE FLUXO AO MODIFICAR O DESIGN.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Checkout Pix] submit iniciado");
    console.log("[Checkout Pix] checkout", checkout);

    const fields = (checkout.checkout_fields || [])
      .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
    
    console.log("[Checkout Pix] activeFields", fields);

    // Dynamic validation for active & required fields
    for (const field of fields) {
      if (field.required && !formData[field.field_name]?.trim()) {
        return toast.error(`Por favor, preencha o campo ${field.field_label}`);
      }
    }

    setLoading(true);

    const payload = {
      checkout_slug: checkout.slug,
      customer_name: (formData.customer_name || "").trim() || null,
      customer_email: (formData.customer_email || "").trim() || null,
      customer_phone: (formData.customer_phone || "").trim() || null,
      customer_cpf: (formData.customer_cpf || "").trim() ? (formData.customer_cpf || "").replace(/\D/g, "") : null,
      form_data: formData, // Send everything for metadata
    };

    console.log("[Checkout Pix] payload enviado:", payload);

    try {
      // 1. Save lead (optional)
      await supabase.from("checkout_leads").insert({
        checkout_id: checkout.id,
        data: formData,
      });

      // 2. Invoke real payment function
      const { data, error: invokeError } = await supabase.functions.invoke("create-pix", {
        body: payload,
      });

      console.log("[Checkout Pix] resposta create-pix", { data, invokeError });

      if (invokeError) {
        let errorMessage = invokeError.message;
        try {
          const errorContext = (invokeError as any).context;
          if (errorContext) {
            const body = await errorContext.json();
            if (body && body.error) {
              errorMessage = `Erro: ${body.error}${body.details ? ` (${JSON.stringify(body.details)})` : ""}`;
            }
          }
        } catch (e) {
          console.error("[Checkout Pix] Erro ao processar resposta de erro:", e);
        }
        throw new Error(errorMessage);
      }

      if (!data || data.error) {
        throw new Error(data?.error || "Erro ao gerar pagamento");
      }

      setPaymentData(data);
      setIsPolling(true);
      toast.success("Pix gerado com sucesso!");
    } catch (error: any) {
      console.error("[Checkout Pix] erro create-pix:", error);
      toast.error(error.message || "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPayment = () => {
    setPaymentData(null);
    setPaymentStatus("waiting_payment");
    setIsPolling(false);
  };

  const mediaData = checkout.media_json ? (checkout.media_json as unknown as MediaValue) : (checkout.media_url ? {
    url: checkout.media_url,
    type: (checkout.media_type as any) || "image",
    source: "external_url",
  } : null);

  const layoutConfig = checkout.layout_config || {};
  const templateKey = layoutConfig.template_key || (checkout.slug === "receitas-praticas" ? "premium_editorial_v1" : "base");

  if (templateKey === "premium_editorial_v1" || checkout.slug === "receitas-praticas") {
    return (
      <ReceitasPraticasCheckout 
        checkout={checkout}
        formData={formData}
        loading={loading}
        paymentData={paymentData}
        paymentStatus={paymentStatus}
        mediaData={mediaData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleResetPayment={handleResetPayment}
        InlinePixPanel={InlinePixPanel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#22c55e_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
          
          {/* Coluna Esquerda: Produto e Mídia */}
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                <Zap size={14} className="fill-current" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Acesso Imediato</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                  {checkout.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                  {checkout.subtitle}
                </p>
              </div>
            </div>

            {/* Media Display Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-[#141414] shadow-2xl">
                {mediaData ? (
                  <MediaDisplay media={mediaData} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-12 h-12 text-white/10" />
                      <p className="text-gray-600 font-medium text-sm uppercase tracking-wider">Checkout Seguro</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {[
                { icon: <ShieldCheck className="text-green-500" size={20} />, title: "Pagamento Seguro", desc: "Criptografia de ponta" },
                { icon: <Zap className="text-green-500" size={20} />, title: "Entrega Rápida", desc: "Acesso via e-mail" },
                { icon: <Star className="text-green-500" size={20} />, title: "Produto Premium", desc: "Qualidade garantida" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Logos Desktop Only */}
            <div className="hidden lg:flex items-center gap-8 opacity-20 grayscale pt-8">
              <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-6 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-5 object-contain" />
            </div>
          </div>

          {/* Coluna Direita: Card de Compra */}
          <div className="w-full lg:sticky lg:top-12 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <Card className="overflow-hidden bg-[#111111]/80 backdrop-blur-2xl border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2.5rem] relative">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500/10 blur-[100px] pointer-events-none"></div>
              
              <div className="p-8 md:p-10 relative z-10">
                {/* Header do Card / Preço */}
                <div className="mb-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Investimento Único</span>
                    <div className="flex items-baseline gap-2">
                      <div className="text-5xl font-black text-white tracking-tighter">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(checkout.price)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                  
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      {paymentData ? "Escaneie o QR Code" : "Dados de Acesso"}
                      <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
                    </h2>
                    <p className="text-[10px] text-gray-500">
                      {paymentData 
                        ? "O seu acesso será liberado imediatamente após o pagamento." 
                        : "Preencha seus dados corretamente para receber o acesso."}
                    </p>
                  </div>
                </div>

                {paymentData ? (
                  <div className="animate-in zoom-in-95 duration-500">
                    <InlinePixPanel 
                      paymentData={paymentData}
                      paymentStatus={paymentStatus}
                      onReset={handleResetPayment}
                      formatPrice={(cents) => new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(cents / 100)}
                      theme={{
                        button: "#22c55e",
                        buttonText: "#000000",
                        accent: "#22c55e",
                        card: "transparent"
                      }}
                    />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {/**
                        * FORM CAMPOS (VALIDADO)
                        * Renderiza apenas campos onde active=true.
                        */}
                      {(() => {
                        const fields = (checkout.checkout_fields || [])
                          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
                          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
                        
                        if (fields.length === 0) return null;

                        return fields.map((field: any) => (
                          <div key={field.id || field.field_name} className="group space-y-2">
                            <Label 
                              htmlFor={field.field_name} 
                              className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-green-500 transition-colors"
                            >
                              {field.field_label}
                              {field.required && <span className="text-green-500 ml-1 opacity-50">*</span>}
                            </Label>
                            <Input
                              id={field.field_name}
                              type={field.field_type?.replace("hidden:", "") || "text"}
                              placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                              required={field.required}
                              className="h-14 bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05] focus:ring-1 focus:ring-green-500/30 focus:border-green-500/50 transition-all rounded-2xl placeholder:text-gray-700 text-sm px-6"
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                            />
                          </div>
                        ));
                      })()}
                    </div>

                    <div className="pt-4 space-y-6">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 md:h-20 text-lg font-black bg-green-500 hover:bg-green-400 text-black transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-[0_20px_40px_-12px_rgba(34,197,94,0.4)] relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="relative flex items-center justify-center gap-3">
                          {loading ? (
                            <span className="animate-pulse tracking-tight">Gerando Pix...</span>
                          ) : (
                            <>
                              <span className="tracking-tight italic">{checkout.cta_text || "GARANTIR ACESSO AGORA"}</span>
                              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </Button>
                      
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                          <Lock className="w-3 h-3 text-green-500" />
                          <span>Pagamento 100% Seguro</span>
                        </div>
                        
                        {/* Footer Logos Mobile */}
                        <div className="flex lg:hidden items-center gap-6 opacity-20 grayscale">
                          <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-2.5 object-contain" />
                          <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-4 object-contain" />
                          <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-3.5 object-contain" />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          </div>

        </div>
      </main>

      <footer className="w-full py-12 text-center relative z-10">
        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">Checkout Protegido via Pushin Pay</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0a0a0a;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </div>
  );
}
