import { useState } from "react";
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

export function CheckoutPageContent({ checkout }: CheckoutPageContentProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("checkout_leads").insert({
        checkout_id: checkout.id,
        data: formData,
      });

      if (error) throw error;

      toast.success("Dados enviados com sucesso!");
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar formulário");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
        <Card className="max-w-md w-full p-8 bg-[#141414] border-[#222] text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-white">Sucesso!</h2>
          <p className="text-gray-400 mb-8 text-lg">Seus dados foram processados. Em breve você receberá as instruções de acesso.</p>
          <Button 
            className="w-full py-6 bg-green-500 hover:bg-green-600 text-black font-bold text-lg"
            onClick={() => setSubmitted(false)}
          >
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

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
              <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Finalize sua inscrição</h2>
              <div className="h-1 w-10 bg-green-500 rounded-full" />
            </div>

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
