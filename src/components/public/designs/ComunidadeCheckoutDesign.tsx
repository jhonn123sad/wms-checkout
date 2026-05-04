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
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const isPaid = paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Background Pro */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 py-8 lg:py-16 min-h-screen flex flex-col items-center">
        
        {/* Top Branding / Badge */}
        <div className="mb-8 lg:mb-12 animate-in fade-in slide-in-from-top-4 duration-700 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl group transition-all hover:bg-white/[0.05]">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-[#050505] bg-indigo-500 flex items-center justify-center overflow-hidden">
                   <Users className="w-3 h-3 text-white" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">+500 membros ativos</span>
            <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 w-full items-start">
          
          {/* LADO ESQUERDO: Proposta de Valor */}
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                {checkout.title}
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                {checkout.subtitle}
              </p>
            </div>

            {/* Media Container - Cinematic Style */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                <MediaDisplay media={mediaData} />
                
                {/* Floating Content Label */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                  <Video className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Acesso Exclusivo</span>
                </div>
              </div>
            </div>

            {/* Feature List - Horizontal & Compact */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: <Zap className="text-indigo-400" />, text: "Acesso Imediato" },
                { icon: <Award className="text-indigo-400" />, text: "Certificado Oficial" },
                { icon: <Globe className="text-indigo-400" />, text: "Networking VIP" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="shrink-0">{React.cloneElement(item.icon as React.ReactElement, { size: 14 })}</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: Bloco de Compra Unificado */}
          <div className="lg:sticky lg:top-8 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
            <div className="bg-[#0D0D0F] border border-white/[0.08] rounded-[2rem] p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group/card">
              {/* Inner Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] pointer-events-none"></div>
              
              {paymentData ? (
                /* Pix State - Compact Integration */
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="text-center space-y-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border transition-colors duration-500 ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                      <div className={`h-1 w-1 rounded-full ${isPaid ? 'bg-green-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                        {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Finalize seu acesso</h3>
                  </div>

                  <div className="relative flex justify-center py-2">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full"></div>
                    <div className="relative w-[180px] h-[180px] bg-white p-3 rounded-2xl shadow-2xl flex items-center justify-center">
                      {paymentData.qr_code_base64 ? (
                        <img src={paymentData.qr_code_base64} alt="QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      )}
                      
                      {isPaid && (
                        <div className="absolute inset-0 bg-green-500/95 flex flex-col items-center justify-center rounded-2xl animate-in fade-in zoom-in duration-500">
                          <Check className="text-white w-10 h-10" strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(paymentData.qr_code);
                        toast.success("Código copiado!");
                      }}
                      className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl uppercase tracking-widest text-xs italic"
                    >
                      Copiar Código Pix
                    </Button>
                    
                    <button 
                      onClick={handleResetPayment}
                      className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em]"
                    >
                      <RefreshCw size={12} /> Alterar dados
                    </button>
                  </div>
                </div>
              ) : (
                /* Buy State */
                <div className="space-y-8">
                  {/* Price Header */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] block">Inscrição Única</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkout.price)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/[0.05]"></div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        {activeFields.map((field: any) => (
                          <div key={field.id} className="space-y-2 group">
                            <Label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black ml-1 group-focus-within:text-indigo-400 transition-colors">
                              {field.field_label}
                              {field.required && <span className="text-indigo-500/50 ml-1">*</span>}
                            </Label>
                            <Input
                              className="h-14 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-white placeholder:text-zinc-800 text-sm px-5"
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                              required={field.required}
                              placeholder={`Seu ${field.field_label.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full h-16 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-base rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_12px_24px_-8px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="uppercase tracking-widest italic text-xs">Gerando Pix...</span>
                          </div>
                        ) : (
                          <>
                            <span className="uppercase tracking-tight italic">{checkout.cta_text || "ASSINAR AGORA"}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center gap-6 pt-2 border-t border-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                      <Lock size={10} className="text-zinc-700" /> Seguro
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                      <ShieldCheck size={10} className="text-zinc-700" /> Criptografado
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <p className="mt-8 text-center text-[8px] font-bold text-zinc-800 uppercase tracking-[0.5em] opacity-40">
              Ambiente de Pagamento Protegido
            </p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
}

