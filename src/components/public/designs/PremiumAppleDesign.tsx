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

export function PremiumAppleDesign({
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
  
  const colors = {
    background: "#FFFFFF", 
    surface: "#FFFFFF",
    primary: "#0071E3", 
    text: "#1D1D1F", 
    muted: "#6B7280", 
    border: "#F5F5F7"
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
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071E3]/10 overflow-x-hidden antialiased">
      <main className="w-full max-w-[1100px] mx-auto px-6 py-12 lg:py-24 animate-in fade-in duration-1000">
        
        {/* MOBILE HEADER */}
        <div className="lg:hidden space-y-6 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.1]">
            {checkout.title}
          </h1>
          <p className="text-lg text-[#6B7280] font-normal leading-relaxed">
            {checkout.subtitle}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN */}
          <div className="w-full space-y-16">
            {/* DESKTOP HEADER */}
            <div className="hidden lg:block space-y-8">
              <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.05] max-w-[15ch]">
                {checkout.title}
              </h1>
              <p className="text-xl text-[#6B7280] max-w-lg font-normal leading-relaxed">
                {checkout.subtitle}
              </p>
            </div>

            {/* MEDIA */}
            <div className="w-full">
              <div className="relative aspect-video rounded-[32px] overflow-hidden bg-[#FBFBFD] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-[#F5F5F7]">
                {mediaData ? (
                  <MediaDisplay media={mediaData} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D2D2D7]">
                    <CreditCard size={48} strokeWidth={1} />
                  </div>
                )}
              </div>
            </div>

            {/* BENEFITS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#0071E3]">
                    {benefit.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[16px] text-[#1D1D1F] tracking-tight">{benefit.title}</h3>
                    <p className="text-[14px] text-[#6B7280] leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:sticky lg:top-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_32px_64px_rgba(0,0,0,0.06)] border border-[#F5F5F7]">
              
              {paymentData ? (
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-12">
                    <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em] block mb-3">Total do Investimento</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-[#1D1D1F]">R$</span>
                      <span className="text-6xl font-extrabold tracking-tighter text-[#1D1D1F]">
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 0,
                        }).format(checkout.price)}
                      </span>
                      <span className="text-lg font-medium text-[#86868B] ml-1">à vista</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {activeFields.length > 0 && (
                      <div className="space-y-6">
                        {activeFields.map((field: any) => {
                          const labelText = field.field_label || field.label || "Campo";
                          const fieldId = field.field_name || `field-${field.id}`;
                          
                          return (
                            <div key={field.id || fieldId} className="space-y-2.5">
                              <Label 
                                htmlFor={fieldId} 
                                className="text-[13px] font-bold text-[#1D1D1F] tracking-tight ml-1"
                              >
                                {labelText}
                                {field.required && <span className="ml-1 text-[#0071E3]">*</span>}
                              </Label>
                              <Input
                                id={fieldId}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={String(labelText)}
                                required={field.required}
                                className="h-14 bg-[#F5F5F7] border-transparent focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/5 transition-all rounded-2xl text-[16px] px-6 text-[#1D1D1F] placeholder:text-[#86868B]/40"
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
                        className="w-full h-16 text-[18px] font-bold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all rounded-2xl flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20 active:scale-[0.98]"
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

                    <div className="flex items-center justify-center gap-2 pt-4 text-[12px] text-[#86868B] font-medium">
                      <Lock size={14} className="text-[#34C759]" />
                      <span>Transação segura com criptografia SSL</span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 pb-20 border-t border-[#F5F5F7] pt-12 flex flex-col items-center">
          <p className="text-[13px] text-[#86868B] font-medium tracking-tight">
            © 2026 {checkout.title} • Checkout Oficial
          </p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          background-color: white; 
          -webkit-font-smoothing: antialiased; 
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #F5F5F7 inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}} />
    </div>
  );
}

function PixGeneratedView({ paymentData, paymentStatus, onReset }: any) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!paymentData?.qr_code) return;
    navigator.clipboard.writeText(paymentData.qr_code);
    setCopied(true);
    toast.success("Copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaid = paymentStatus === "paid";

  return (
    <div className="animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center w-full">
      
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10 border ${isPaid ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]' : 'bg-[#E3F2FD] border-[#BBDEFB] text-[#0071E3]'}`}>
        <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-[#4CAF50]' : 'bg-[#0071E3] animate-pulse'}`}></div>
        <span className="text-[11px] font-bold uppercase tracking-widest">
          {isPaid ? 'Pagamento Aprovado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-10">
        <h3 className="text-2xl font-extrabold mb-3 tracking-tight text-[#1D1D1F]">Conclua via Pix</h3>
        <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-[280px] mx-auto font-normal">
          Escaneie o QR Code ou use o código Copia e Cola.
        </p>
      </div>

      <div className="relative mb-12 group">
        <div className="w-[180px] h-[180px] bg-white p-4 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#F5F5F7] flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:scale-[1.05]">
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
              <div className="bg-[#34C759] p-3 rounded-full mb-3 shadow-lg shadow-[#34C759]/20">
                <Check className="text-white w-8 h-8" strokeWidth={3} />
              </div>
              <span className="text-[#1D1D1F] font-bold text-[12px] uppercase tracking-widest">Sucesso</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-8">
        <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#F5F5F7]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest">Código Pix</span>
            <button 
              onClick={handleCopy}
              className="text-[11px] font-bold text-[#0071E3] uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <div className="bg-white border border-[#E5E5E7] rounded-2xl p-4 shadow-sm">
            <p className="text-[12px] font-mono break-all line-clamp-1 text-[#1D1D1F] text-center">
              {paymentData.qr_code}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="w-full text-[#86868B] text-[12px] font-bold uppercase tracking-widest hover:text-[#1D1D1F] hover:bg-transparent transition-all gap-2 h-12"
        >
          <RefreshCw size={14} className="opacity-60" />
          Editar informações
        </Button>
      </div>
    </div>
  );
}
