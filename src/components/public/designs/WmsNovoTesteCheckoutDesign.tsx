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
  CreditCard,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Star,
  Shield
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
  
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { 
      title: "Acesso Vitalício", 
      desc: "Pague uma vez, use para sempre.", 
      icon: <Trophy className="text-[#0071E3]" size={20} /> 
    },
    { 
      title: "Suporte VIP", 
      desc: "Atendimento prioritário 24/7.", 
      icon: <Star className="text-[#0071E3]" size={20} /> 
    },
    { 
      title: "Segurança Total", 
      desc: "Criptografia de nível bancário.", 
      icon: <Shield className="text-[#0071E3]" size={20} /> 
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] font-sans antialiased selection:bg-[#0071E3]/10">
      <header className="w-full h-16 border-b border-[#F5F5F7] bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-6">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1D1D1F] rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span>{checkout.title}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#86868B]">
            <span className="flex items-center gap-1.5"><Lock size={12} /> Pagamento Seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 lg:gap-24 items-start">
          
          <div className="space-y-16 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 bg-[#F5F5F7] rounded-full text-[11px] font-bold tracking-[0.1em] text-[#0071E3] uppercase">
                Oferta Exclusiva
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                {checkout.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#86868B] leading-relaxed max-w-2xl">
                {checkout.subtitle}
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-[#F5F5F7] rounded-[40px] opacity-50 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative aspect-video rounded-[32px] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-[#F5F5F7]">
                {mediaData ? (
                  <MediaDisplay media={mediaData} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#FBFBFD]">
                    <Sparkles className="text-[#D2D2D7] w-16 h-16" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#F5F5F7]">
              {benefits.map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] tracking-tight">{item.title}</h3>
                    <p className="text-[14px] text-[#86868B] leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="bg-white rounded-[40px] border border-[#F5F5F7] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden relative">
              
              <div className="h-1.5 w-full bg-[#F5F5F7] overflow-hidden">
                <div className={`h-full bg-[#0071E3] transition-all duration-1000 ${paymentData ? 'w-full' : 'w-1/3'}`}></div>
              </div>

              <div className="p-8 md:p-12">
                {paymentData ? (
                  <PixView 
                    paymentData={paymentData}
                    paymentStatus={paymentStatus}
                    onReset={handleResetPayment}
                  />
                ) : (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#86868B] uppercase tracking-widest">Preço Especial</span>
                        <div className="px-2 py-0.5 bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold rounded-md uppercase">
                          Ativo agora
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold">R$</span>
                        <span className="text-6xl font-extrabold tracking-tighter">
                          {new Intl.NumberFormat("pt-BR", {
                            minimumFractionDigits: 0,
                          }).format(checkout.price)}
                        </span>
                        <span className="text-lg font-medium text-[#86868B] ml-1">à vista</span>
                      </div>
                      <div className="p-3 bg-[#F5F5F7] rounded-2xl flex items-center gap-3">
                        <Zap size={14} className="text-[#0071E3] fill-[#0071E3]" />
                        <span className="text-[12px] font-semibold text-[#1D1D1F]">Liberação imediata via Pix</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        {activeFields.map((field: any) => {
                          const label = field.field_label || field.label;
                          const name = field.field_name;
                          return (
                            <div key={field.id || name} className="space-y-2">
                              <Label 
                                htmlFor={name} 
                                className="text-[13px] font-bold text-[#1D1D1F] tracking-tight ml-1"
                              >
                                {label}
                                {field.required && <span className="text-[#0071E3] ml-1">*</span>}
                              </Label>
                              <Input
                                id={name}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={label}
                                required={field.required}
                                className="h-14 bg-[#F5F5F7] border-transparent focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/5 transition-all rounded-2xl text-[16px] px-6"
                                value={formData[name] || ""}
                                onChange={(e) => handleInputChange(name, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 md:h-20 text-[18px] font-extrabold bg-[#1D1D1F] hover:bg-[#000000] text-white transition-all rounded-3xl shadow-xl hover:scale-[1.01] active:scale-[0.98] mt-6 flex items-center justify-center gap-3 group"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Gerando pagamento...</span>
                          </>
                        ) : (
                          <>
                            <span>{checkout.cta_text || "Comprar Agora"}</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      <div className="flex flex-col items-center gap-3 pt-6 border-t border-[#F5F5F7]">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#86868B] font-bold uppercase tracking-widest">
                          <Lock size={12} className="text-[#34C759]" />
                          Checkout 100% Seguro
                        </div>
                        <div className="flex gap-4 opacity-40 grayscale items-center">
                          <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-3" />
                          <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Master" className="h-5" />
                          <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="Pix" className="h-4" />
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-center mt-8 text-[13px] text-[#86868B] font-medium leading-relaxed px-6">
              Ao confirmar sua compra, você concorda com nossos <br className="hidden md:block" /> 
              <span className="underline cursor-pointer hover:text-[#1D1D1F]">Termos de Uso</span> e <span className="underline cursor-pointer hover:text-[#1D1D1F]">Privacidade</span>.
            </p>
          </aside>
        </div>
      </main>

      <footer className="border-t border-[#F5F5F7] py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-40">
            <ShieldCheck size={16} />
            <span className="text-[12px] font-bold uppercase tracking-widest">Blindagem Digital Ativa</span>
          </div>
          <p className="text-[13px] text-[#86868B] font-medium">
            © 2026 {checkout.title} • Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}} />
    </div>
  );
}

function PixView({ paymentData, paymentStatus, onReset }: any) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!paymentData?.qr_code) return;
    navigator.clipboard.writeText(paymentData.qr_code);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaid = paymentStatus === "paid";

  return (
    <div className="animate-in zoom-in-95 fade-in duration-500 space-y-8 flex flex-col items-center">
      <div className="text-center space-y-3">
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isPaid ? 'bg-[#34C759]' : 'bg-[#0071E3]/10 text-[#0071E3]'}`}>
          {isPaid ? <Check className="text-white" size={24} strokeWidth={3} /> : <CreditCard size={24} />}
        </div>
        <h3 className="text-2xl font-extrabold tracking-tight">
          {isPaid ? "Pagamento Aprovado!" : "Quase lá!" }
        </h3>
        <p className="text-[15px] text-[#86868B] leading-relaxed">
          {isPaid 
            ? "Seu acesso foi liberado. Verifique seu e-mail agora mesmo." 
            : "Finalize o pagamento via Pix para liberar seu acesso instantaneamente."}
        </p>
      </div>

      {!isPaid && (
        <>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#F5F5F7] rounded-[48px] opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-64 h-64 bg-white p-6 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-[#F5F5F7] flex items-center justify-center overflow-hidden">
              {paymentData.qr_code_base64 ? (
                <img 
                  src={paymentData.qr_code_base64} 
                  alt="Pix QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Loader2 className="h-10 w-10 animate-spin text-[#0071E3]" />
              )}
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="bg-[#F5F5F7] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.1em]">Copia e Cola</span>
                <span className="text-[11px] font-bold text-[#34C759] uppercase">Seguro</span>
              </div>
              <div className="bg-white border border-[#E5E5E7] rounded-2xl p-4">
                <p className="text-[12px] font-mono break-all text-[#1D1D1F] line-clamp-2 text-center">
                  {paymentData.qr_code}
                </p>
              </div>
              <Button 
                onClick={handleCopy}
                className="w-full h-14 bg-white hover:bg-white text-[#1D1D1F] border border-[#E5E5E7] rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2"
              >
                {copied ? <CheckCircle2 className="text-[#34C759]" size={18} /> : <Copy size={18} />}
                <span>{copied ? "Copiado com sucesso" : "Copiar código Pix"}</span>
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={onReset}
              className="w-full text-[#86868B] text-[12px] font-bold uppercase tracking-widest hover:bg-[#F5F5F7] rounded-2xl h-12 flex gap-2"
            >
              <RefreshCw size={14} />
              Refazer inscrição
            </Button>
          </div>
        </>
      )}

      {isPaid && (
        <div className="w-full space-y-4">
          <div className="p-6 bg-[#34C759]/10 rounded-3xl border border-[#34C759]/20 flex flex-col items-center gap-4 text-center">
            <p className="text-[14px] font-medium text-[#1B5E20]">
              Obrigado pela confiança! O acesso ao produto foi enviado para o e-mail cadastrado.
            </p>
          </div>
          <Button 
            className="w-full h-16 bg-[#1D1D1F] text-white rounded-2xl font-bold"
            onClick={() => window.location.reload()}
          >
            Acessar Agora
          </Button>
        </div>
      )}
    </div>
  );
}
