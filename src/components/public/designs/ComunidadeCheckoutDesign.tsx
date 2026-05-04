import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Users, 
  Video, 
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Award,
  Globe,
  ArrowRight,
  ChevronRight
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

  const isPaid = paymentStatus === "paid";
  const displayTitle = checkout?.title || "Comunidade WMS";
  const displaySubtitle = checkout?.subtitle || "Tenha acesso imediato a todo o conteúdo exclusivo da nossa comunidade.";
  const displayPrice = checkout?.price || 0;
  const displayCTA = checkout?.cta_text || "Quero Acesso Imediato";

  return (
    <div className="min-h-screen bg-[#09090b] text-[#FAFAFA] font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Glow Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 lg:py-12 min-h-screen flex flex-col items-center">
        {/* Header / Top Badge */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-xl group hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#09090b] bg-zinc-800 flex items-center justify-center overflow-hidden">
                   <Users className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-indigo-400 transition-colors">
              +500 membros na comunidade
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full items-start">
          
          {/* LADO ESQUERDO: Conteúdo e Proposta de Valor */}
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                {displayTitle}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mt-2 italic">
                  Exclusivo
                </span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                {displaySubtitle}
              </p>
            </div>

            {/* Media Display - Framed */}
            <div className="relative group max-w-2xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                <MediaDisplay media={mediaData} />
              </div>
            </div>

            {/* Features/Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                { icon: ShieldCheck, title: "Acesso Vitalício", desc: "Pagamento único, acesso para sempre" },
                { icon: Zap, title: "Conteúdo Imediato", desc: "Liberação automática após o Pix" },
                { icon: Globe, title: "Networking", desc: "Comunidade privada de alto nível" },
                { icon: Sparkles, title: "Atualizações", desc: "Novos conteúdos todos os meses" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-wide">{item.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: Checkout Card */}
          <div className="lg:sticky lg:top-8 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
            <div className="relative group">
              {/* Outer glow for the card */}
              <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              
              <div className="relative bg-[#121214] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-3xl overflow-hidden backdrop-blur-sm">
                
                {paymentData ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-2 mb-2">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                        <Zap className="w-6 h-6 text-indigo-400 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Finalize seu acesso</h3>
                      <p className="text-sm text-zinc-500">Pague via Pix para liberação instantânea</p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-2">
                      {InlinePixPanel && (
                        <InlinePixPanel 
                          paymentData={paymentData} 
                          paymentStatus={paymentStatus}
                          onReset={handleResetPayment}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Oferta Exclusiva</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice)}
                        </span>
                        <span className="text-sm text-zinc-500 line-through decoration-indigo-500/50">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice * 2)}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        {activeFields.map((field: any) => {
                          const labelText = field.field_label || field.label || "Campo";
                          return (
                            <div key={field.id} className="space-y-2">
                              <Label 
                                htmlFor={field.field_name}
                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1"
                              >
                                {labelText}
                              </Label>
                              <Input
                                id={field.field_name}
                                name={field.field_name}
                                placeholder={field.placeholder || `Digite seu ${String(labelText).toLowerCase()}`}
                                required={field.required}
                                value={formData[field.field_name] || ""}
                                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                                className="h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-700"
                              />
                            </div>
                          );
                        })}
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-16 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/20 group transition-all duration-300"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <span className="flex items-center gap-2">
                            {displayCTA}
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </form>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Lock className="w-3 h-3" />
                        <span className="text-[10px] font-medium uppercase tracking-tighter">Ambiente Seguro</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Check className="w-3 h-3" />
                        <span className="text-[10px] font-medium uppercase tracking-tighter">Garantia 7 Dias</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 w-full py-8 border-t border-white/5 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 text-zinc-600">
          <Award className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Selo de Qualidade Digital</span>
        </div>
        <p className="text-[10px] text-zinc-700">© 2026 Comunidade Premium. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}


