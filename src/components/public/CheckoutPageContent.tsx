import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MediaDisplay, MediaValue } from "@/components/public/MediaDisplay";
import { toast } from "sonner";

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
        <Card className="max-w-md w-full p-8 bg-[#1a1a1a] border-[#333] text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Sucesso!</h2>
          <p className="text-gray-400 mb-6">Seus dados foram salvos com sucesso. Em breve entraremos em contato.</p>
          <Button 
            variant="outline" 
            className="border-[#333] text-white hover:bg-[#333]"
            onClick={() => setSubmitted(false)}
          >
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Card className="overflow-hidden border-[#333] bg-[#1a1a1a] shadow-2xl min-h-[200px]">
            <MediaDisplay
              media={
                checkout.media_url
                  ? {
                      url: checkout.media_url,
                      type: checkout.media_type as any || "image",
                      source: "external_url",
                    }
                  : (checkout.media_json as unknown as MediaValue)
              }
            />
          </Card>
          
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-white">
              {checkout.title}
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              {checkout.subtitle}
            </p>
            <div className="text-3xl font-bold text-green-500">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(checkout.price)}
            </div>
          </div>
        </div>

        <Card className="p-8 bg-[#1a1a1a] border-[#333] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {checkout.checkout_fields
                ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
                .map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.field_name} className="text-gray-300">
                      {field.field_label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.field_name}
                      type={field.field_type}
                      placeholder={`Seu ${field.field_label.toLowerCase()}...`}
                      required={field.required}
                      className="bg-[#0a0a0a] border-[#333] text-white focus:ring-green-500 focus:border-green-500"
                      value={formData[field.field_name] || ""}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                    />
                  </div>
                ))}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg font-bold bg-[#22c55e] hover:bg-[#16a34a] text-black transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Processando..." : checkout.cta_text}
            </Button>
            
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
              🔒 Pagamento Seguro & Confirmado
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}