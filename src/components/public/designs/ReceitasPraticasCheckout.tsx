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
  InlinePixPanel: any; // Mantido para compatibilidade, mas usaremos versão customizada aqui
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D2B1F] font-sans selection:bg-orange-100 overflow-x-hidden flex items-center justify-center p-4">
      {/* Textura de papel sutil */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      
      {/* Gradientes de fundo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-amber-100/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1180px] lg:h-[680px] flex flex-col lg:flex-row gap-0 lg:gap-8 items-center justify-center animate-in fade-in duration-1000">
        
        {/* LADO ESQUERDO: O "Cartão de Receita" */}
        <div className="w-full lg:flex-1 bg-white rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(61,43,31,0.15)] overflow-hidden border border-orange-100/50 flex flex-col h-full relative group">
          
          {/* Capa da Receita / Mídia */}
          <div className="relative w-full aspect-video lg:aspect-auto lg:h-[310px] overflow-hidden">
            {mediaData ? (
              <MediaDisplay media={mediaData} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <Utensils className="w-16 h-16 text-orange-200/50" />
              </div>
            )}
            {/* Overlay gradiente suave na mídia */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            
            {/* Badge Flutuante */}
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-orange-100 shadow-sm flex items-center gap-2">
              <Zap size={14} className="text-orange-600 fill-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]">Acesso Imediato</span>
            </div>
          </div>

          {/* Conteúdo do Cartão */}
          <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-[#2D241E]">
                  {checkout.title}
                </h1>
                <p className="text-base md:text-lg text-[#6B5A4E] max-w-xl leading-relaxed">
                  {checkout.subtitle}
                </p>
              </div>

              {/* Chips de Benefício */}
              <div className="flex flex-wrap gap-3 pt-2">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDFBF7] border border-orange-100 shadow-sm">
                    {item.icon}
                    <span className="text-[11px] font-bold text-[#6B5A4E] uppercase tracking-wide">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selo de Garantia Footer */}
            <div className="hidden lg:flex items-center gap-6 pt-6 opacity-60 border-t border-orange-50 mt-8">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Satisfação Garantida</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-orange-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Pagamento Seguro</span>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Bloco de Compra "Ticket" */}
        <div className={`w-full lg:w-[380px] mt-8 lg:mt-0 lg:absolute lg:right-4 xl:right-8 transition-all duration-500 ${paymentData ? 'lg:scale-105 z-20' : 'z-10'}`}>
          <div className="bg-[#3D2B1F] text-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(61,43,31,0.4)] overflow-hidden relative border border-white/5 p-8 md:p-10">
            
            {/* Decoração de Ticket */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-orange-500 rounded-b-lg"></div>
            
            {paymentData ? (
              <PixGeneratedView 
                paymentData={paymentData}
                paymentStatus={paymentStatus}
                onReset={handleResetPayment}
              />
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-[0.2em]">Investimento Único</span>
                  <div className="text-5xl font-black tracking-tighter text-white">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(checkout.price)}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {activeFields.length > 0 && (
                    <div className="space-y-4">
                      {activeFields.map((field: any) => (
                        <div key={field.id || field.field_name} className="space-y-1.5">
                          <Label 
                            htmlFor={field.field_name} 
                            className="text-[10px] font-bold text-orange-200/60 uppercase tracking-widest ml-1"
                          >
                            {field.field_label}
                            {field.required && <span className="text-orange-500 ml-1">*</span>}
                          </Label>
                          <Input
                            id={field.field_name}
                            type={field.field_type?.replace("hidden:", "") || "text"}
                            placeholder={`Seu ${field.field_label.toLowerCase()}`}
                            required={field.required}
                            className="h-12 bg-white/5 border-white/10 text-white focus:bg-white/10 focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all rounded-xl placeholder:text-white/20 text-sm px-4 shadow-inner"
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
                    className="w-full h-16 text-lg font-black bg-orange-500 hover:bg-orange-400 text-white transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-[0_12px_24px_-8px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 group border-b-4 border-orange-700 active:border-b-0 active:translate-y-1"
                  >
                    {loading ? (
                      <span className="tracking-tight italic uppercase">Gerando Pix...</span>
                    ) : (
                      <>
                        <span className="tracking-tight italic uppercase">{checkout.cta_text || "Garantir Receitas"}</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-2 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">
                    <ShieldCheck className="w-3 h-3 text-orange-500" />
                    <span>Pagamento Seguro via Pix</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-30 grayscale brightness-200">
                    <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-2.5 object-contain" />
                    <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-4 object-contain" />
                    <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-4 object-contain" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CUSTOM PIX VIEW PARA RECEITAS PRÁTICAS
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
    <div className="animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 border transition-all duration-500 ${isPaid ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/5 text-orange-200/60'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-400 animate-pulse'}`}></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-black mb-1 tracking-tight text-white uppercase italic leading-none">Finalize seu Pedido</h3>
        <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
          Escaneie o QR Code abaixo
        </p>
      </div>

      {/* QR Code Magnificado */}
      <div className="relative group mb-8">
        <div className="absolute -inset-6 bg-orange-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition duration-700"></div>
        <div className="relative w-[210px] h-[210px] bg-white p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-[1.05]">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
              <p className="text-[10px] text-[#3D2B1F] font-bold uppercase tracking-widest leading-none">Gerando...</p>
            </div>
          )}
        </div>
      </div>

      {/* Código Copia e Cola Compacto */}
      <div className="w-full space-y-3 mb-6">
        <div 
          onClick={handleCopy}
          className="w-full bg-white/5 rounded-xl p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition-all group overflow-hidden flex items-center gap-3"
        >
          <p className="text-[10px] font-mono truncate text-white/60 flex-1">
            {paymentData.qr_code}
          </p>
          <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest border-l border-white/10 pl-3 shrink-0">
            {copied ? "Copiado" : "Copiar"}
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <Button 
          onClick={handleCopy}
          className="w-full h-14 rounded-xl font-black text-sm bg-orange-500 hover:bg-orange-400 text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg border-b-4 border-orange-700 active:border-b-0 active:translate-y-1"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span className="uppercase tracking-widest italic">{copied ? "Código Copiado!" : "Copiar Código Pix"}</span>
        </Button>

        <div className="flex flex-col gap-3 pt-2">
          {!isPaid && (
            <button 
              onClick={onReset}
              className="text-[9px] font-bold text-white/30 hover:text-white flex items-center justify-center gap-2 transition-all uppercase tracking-[0.2em]"
            >
              <RefreshCw size={12} />
              Alterar dados
            </button>
          )}
          <a 
            href={`/pagamento/${paymentData.orderId}?token=${paymentData.accessToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold text-white/30 hover:text-white flex items-center justify-center gap-2 transition-all uppercase tracking-[0.2em]"
          >
            <ExternalLink size={12} />
            Nova Aba
          </a>
        </div>
      </div>
    </div>
  );
}
