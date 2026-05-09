
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
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {(checkout.checkout_fields || [])
          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((field: any) => (
            <div key={field.id || field.field_name} className="group space-y-1.5">
              <Label 
                htmlFor={field.field_name} 
                className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-white transition-colors"
              >
                {field.field_label}
                {field.required && <span className="text-white/30 ml-1">*</span>}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-12 bg-white/[0.05] border-white/10 text-white focus:bg-white/[0.08] focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all rounded-xl placeholder:text-gray-600 text-sm px-5"
                value={formData[field.field_name] || ""}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
              />
            </div>
          ))}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-16 text-base font-bold bg-white text-black hover:bg-gray-200 transition-all active:scale-[0.98] rounded-xl relative group overflow-hidden shadow-xl"
        >
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                <span>{checkout.cta_text || "Entrar na WMS"}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </Button>
        
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
            <Lock className="w-3 h-3 text-white/40" />
            <span>Pagamento 100% Criptografado</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/30 overflow-x-hidden relative">
      {/* Liquid Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-white/[0.02] blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Content */}
          <div className="flex flex-col space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/80">
                <Zap size={14} className="fill-current text-white" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Acesso Imediato</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white">
                  {checkout.title || "Crie renda com IA sem precisar aparecer"}
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed font-light">
                  {checkout.subtitle || "Aprenda a construir páginas temáticas e Influencers IA no Instagram, mesmo começando do zero."}
                </p>
              </div>
            </div>

            {/* Hero Visual Slot */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                {heroVisual ? (
                  <MediaDisplay media={heroVisual} />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Zap className="w-12 h-12" />
                      <p className="text-[10px] uppercase tracking-widest font-bold">WMS Visual</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features / Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Sem programação",
                "Sem aparecer",
                "Método prático",
                "Comunidade de execução"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <CheckCircle2 size={18} className="text-white/60 shrink-0" />
                  <span className="text-sm font-medium text-gray-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Proof Visual Slot */}
            {proofVisual && (
              <div className="pt-4">
                <div className="rounded-2xl overflow-hidden border border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                  <MediaDisplay media={proofVisual} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Card */}
          <div className="w-full lg:sticky lg:top-12">
            <div className="relative">
              {/* Card Container with Liquid Glass Effect */}
              <div className="absolute inset-0 bg-white/[0.02] rounded-[2.5rem] blur-[2px] border border-white/10"></div>
              <Card className="relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border-white/10 shadow-2xl rounded-[2.5rem]">
                <div className="p-8 md:p-10 relative z-10">
                  
                  {/* Header Info */}
                  <div className="mb-10 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Inscrição Única</span>
                        <div className="text-5xl font-bold text-white tracking-tighter">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(checkout.price)}
                        </div>
                      </div>
                      
                      {/* Trust Badge Slot */}
                      {trustBadge && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/[0.05] p-1">
                          <MediaDisplay media={trustBadge} />
                        </div>
                      )}
                    </div>
                    
                    <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                  </div>

                  {paymentData ? (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
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

                  {/* Trust Elements */}
                  <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <ShieldCheck className="w-5 h-5 text-white/40" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Segurança Total</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Zap className="w-5 h-5 text-white/40" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Acesso Imediato</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Guarantee / Info below card */}
            <div className="mt-6 px-6 text-center">
              <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                Garantia incondicional de 7 dias. Se você não gostar do método, devolvemos seu investimento integralmente.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer footer-less look */}
      <footer className="relative z-10 py-12 border-t border-white/[0.03] mt-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-30 grayscale">
            <span className="text-sm font-bold tracking-tighter">WMS</span>
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            © 2026 Web Money Society • Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
