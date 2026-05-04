import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Users, 
  Video, 
  Globe,
  Sparkles,
  Loader2,
  CheckCircle2,
  Layout,
  Copy,
  Check,
  RefreshCw,
  Award,
  CircleDashed
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
}: DesignProps) {
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const colors = {
    background: "#09090B",
    surface: "#111114",
    primary: "#38BDF8", // sky-400
    accent: "#818CF8",  // indigo-400
    text: "#FAFAFA",
    muted: "#A1A1AA"
  };

  const benefits = [
    { icon: <Video size={16} />, title: "Aulas Exclusivas", desc: "Conteúdo de alto nível" },
    { icon: <Users size={16} />, title: "Comunidade VIP", desc: "Networking qualificado" },
    { icon: <Award size={16} />, title: "Certificado", desc: "Reconhecimento oficial" }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans selection:bg-sky-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-sky-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.05]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
          
          {/* LADO ESQUERDO: Valor e Proposta */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Sparkles size={12} className="animate-pulse" /> Acesso Exclusivo
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
                  {checkout.title}
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
                  {checkout.subtitle}
                </p>
              </div>
            </div>

            {/* Mídia Principal */}
            <div className="relative group w-full max-w-[860px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/40 shadow-2xl backdrop-blur-sm">
                <MediaDisplay media={mediaData} />
                
                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Ao Vivo e Gravado</span>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[860px]">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: Checkout Card */}
          <div className="w-full lg:sticky lg:top-12 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="bg-zinc-900/50 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[60px] pointer-events-none"></div>

              {paymentData ? (
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                  colors={colors}
                />
              ) : (
                <div className="space-y-8">
                  {/* Preço */}
                  <div className="text-center lg:text-left space-y-1">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] block">Investimento Único</span>
                    <div className="flex items-baseline justify-center lg:justify-start gap-2">
                      <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkout.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 pt-2 text-zinc-500 font-bold text-[9px] uppercase tracking-widest">
                      <Zap size={12} className="text-sky-500" /> Acesso Imediato • Seguro
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/5"></div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        {activeFields.map((field: any) => (
                          <div key={field.id} className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                              {field.field_label}
                              {field.required && <span className="text-sky-500 ml-1">*</span>}
                            </Label>
                            <Input
                              className="h-14 bg-white/[0.03] border-white/10 rounded-xl focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all text-white placeholder:text-zinc-700 text-sm px-5"
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                              required={field.required}
                              placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full h-18 bg-sky-500 hover:bg-sky-400 text-black font-black text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="uppercase tracking-widest italic">Processando...</span>
                        </div>
                      ) : (
                        <>
                          <span className="uppercase tracking-tight italic">{checkout.cta_text || "GARANTIR MEU ACESSO"}</span>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                        <Lock size={12} className="text-sky-500/50" /> Seguro
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-sky-500/50" /> Oficial
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <p className="mt-8 text-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
              Tecnologia de Pagamento Criptografada
            </p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
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
    <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center py-2">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border transition-all duration-500 ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-sky-500 animate-pulse'}`}></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {isPaid ? 'Pagamento Confirmado' : 'Pix gerado'}
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-black mb-2 tracking-tight uppercase italic text-white">Pix gerado</h3>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[260px] mx-auto">
          Finalize seu pagamento para liberar o acesso imediato.
        </p>
      </div>

      <div className="relative group mb-8">
        <div className="absolute -inset-6 bg-sky-500/10 rounded-full blur-[40px] opacity-50 group-hover:opacity-100 transition duration-700"></div>
        <div className="relative w-[220px] h-[220px] bg-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <CircleDashed className="h-8 w-8 animate-spin text-sky-500 mb-3" />
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Gerando QR...</p>
            </div>
          )}
          
          {isPaid && (
            <div className="absolute inset-0 bg-green-500/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 z-10">
              <div className="bg-white p-3 rounded-full mb-3 shadow-lg transform scale-110">
                <Check className="text-green-600 w-6 h-6" strokeWidth={4} />
              </div>
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Sucesso!</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-4 mb-8">
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/10 flex flex-col items-center gap-3 group relative overflow-hidden">
          <p className="text-[10px] font-mono break-all text-zinc-500 text-center leading-relaxed select-all">
            {paymentData.qr_code}
          </p>
        </div>

        <Button 
          onClick={handleCopy}
          className="w-full h-16 bg-white text-black hover:bg-zinc-200 font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl uppercase tracking-widest italic"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copiar Código Pix
            </>
          )}
        </Button>
      </div>

      <button 
        onClick={onReset}
        className="group flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-sky-400 transition-colors uppercase tracking-[0.2em]"
      >
        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
        Editar informações
      </button>
    </div>
  );
}
