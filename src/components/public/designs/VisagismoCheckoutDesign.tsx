import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Eye, 
  Search, 
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaDisplay } from "@/components/public/MediaDisplay";

interface DesignProps {
  checkout: any;
  formData: Record<string, string>;
  loading: boolean;
  paymentData: any;
  paymentStatus: string;
  mediaData: any;
  handleSubmit: (e: React.FormEvent) => Promise<any>;
  handleInputChange: (name: string, value: string) => void;
  handleResetPayment: () => void;
  InlinePixPanel: any;
}

export function VisagismoCheckoutDesign({
  checkout,
  formData,
  loading,
  paymentData,
  paymentStatus,
  mediaData,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
  InlinePixPanel
}: DesignProps) {
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent"></div>
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-indigo-200/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-pink-100/30 blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} /> Inteligência Artificial + Estilo
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">{checkout.title}</h1>
          <p className="text-base text-zinc-500 max-w-2xl font-medium">{checkout.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="space-y-8">
            <div className="relative group p-2 bg-white rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-indigo-50">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-100">
                <MediaDisplay media={mediaData} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <Search className="text-indigo-500" />, title: "Análise Facial", desc: "Mapeamento completo via IA" },
                { icon: <CheckCircle2 className="text-indigo-500" />, title: "Resultado Prático", desc: "Dicas prontas para aplicar" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-indigo-50 shadow-sm">
                  <div className="p-2 bg-indigo-50 rounded-lg h-fit">{item.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-50 shadow-2xl shadow-indigo-500/10">
              {paymentData ? (
                <InlinePixPanel 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  formatPrice={(cents: number) => `R$ ${(cents / 100).toFixed(2)}`}
                  theme={{ 
                    button: "#6366f1", 
                    accent: "#6366f1",
                    buttonText: "#ffffff",
                    card: "white" 
                  }}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center pb-6 border-b border-zinc-100">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Transformação Completa</span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-lg font-bold text-indigo-600">R$</span>
                      <span className="text-5xl font-black tracking-tighter text-zinc-900">{checkout.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activeFields.map((field: any) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-1">{field.field_label}</Label>
                        <Input
                          className="h-14 bg-zinc-50 border-zinc-100 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500/50"
                          value={formData[field.field_name] || ""}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                          required={field.required}
                          placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-18 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-600/20 transition-all hover:translate-y-[-2px]">
                    {loading ? "GERANDO ACESSO..." : checkout.cta_text.toUpperCase()}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    <Lock size={12} className="text-indigo-400" /> Transação Criptografada
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
