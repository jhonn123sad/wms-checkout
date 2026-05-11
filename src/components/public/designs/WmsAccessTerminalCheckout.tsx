import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSlotMedia } from "@/lib/designMediaSlots";
import React from "react";

/**
 * GlitchTitle
 * Efeito de glitch premium com camadas e burst controlado.
 */
function GlitchTitle({ text, className = "" }: { text: string; className?: string }) {
  const [isGlitching, setIsGlitching] = React.useState(false);
  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = React.useRef(true);

  const clearAllTimeouts = React.useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  React.useEffect(() => {
    isMountedRef.current = true;
    const cycle = () => {
      if (!isMountedRef.current) return;

      const burstDuration = 250 + Math.random() * 200;
      const waitDuration = 3000 + Math.random() * 5000;
      
      const waitTimeout = setTimeout(() => {
        if (!isMountedRef.current) return;
        setIsGlitching(true);
        const burstTimeout = setTimeout(() => {
          if (!isMountedRef.current) return;
          setIsGlitching(false);
          cycle();
        }, burstDuration);
        timeoutsRef.current.push(burstTimeout);
      }, waitDuration);
      
      timeoutsRef.current.push(waitTimeout);
    };
    
    cycle();
    return () => {
      isMountedRef.current = false;
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return (
    <div className={`relative inline-block ${className} ${isGlitching ? "glitch-active" : ""}`} data-text={text}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span className="absolute inset-0 z-0 text-[#00FF41] opacity-60 translate-x-[1px] -translate-y-[0.5px] mix-blend-screen overflow-hidden whitespace-nowrap">
            {text}
          </span>
          <span className="absolute inset-0 z-0 text-[#00e5ff] opacity-60 -translate-x-[1px] translate-y-[0.5px] mix-blend-screen overflow-hidden whitespace-nowrap">
            {text}
          </span>
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-[#00FF41]/40 to-transparent w-full h-[2px] top-[40%] animate-scan-line-burst pointer-events-none shadow-[0_0_10px_#00FF41]"></div>
        </>
      )}
    </div>
  );
}

/**
 * PriceDisplay
 * Renderiza o preço de forma refinada.
 */
function PriceDisplay({ integer, decimal, label = "Valor do acesso", size = "large" }: any) {
  if (size === "small") {
    return (
      <div className="flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41]/20 px-3 py-1 rounded-full backdrop-blur-sm">
        <span className="text-[10px] lg:text-[11px] text-[#00FF41]/60 font-black uppercase tracking-widest">{label}:</span>
        <span className="text-xs font-black text-white italic">R$ {integer},{decimal}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-[10px] lg:text-xs font-black tracking-[0.2em] uppercase italic mb-1">{label}</span>
      <div className="flex items-baseline">
        <span className="text-white text-[10px] lg:text-xs font-black mr-1 opacity-60">R$</span>
        <span className="text-4xl lg:text-[44px] font-black text-white italic tracking-tighter leading-tight">{integer}</span>
        <span className="text-xl lg:text-2xl font-black text-[#00FF41] italic opacity-90 leading-none">,{decimal}</span>
      </div>
      <span className="text-[10px] text-[#00FF41]/60 font-bold uppercase tracking-widest mt-1">Liberação imediata via Pix</span>
    </div>
  );
}

/**
 * WmsAccessTerminalVisualShell
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
  const formatPriceParts = (price: any) => {
    try {
      const numericPrice = typeof price === 'number' 
        ? price 
        : (typeof price === 'string' ? parseFloat(price.replace(/[^\d]/g, '')) / 100 : 0);
      
      const formatted = new Intl.NumberFormat("pt-BR", { 
        style: "currency", 
        currency: "BRL" 
      }).format(isNaN(numericPrice) ? 0 : numericPrice);
      
      const parts = formatted.replace("R$", "").trim().split(",");
      
      return {
        integer: parts[0] || "0",
        decimal: parts[1] || "00",
        full: formatted
      };
    } catch (e) {
      return { integer: "0", decimal: "00", full: "R$ 0,00" };
    }
  };

  const { integer: integerPart, decimal: decimalPart } = formatPriceParts(price);

  return (
    <div className="min-h-screen bg-[#020202] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 relative w-full wms-access-terminal overflow-x-hidden">
      {/* HUD OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.04]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 bg-[#00FF41]/5 animate-pulse"></div>
      </div>

      {/* BACKGROUND SCENE */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,65,0.04)_0%,transparent_70%,black_100%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,255,65,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,.5)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        <div className="absolute inset-0 grayscale opacity-10">{heroBackgroundSlot}</div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen py-0 lg:py-6 px-0 lg:px-4 w-full max-w-full overflow-x-hidden">
        
        {/* Main Container */}
        <div className="w-full max-w-[1100px] bg-[#0A0A0A]/90 backdrop-blur-3xl lg:rounded-[32px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:overflow-visible min-h-screen lg:min-h-0 min-w-0">
          
          {/* LEFT COLUMN: Authority & Visual */}
          <div className="p-6 lg:p-10 flex flex-col py-6 lg:py-10 min-w-0 w-full">
            
            {/* Header */}
            <header className="relative mb-8 lg:mb-10">
              <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                <div className="relative flex items-center justify-center border border-[#00FF41]/20 rounded-xl p-1 bg-black/80 shadow-[0_0_30px_rgba(0,255,65,0.1)] group overflow-hidden w-14 h-14 lg:w-18 lg:h-18">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 to-transparent"></div>
                  <div className="w-full h-full rounded-lg border border-dashed border-[#00FF41]/20 flex items-center justify-center overflow-hidden">
                    {logoIconSlot}
                  </div>
                </div>
                
                <div className="flex-1">
                  <GlitchTitle text="Faça parte da maior Biblioteca do Digital" className="font-black tracking-tighter text-white uppercase italic leading-[1.1] block mb-2 text-[24px] lg:text-[40px] max-w-xl break-words" />
                  <div className="flex items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-[#00FF41]/5 border border-[#00FF41]/10 text-[10px] lg:text-[11px] font-black text-[#00FF41]/70 tracking-[0.2em] rounded uppercase italic">
                      ACESSO EXCLUSIVO
                    </span>
                    <div className="h-[1px] w-6 bg-[#00FF41]/10"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-5 border-l-2 border-[#00FF41]/30">
                <p className="text-gray-400 text-[14px] lg:text-[17px] font-medium leading-[1.5] italic max-w-md break-words">
                  Uma biblioteca exclusiva para quem quer dominar a era da IA e acessar recursos, prompts, métodos e ferramentas poderosas.
                </p>
              </div>
            </header>

            {/* Main Media Showcase */}
            <div className="relative w-full bg-black rounded-2xl border border-white/5 overflow-hidden shadow-2xl group aspect-[16/10] mb-8 lg:mb-10">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center scale-105 group-hover:scale-100 transition-transform duration-700">
                {mainMediaSlot}
              </div>
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xl border border-[#00FF41]/20 px-2.5 py-1 rounded-md z-20 flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse"></div>
                 <span className="text-[10px] lg:text-[11px] text-[#00FF41] font-black uppercase tracking-widest italic">Faça parte — ou fique para trás</span>
              </div>
            </div>

            {/* Proof Section */}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3 mt-8 lg:mt-10">
              {[
                { title: 'Prompts', desc: 'Obtenha vantagem', slot: proofMedia1Slot },
                { title: 'Métodos', desc: 'Aplique com clareza', slot: proofMedia2Slot },
                { title: 'Insights', desc: 'Siga com direção', slot: proofMedia3Slot }
              ].map((card, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center gap-2 group hover:bg-[#00FF41]/5 transition-all duration-300 min-w-0">
                  <div className="bg-black border border-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#00FF41]/20 transition-colors w-10 h-7">
                    {card.slot}
                  </div>
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className="font-black text-gray-400 uppercase tracking-widest italic group-hover:text-[#00FF41]/80 transition-all text-[12px] truncate">{card.title}</span>
                    <span className="text-[11px] text-gray-600 font-medium italic truncate">{card.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Transactional */}
          <div className="bg-[#050505]/90 p-6 lg:p-10 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 relative overflow-hidden min-w-0 w-full">
            
            {/* Payment Header */}
            <div className="relative z-10 mb-8 lg:mb-10">
              {hasPaymentData ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-[#00FF41]/5 border border-[#00FF41]/10 px-4 py-3 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_10px_#00FF41] animate-pulse"></div>
                      <h2 className="text-[10px] lg:text-xs font-black text-[#00FF41] tracking-[0.2em] uppercase italic">Pix gerado</h2>
                    </div>
                    <PriceDisplay integer={integerPart} decimal={decimalPart} label="Total" size="small" />
                  </div>
                  <div className="flex flex-col gap-1 pl-1">
                    <p className="text-[10px] lg:text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed break-words">
                      Escaneie o QR Code ou copie o código Pix para concluir seu acesso.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <PriceDisplay integer={integerPart} decimal={decimalPart} />
                </div>
              )}
            </div>

            {/* Checkout Area */}
            <div className="flex-1 relative z-10 flex flex-col wms-access-pix-panel">
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl transition-all duration-500 ${hasPaymentData ? 'p-4 lg:p-6 overflow-visible' : 'p-6 lg:p-8 overflow-hidden'}`}>
                   {hasPaymentData ? pixSlot : formSlot}
                </div>
            </div>


            {/* Trust Section */}
            <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-white/10 bg-white/[0.02] rounded-xl flex items-center justify-center p-2 shadow-lg">
                  {trustBadgeSlot}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[11px] lg:text-[12px] font-black tracking-widest uppercase italic">Acesso protegido</span>
                  <p className="text-[#00FF41]/50 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest italic">A oportunidade é agora</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end opacity-20">
                <span className="text-[7px] font-mono tracking-tighter">WMS_ACCESS_v1.0.8</span>
                <span className="text-[7px] font-mono text-[#00FF41] tracking-tighter uppercase">SECURE_LINK_ENCRYPTED</span>
              </div>
            </footer>
            
            {/* Background Texture for Right Column */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] sm-scanlines"></div>
          </div>
        </div>
      </div>

      <style>{`
        .wms-access-terminal {
          --wms-neon: #00FF41;
          --wms-cyan: #00e5ff;
        }

        @keyframes scan-line-burst {
          0% { transform: translateY(-150%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(150%); opacity: 0; }
        }
        .animate-scan-line-burst { animation: scan-line-burst 0.8s ease-in-out infinite; }

        .glitch-active {
          animation: glitch-skew 0.25s cubic-bezier(.25,.46,.45,.94) both infinite;
        }
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(3deg); filter: hue-rotate(90deg); }
          40% { transform: skew(-2deg); }
          60% { transform: skew(1deg); filter: hue-rotate(-90deg); }
          80% { transform: skew(-3deg); }
          100% { transform: skew(0deg); }
        }

        .sm-scanlines {
           background: linear-gradient(rgba(255,255,255,0) 50%, rgba(255,255,255,0.015) 50%);
           background-size: 100% 3px;
        }

        /* DEFENSIVE PIX PANEL */
        .wms-access-pix-panel {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .wms-access-pix-panel * {
          max-width: 100%;
          box-sizing: border-box;
        }

        .wms-access-pix-panel img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .wms-access-pix-panel code,
        .wms-access-pix-panel pre,
        .wms-access-pix-panel p,
        .wms-access-pix-panel div {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        @media (max-width: 1024px) {
          .wms-access-terminal, 
          .wms-access-terminal > div {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
          }
        }


      `}</style>
    </div>
  );
}

/**
 * WmsAccessTerminalCheckout
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
  
  const logoIcon = getSlotMedia(sections, "logo_icon");
  const mainMedia = getSlotMedia(sections, "main_media");
  const heroBackground = getSlotMedia(sections, "hero_background");
  const proofMedia1 = getSlotMedia(sections, "proof_media_1");
  const proofMedia2 = getSlotMedia(sections, "proof_media_2");
  const proofMedia3 = getSlotMedia(sections, "proof_media_3");
  const trustBadge = getSlotMedia(sections, "trust_badge");
  const sideVisual = getSlotMedia(sections, "side_visual");

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
                className="text-[10px] lg:text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-[#00FF41] transition-colors italic"
              >
                {field.field_label}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-12 bg-white/[0.04] border-white/5 text-white focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00FF41]/30 focus:border-[#00FF41]/50 transition-all rounded-xl placeholder:text-gray-700 text-base px-5 appearance-none"
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
          className="w-full h-14 bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-black uppercase tracking-tight text-[14px] lg:text-[16px] rounded-2xl shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all active:scale-[0.98] italic px-4"
        >
          {loading ? "Gerando acesso..." : (checkout.cta_text || "Acessar a biblioteca agora")}
        </Button>
      </div>
    </div>
  );

  const formSlot = (
    <form onSubmit={handleSubmit} className="w-full">
      {renderForm()}
    </form>
  );

  const pixSlot = (
    <div className="w-full bg-transparent">
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

