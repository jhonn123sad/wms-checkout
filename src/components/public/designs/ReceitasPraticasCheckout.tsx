/**
 * RECEITAS PRÁTICAS CHECKOUT DESIGN - REFINADO V4
 * Um design editorial, leve, quente e focado em alta conversão para produtos de culinária.
 * Mantém INTEGRALMENTE a lógica de Pix e formulários do sistema base.
 */
import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Utensils, 
  Clock, 
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { toast } from "sonner";

interface ReceitasPraticasCheckoutProps {
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

export function ReceitasPraticasCheckout({
  checkout,
  formData,
  loading,
  paymentData,
  paymentStatus,
  mediaData,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
}: ReceitasPraticasCheckoutProps) {
  
  // Removendo dependência de layout_config e simplificando para design fixo restaurado
  const colors = {
    background: "#FCF9F3",
    surface: "#FFFFFF",
    primary: "#f97316", // orange-500
    text: "#3D2B1F",
    muted: "#6B5A4E",
    button: "#f97316",
    buttonText: "#FFFFFF"
  };

  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { icon: <Utensils size={14} className="text-orange-600" />, title: "Receitas rápidas", text: "Prontas para o dia a dia" },
    { icon: <Clock size={14} className="text-orange-600" />, title: "Preparo prático", text: "Passo a passo direto" },
    { icon: <BookOpen size={14} className="text-orange-600" />, title: "Ingredientes simples", text: "Sem complicação" }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-orange-100 overflow-x-hidden flex items-center justify-center p-0 md:p-4" style={{ backgroundColor: colors.background }}>
      {/* Papel sutil de fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      
      {/* Brilhos de ambientação */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-amber-100/40 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1160px] flex flex-col items-center justify-center py-4 lg:py-6 px-4 md:px-6">
        
        {/* Container Editorial Principal */}
        <div className="w-full rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(61,43,31,0.08)] overflow-hidden border border-[#F2EDE4] flex flex-col lg:flex-row items-stretch animate-in fade-in zoom-in-95 duration-1000" style={{ backgroundColor: colors.surface }}>
          
          {/* LADO ESQUERDO: Conteúdo Editorial */}
          <div className="w-full lg:flex-1 p-6 lg:p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-[#F2EDE4]">
            
            {/* Header / Selo */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-100 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                <Sparkles size={12} />
                Receitas Práticas
              </div>
              <div className="hidden sm:flex items-center gap-2 opacity-40" style={{ color: colors.muted }}>
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pagamento 100% Seguro</span>
              </div>
            </div>

            {/* Títulos Dinâmicos */}
            <div className="space-y-3 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1]" style={{ color: colors.text }}>
                {checkout.title}
              </h1>
              <p className="text-sm md:text-base leading-relaxed font-medium max-w-xl" style={{ color: colors.muted }}>
                {checkout.subtitle}
              </p>
            </div>

            {/* Mídia Principal - Reduzida para caber melhor */}
            <div className="relative w-full aspect-video max-h-[220px] md:max-h-[320px] rounded-2xl lg:rounded-[1.5rem] overflow-hidden shadow-sm border border-[#F2EDE4] mb-6 group bg-[#FDFBF7]">
              {mediaData ? (
                <MediaDisplay media={mediaData} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-200/50">
                  <Utensils size={40} strokeWidth={1.5} />
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-widest">Sua Receita em Destaque</p>
                </div>
              )}
              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              
              {/* Badge na Mídia */}
              <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-wider text-[#3D2B1F]">Acesso imediato</span>
              </div>
            </div>

            {/* Benefícios Compactos - Agora em flex-wrap para mobile */}
            <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-2">
              {benefits.map((benefit: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 lg:p-2.5 rounded-xl bg-[#FDFBF7] border border-[#F2EDE4] transition-all hover:border-orange-200 shrink-0 lg:shrink">
                  <div className="bg-white p-1 rounded-lg shadow-sm shrink-0">
                    {benefit.icon || <Utensils size={14} style={{ color: colors.primary }} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-wide leading-tight" style={{ color: colors.text }}>{benefit.title}</span>
                    <span className="text-[7px] font-bold uppercase tracking-tight opacity-50" style={{ color: colors.muted }}>{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Texto informativo discreto */}
            <div className="hidden lg:block mt-6 opacity-30 italic text-[9px] text-center" style={{ color: colors.muted }}>
              * Você receberá o link de acesso imediatamente após a confirmação do Pix.
            </div>
          </div>

          {/* LADO DIREITO: Checkout / Compra - Com distinção visual mais forte */}
          <div className="w-full lg:w-[400px] p-6 lg:p-10 flex flex-col border-l border-[#F2EDE4]/30 shadow-[-10px_0_30px_-15px_rgba(61,43,31,0.03)]" style={{ backgroundColor: `${colors.surface}cc` }}>
            <div className="flex-1 flex flex-col justify-center">
              
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
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: colors.primary }}>Valor do Investimento</span>
                    <div className="flex items-baseline justify-center lg:justify-start gap-1">
                      <span className="text-xl font-bold" style={{ color: colors.primary }}>R$</span>
                      <span className="text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: colors.text }}>
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(checkout.price)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 opacity-60">
                      <Zap size={12} style={{ color: colors.primary }} />
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: colors.muted }}>Pagamento Único • Acesso Vitalício</span>
                    </div>
                  </div>

                  {/* Formulário de Checkout */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        {activeFields.map((field: any) => (
                          <div key={field.id || field.field_name} className="space-y-1.5">
                            <Label 
                              htmlFor={field.field_name} 
                              className="text-[10px] font-black uppercase tracking-[0.1em] ml-1 opacity-70"
                              style={{ color: colors.muted }}
                            >
                              {field.field_label}
                              {field.required && <span className="ml-1" style={{ color: colors.primary }}>*</span>}
                            </Label>
                            <Input
                              id={field.field_name}
                              type={field.field_type?.replace("hidden:", "") || "text"}
                              placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                              required={field.required}
                              className="h-12 md:h-14 bg-white border-[#F2EDE4] focus:ring-orange-200/50 transition-all rounded-xl text-sm px-4"
                              style={{ color: colors.text }}
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Botão de CTA Refinado */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 lg:h-18 text-lg font-black text-white transition-all hover:scale-[1.01] active:scale-[0.98] rounded-2xl shadow-lg flex items-center justify-center gap-3 group overflow-hidden relative"
                        style={{ backgroundColor: colors.button, color: colors.buttonText }}
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="tracking-tight uppercase italic">Processando...</span>
                          </div>
                        ) : (
                          <>
                            <span className="tracking-tight uppercase italic drop-shadow-sm">{checkout.cta_text || "Quero Receber Agora"}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                      </Button>
                    </div>

                    {/* Microgarantias */}
                    <div className="flex items-center justify-between pt-5 border-t border-[#F2EDE4]">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Lock size={10} style={{ color: colors.primary }} />
                        <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>Criptografado</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-60">
                        <ShieldCheck size={10} style={{ color: colors.primary }} />
                        <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>Checkout Seguro</span>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Minimalista */}
        <footer className="w-full py-6 text-center opacity-25">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: colors.muted }}>Plataforma • Pagamento via Pix</p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
}

/**
 * PIX VIEW REFINADA
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
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border transition-all duration-500 ${isPaid ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`} style={!isPaid ? { backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}20`, color: colors.primary } : {}}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.3)]'}`} style={!isPaid ? { backgroundColor: colors.primary } : {}}></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-black mb-1.5 tracking-tight uppercase italic" style={{ color: colors.text }}>Pix gerado</h3>
        <p className="text-[9px] uppercase tracking-[0.12em] leading-relaxed max-w-[240px] mx-auto opacity-70" style={{ color: colors.muted }}>
          Escaneie o QR Code ou copie o código Pix para concluir.
        </p>
      </div>

      {/* QR Code Container - Mais compacto */}
      <div className="relative group mb-6">
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition duration-700" style={{ backgroundColor: `${colors.primary}20` }}></div>
        <div className="relative w-[190px] h-[190px] md:w-[210px] md:h-[210px] bg-white p-4 rounded-[1.5rem] shadow-[0_15px_30px_-10px_rgba(61,43,31,0.1)] border border-[#F2EDE4] flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-6 w-6 animate-spin mb-3" style={{ color: colors.primary }} />
              <p className="text-[9px] font-black uppercase tracking-widest opacity-30" style={{ color: colors.text }}>Gerando QR Code...</p>
            </div>
          )}
          
          {/* Sucesso Animado */}
          {isPaid && (
            <div className="absolute inset-0 bg-green-500/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 z-10">
              <div className="bg-white p-3 rounded-full mb-2 shadow-lg transform scale-110">
                <Check className="text-green-600 w-6 h-6" strokeWidth={4} />
              </div>
              <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Pagamento Recebido!</span>
            </div>
          )}
        </div>
      </div>

      {/* Código Copia e Cola - Compacto e Elegante */}
      <div className="w-full space-y-3 mb-6">
        <div 
          onClick={handleCopy}
          className="w-full bg-white rounded-xl p-3 border border-[#F2EDE4] cursor-pointer hover:border-orange-300 transition-all flex items-center gap-3 overflow-hidden group shadow-sm"
        >
          <div className="p-2 rounded-lg transition-colors" style={copied ? { backgroundColor: '#22c55e', color: 'white' } : { backgroundColor: `${colors.primary}10`, color: colors.primary }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </div>
          <p className="text-[10px] font-mono truncate flex-1 select-all tracking-tight opacity-60" style={{ color: colors.muted }}>
            {paymentData.qr_code}
          </p>
          <span className="text-[9px] font-black uppercase tracking-widest pr-2" style={{ color: colors.primary }}>
            {copied ? "COPIADO" : "COPIAR"}
          </span>
        </div>
        
        {/* Microtexto de segurança */}
        <p className="text-center text-[8px] font-bold text-green-600/60 uppercase tracking-wider">
          Após o pagamento, a liberação é automática.
        </p>
      </div>

      {/* Botão de Ajuda / Reset */}
      {!isPaid && (
        <button 
          onClick={onReset}
          className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group py-2 opacity-50 hover:opacity-100"
          style={{ color: colors.muted }}
        >
          <RefreshCw size={11} className="group-hover:rotate-180 transition-transform duration-500" />
          {hasFields ? "Editar informações" : "Voltar ao checkout"}
        </button>
      )}
    </div>
  );
}
