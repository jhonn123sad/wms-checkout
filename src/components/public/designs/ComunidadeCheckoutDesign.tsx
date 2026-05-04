import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Users, 
  Video, 
  Globe,
  Sparkles,
  Loader2
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

export function ComunidadeCheckoutDesign({
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
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                <Users size={14} /> Comunidade Premium
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">{checkout.title}</h1>
              <p className="text-lg text-gray-400 max-w-2xl">{checkout.subtitle}</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                <MediaDisplay media={mediaData} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Video className="text-purple-500" />, title: "Conteúdo Exclusivo" },
                { icon: <Users className="text-purple-500" />, title: "Networking" },
                { icon: <Zap className="text-purple-500" />, title: "Acesso Imediato" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  {item.icon}
                  <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:sticky lg:top-12">
            <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              {paymentData ? (
                <InlinePixPanel 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  formatPrice={(cents: number) => `R$ ${(cents / 100).toFixed(2)}`}
                  theme={{ 
                    button: "#a855f7", 
                    accent: "#a855f7",
                    card: "transparent"
                  }}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1 text-center lg:text-left">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Acesso Vitalício</span>
                    <div className="text-5xl font-black">R$ {checkout.price.toFixed(2)}</div>
                  </div>

                  <div className="space-y-4">
                    {activeFields.map((field: any) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">{field.field_label}</Label>
                        <Input
                          className="h-14 bg-white/5 border-white/5 rounded-2xl focus:ring-purple-500/50"
                          value={formData[field.field_name] || ""}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                          required={field.required}
                          placeholder={`Seu ${field.field_label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-18 bg-purple-600 hover:bg-purple-500 text-white font-black text-lg rounded-2xl transition-all hover:scale-[1.02]">
                    {loading ? "GERANDO PIX..." : checkout.cta_text.toUpperCase()}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Lock size={12} className="text-purple-500" /> Pagamento 100% Seguro
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
