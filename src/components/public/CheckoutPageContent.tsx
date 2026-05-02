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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit validation for required Pix fields
    const projectSlug = checkout.slug;
    const name = (formData.customer_name || formData.name || formData.nome || "").trim();
    const email = (formData.customer_email || formData.email || formData.email_address || "").trim();
    const phone = (formData.customer_phone || formData.phone || formData.whatsapp || "").trim();
    const cpf = (formData.customer_cpf || formData.cpf || "").trim();

    if (!name) return toast.error("Por favor, preencha seu nome completo.");
    if (!email) return toast.error("Por favor, preencha seu e-mail.");
    if (!email.includes("@")) return toast.error("Por favor, informe um e-mail válido.");
    if (!phone) return toast.error("Por favor, preencha seu telefone/WhatsApp.");
    if (!cpf) return toast.error("Por favor, preencha seu CPF.");

    setLoading(true);

    console.log("[Checkout] Iniciando pagamento para:", { 
      project_slug: projectSlug,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      customer_cpf: cpf.length > 5 ? `${cpf.substring(0, 3)}.***.***-${cpf.slice(-2)}` : "invalid"
    });

    try {
      // 1. Save lead (optional but good for tracking)
      await supabase.from("checkout_leads").insert({
        checkout_id: checkout.id,
        data: formData,
      });

      // 2. Invoke real payment function with the exact payload expected by create-pix
      const { data, error: invokeError } = await supabase.functions.invoke("create-pix", {
        body: {
          project_slug: projectSlug,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          customer_cpf: cpf,
        },
      });

      if (invokeError) {
        // Try to parse error from Edge Function response
        let errorMessage = invokeError.message;
        try {
          // FunctionsHttpError might have more context
          const errorContext = (invokeError as any).context;
          if (errorContext) {
            const body = await errorContext.json();
            if (body && body.error) {
              errorMessage = `Erro: ${body.error}${body.details ? ` (${JSON.stringify(body.details)})` : ""}`;
            }
          }
        } catch (e) {
          console.error("[Checkout] Erro ao processar resposta de erro:", e);
        }
        throw new Error(errorMessage);
      }

      if (!data || data.error) {
        throw new Error(data?.error || "Erro ao gerar pagamento");
      }

      console.log("[Checkout] Pagamento gerado:", { orderId: data.orderId });
      setPaymentData(data);
      setIsPolling(true);
      toast.success("Pix gerado com sucesso!");
    } catch (error: any) {
      console.error("[Checkout] Erro no submit:", error);
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
        {/* Coluna Esquerda: Mídia e Info */}
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#141414]/50 p-4 rounded-2xl border border-[#222]/50">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Acesso Vitalício por apenas</span>
            <div className="text-3xl md:text-4xl font-black text-green-500 tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(checkout.price)}
            </div>
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
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">
                {paymentData ? "Pagamento via Pix" : "Finalize sua inscrição"}
              </h2>
              <div className="h-1 w-10 bg-green-500 rounded-full" />
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
                  {checkout.checkout_fields
                    ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
                    .map((field: any) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.field_name} className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                          {field.field_label}
                          {field.required && <span className="text-green-500 ml-1">*</span>}
                        </Label>
                        <Input
                          id={field.field_name}
                          type={field.field_type}
                          placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                          required={field.required}
                          className="h-12 bg-[#0a0a0a] border-[#222] text-white focus:ring-1 focus:ring-green-500/50 focus:border-green-500 transition-all rounded-xl placeholder:text-gray-700 text-sm"
                          value={formData[field.field_name] || ""}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                        />
                      </div>
                    ))}
                </div>

                <div className="pt-2 space-y-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 md:h-16 text-lg md:text-xl font-black bg-green-500 hover:bg-green-600 text-black transition-all transform hover:scale-[1.01] active:scale-[0.99] rounded-xl shadow-[0_10px_30px_rgba(34,197,94,0.2)]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Processando...</span>
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
