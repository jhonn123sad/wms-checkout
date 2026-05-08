import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { ShieldCheck, Zap, Star, ChevronRight, Lock, CheckCircle2, PlayCircle } from "lucide-react";
import { getSlotMedia } from "@/lib/designMediaSlots";

interface SalesLongV1DesignProps {
  checkout: any;
  formData: Record<string, string>;
  loading: boolean;
  paymentData: any;
  paymentStatus: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (name: string, value: string) => void;
  handleResetPayment: () => void;
  InlinePixPanel: any;
}

export function SalesLongV1Design({
  checkout,
  formData,
  loading,
  paymentData,
  paymentStatus,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
  InlinePixPanel
}: SalesLongV1DesignProps) {
  const sections = checkout.checkout_sections || [];
  
  const heroBackground = getSlotMedia(sections, "hero_background");
  const heroProduct = getSlotMedia(sections, "hero_product");
  const vslVideo = getSlotMedia(sections, "vsl_video");
  const proof1 = getSlotMedia(sections, "proof_image_1");
  const proof2 = getSlotMedia(sections, "proof_image_2");
  const bonusMockup = getSlotMedia(sections, "bonus_mockup");

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(checkout.price);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        {heroBackground && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full [&_img]:object-cover [&_img]:h-full">
              <MediaDisplay media={heroBackground} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 pointer-events-none"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Star size={14} className="fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">OFERTA ESPECIAL E LIMITADA</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-4 delay-100">
            {checkout.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200">
            {checkout.subtitle}
          </p>

          {vslVideo ? (
            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-12 animate-in zoom-in-95 delay-300 group cursor-pointer relative">
               <MediaDisplay media={vslVideo} />
            </div>
          ) : heroProduct && (
            <div className="max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800 mb-12 animate-in zoom-in-95 delay-300">
              <MediaDisplay media={heroProduct} />
            </div>
          )}

          <Button 
            onClick={() => document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-16 md:h-20 px-10 text-xl font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {checkout.cta_text || "QUERO COMEÇAR AGORA"}
          </Button>
        </div>
      </section>

      {/* Proof Section */}
      {(proof1 || proof2) && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Resultados Reais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {proof1 && (
                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-50">
                  <MediaDisplay media={proof1} />
                </div>
              )}
              {proof2 && (
                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-50">
                  <MediaDisplay media={proof2} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bonus Section */}
      {bonusMockup && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
               <div className="inline-block px-4 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-widest mb-6">BÔNUS EXCLUSIVO</div>
               <h2 className="text-3xl md:text-4xl font-bold mb-8">Você ainda leva isso de presente:</h2>
               <div className="max-w-sm mx-auto mb-8">
                 <MediaDisplay media={bonusMockup} />
               </div>
               <p className="text-slate-600 text-lg mb-0 italic">"Um complemento perfeito para acelerar seus resultados."</p>
            </div>
          </div>
        </section>
      )}

      {/* Checkout Section */}
      <section id="checkout-form" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">
            <div className="space-y-8 hidden lg:block">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">Sua jornada começa aqui.</h2>
              <div className="space-y-4">
                {[
                  "Acesso imediato e vitalício",
                  "Atualizações constantes sem custo",
                  "Suporte prioritário via WhatsApp",
                  "Garantia incondicional de 7 dias"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-blue-500 shrink-0" size={24} />
                    <span className="text-lg text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 flex items-center gap-6 opacity-30">
                <ShieldCheck size={48} />
                <div className="h-12 w-px bg-white/20"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Pagamento 100% Seguro</p>
                  <p className="text-[10px] text-slate-400">Processado com criptografia SSL militar</p>
                </div>
              </div>
            </div>

            <Card className="bg-white text-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-none">
              <div className="p-8 md:p-10">
                <div className="mb-8 space-y-4">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">INVESTIMENTO HOJE</span>
                     <div className="text-5xl font-black tracking-tighter text-blue-600">
                        {formattedPrice}
                     </div>
                  </div>
                  <div className="h-px w-full bg-slate-100"></div>
                </div>

                {paymentData ? (
                   <InlinePixPanel 
                      paymentData={paymentData}
                      paymentStatus={paymentStatus}
                      onReset={handleResetPayment}
                      formatPrice={(cents: number) => new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(cents / 100)}
                   />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {(checkout.checkout_fields || [])
                        .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
                        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                        .map((field: any) => (
                          <div key={field.field_name} className="space-y-2">
                            <Label htmlFor={field.field_name} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                              {field.field_label}
                              {field.required && <span className="text-blue-500 ml-1">*</span>}
                            </Label>
                            <Input
                              id={field.field_name}
                              type={field.field_type?.replace("hidden:", "") || "text"}
                              required={field.required}
                              className="h-14 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-2xl px-6"
                              value={formData[field.field_name] || ""}
                              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                            />
                          </div>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-16 md:h-20 text-lg font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg transition-all"
                    >
                      {loading ? "PROCESSANDO..." : (checkout.cta_text || "GARANTIR MINHA VAGA")}
                    </Button>

                    <div className="flex flex-col items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        <Lock className="w-3 h-3 text-slate-300" />
                        <span>Checkout Seguro & Criptografado</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-900 text-slate-500 text-center text-xs">
        <div className="container mx-auto px-4 space-y-4">
          <p>© {new Date().getFullYear()} {checkout.title}. Todos os direitos reservados.</p>
          <p className="max-w-2xl mx-auto opacity-50">
            Este site não faz parte do site do Facebook ou do Facebook Inc. Além disso, este site NÃO é endossado pelo Facebook de nenhuma maneira. FACEBOOK é uma marca comercial da FACEBOOK, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
