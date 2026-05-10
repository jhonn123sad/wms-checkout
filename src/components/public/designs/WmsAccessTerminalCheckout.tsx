import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSlotMedia } from "@/lib/designMediaSlots";
import React from "react";

/**
 * GlitchTitle
 * Componente interno para aplicar o efeito de glitch no título de forma controlada.
 */
function GlitchTitle({ text }: { text: string }) {
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    // Ciclo de glitch: 80-90% normal, 10-20% glitch bursts
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 800); // burst curto de 800ms
    }, 5000 + Math.random() * 2000); // Ciclo entre 5s e 7s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative inline-block ${isGlitching ? "animate-glitch-premium" : ""}`}>
      {text}
    </div>
  );
}

/**
 * WmsAccessTerminalVisualShell
 * 
 * Camada visual inspirada no terminal privado WMS.
 * Estética: Dark, Green Neon, Glitch, Glassmorphism.
 */
function WmsAccessTerminalVisualShell({
  checkout,
  price,
  logoIconSlot,
  mainMediaSlot,
  heroBackgroundSlot,
  proofMedia1Slot,
  proofMedia2Slot,
  proofMedia3Slot,
  trustBadgeSlot,
  sideVisualSlot,
  formSlot,
  pixSlot,
  hasPaymentData,
}: any) {
  const formattedPrice = typeof price === "number"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
    : price;

  const [integerPart, decimalPart] = formattedPrice.replace("R$", "").trim().split(",");

  return (
    <div className="min-h-[100dvh] bg-[#020202] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 relative overflow-x-hidden">
      {/* GLOBAL HUD OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 scanline animate-scanline"></div>
      </div>

      {/* HERO_BACKGROUND_SLOT */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.05)_0%,transparent_70%,black_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[#00FF41]/3 to-cyan-500/3 blur-[180px] animate-pulse"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(0,255,65,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,.5)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0">{heroBackgroundSlot}</div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] py-0 lg:py-8 px-0 lg:px-6">
        
        {/* Container Principal */}
        <div className="w-full max-w-[1200px] bg-[#0A0A0A]/70 backdrop-blur-3xl lg:rounded-[32px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] overflow-hidden min-h-screen lg:min-h-0">
          
          {/* Desktop Left Column / Mobile Header & Media Section */}
          <div className={`p-5 lg:p-10 flex flex-col ${hasPaymentData ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Header Area */}
            <header className="mb-6 lg:mb-8 relative z-10">
              <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                {/* LOGO_ICON_SLOT */}
                <div className="w-12 h-12 lg:w-16 lg:h-16 relative flex items-center justify-center border border-[#00FF41]/20 rounded-full p-1 bg-black/80 shadow-[0_0_20px_rgba(0,255,65,0.1)] group shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 to-cyan-500/10 opacity-40 rounded-full"></div>
                  <div className="w-full h-full rounded-full border border-dashed border-[#00FF41]/20 flex items-center justify-center overflow-hidden">
                    {logoIconSlot}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xl lg:text-3xl font-black tracking-tighter text-white uppercase italic mb-1 lg:mb-2 break-words leading-tight lg:leading-none">
                    <GlitchTitle text="WEB MONEY SOCIETY" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-1.5 py-0.5 bg-[#00FF41]/5 border border-[#00FF41]/20 text-[8px] lg:text-[9px] font-black text-[#00FF41]/70 tracking-[0.1em] rounded-sm uppercase italic">
                      ACESSO PRIVADO
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00FF41]/50 to-transparent"></div>
                <p className="text-gray-400 text-xs lg:text-sm font-medium leading-relaxed italic pl-4 lg:pl-6 max-w-2xl">
                  Acesso privado para quem quer entrar no jogo com método, visão e execução.
                </p>
              </div>
            </header>

            {/* MAIN_MEDIA_SLOT */}
            <div className="relative aspect-video w-full bg-[#050505]/80 rounded-xl lg:rounded-2xl border border-white/5 overflow-hidden mb-6 lg:mb-8 shadow-2xl shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {mainMediaSlot}
              </div>
              <div className="absolute top-3 right-3 lg:top-4 lg:right-4 bg-black/60 backdrop-blur-md border border-[#00FF41]/20 px-2 py-1 rounded-sm z-20">
                 <span className="text-[8px] text-[#00FF41] font-black uppercase tracking-widest italic">TERMINAL SEGURO</span>
              </div>
            </div>

            {/* Proof Units */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-auto">
              {[
                { id: '1', label: 'Conexão', slot: proofMedia1Slot },
                { id: '2', label: 'Estratégia', slot: proofMedia2Slot },
                { id: '3', label: 'Execução', slot: proofMedia3Slot }
              ].map((card, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-2 lg:p-3 rounded-lg lg:rounded-xl flex items-center gap-3">
                  <div className="w-10 h-7 bg-black border border-white/5 rounded flex items-center justify-center overflow-hidden shrink-0">
                    {card.slot}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[8px] font-black text-gray-500 uppercase italic truncate">{card.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Status Header - Pix Generated */}
          {hasPaymentData && (
            <div className="lg:hidden p-5 border-b border-white/5 bg-[#050505]/80 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse"></div>
                <h2 className="text-[9px] font-black text-[#00FF41] tracking-[0.3em] uppercase italic">PAGAMENTO SOLICITADO</h2>
              </div>
              <div className="flex items-center gap-1 bg-[#00FF41]/10 px-3 py-1 rounded-full border border-[#00FF41]/20">
                <span className="text-[8px] text-white/50 font-black uppercase">VALOR:</span>
                <span className="text-xs font-black text-white italic">R$ {integerPart},{decimalPart}</span>
              </div>
            </div>
          )}

          {/* Right Column - Checkout Terminal */}
          <div className="bg-[#050505]/60 p-5 lg:p-10 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 relative">
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] sm-scanlines"></div>

            {/* Price Display */}
            {!hasPaymentData ? (
              <div className="mb-6 lg:mb-8 relative z-10">
                <span className="text-gray-500 text-[9px] font-black tracking-[0.2em] uppercase italic mb-2 block">VALOR DO ACESSO</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter">R$ {integerPart}</span>
                  <span className="text-xl lg:text-2xl font-black text-[#00FF41] italic opacity-80">,{decimalPart}</span>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex mb-6 relative z-10 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl items-center justify-between">
                 <span className="text-gray-500 text-[8px] font-black tracking-[0.2em] uppercase italic">TOTAL</span>
                 <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-white italic">R$ {integerPart},{decimalPart}</span>
                 </div>
              </div>
            )}

            {/* Main Form/Pix Area */}
            <div className="flex-1 relative z-10 flex flex-col wms-access-pix-panel">
               <div className={`flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 lg:p-8 flex flex-col ${hasPaymentData ? 'justify-start' : 'justify-center'}`}>
                  {hasPaymentData ? (
                    <div className="bg-transparent">{pixSlot}</div>
                  ) : (
                    formSlot
                  )}
               </div>
            </div>

            {/* Footer Trust Section */}
            <footer className="mt-6 lg:mt-8 pt-5 border-t border-white/5 flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 border border-white/5 bg-white/[0.03] rounded-xl flex items-center justify-center p-2">
                {trustBadgeSlot}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[9px] font-black tracking-[0.1em] uppercase italic">PAGAMENTO SEGURO</span>
                <p className="text-gray-600 text-[8px] font-bold uppercase tracking-widest italic">LIBERAÇÃO IMEDIATA</p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline { animation: scanline 12s linear infinite; }
        .scanline {
          width: 100%;
          height: 150px;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 255, 65, 0.08) 50%, transparent 100%);
        }
        
        .animate-glitch-premium {
          position: relative;
          text-shadow: 0.05em 0 0 rgba(0, 255, 65, 0.75), -0.025em -0.05em 0 rgba(0, 229, 255, 0.75), 0.025em 0.05em 0 rgba(255, 0, 0, 0.75);
          animation: glitch 250ms linear infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(0); text-shadow: 0.05em 0 0 rgba(0, 255, 65, 0.75), -0.025em -0.05em 0 rgba(0, 229, 255, 0.75); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); text-shadow: -0.05em -0.025em 0 rgba(0, 255, 65, 0.75), 0.025em 0.025em 0 rgba(0, 229, 255, 0.75); }
          75% { transform: translate(-1px, -1px); }
          100% { transform: translate(0); }
        }

        .sm-scanlines {
           background: linear-gradient(rgba(255,255,255,0) 50%, rgba(255,255,255,0.02) 50%);
           background-size: 100% 4px;
        }

        .wms-access-pix-panel button {
          height: 2.75rem !important;
          font-size: 0.75rem !important;
          border-radius: 12px !important;
          font-weight: 900 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          background-color: #00FF41 !important;
          color: black !important;
          transition: all 0.2s ease !important;
        }
        .wms-access-pix-panel button:hover {
          opacity: 0.9 !important;
          transform: translateY(-1px) !important;
        }
      `}</style>
    </div>
  );
}

/**
 * WmsAccessTerminalCheckout
 * 
 * Componente principal que gerencia a integração de dados e lógica.
 * Segue o padrão estabelecido no WmsLiquidCheckout para garantir compatibilidade.
 */
export function WmsAccessTerminalCheckout(props: any) {
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
  
  // Mapeamento de Slots
  const logoIcon = getSlotMedia(sections, "logo_icon");
  const mainMedia = getSlotMedia(sections, "main_media");
  const heroBackground = getSlotMedia(sections, "hero_background");
  const proofMedia1 = getSlotMedia(sections, "proof_media_1");
  const proofMedia2 = getSlotMedia(sections, "proof_media_2");
  const proofMedia3 = getSlotMedia(sections, "proof_media_3");
  const trustBadge = getSlotMedia(sections, "trust_badge");
  const sideVisual = getSlotMedia(sections, "side_visual");

  // Helper para renderizar slots com fallback visual
  const renderSlot = (media: any, fallbackLabel: string) => {
    if (media) return <MediaDisplay media={media} />;
    return (
      <div className="w-full h-full flex items-center justify-center p-2 opacity-10">
        <span className="text-[7px] text-white font-black uppercase italic">{fallbackLabel}</span>
      </div>
    );
  };

  const logoIconSlot = renderSlot(logoIcon, "LOGO");
  const mainMediaSlot = mainMedia ? (
    <div className="w-full h-full flex items-center justify-center">
      <MediaDisplay media={mainMedia} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center opacity-10 p-6">
      <div className="text-white font-black uppercase tracking-[0.5em] text-xl lg:text-2xl text-center italic">
        TERMINAL_MEDIA
      </div>
    </div>
  );
  
  const heroBackgroundSlot = heroBackground ? (
    <div className="w-full h-full object-cover">
      <MediaDisplay media={heroBackground} />
    </div>
  ) : null;

  const proofMedia1Slot = renderSlot(proofMedia1, "P1");
  const proofMedia2Slot = renderSlot(proofMedia2, "P2");
  const proofMedia3Slot = renderSlot(proofMedia3, "P3");
  const trustBadgeSlot = renderSlot(trustBadge, "T");
  const sideVisualSlot = renderSlot(sideVisual, "S");

  // --- RENDER FORM ---
  const renderForm = () => (
    <div className="w-full space-y-5">
      <div className="space-y-3">
        {(checkout.checkout_fields || [])
          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((field: any) => (
            <div key={field.id || field.field_name} className="group space-y-1.5">
              <Label 
                htmlFor={field.field_name} 
                className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-[#00FF41] transition-colors italic"
              >
                {field.field_label}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Informe seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-12 bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05] focus:ring-1 focus:ring-[#00FF41]/30 focus:border-[#00FF41]/50 transition-all rounded-xl placeholder:text-gray-700 text-sm px-5"
                value={formData[field.field_name] || ""}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
              />
            </div>
          ))}
      </div>

      <div className="pt-3">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-black uppercase tracking-[0.1em] text-sm lg:text-base rounded-2xl shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all active:scale-[0.98]"
        >
          {loading ? "PROCESSANDO..." : (checkout.cta_text || "LIBERAR ACESSO AGORA")}
        </Button>
      </div>
    </div>
  );

  const formSlot = (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {renderForm()}
    </form>
  );

  const pixSlot = (
    <div className="animate-in fade-in zoom-in-95 duration-500 bg-transparent">
      <div className="relative z-30">
        <InlinePixPanel 
          paymentData={paymentData}
          paymentStatus={paymentStatus}
          onReset={handleResetPayment}
          formatPrice={(cents: number) => new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(cents / 100)}
          theme={{
            button: "#00FF41",
            buttonText: "#000000",
            accent: "#00FF41",
            card: "transparent"
          }}
        />
      </div>
    </div>
  );

  return (
    <WmsAccessTerminalVisualShell 
      checkout={checkout}
      price={checkout.price}
      logoIconSlot={logoIconSlot}
      mainMediaSlot={mainMediaSlot}
      heroBackgroundSlot={heroBackgroundSlot}
      proofMedia1Slot={proofMedia1Slot}
      proofMedia2Slot={proofMedia2Slot}
      proofMedia3Slot={proofMedia3Slot}
      trustBadgeSlot={trustBadgeSlot}
      sideVisualSlot={sideVisualSlot}
      formSlot={formSlot}
      pixSlot={pixSlot}
      hasPaymentData={!!paymentData}
    />
  );
}
