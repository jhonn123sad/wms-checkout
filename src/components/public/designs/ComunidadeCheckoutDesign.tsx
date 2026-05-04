import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Users, 
  Sparkles,
  Loader2,
  Check,
  Award,
  ChevronRight,
  Target,
  Rocket,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { cn } from "@/lib/utils";

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
  checkout = {},
  formData = {},
  loading = false,
  paymentData = null,
  paymentStatus = "waiting_payment",
  mediaData = null,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
  InlinePixPanel,
}: DesignProps) {
  const activeFields = (checkout?.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const displayTitle = checkout?.title || "Comunidade WMS";
  const displaySubtitle = checkout?.subtitle || "Tenha acesso imediato a todo o conteúdo exclusivo da nossa comunidade.";
  const displayPrice = checkout?.price || 0;
  const displayCTA = checkout?.cta_text || "Quero Acesso Imediato";

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col">
        {/* Top Navbar Style Header */}
        <header className="flex justify-between items-center mb-12 md:mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">Comunidade<span className="text-purple-500">WMS</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Ambiente 100% Seguro
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
              <Award className="w-4 h-4 text-purple-400" />
              Garantia de Satisfação
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 flex-1">
          
          {/* Left Column: Value Proposition (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Vagas Limitadas • 2026 Edition
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-white">
                {displayTitle}
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
                {displaySubtitle}
              </p>
            </div>

            {/* Premium Video Frame */}
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/5">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/50 via-transparent to-cyan-500/50 rounded-3xl opacity-30"></div>
              <div className="relative aspect-video bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
                <MediaDisplay media={mediaData} />
              </div>
            </div>

            {/* Social Proof & Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                { icon: Users, label: "5k+ Membros", color: "text-purple-400" },
                { icon: Target, label: "Conteúdo Prático", color: "text-cyan-400" },
                { icon: Rocket, label: "Acesso Instantâneo", color: "text-emerald-400" },
                { icon: Lock, label: "Vitalício", color: "text-amber-400" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <item.icon className={cn("w-6 h-6 mb-2", item.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout Card (5 columns) */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-8">
              {/* Card Container */}
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-b from-purple-600/20 to-cyan-600/20 rounded-[2.5rem] blur-2xl opacity-40"></div>
                
                <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  {/* Top Bar for Card */}
                  <div className="h-2 w-full bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600"></div>
                  
                  <div className="p-8 md:p-10">
                    {paymentData ? (
                      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto ring-1 ring-purple-500/20">
                            <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
                          </div>
                          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Pix Gerado</h2>
                          <p className="text-sm text-zinc-400 leading-relaxed max-w-[280px] mx-auto">Escaneie o QR Code abaixo para confirmar seu acesso exclusivo à comunidade.</p>
                        </div>

                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
                          {InlinePixPanel && (
                            <div className="w-full">
                              <InlinePixPanel 
                                paymentData={paymentData} 
                                paymentStatus={paymentStatus}
                                onReset={handleResetPayment}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Pricing Header */}
                        <div className="space-y-2">
                          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Investimento Único</p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice)}
                            </span>
                            <span className="text-lg text-zinc-500 line-through font-medium opacity-50">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice * 2.5)}
                            </span>
                          </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            {activeFields.map((field: any) => {
                              const labelText = field.field_label || field.label || "Campo";
                              const fieldId = field.field_name || `field-${field.id}`;
                              
                              return (
                                <div key={field.id || fieldId} className="space-y-2">
                                  <Label 
                                    htmlFor={fieldId}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 flex justify-between"
                                  >
                                    {labelText}
                                    {field.required && <span className="text-purple-500/50 font-normal">* Obrigatório</span>}
                                  </Label>
                                  <Input
                                    id={fieldId}
                                    name={fieldId}
                                    placeholder={field.placeholder || `Digite seu ${String(labelText).toLowerCase()}`}
                                    required={field.required}
                                    value={formData[fieldId] || ""}
                                    onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                    className="h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-zinc-700 font-medium"
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-18 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-500/20 group transition-all duration-300 transform active:scale-[0.98]"
                          >
                            {loading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <span className="flex items-center gap-3">
                                {displayCTA}
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </form>

                        {/* Security Footer */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <Lock className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Criptografia SSL</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Aprovado</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Checkout Seguro</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Urgency Badge */}
              {!paymentData && (
                <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-xs animate-bounce">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  Vagas sendo preenchidas agora
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">© 2026 Comunidade WMS Premium</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Termos de Uso</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Políticas</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
