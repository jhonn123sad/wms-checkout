/**
 * RECEITAS PRÁTICAS CHECKOUT DESIGN
 * Um design visualmente quente, apetitoso e premium para produtos de culinária.
 * Mantém INTEGRALMENTE a lógica de Pix e formulários do sistema base.
 */
import { ShieldCheck, CheckCircle2, Zap, Lock, CreditCard, ChevronRight, Utensils, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/public/MediaDisplay";

interface ReceitasPraticasCheckoutProps {
  checkout: any;
  formData: Record<string, string>;
  loading: boolean;
  paymentData: any;
  paymentStatus: string;
  mediaData: any;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
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
  InlinePixPanel
}: ReceitasPraticasCheckoutProps) {
  
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  const benefits = [
    { icon: <Utensils size={18} className="text-orange-500" />, text: "Receitas rápidas para o dia a dia" },
    { icon: <Clock size={18} className="text-orange-500" />, text: "Preparo prático em poucos minutos" },
    { icon: <BookOpen size={18} className="text-orange-500" />, text: "Ingredientes simples e acessíveis" }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D241E] font-sans selection:bg-orange-200 overflow-x-hidden">
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 lg:gap-16 items-start">
          
          {/* Coluna Esquerda: Conteúdo e Mídia */}
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700">
                <span className="text-[10px] font-bold uppercase tracking-widest">Receitas Práticas</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-[#2D241E]">
                  {checkout.title}
                </h1>
                <p className="text-lg md:text-xl text-[#5C4D42] max-w-2xl leading-relaxed">
                  {checkout.subtitle}
                </p>
              </div>
            </div>

            {/* Mídia Principal */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-orange-100/50 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative aspect-video rounded-[1.5rem] overflow-hidden border border-orange-100 bg-white shadow-xl">
                {mediaData ? (
                  <MediaDisplay media={mediaData} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#FDFBF7]">
                    <div className="flex flex-col items-center gap-3">
                      <Utensils className="w-12 h-12 text-orange-100" />
                      <p className="text-orange-200 font-medium text-sm uppercase tracking-wider">Aprenda Agora</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-orange-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span className="text-sm font-semibold text-[#5C4D42] leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
            
            {/* Trust Footer Desktop */}
            <div className="hidden lg:flex items-center gap-8 opacity-40 grayscale contrast-125 pt-4">
              <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-6 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-5 object-contain" />
            </div>
          </div>

          {/* Coluna Direita: Card de Pagamento */}
          <div className="w-full lg:sticky lg:top-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <Card className="overflow-hidden bg-white border-orange-100 shadow-[0_24px_48px_-12px_rgba(45,36,30,0.12)] rounded-[2rem] relative border">
              <div className="p-6 md:p-8 relative z-10">
                
                {/* Preço e Chamada */}
                <div className="mb-6 flex flex-col gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em]">Acesso Imediato</span>
                    <div className="flex items-baseline gap-2">
                      <div className="text-5xl font-black text-[#2D241E] tracking-tighter">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(checkout.price)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-orange-100 via-orange-50/50 to-transparent"></div>
                  
                  <div className="flex items-center gap-3 text-[#5C4D42]">
                    <ShieldCheck className="text-orange-500 shrink-0" size={18} />
                    <p className="text-xs font-medium leading-tight">
                      {paymentData 
                        ? "Escaneie o QR Code abaixo para liberar seu acesso agora." 
                        : "Pagamento 100% seguro processado via Pix com entrega imediata."}
                    </p>
                  </div>
                </div>

                {paymentData ? (
                  <div className="animate-in zoom-in-95 duration-500">
                    <InlinePixPanel 
                      paymentData={paymentData}
                      paymentStatus={paymentStatus}
                      onReset={handleResetPayment}
                      formatPrice={(cents) => new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(cents / 100)}
                      theme={{
                        button: "#F97316",
                        buttonText: "#FFFFFF",
                        accent: "#F97316",
                        card: "#FFFDF9"
                      }}
                    />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {activeFields.length > 0 && (
                      <div className="space-y-4">
                        {activeFields.map((field: any) => (
                          <div key={field.id || field.field_name} className="space-y-1.5">
                            <Label 
                              htmlFor={field.field_name} 
                              className="text-[10px] font-bold text-[#8C7A6D] uppercase tracking-widest ml-1"
                            >
                              {field.field_label}
                              {field.required && <span className="text-orange-500 ml-1">*</span>}
                            </Label>
                            <Input
                              id={field.field_name}
                              type={field.field_type?.replace("hidden:", "") || "text"}
                              placeholder={`Seu ${field.field_label.toLowerCase()}`}
                              required={field.required}
                              className="h-12 bg-[#FDFBF7] border-orange-100 text-[#2D241E] focus:bg-white focus:ring-1 focus:ring-orange-200 focus:border-orange-300 transition-all rounded-xl placeholder:text-[#C5B7AD] text-sm px-4 shadow-sm"
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 text-lg font-black bg-orange-500 hover:bg-orange-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-[0_12px_24px_-8px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 group"
                      >
                        {loading ? (
                          <span className="animate-pulse tracking-tight">Gerando Pix...</span>
                        ) : (
                          <>
                            <span className="tracking-tight italic uppercase">{checkout.cta_text || "Comprar Agora"}</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                      
                      <div className="mt-6 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-[#8C7A6D] uppercase tracking-[0.2em] font-bold">
                          <Lock className="w-3 h-3 text-orange-400" />
                          <span>Pagamento Seguro</span>
                        </div>
                        
                        {/* Logos Mobile */}
                        <div className="flex lg:hidden items-center gap-6 opacity-40 grayscale contrast-125">
                          <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-3 object-contain" />
                          <img src="https://logodownload.org/wp-content/uploads/2014/10/mastercard-logo-4.png" alt="Mastercard" className="h-4 object-contain" />
                          <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo.png" alt="PIX" className="h-4 object-contain" />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          </div>

        </div>
      </main>

      <footer className="w-full py-10 text-center relative z-10">
        <p className="text-[10px] font-bold text-[#C5B7AD] uppercase tracking-[0.4em]">Plataforma Segura via Pushin Pay</p>
      </footer>
    </div>
  );
}
