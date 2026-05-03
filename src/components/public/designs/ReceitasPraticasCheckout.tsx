/**
 * RECEITAS PRÁTICAS CHECKOUT DESIGN - PREMIUM RECIPE CARD
 * Um design editorial, quente e focado em conversão para produtos de culinária.
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
  ExternalLink,
  Loader2
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
  
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { icon: <Utensils size={14} className="text-orange-600" />, text: "Receitas rápidas" },
    { icon: <Clock size={14} className="text-orange-600" />, text: "Preparo prático" },
    { icon: <BookOpen size={14} className="text-orange-600" />, text: "Ingredientes simples" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D2B1F] font-sans selection:bg-orange-100 overflow-x-hidden flex items-center justify-center p-4 lg:p-0">
      {/* Textura de papel sutil */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      
      {/* Gradientes de fundo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-amber-100/30 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1180px] lg:min-h-[680px] flex flex-col items-center justify-center py-6 lg:py-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden w-full flex items-center justify-between mb-6 px-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-[10px] font-black uppercase tracking-widest text-orange-700 shadow-sm">
            Receitas Práticas
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold text-[#6B5A4E] uppercase tracking-wider">Pagamento Seguro</span>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-0 items-stretch lg:items-center relative animate-in fade-in zoom-in-95 duration-1000">
          
          {/* LADO ESQUERDO: O "Cartão de Receita" */}
          <div className="w-full lg:flex-1 bg-white rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(61,43,31,0.12)] overflow-hidden border border-orange-100/50 flex flex-col min-h-[500px] lg:h-[640px] relative transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(61,43,31,0.18)]">
            
            {/* Capa da Receita / Mídia */}
            <div className="relative w-full aspect-video lg:h-[340px] overflow-hidden">
              {mediaData ? (
                <MediaDisplay media={mediaData} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-orange-200/50" />
                </div>
              )}
              {/* Overlay gradiente suave na mídia */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              
              {/* Badge Flutuante Desktop */}
              <div className="hidden lg:flex absolute top-8 left-8 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-orange-100 shadow-xl items-center gap-2.5 transform hover:scale-105 transition-transform">
                <div className="bg-orange-500 p-1 rounded-full">
                  <Zap size={10} className="text-white fill-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]">Acesso Vitalício</span>
              </div>
            </div>

            {/* Conteúdo do Cartão */}
            <div className="p-8 lg:p-12 flex flex-col justify-between flex-1">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] text-[#2D241E]">
                    {checkout.title}
                  </h1>
                  <p className="text-base md:text-lg text-[#6B5A4E] max-w-xl leading-relaxed font-medium">
                    {checkout.subtitle}
                  </p>
                </div>

                {/* Chips de Benefício */}
                <div className="flex flex-wrap gap-3">
                  {benefits.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#FDFBF7] border border-orange-100 shadow-sm hover:border-orange-200 transition-colors">
                      <div className="bg-orange-50 p-1.5 rounded-lg">{item.icon}</div>
                      <span className="text-[11px] font-bold text-[#6B5A4E] uppercase tracking-wide">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Footer Desktop */}
              <div className="hidden lg:flex items-center gap-8 pt-8 opacity-60 border-t border-orange-50 mt-10">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Garantia de 7 Dias</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Lock size={18} className="text-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ambiente Seguro</span>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Bloco de Compra "Ticket" */}
          <div className={`w-full lg:w-[390px] mt-6 lg:mt-0 lg:absolute lg:right-[-20px] xl:right-[-40px] transition-all duration-700 ${paymentData ? 'lg:scale-105 z-20' : 'z-10'}`}>
            <div className="bg-[#2D241E] text-white rounded-[2.5rem] shadow-[0_40px_120px_-20px_rgba(45,36,30,0.5)] overflow-hidden relative border border-white/5 p-8 lg:p-10 flex flex-col min-h-[460px]">
              
              {/* Decoração de Ticket Superior */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-orange-500 rounded-b-full"></div>
              
              {paymentData ? (
                <PixGeneratedView 
                  paymentData={paymentData}
                  paymentStatus={paymentStatus}
                  onReset={handleResetPayment}
                />
              ) : (
                <div className="flex flex-col flex-1 justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="w-4 h-px bg-orange-400/30"></div>
                        Investimento Único
                      </span>
                      <div className="text-5xl md:text-6xl font-black tracking-tighter text-white flex items-start gap-1">
                        <span className="text-2xl mt-2 text-orange-500 font-bold tracking-normal">R$</span>
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(checkout.price)}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {activeFields.length > 0 && (
                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                          {activeFields.map((field: any) => (
                            <div key={field.id || field.field_name} className="space-y-2">
                              <Label 
                                htmlFor={field.field_name} 
                                className="text-[10px] font-black text-orange-200/50 uppercase tracking-[0.2em] ml-1"
                              >
                                {field.field_label}
                                {field.required && <span className="text-orange-500 ml-1">*</span>}
                              </Label>
                              <Input
                                id={field.field_name}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                placeholder={`Seu ${field.field_label.toLowerCase()}`}
                                required={field.required}
                                className="h-14 bg-white/[0.04] border-white/10 text-white focus:bg-white/[0.08] focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all rounded-2xl placeholder:text-white/10 text-sm px-5 shadow-inner"
                                value={formData[field.field_name] || ""}
                                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-18 lg:h-20 text-xl font-black bg-orange-500 hover:bg-orange-400 text-white transition-all hover:scale-[1.02] active:scale-[0.98] rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 group border-b-[6px] border-orange-700 active:border-b-0 active:translate-y-1"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="tracking-tight italic uppercase">Gerando Pix...</span>
                          </div>
                        ) : (
                          <>
                            <span className="tracking-tight italic uppercase drop-shadow-sm">{checkout.cta_text || "Garantir Receitas"}</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[9px] text-white/40 uppercase tracking-[0.3em] font-black">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      Acesso Liberado no E-mail
                    </div>
                    <div className="flex items-center gap-5 opacity-20 grayscale brightness-200 contrast-125">
                      <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-5 object-contain" />
                      <div className="w-px h-3 bg-white/20"></div>
                      <ShieldCheck size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Geral */}
        <footer className="w-full py-12 text-center opacity-30 mt-8">
          <p className="text-[10px] font-black text-[#6B5A4E] uppercase tracking-[0.5em]">Plataforma Segura • Pushin Pay</p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}} />
    </div>
  );
}

/**
 * CUSTOM PIX VIEW PARA RECEITAS PRÁTICAS
 * QR Code maximizado e experiência dark ticket.
 */
function PixGeneratedView({ paymentData, paymentStatus, onReset }: any) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentData.qr_code);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const isPaid = paymentStatus === "paid";

  return (
    <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center flex-1 justify-between">
      <div className="w-full flex flex-col items-center">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border transition-all duration-500 ${isPaid ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/5 text-orange-200/50'}`}>
          <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.4)]'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
          </span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-black mb-2 tracking-tight text-white uppercase italic leading-none drop-shadow-md">Pedido Gerado!</h3>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
            Escaneie o QR Code para liberar o seu acesso
          </p>
        </div>

        {/* QR Code Maximizado */}
        <div className="relative group mb-8">
          <div className="absolute -inset-8 bg-orange-500/20 rounded-full blur-[40px] opacity-40 group-hover:opacity-70 transition duration-1000"></div>
          <div className="relative w-[220px] h-[220px] md:w-[240px] md:h-[240px] bg-white p-4 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.04] hover:rotate-1">
            {paymentData.qr_code_base64 ? (
              <img 
                src={paymentData.qr_code_base64} 
                alt="QR Code Pix" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
                <p className="text-[11px] text-[#2D241E] font-black uppercase tracking-widest leading-none opacity-40">Processando...</p>
              </div>
            )}
            
            {/* Overlay Sucesso */}
            {isPaid && (
              <div className="absolute inset-0 bg-green-500/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500 z-10">
                <div className="bg-white p-3 rounded-full mb-3 shadow-xl transform scale-125">
                  <Check className="text-green-600 w-8 h-8" strokeWidth={4} />
                </div>
                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Sucesso!</span>
              </div>
            )}
          </div>
        </div>

        {/* Código Copia e Cola */}
        <div className="w-full space-y-3 mb-8">
          <div 
            onClick={handleCopy}
            className="w-full bg-white/[0.03] rounded-2xl p-4 border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-all group overflow-hidden flex items-center gap-4 relative"
          >
            <p className="text-[11px] font-mono truncate text-white/40 flex-1 select-all">
              {paymentData.qr_code}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "OK" : "COPIAR"}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <Button 
          onClick={handleCopy}
          className="w-full h-18 rounded-[1.25rem] font-black text-base bg-white hover:bg-orange-50 text-[#2D241E] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative flex items-center gap-2.5">
            {copied ? <Check size={20} className="text-orange-600" /> : <Copy size={20} className="text-orange-600" />}
            <span className="uppercase tracking-[0.1em] italic text-lg">{copied ? "Código Copiado!" : "Copiar Código Pix"}</span>
          </div>
        </Button>

        <div className="flex items-center justify-center gap-6 pt-2">
          {!isPaid && (
            <button 
              onClick={onReset}
              className="text-[10px] font-black text-white/20 hover:text-orange-400 flex items-center gap-2 transition-all uppercase tracking-[0.2em] group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Alterar Dados
            </button>
          )}
          <a 
            href={`/pagamento/${paymentData.orderId}?token=${paymentData.accessToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black text-white/20 hover:text-white flex items-center gap-2 transition-all uppercase tracking-[0.2em]"
          >
            <ExternalLink size={14} />
            Ver Checkout
          </a>
        </div>
      </div>
    </div>
  );
}
