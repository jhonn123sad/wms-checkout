import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, ChevronRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { getSlotMedia } from "@/lib/designMediaSlots";

export function WmsLiquidCheckout(props: any) {
  const {
    checkout,
    formData,
    loading,
    paymentData,
    paymentStatus,
    handleSubmit,
    handleInputChange,
    handleResetPayment,
    InlinePixPanel
  } = props;

  const sections = checkout.checkout_sections || [];
  const heroVisual = getSlotMedia(sections, "hero_visual");
  const proofVisual = getSlotMedia(sections, "proof_visual");
  const trustBadge = getSlotMedia(sections, "trust_badge");

  const renderForm = () => (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {(checkout.checkout_fields || [])
          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((field: any) => (
            <div key={field.id || field.field_name} className="group space-y-1">
              <Label 
                htmlFor={field.field_name} 
                className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-white transition-colors"
              >
                {field.field_label}
                {field.required && <span className="text-white/30 ml-1">*</span>}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-10 bg-white/[0.05] border-white/10 text-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all rounded-lg placeholder:text-gray-600 text-sm px-4"
                value={formData[field.field_name] || ""}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
              />
            </div>
          ))}
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all active:scale-[0.98] rounded-xl relative group overflow-hidden shadow-lg"
        >
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                <span>{checkout.cta_text || "Entrar na WMS"}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </Button>
        
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-widest font-medium">
            <Lock className="w-2.5 h-2.5 text-white/30" />
            <span>Pagamento Criptografado</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/30 overflow-x-hidden relative flex flex-col items-center">
      {/* Liquid Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1000px] mx-auto px-4 md:px-6 lg:h-screen lg:flex lg:items-center py-6 md:py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Content (Short & Compact) */}
          <div className="flex flex-col space-y-6 md:space-y-8 lg:max-h-full">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-white/80">
                <Zap size={12} className="fill-current text-white" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Acesso Imediato</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white">
                  {checkout.title || "Crie renda com IA sem aparecer"}
                </h1>
                <p className="text-base md:text-lg text-gray-400 max-w-md leading-relaxed font-light">
                  {checkout.subtitle || "Aprenda a construir páginas temáticas e Influencers IA no Instagram."}
                </p>
              </div>
            </div>

            {/* Hero Visual Slot (Compact Height) */}
            <div className="relative group max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm max-h-[220px] md:max-h-[280px]">
                {heroVisual ? (
                  <div className="w-full h-full object-cover aspect-video overflow-hidden">
                    <MediaDisplay media={heroVisual} />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <Zap className="w-8 h-8" />
                      <p className="text-[8px] uppercase tracking-widest font-bold">WMS Visual</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features / Bullets (Chips layout) */}
            <div className="flex flex-wrap gap-2 max-w-md">
              {[
                "Sem programação",
                "Sem aparecer",
                "Método prático",
                "Comunidade VIP"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <CheckCircle2 size={14} className="text-white/40 shrink-0" />
                  <span className="text-[11px] font-medium text-gray-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Proof Visual Slot (Hidden or very small on mobile) */}
            {proofVisual && (
              <div className="hidden md:block pt-2">
                <div className="max-w-[140px] rounded-lg overflow-hidden border border-white/5 opacity-60 hover:opacity-90 transition-opacity grayscale hover:grayscale-0 aspect-square">
                  <MediaDisplay media={proofVisual} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Card (Liquid Glass) */}
          <div className="w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-white/[0.01] rounded-[2rem] blur-[1px] border border-white/5"></div>
              <Card className="relative overflow-hidden bg-white/[0.02] backdrop-blur-2xl border-white/10 shadow-2xl rounded-[2rem]">
                <div className="p-6 md:p-8 relative z-10">
                  
                  {/* Header Info (Price focused) */}
                  <div className="mb-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Pagamento Único</span>
                        <div className="text-4xl font-bold text-white tracking-tighter">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(checkout.price)}
                        </div>
                      </div>
                      
                      {/* Trust Badge Slot */}
                      {trustBadge && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-white/[0.05] p-1 flex-shrink-0">
                          <MediaDisplay media={trustBadge} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                    
                    <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                  </div>

                  {paymentData ? (
                    <div className="animate-in fade-in zoom-in-95 duration-500 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                      <InlinePixPanel 
                        paymentData={paymentData}
                        paymentStatus={paymentStatus}
                        onReset={handleResetPayment}
                        formatPrice={(cents: number) => new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(cents / 100)}
                        theme={{
                          button: "#ffffff",
                          buttonText: "#000000",
                          accent: "#ffffff",
                          card: "transparent"
                        }}
                      />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {renderForm()}
                    </form>
                  )}

                  {/* Trust Elements (Mini) */}
                  <div className="mt-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-white/30" />
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-white/30" />
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Imediato</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Guarantee (Micro copy) */}
            <div className="mt-4 px-4 text-center">
              <p className="text-[9px] text-gray-600 leading-tight font-light">
                7 dias de garantia incondicional. Risco zero.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Minimalist */}
      <footer className="w-full py-4 border-t border-white/[0.02] mt-auto">
        <div className="max-w-[1000px] mx-auto px-6 flex justify-between items-center opacity-20">
          <span className="text-[9px] font-bold tracking-tighter">WMS</span>
          <p className="text-[8px] uppercase tracking-widest">
            © 2026 Web Money Society
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
