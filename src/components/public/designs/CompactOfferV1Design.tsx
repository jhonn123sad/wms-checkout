import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { ShieldCheck, Lock, ChevronRight, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { getSlotMedia } from "@/lib/designMediaSlots";

interface CompactOfferV1DesignProps {
  checkout: any;
  formData: Record<string, string>;
  loading: boolean;
  paymentData: any;
  paymentStatus: string;
  handleSubmit: (e: React.FormEvent) => Promise<any>;
  handleInputChange: (name: string, value: string) => void;
  handleResetPayment: () => void;
  InlinePixPanel: any;
}

export function CompactOfferV1Design({
  checkout,
  formData,
  loading,
  paymentData,
  paymentStatus,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
  InlinePixPanel
}: CompactOfferV1DesignProps) {
  const sections = checkout.checkout_sections || [];
  
  const coverImage = getSlotMedia(sections, "cover_image");
  const sideImage = getSlotMedia(sections, "side_image");
  const trustBadge = getSlotMedia(sections, "trust_badge");

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(checkout.price);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Visual Column */}
          <div className="space-y-6 lg:sticky lg:top-12">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-slate-100 relative group">
              {coverImage ? (
                <MediaDisplay media={coverImage} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">Sua Oferta Aqui</p>
                  </div>
                </div>
              )}
              {trustBadge && (
                <div className="absolute top-6 right-6 w-24 h-24 pointer-events-none drop-shadow-xl animate-pulse">
                  <MediaDisplay media={trustBadge} />
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
               <h1 className="text-3xl font-black tracking-tight leading-tight">
                  {checkout.title}
               </h1>
               <p className="text-slate-500 leading-relaxed">
                  {checkout.subtitle}
               </p>
               
               <div className="grid grid-cols-2 gap-4 pt-4">
                  {sideImage ? (
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-50">
                       <MediaDisplay media={sideImage} />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] rounded-2xl border border-dashed border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300">
                       <ImageIcon className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  <div className="space-y-3 flex flex-col justify-center">
                     {[
                       "Acesso Imediato",
                       "Suporte 24/7",
                       "Garantia Total"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                           <CheckCircle2 className="text-emerald-500" size={16} />
                           <span className="text-sm font-medium text-slate-700">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="w-full lg:pt-0">
            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
              <div className="p-8 md:p-10">
                 <div className="mb-10 space-y-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOTAL A PAGAR</span>
                       <div className="text-5xl font-black tracking-tighter text-slate-900">
                          {formattedPrice}
                       </div>
                    </div>
                    <div className="h-1.5 w-16 bg-emerald-500 rounded-full"></div>
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
                      theme={{
                        button: "#10b981",
                        buttonText: "#ffffff",
                        accent: "#10b981"
                      }}
                   />
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        {(checkout.checkout_fields || [])
                          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
                          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                          .map((field: any) => (
                            <div key={field.field_name} className="space-y-2">
                              <Label htmlFor={field.field_name} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                {field.field_label}
                                {field.required && <span className="text-emerald-500 ml-1">*</span>}
                              </Label>
                              <Input
                                id={field.field_name}
                                type={field.field_type?.replace("hidden:", "") || "text"}
                                required={field.required}
                                className="h-14 bg-slate-50 border-slate-100 focus:ring-emerald-500 rounded-2xl px-6"
                                value={formData[field.field_name] || ""}
                                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                              />
                            </div>
                        ))}
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 md:h-20 text-lg font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg transition-all"
                      >
                        {loading ? "GERANDO PIX..." : (checkout.cta_text || "CONCLUIR PEDIDO")}
                      </Button>

                      <div className="flex items-center justify-center gap-6 pt-2 opacity-50">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter">
                          <ShieldCheck size={14} />
                          <span>Seguro</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter">
                          <Lock size={14} />
                          <span>Privado</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter">
                          <CheckCircle2 size={14} />
                          <span>Oficial</span>
                        </div>
                      </div>
                   </form>
                 )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-300 text-[10px] font-medium uppercase tracking-widest">
        © {new Date().getFullYear()} {checkout.title}
      </footer>
    </div>
  );
}
