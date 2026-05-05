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
  
  // Apple-like Premium SaaS Theme
  const colors = {
    background: "#FFFFFF", 
    surface: "#FFFFFF",
    primary: "#000000", // Apple-style focus on black/white with blue accents
    accent: "#0071E3", 
    text: "#1D1D1F", 
    muted: "#6B7280", 
    border: "#E5E7EB"
  };

  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { title: "Acesso imediato", desc: "Entre agora mesmo", icon: <Zap size={18} /> },
    { title: "Conteúdo exclusivo", desc: "Material inédito", icon: <Sparkles size={18} /> },
    { title: "Liberação automática", desc: "Via e-mail", icon: <CheckCircle2 size={18} /> },
    { title: "Ambiente seguro", desc: "Criptografia total", icon: <ShieldCheck size={18} /> }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-[#0071E3]/20 flex flex-col items-center bg-white overflow-x-hidden">
      <main className="w-full max-w-[1100px] px-6 sm:px-10 py-12 md:py-24 animate-in fade-in duration-1000">
        
        {/* MOBILE HEADER (Order: Title -> Subtitle -> Media -> Benefits -> Card) */}
        <div className="lg:hidden space-y-4 mb-10">
          <h1 className="text-[36px] font-bold tracking-tight text-[#1D1D1F] leading-[1.1]">
            {checkout.title}
          </h1>
          <p className="text-lg text-[#6B7280] font-normal leading-relaxed">
            {checkout.subtitle}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Experience */}
          <div className="w-full order-1 lg:order-none space-y-16">
            {/* DESKTOP HEADER */}
            <div className="hidden lg:block space-y-8">
              <h1 className="text-5xl xl:text-[64px] font-extrabold tracking-tight text-[#1D1D1F] leading-[1.05] max-w-[15ch]">
                {checkout.title}
              </h1>
              <p className="text-xl xl:text-2xl text-[#6B7280] max-w-lg font-normal leading-relaxed">
                {checkout.subtitle}
              </p>
            </div>

            {/* MEDIA DISPLAY */}
            <div className="w-full max-w-[720px]">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#FBFBFD] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/60">
                {mediaData ? (
                  <MediaDisplay media={mediaData} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D2D2D7]">
                    <CreditCard size={48} strokeWidth={1} />
                  </div>
                )}
              </div>
            </div>

            {/* BENEFITS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 max-w-[640px]">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#0071E3]">
                    {benefit.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[16px] text-[#1D1D1F] tracking-tight">{benefit.title}</h3>
                    <p className="text-[14px] text-[#6B7280] leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Transaction Card */}
          <div className="w-full order-2 lg:order-none lg:sticky lg:top-12">
            <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#E5E7EB]/50 transition-all duration-300">
              
              {paymentData ? (
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  colors={colors}
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-10">
                    <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-[0.1em] block mb-2">Investimento</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-medium text-[#1D1D1F]">R$</span>
                      <span className="text-5xl font-bold tracking-tighter text-[#1D1D1F]">
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(checkout.price)}
                      </span>
                    </div>
                    <div className="h-px w-full bg-[#E5E7EB] mt-8 opacity-60"></div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {activeFields.length > 0 && (
                      <div className="space-y-5">
                        {activeFields.map((field: any) => {
                          const labelText = field.field_label || field.label || "Campo";
                          const fieldId = field.field_name || `field-${field.id}`;
                          
                          return (
                            <div key={field.id || fieldId} className="space-y-2">
                              <Label 
                                htmlFor={fieldId} 
                                className="text-[13px] font-semibold text-[#1D1D1F] tracking-tight block ml-0.5"
                              >
                                {labelText}
                                {field.required && <span className="ml-1 text-[#0071E3]">*</span>}
                              </Label>
                              <Input
                                id={fieldId}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={String(labelText)}
                                required={field.required}
                                className="h-13 bg-[#F9F9FB] border-[#E5E7EB] focus:border-[#0071E3] focus:ring-0 focus:bg-white transition-all rounded-xl text-[15px] px-4 py-6 text-[#1D1D1F] placeholder:text-[#9CA3AF]"
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
                        className="w-full h-14 text-[17px] font-bold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/10 hover:-translate-y-0.5"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processando</span>
                          </div>
                        ) : (
                          <>
                            <span>{checkout.cta_text || "Confirmar Inscrição"}</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-6 text-[12px] text-[#6B7280] font-medium opacity-80">
                      <ShieldCheck size={14} className="text-[#059669]" />
                      <span>Pagamento processado em ambiente seguro</span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 pb-20 border-t border-[#E5E7EB]/40 pt-12 flex flex-col items-center">
          <p className="text-[13px] text-[#9CA3AF] font-medium tracking-tight">
            © 2026 {checkout.title} • Experiência Segura e Criptografada
          </p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          background-color: white; 
          -webkit-font-smoothing: antialiased; 
          scroll-behavior: smooth;
        }
        input::placeholder { color: #9CA3AF; }
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
    <div className="animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center w-full">
      
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border ${isPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-[#0071E3]'}`}>
        <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-[#0071E3] animate-pulse'}`}></div>
        <span className="text-[11px] font-bold uppercase tracking-widest">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold mb-3 tracking-tight text-[#1D1D1F]">Finalize seu Pix</h3>
        <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-[280px] mx-auto font-normal">
          Escaneie o QR Code abaixo ou copie o código para concluir sua inscrição.
        </p>
      </div>

      <div className="relative mb-10 group">
        <div className="w-[200px] h-[200px] bg-white p-4 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/80 flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-[#0071E3]" />
          )}
          
          {isPaid && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 z-10">
              <div className="bg-emerald-500 p-3 rounded-full mb-3 shadow-lg shadow-emerald-500/20">
                <Check className="text-white w-8 h-8" strokeWidth={3} />
              </div>
              <span className="text-[#1D1D1F] font-bold text-[12px] uppercase tracking-widest">Acesso Liberado</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-6">
        <div className="bg-[#F9F9FB] rounded-2xl p-4 border border-[#E5E7EB]/50">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Código Copia e Cola</span>
            <button 
              onClick={handleCopy}
              className="text-[11px] font-bold text-[#0071E3] uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <div className="bg-white border border-[#E5E7EB]/40 rounded-xl p-4 shadow-sm">
            <p className="text-[12px] font-mono break-all line-clamp-2 text-[#1D1D1F] leading-relaxed">
              {paymentData.qr_code}
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="w-full text-[#6B7280] text-[12px] font-bold uppercase tracking-widest hover:text-[#1D1D1F] hover:bg-transparent transition-all gap-2 h-12"
          >
            <RefreshCw size={14} className="opacity-60" />
            Alterar dados de pagamento
          </Button>
        </div>
      </div>
    </div>
  );
}
