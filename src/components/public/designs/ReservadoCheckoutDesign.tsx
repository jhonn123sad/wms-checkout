import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Eye, 
  Crown, 
  Sparkles,
  Loader2,
  CheckCircle2,
  Target
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

export function ReservadoCheckoutDesign({
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
    <div className="min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1a150a_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1000px] mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/30 border border-amber-900/50 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
            <Crown size={14} /> Acesso Exclusivo
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent italic">{checkout.title}</h1>
          <p className="text-lg text-zinc-500 max-w-xl font-medium tracking-wide italic">{checkout.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="relative group aspect-square max-w-[400px] mx-auto lg:mx-0">
              <div className="absolute -inset-4 bg-amber-500/5 rounded-full blur-[60px] opacity-50"></div>
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-amber-900/20 bg-zinc-900 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <MediaDisplay media={mediaData} />
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Target className="text-amber-500" />, title: "Conteúdo Reservado" },
                { icon: <ShieldCheck className="text-amber-500" />, title: "Privacidade Total" },
                { icon: <Zap className="text-amber-500" />, title: "Liberação Instantânea" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="p-3 bg-amber-950/20 rounded-full border border-amber-900/30 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-[#121212] p-10 rounded-[3rem] border border-amber-900/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl"></div>
              
              {paymentData ? (
                <InlinePixPanel 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  formatPrice={(cents: number) => `R$ ${(cents / 100).toFixed(2)}`}
                  theme={{ 
                    button: "#d97706", 
                    accent: "#d97706",
                    buttonText: "#ffffff",
                    card: "transparent"
                  }}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-black tracking-tighter text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkout.price)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {activeFields.map((field: any) => (
                      <div key={field.id} className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black ml-2">{field.field_label}</Label>
                        <Input
                          className="h-14 bg-white/5 border-amber-900/10 rounded-2xl focus:ring-amber-500/20 focus:border-amber-500/40 text-white px-6"
                          value={formData[field.field_name] || ""}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                          required={field.required}
                          placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-20 bg-amber-600 hover:bg-amber-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-amber-950/50 transition-all hover:brightness-110">
                    {loading ? "GERANDO..." : checkout.cta_text.toUpperCase()}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                    <Lock size={12} className="text-amber-800" /> Área Criptografada
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
