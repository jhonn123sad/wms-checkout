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
    <div className="min-h-screen font-sans selection:bg-[#0071E3]/20 flex flex-col items-center pt-8 pb-20 px-4" style={{ backgroundColor: colors.background }}>
      <main className="w-full max-w-[1000px] animate-in fade-in duration-1000">
        
        {/* HERO SECTION */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071E3] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="fill-current" />
            Lançamento Exclusivo
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1D1D1F] leading-[1.05]">
            {checkout.title}
          </h1>
          <p className="text-lg md:text-xl text-[#86868B] max-w-2xl mx-auto font-medium leading-relaxed">
            {checkout.subtitle}
          </p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          {/* MEDIA DISPLAY */}
          <div className="space-y-10">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-[#D2D2D7]/50 group">
              {mediaData ? (
                <MediaDisplay media={mediaData} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-200">
                  <CreditCard size={64} strokeWidth={1} />
                </div>
              )}
            </div>

            {/* BENEFITS SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1D1D1F]">
                    <CheckCircle2 size={18} className="text-[#0071E3]" />
                    <h3 className="font-bold text-sm uppercase tracking-wide">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-[#86868B] font-medium leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CHECKOUT CARD */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/30 relative overflow-hidden">
              
              {paymentData ? (
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  colors={colors}
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="mb-10 text-center">
                    <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-2 block">Investimento</span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-xl font-bold text-[#1D1D1F]">R$</span>
                      <span className="text-5xl font-black tracking-tighter text-[#1D1D1F]">
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(checkout.price)}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        {activeFields.map((field: any) => {
                          const labelText = field.field_label || field.label || "Campo";
                          const fieldId = field.field_name || `field-${field.id}`;
                          
                          return (
                            <div key={field.id || fieldId} className="space-y-1.5">
                              <Label 
                                htmlFor={fieldId} 
                                className="text-[10px] font-bold uppercase tracking-[0.1em] ml-2 text-[#86868B]"
                              >
                                {labelText}
                                {field.required && <span className="ml-1 text-[#0071E3]">*</span>}
                              </Label>
                              <Input
                                id={fieldId}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={`Seu ${String(labelText).toLowerCase()}`}
                                required={field.required}
                                className="h-14 bg-[#F5F5F7] border-transparent focus:bg-white focus:border-[#0071E3]/30 focus:ring-4 focus:ring-[#0071E3]/5 transition-all rounded-2xl text-sm px-5 text-[#1D1D1F] placeholder:text-[#86868B]/40"
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
                        className="w-full h-16 md:h-18 text-lg font-bold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all hover:scale-[1.01] active:scale-[0.98] rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 group"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="tracking-tight">PROCESSANDO...</span>
                          </div>
                        ) : (
                          <>
                            <span className="tracking-tight">{checkout.cta_text || "Comprar agora"}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-6 opacity-40">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1D1D1F]">
                        <Lock size={12} />
                        <span>Checkout 100% Seguro</span>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 py-10 border-t border-[#D2D2D7]/50 text-center space-y-4">
          <div className="flex items-center justify-center gap-8 opacity-30 grayscale">
            <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-6 object-contain" />
            <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-5 object-contain" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868B]">
            © 2026 {checkout.title} • Apple Style Experience
          </p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: ${colors.background}; }
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
    <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center py-4">
      
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border ${isPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></div>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-10">
        <h3 className="text-2xl font-black mb-3 tracking-tight text-[#1D1D1F]">Pix gerado com sucesso</h3>
        <p className="text-sm text-[#86868B] leading-relaxed max-w-[280px] mx-auto font-medium">
          Escaneie o QR Code abaixo ou copie o código Pix para finalizar sua compra.
        </p>
      </div>

      <div className="relative mb-10">
        <div className="w-[240px] h-[240px] bg-white p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#D2D2D7]/30 flex items-center justify-center relative overflow-hidden">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          )}
          
          {isPaid && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 z-10">
              <div className="bg-emerald-500 p-4 rounded-full mb-3 shadow-lg transform scale-110">
                <Check className="text-white w-8 h-8" strokeWidth={4} />
              </div>
              <span className="text-[#1D1D1F] font-bold text-xs uppercase tracking-[0.2em]">Acesso Liberado</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={handleCopy}
          className="w-full bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-2xl p-4 transition-all flex items-center gap-4 group"
        >
          <div className={`p-2 rounded-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </div>
          <p className="text-xs font-mono truncate flex-1 text-left text-[#86868B]">
            {paymentData.qr_code}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest pr-2 text-blue-600">
            {copied ? "Copiado" : "Copiar"}
          </span>
        </button>
        
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="w-full text-[#86868B] text-xs font-bold uppercase tracking-widest hover:text-[#1D1D1F] transition-colors gap-2"
        >
          <RefreshCw size={14} />
          Alterar informações
        </Button>
      </div>
    </div>
  );
}
