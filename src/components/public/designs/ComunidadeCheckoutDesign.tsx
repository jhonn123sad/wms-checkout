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
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  hasFields={activeFields.length > 0}
                  colors={colors}
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
function PixGeneratedView({ paymentData, paymentStatus, onReset, hasFields, colors }: any) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!paymentData?.qr_code) return;
    navigator.clipboard.writeText(paymentData.qr_code);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const isPaid = paymentStatus === "paid";

  return (
    <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center">
      
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border transition-all duration-500 ${isPaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[#39FF88]/10 border-[#39FF88]/20 text-[#39FF88]'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'animate-pulse shadow-[0_0_8px_rgba(57,255,136,0.3)]'}`} style={!isPaid ? { backgroundColor: colors.primary } : {}}></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-black mb-1.5 tracking-tight uppercase italic text-[#F5FFF8]">Pix gerado</h3>
        <p className="text-[9px] uppercase tracking-[0.12em] leading-relaxed max-w-[240px] mx-auto opacity-70 text-[#8A9A91]">
          Escaneie o QR Code ou copie o código Pix para concluir seu acesso.
        </p>
      </div>

      {/* QR Code Container - Compacto e elegante em fundo claro para leitura do scanner */}
      <div className="relative group mb-6">
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition duration-700" style={{ backgroundColor: `${colors.primary}` }}></div>
        <div className="relative w-[190px] h-[190px] md:w-[210px] md:h-[210px] bg-white p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-6 w-6 animate-spin mb-3 text-violet-600" />
              <p className="text-[9px] font-black uppercase tracking-widest opacity-30 text-black">Gerando...</p>
            </div>
          )}
          
          {/* Sucesso Animado */}
          {isPaid && (
            <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 z-10">
              <div className="bg-white p-3 rounded-full mb-2 shadow-lg transform scale-110">
                <Check className="text-emerald-600 w-6 h-6" strokeWidth={4} />
              </div>
              <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Acesso Liberado!</span>
            </div>
          )}
        </div>
      </div>

      {/* Código Copia e Cola - Adaptado para o tema escuro */}
      <div className="w-full space-y-3 mb-6">
        <div 
          onClick={handleCopy}
          className="w-full bg-black/40 rounded-xl p-3 border border-white/5 cursor-pointer hover:border-[#39FF88]/20 transition-all flex items-center gap-3 overflow-hidden group shadow-sm"
        >
          <div className="p-2 rounded-lg transition-colors" style={copied ? { backgroundColor: '#10b981', color: 'white' } : { backgroundColor: `${colors.primary}10`, color: colors.primary }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </div>
          <p className="text-[10px] font-mono truncate flex-1 select-all tracking-tight opacity-40 text-[#8A9A91]">
            {paymentData.qr_code}
          </p>
          <span className="text-[9px] font-black uppercase tracking-widest pr-2" style={{ color: colors.primary }}>
            {copied ? "COPIADO" : "COPIAR"}
          </span>
        </div>
        
        {/* Microtexto de segurança */}
        <p className="text-center text-[8px] font-bold text-[#00D9FF]/60 uppercase tracking-wider">
          O acesso será enviado para seu e-mail instantaneamente.
        </p>
      </div>

      {/* Botão de Ajuda / Reset */}
      {!isPaid && (
        <button 
          onClick={onReset}
          className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group py-2 opacity-50 hover:opacity-100 text-[#8A9A91] hover:text-[#39FF88]"
        >
          <RefreshCw size={11} className="group-hover:rotate-180 transition-transform duration-500" />
          {hasFields ? "Editar informações" : "Voltar ao checkout"}
        </button>
      )}
    </div>
  );
}
