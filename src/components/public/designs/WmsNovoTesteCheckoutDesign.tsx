import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Check,
  Copy,
  Loader2,
  Sparkles,
  Award,
  CreditCard,
  CheckCircle2,
  RefreshCw
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

export function WmsNovoTesteCheckoutDesign({
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
  
  // Apple-like Minimalist Theme
  const colors = {
    background: "#FBFBFD", // Apple product background
    surface: "#FFFFFF",
    primary: "#0071E3", // Apple blue
    text: "#1D1D1F", // Apple primary text
    muted: "#86868B", // Apple secondary text
    border: "#D2D2D7"
  };

  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { title: "Acesso imediato", desc: "Entre agora mesmo" },
    { title: "Conteúdo exclusivo", desc: "Material inédito" },
    { title: "Liberação automática", desc: "Via e-mail" },
    { title: "Ambiente seguro", desc: "Criptografia total" }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-[#0071E3]/20 flex flex-col items-center" style={{ backgroundColor: colors.background }}>
      <main className="w-full max-w-[1100px] px-5 sm:px-8 py-12 md:py-24 animate-in fade-in duration-1000">
        
        {/* HERO SECTION - MOBILE ONLY (Title & Subtitle first) */}
        <div className="lg:hidden text-center mb-10 space-y-4">
          <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[#1D1D1F] leading-[1.1] max-w-[90%] mx-auto">
            {checkout.title}
          </h1>
          <p className="text-base sm:text-lg text-[#86868B] max-w-[85%] mx-auto font-normal leading-snug">
            {checkout.subtitle}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Content */}
          <div className="w-full order-1 lg:order-none space-y-12">
            {/* DESKTOP HEADER */}
            <div className="hidden lg:block space-y-6">
              <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-[#1D1D1F] leading-[1.05] max-w-[18ch]">
                {checkout.title}
              </h1>
              <p className="text-xl text-[#86868B] max-w-lg font-normal leading-relaxed">
                {checkout.subtitle}
              </p>
            </div>

            {/* MEDIA DISPLAY */}
            <div className="w-full">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-white shadow-[0_15px_30px_rgba(0,0,0,0.03)] border border-[#D2D2D7]/40">
                {mediaData ? (
                  <MediaDisplay media={mediaData} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D2D2D7]">
                    <CreditCard size={48} strokeWidth={1} />
                  </div>
                )}
              </div>
            </div>

            {/* BENEFITS SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 size={18} className="text-[#0071E3]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[15px] text-[#1D1D1F] leading-tight">{benefit.title}</h3>
                    <p className="text-[13px] text-[#86868B] leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase Card */}
          <div className="w-full order-2 lg:order-none lg:sticky lg:top-12">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#D2D2D7]/30">
              
              {paymentData ? (
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  colors={colors}
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="mb-8">
                    <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.05em] block mb-1">Total hoje</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold text-[#1D1D1F]">R$</span>
                      <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(checkout.price)}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {activeFields.length > 0 && (
                      <div className="space-y-3.5">
                        {activeFields.map((field: any) => {
                          const labelText = field.field_label || field.label || "Campo";
                          const fieldId = field.field_name || `field-${field.id}`;
                          
                          return (
                            <div key={field.id || fieldId} className="space-y-1.5">
                              <Label 
                                htmlFor={fieldId} 
                                className="text-[12px] font-medium text-[#1D1D1F] ml-1"
                              >
                                {labelText}
                                {field.required && <span className="ml-0.5 text-[#0071E3]">*</span>}
                              </Label>
                              <Input
                                id={fieldId}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={String(labelText)}
                                required={field.required}
                                className="h-12 bg-white border-[#D2D2D7] focus:border-[#0071E3] focus:ring-0 transition-all rounded-xl text-[15px] px-4 text-[#1D1D1F] placeholder:text-[#86868B]/50"
                                value={formData[fieldId] || ""}
                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 text-[16px] font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all rounded-xl flex items-center justify-center gap-2 group"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processando</span>
                          </div>
                        ) : (
                          <>
                            <span>{checkout.cta_text || "Continuar"}</span>
                            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-6 text-[11px] text-[#86868B] font-medium">
                      <Lock size={12} />
                      <span>Transação segura com criptografia 256-bit</span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pb-20 flex flex-col items-center">
          <p className="text-[11px] text-[#86868B] font-medium">
            © 2026 {checkout.title} • Todos os direitos reservados.
          </p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: ${colors.background}; -webkit-font-smoothing: antialiased; }
      `}} />
    </div>
  );
}

function PixGeneratedView({ paymentData, paymentStatus, onReset, colors }: any) {
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
    <div className="animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center">
      
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 border ${isPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></div>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {isPaid ? 'Pago' : 'Aguardando'}
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2 tracking-tight text-[#1D1D1F]">Quase lá!</h3>
        <p className="text-[14px] text-[#86868B] leading-snug max-w-[240px] mx-auto">
          Finalize o pagamento via Pix para liberar seu acesso instantaneamente.
        </p>
      </div>

      <div className="relative mb-8">
        <div className="w-[180px] h-[180px] bg-white p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-[#D2D2D7]/30 flex items-center justify-center relative overflow-hidden">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          )}
          
          {isPaid && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 z-10">
              <div className="bg-emerald-500 p-2.5 rounded-full mb-2">
                <Check className="text-white w-6 h-6" strokeWidth={4} />
              </div>
              <span className="text-[#1D1D1F] font-bold text-[10px] uppercase tracking-wider">Sucesso</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="bg-[#F5F5F7] rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Código Copia e Cola</span>
            <button 
              onClick={handleCopy}
              className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider"
            >
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <div className="bg-white border border-[#D2D2D7]/50 rounded-lg p-2.5">
            <p className="text-[11px] font-mono break-all line-clamp-2 text-[#1D1D1F]">
              {paymentData.qr_code}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="w-full text-[#86868B] text-[11px] font-semibold uppercase tracking-wider hover:text-[#1D1D1F] transition-colors gap-2 h-10"
        >
          <RefreshCw size={12} />
          Voltar e editar dados
        </Button>
      </div>
    </div>
  );
}
