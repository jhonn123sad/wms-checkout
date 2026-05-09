import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, ChevronRight, CheckCircle2, ShieldCheck, Zap, Globe, Award } from "lucide-react";
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
    <div className="w-full space-y-3">
      <div className="space-y-2">
        {(checkout.checkout_fields || [])
          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((field: any) => (
            <div key={field.id || field.field_name} className="group space-y-1">
              <Label 
                htmlFor={field.field_name} 
                className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-600 transition-colors"
              >
                {field.field_label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-11 bg-white border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all rounded-xl placeholder:text-slate-300 text-sm px-4 shadow-sm"
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
          className="w-full h-14 text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-[0.98] rounded-2xl relative group overflow-hidden shadow-lg shadow-blue-200"
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
        
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            <Lock className="w-3 h-3 text-blue-500" />
            <span>Pagamento Seguro 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden relative flex flex-col items-center">
      {/* Liquid Glass Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-purple-100/30 blur-[150px] rounded-full"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-6 lg:h-screen lg:flex lg:items-center py-6 md:py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-16 items-center w-full">
          
          {/* Left Column: Brand & Hero */}
          <div className="flex flex-col space-y-5 md:space-y-8 lg:max-h-full">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
                <Globe size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Web Money Society</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900">
                  {checkout.title || "Crie renda com IA sem aparecer"}
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                  {checkout.subtitle || "Aprenda a construir páginas e Influencers AI no Instagram, mesmo começando do zero."}
                </p>
              </div>
            </div>

            {/* Hero Visual Slot (Compact & Glassy) */}
            <div className="relative group max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white bg-white/40 backdrop-blur-md shadow-xl max-h-[170px] md:max-h-[240px]">
                {heroVisual ? (
                  <div className="w-full h-full object-cover aspect-video overflow-hidden">
                    <MediaDisplay media={heroVisual} />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Zap className="w-10 h-10 text-blue-600" />
                      <p className="text-[10px] uppercase tracking-widest font-black">Design Premium</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features / Bullets (Modern Chips) */}
            <div className="flex flex-wrap gap-2.5 max-w-lg">
              {[
                { text: "Sem programação", icon: Zap },
                { text: "Sem aparecer", icon: CheckCircle2 },
                { text: "Método prático", icon: Award },
                { text: "Comunidade ativa", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 border border-slate-100 shadow-sm backdrop-blur-sm hover:border-blue-200 transition-colors">
                  <item.icon size={15} className="text-blue-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Proof Visual (Mini Supporting Card) */}
            {proofVisual && (
              <div className="hidden lg:block pt-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                <div className="max-w-[120px] rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-[-3deg] hover:rotate-0 transition-all duration-500 aspect-square">
                  <MediaDisplay media={proofVisual} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Card (Premium Liquid Glass) */}
          <div className="w-full relative">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full"></div>
            <div className="relative">
              {/* Card Container */}
              <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] blur-[2px] border border-white/60"></div>
              <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem]">
                <div className="p-7 md:p-10 relative z-10">
                  
                  {/* Price & Badge Header */}
                  <div className="mb-8 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.2em]">Investimento</span>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(checkout.price)}
                        </div>
                      </div>
                      
                      {/* Trust Badge Slot */}
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white bg-slate-50/50 shadow-sm flex-shrink-0 flex items-center justify-center p-1.5">
                        {trustBadge ? (
                          <MediaDisplay media={trustBadge} />
                        ) : (
                          <ShieldCheck className="w-8 h-8 text-blue-500 opacity-30" />
                        )}
                      </div>
                    </div>
                    
                    <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
                  </div>

                  {/* Dynamic Panel (Form or Pix) */}
                  <div className="relative">
                    {paymentData ? (
                      <div className="animate-in fade-in zoom-in-95 duration-500 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                        <InlinePixPanel 
                          paymentData={paymentData}
                          paymentStatus={paymentStatus}
                          onReset={handleResetPayment}
                          formatPrice={(cents: number) => new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(cents / 100)}
                          theme={{
                            button: "#2563eb",
                            buttonText: "#ffffff",
                            accent: "#2563eb",
                            card: "transparent"
                          }}
                        />
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderForm()}
                      </form>
                    )}
                  </div>

                  {/* Micro Trust Info */}
                  <div className="mt-8 flex items-center justify-center gap-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Acesso Vitalício</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SSL Seguro</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Guarantee Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
              <CheckCircle2 size={12} className="text-blue-400" />
              <p className="text-[10px] font-medium tracking-tight">
                7 dias de garantia ou seu dinheiro de volta.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer minimal */}
      <footer className="w-full py-6 mt-auto">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200/50 pt-6">
          <div className="flex items-center gap-2 grayscale opacity-40">
             <span className="text-xs font-black tracking-tighter">WMS</span>
             <div className="h-3 w-px bg-slate-300"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Web Money Society</span>
          </div>
          <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-medium">
            © 2026 • Todos os direitos reservados
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(37, 99, 235, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.2);
        }
      `}} />
    </div>
  );
}
