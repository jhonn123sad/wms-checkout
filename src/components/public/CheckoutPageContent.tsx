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

  const mediaData = checkout.media_url
    ? {
        url: checkout.media_url,
        type: (checkout.media_type as any) || "image",
        source: "external_url",
      }
    : (checkout.media_json as unknown as MediaValue);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:h-screen lg:overflow-hidden font-sans">
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 gap-6 lg:gap-12">
        {/* Coluna Esquerda: Mídia e Info */}
        <div className="flex-1 flex flex-col justify-center min-h-0 space-y-6 lg:space-y-8">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {checkout.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
              {checkout.subtitle}
            </p>
          </div>

          <div className="relative group rounded-3xl overflow-hidden border border-[#222] bg-[#141414] shadow-2xl flex-shrink min-h-0 max-h-[40vh] lg:max-h-[55vh] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full aspect-video flex items-center justify-center">
              <MediaDisplay media={mediaData} />
            </div>
            {!mediaData && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                <p className="text-gray-600 font-medium">Sem prévia disponível</p>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Acesso Vitalício por</span>
            <div className="text-4xl md:text-5xl font-black text-green-500 tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(checkout.price)}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Formulário */}
        <div className="w-full lg:w-[450px] flex flex-col justify-center shrink-0">
          <Card className="p-6 md:p-8 bg-[#141414] border-[#222] shadow-2xl rounded-3xl">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Finalize sua inscrição</h2>
              <div className="h-1 w-12 bg-green-500 rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {checkout.checkout_fields
                  ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map((field: any) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.field_name} className="text-sm font-medium text-gray-400 ml-1">
                        {field.field_label}
                        {field.required && <span className="text-green-500 ml-1">*</span>}
                      </Label>
                      <Input
                        id={field.field_name}
                        type={field.field_type}
                        placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                        required={field.required}
                        className="h-12 bg-[#0a0a0a] border-[#222] text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all rounded-xl placeholder:text-gray-700"
                        value={formData[field.field_name] || ""}
                        onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                      />
                    </div>
                  ))}
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 text-xl font-black bg-green-500 hover:bg-green-600 text-black transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]"
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
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <ShieldCheck className="w-4 h-4 text-green-500/50" />
                  <span>Pagamento 100% Seguro & Criptografado</span>
                </div>
              </div>
            </form>
          </Card>
          
          <div className="mt-6 flex justify-center gap-8 opacity-40 grayscale pointer-events-none px-4">
            <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-6 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-5 object-contain" />
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
