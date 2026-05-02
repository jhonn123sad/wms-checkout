/**
 * CHECKOUT PAGE CONTENT (VALIDADO)
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
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface CheckoutPageContentProps {
  checkout: any;
}

import { InlinePixPanel } from "../checkout/InlinePixPanel";

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:min-h-screen lg:h-auto font-sans overflow-x-hidden">
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1180px] mx-auto p-4 md:p-6 lg:p-10 gap-8 lg:gap-16 items-center lg:items-start lg:justify-center">
        {/* Coluna Esquerda: Mídia */}
        <div className="w-full lg:flex-1 flex flex-col space-y-6 lg:space-y-8 min-w-0">
          <div className="space-y-4 lg:space-y-5">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-black tracking-tight leading-tight text-white break-words">
              {checkout.title}
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed break-words">
              {checkout.subtitle}
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#222] bg-[#141414] shadow-2xl">
            {mediaData ? (
              <MediaDisplay media={mediaData} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                <p className="text-gray-600 font-medium text-sm uppercase tracking-wider">Sem prévia disponível</p>
              </div>
            )}
          </div>
          
          <div className="hidden lg:flex items-center gap-6 opacity-40 grayscale pointer-events-none pt-4">
            <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-6 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-5 object-contain" />
          </div>
        </div>

        {/* Coluna Direita: Formulário */}
        <div className="w-full lg:w-[420px] shrink-0 min-w-0">
          <Card className="p-6 md:p-8 bg-[#141414] border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl border-t-green-500/20">
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valor do investimento</span>
                <div className="text-3xl font-black text-green-500 tracking-tighter">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(checkout.price)}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-tight">
                  {paymentData ? "Pagamento via Pix" : "Finalize sua inscrição"}
                </h2>
                <div className="h-1 w-10 bg-green-500 rounded-full" />
              </div>
            </div>

            {paymentData ? (
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
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  {/**
                    * FORM CAMPOS (VALIDADO)
                    * Renderiza apenas campos onde active=true.
                    * Required é validado apenas se active=true.
                    */}
                  {(() => {
                    const fields = (checkout.checkout_fields || [])
                      .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
                      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
                    
                    console.log("[Public Fields] campos recebidos", checkout.checkout_fields);
                    console.log("[Public Fields] campos ativos", fields);

                    if (fields.length === 0) return null;

                    return fields.map((field: any) => (
                      <div key={field.id || field.field_name} className="space-y-2">
                        <Label htmlFor={field.field_name} className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                          {field.field_label}
                          {field.required && <span className="text-green-500 ml-1">*</span>}
                        </Label>
                        <Input
                          id={field.field_name}
                          type={field.field_type?.replace("hidden:", "") || "text"}
                          placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                          required={field.required}
                          className="h-12 bg-[#0a0a0a] border-[#222] text-white focus:ring-1 focus:ring-green-500/50 focus:border-green-500 transition-all rounded-xl placeholder:text-gray-700 text-sm"
                          value={formData[field.field_name] || ""}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                        />
                      </div>
                    ));
                  })()}
                </div>

                <div className="pt-2 space-y-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 md:h-16 text-lg md:text-xl font-black bg-green-500 hover:bg-green-600 text-black transition-all transform hover:scale-[1.01] active:scale-[0.99] rounded-xl shadow-[0_10px_30px_rgba(34,197,94,0.2)]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <span className="animate-pulse">Gerando Pix...</span>
                      </div>
                    ) : (
                      checkout.cta_text || "GARANTIR MEU ACESSO"
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-black opacity-80">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Ambiente 100% Seguro</span>
                  </div>
                </div>
              </form>
            )}
          </Card>
          
          <div className="mt-8 flex lg:hidden justify-center gap-6 opacity-30 grayscale pointer-events-none px-4">
            <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-3 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-5 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-4 object-contain" />
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}} />
    </div>
  );
}
