import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Users, 
  Video, 
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Award,
  Globe,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { toast } from "sonner";

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
}: DesignProps) {
  console.log("[ComunidadeCheckoutDesign] COMPONENTE RENDERIZADO");

  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const isPaid = paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-red-600 text-[#FAFAFA] font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="w-full bg-red-800 py-4 text-center border-b-4 border-white z-[9999] relative">
        <h1 className="text-white text-3xl font-black uppercase tracking-tighter">
          TESTE COMPONENTE COMUNIDADE ATIVO
        </h1>
      </div>

      {/* Background Pro */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 py-8 lg:py-16 min-h-screen flex flex-col items-center">
        
        {/* Top Branding / Badge */}
        <div className="mb-8 lg:mb-12 animate-in fade-in slide-in-from-top-4 duration-700 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.1] border border-white/20 backdrop-blur-md shadow-2xl group transition-all">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-red-600 bg-white flex items-center justify-center overflow-hidden">
                   <Users className="w-3 h-3 text-red-600" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">+500 membros ativos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 w-full items-start">
          
          {/* LADO ESQUERDO: Proposta de Valor */}
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                {checkout.title}
              </h1>
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                {checkout.subtitle}
              </p>
            </div>

            {/* Media Container */}
            <div className="relative group">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black/20 backdrop-blur-xl shadow-2xl">
                <MediaDisplay media={mediaData} />
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Bloco de Compra */}
          <div className="lg:sticky lg:top-8 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
            <div className="bg-red-900/50 border border-white/20 rounded-[2rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              {paymentData ? (
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-white uppercase italic text-center">TESTE PIX ATIVO</h3>
                  <div className="flex justify-center">
                    <div className="w-[180px] h-[180px] bg-white p-3 rounded-2xl flex items-center justify-center">
                      {paymentData.qr_code_base64 && (
                        <img src={paymentData.qr_code_base64} alt="QR Code" className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-1">
                    <span className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkout.price)}
                    </span>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Button type="submit" className="w-full h-16 bg-white text-red-600 hover:bg-zinc-100 font-black text-base rounded-2xl">
                      {checkout.cta_text || "TESTE COMPRA"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
