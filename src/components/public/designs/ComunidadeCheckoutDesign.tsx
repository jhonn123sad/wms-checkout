import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Users, 
  Target, 
  Rocket,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Sparkles,
  Crown,
  Award
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
  InlinePixPanel
}: DesignProps) {

  // Premium Community Theme Colors (Dark + Neon Green)
  const colors = {
    background: "#030604",
    surface: "#0B0F0D",
    primary: "#39FF88", // neon-green
    secondary: "#00D9FF", // neon-cyan
    text: "#F5FFF8",
    muted: "#8A9A91",
    button: "linear-gradient(135deg, #39FF88 0%, #00D9FF 100%)",
    buttonText: "#030604"
  };

  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { icon: <Users size={14} className="text-[#39FF88]" />, title: "Membros Ativos", text: "Comunidade vibrante" },
    { icon: <Zap size={14} className="text-[#00D9FF]" />, title: "Conteúdo Prático", text: "Foco em resultados" },
    { icon: <Rocket size={14} className="text-[#39FF88]" />, title: "Liberação Imediata", text: "Comece agora" }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-[#39FF88]/30 overflow-x-hidden flex items-center justify-center p-0 md:p-4" style={{ backgroundColor: colors.background }}>
      {/* Radial Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#39FF88]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#00D9FF]/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1160px] flex flex-col items-center justify-center py-4 lg:py-6 px-4 md:px-6">
        
        {/* Container Principal Editorial (Mesma estrutura de receitas) */}
        <div className="w-full rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden border border-[#39FF88]/10 flex flex-col lg:flex-row items-stretch animate-in fade-in zoom-in-95 duration-1000" style={{ backgroundColor: colors.surface }}>
          
          {/* LADO ESQUERDO: Conteúdo Editorial */}
          <div className="w-full lg:flex-1 p-6 lg:p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
            {/* Subtle glow behind content */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#39FF88]/[0.02] pointer-events-none"></div>
            
            {/* Header / Selo */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#39FF88]/20 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                <Sparkles size={12} />
                Conteúdo Exclusivo
              </div>
              <div className="hidden sm:flex items-center gap-2 opacity-50 text-[#8A9A91]">
                <ShieldCheck size={14} className="text-[#39FF88]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Ambiente Seguro</span>
              </div>
            </div>

            {/* Títulos Dinâmicos */}
            <div className="space-y-3 mb-6 relative z-10">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1] text-[#F5FFF8]">
                {checkout.title}
              </h1>
              <p className="text-sm md:text-base leading-relaxed font-medium max-w-xl text-[#8A9A91]">
                {checkout.subtitle}
              </p>
            </div>

            {/* Mídia Principal - Proporcional como em receitas */}
            <div className="relative w-full aspect-video max-h-[220px] md:max-h-[320px] rounded-2xl lg:rounded-[1.5rem] overflow-hidden shadow-[0_0_30px_rgba(57,255,136,0.1)] border border-[#39FF88]/20 mb-6 group bg-black">
              {mediaData ? (
                <MediaDisplay media={mediaData} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
                  <Crown size={40} strokeWidth={1.5} />
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-widest">Sua Comunidade em Destaque</p>
                </div>
              )}
              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
              
              {/* Badge na Mídia */}
              <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#39FF88]/20 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#39FF88] animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-wider text-white">Liberação imediata</span>
              </div>
            </div>

            {/* Benefícios Compactos */}
            <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-2 relative z-10">
              {benefits.map((benefit: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 lg:p-2.5 rounded-xl bg-black/40 border border-[#39FF88]/5 transition-all hover:border-[#39FF88]/20 shrink-0 lg:shrink">
                  <div className="bg-[#030604] p-1 rounded-lg shadow-sm shrink-0 border border-white/5">
                    {benefit.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-wide leading-tight text-[#F5FFF8]">{benefit.title}</span>
                    <span className="text-[7px] font-bold uppercase tracking-tight text-[#8A9A91]">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Texto informativo discreto */}
            <div className="hidden lg:block mt-6 opacity-40 italic text-[9px] text-center text-[#8A9A91]">
              * Pagamento via Pix com liberação instantânea.
            </div>
          </div>

          {/* LADO DIREITO: Checkout / Compra */}
          <div className="w-full lg:w-[400px] p-6 lg:p-10 flex flex-col border-l border-[#39FF88]/5 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)] bg-black/40 relative">
            <div className="flex-1 flex flex-col justify-center relative z-10">
              
              {paymentData ? (
                <InlinePixPanel
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  formatPrice={(cents: number) => `R$ ${(cents / 100).toFixed(2)}`}
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* Bloco de Preço Elegante e Compacto */}
                  <div className="mb-8 text-center lg:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-[#00D9FF]">Acesso Fechado</span>
                    <div className="flex items-baseline justify-center lg:justify-start gap-1">
                      <span className="text-xl font-bold text-[#39FF88]">R$</span>
                      <span className="text-4xl lg:text-5xl font-black tracking-tighter text-[#F5FFF8]">
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(checkout.price)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 opacity-60">
                      <Award size={12} className="text-[#39FF88]" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#8A9A91]">Membros Ativos • Atualizações</span>
                    </div>
                  </div>

                  {/* Formulário de Checkout */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        {activeFields.map((field: any) => {
                          const labelText = field.field_label || field.label || "Campo";
                          const fieldId = field.field_name || `field-${field.id}`;
                          
                          return (
                            <div key={field.id || fieldId} className="space-y-1.5">
                              <Label 
                                htmlFor={fieldId} 
                                className="text-[10px] font-black uppercase tracking-[0.1em] ml-1 opacity-80 text-[#8A9A91]"
                              >
                                {labelText}
                                {field.required && <span className="ml-1 text-[#39FF88]">*</span>}
                              </Label>
                              <Input
                                id={fieldId}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={`Digite seu ${String(labelText).toLowerCase()}`}
                                required={field.required}
                                className="h-12 md:h-14 bg-black/40 border-[#39FF88]/10 focus:border-[#39FF88]/40 focus:ring-0 transition-all rounded-xl text-sm px-4 text-[#F5FFF8] placeholder:text-[#8A9A91]/30"
                                value={formData[fieldId] || ""}
                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Botão de CTA Refinado */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 lg:h-18 text-lg font-black transition-all hover:scale-[1.01] active:scale-[0.98] rounded-2xl shadow-xl shadow-[#39FF88]/10 flex items-center justify-center gap-3 group overflow-hidden relative"
                        style={{ background: colors.button, color: colors.buttonText }}
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="tracking-tight uppercase italic">Validando...</span>
                          </div>
                        ) : (
                          <>
                            <span className="tracking-tight uppercase italic drop-shadow-sm">{checkout.cta_text || "Quero Acesso Agora"}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                      </Button>
                    </div>

                    {/* Microgarantias */}
                    <div className="flex items-center justify-between pt-5 border-t border-[#39FF88]/5">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Lock size={10} className="text-[#00D9FF]" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A9A91]">Pagamento Seguro</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-60">
                        <ShieldCheck size={10} className="text-[#39FF88]" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A9A91]">Liberação Imediata</span>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Minimalista */}
        <footer className="w-full py-6 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8A9A91]">© 2026 Comunidade WMS • Ambiente Seguro • Pagamento via Pix</p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${colors.background}; }
      `}} />
    </div>
  );
}

/**
 * PIX VIEW REFINADA (Adaptada para Tema Escuro)
 */