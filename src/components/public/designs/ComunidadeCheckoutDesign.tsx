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
  Loader2,
  CheckCircle2,
  Layout
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
    <div className="min-h-screen bg-[#020203] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background sofisticado com gradientes suaves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1240px] mx-auto px-4 py-8 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20 items-start">
          
          {/* LADO ESQUERDO: Conteúdo e Mídia */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Sparkles size={14} className="animate-pulse" /> Comunidade Premium
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1] bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                  {checkout.title}
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
                  {checkout.subtitle}
                </p>
              </div>
            </div>

            {/* Mídia proporcional e elegante */}
            <div className="relative group max-w-[800px]">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/50 shadow-2xl backdrop-blur-sm">
                <MediaDisplay media={mediaData} />
                
                {/* Badge flutuante na mídia */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Acesso Imediato</span>
                </div>
              </div>
            </div>

            {/* Benefícios em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px]">
              {[
                { icon: <Video className="text-cyan-400" size={18} />, title: "Conteúdo Exclusivo", desc: "Aulas e materiais" },
                { icon: <Users className="text-cyan-400" size={18} />, title: "Networking", desc: "Comunidade ativa" },
                { icon: <Layout className="text-cyan-400" size={18} />, title: "Plataforma Moderna", desc: "Experiência premium" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tight font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: Checkout Card */}
          <div className="w-full lg:sticky lg:top-12 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
            <div className="bg-zinc-900/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] relative overflow-hidden group">
              {/* Card Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[60px] pointer-events-none"></div>

              {paymentData ? (
                <div className="relative z-10">
                  <InlinePixPanel 
                    paymentData={paymentData}
                    paymentStatus={paymentStatus}
                    onReset={handleResetPayment}
                    formatPrice={(cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)}
                    theme={{ 
                      button: "#06b6d4", 
                      accent: "#06b6d4",
                      card: "transparent"
                    }}
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  {/* Preço de destaque */}
                  <div className="space-y-2 text-center lg:text-left">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] block ml-1">Valor do Investimento</span>
                    <div className="flex items-baseline justify-center lg:justify-start gap-2">
                      <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkout.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 mt-4 text-zinc-500 font-bold text-[9px] uppercase tracking-widest">
                      <Zap size={12} className="text-cyan-500" /> Pagamento Único • Acesso Vitalício
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>

                  {/* Campos do formulário */}
                  <div className="space-y-5">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 size={12} className="text-cyan-500" />
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">Informações de Acesso</span>
                        </div>
                        {activeFields.map((field: any) => (
                          <div key={field.id} className="space-y-2 group">
                            <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold ml-1 group-focus-within:text-cyan-400 transition-colors">
                              {field.field_label}
                              {field.required && <span className="text-cyan-500 ml-1">*</span>}
                            </Label>
                            <Input
                              className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-700 text-sm px-6"
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                              required={field.required}
                              placeholder={`Seu ${field.field_label.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botão de ação */}
                  <div className="space-y-4 pt-2">
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full h-18 md:h-20 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg rounded-[1.5rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="uppercase tracking-widest italic">Processando...</span>
                          </>
                        ) : (
                          <>
                            <span className="uppercase tracking-tight italic drop-shadow-sm">{checkout.cta_text || "QUERO ENTRAR AGORA"}</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </Button>
                    
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                        <Lock size={12} className="text-cyan-500/50" /> Checkout Seguro
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-cyan-500/50" /> Garantia Total
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            {/* Footer discreto do card */}
            <p className="mt-8 text-center text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] opacity-50">
              Ambiente de Pagamento Criptografado
            </p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
}

