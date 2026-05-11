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
  const timeoutsRef = React.useRef<number[]>([]);

  const clearAllTimeouts = React.useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  React.useEffect(() => {
    const cycle = () => {
      const burstDuration = 250 + Math.random() * 200;
      const waitDuration = 3000 + Math.random() * 5000;
      
      const waitTimeout = window.setTimeout(() => {
        setIsGlitching(true);
        const burstTimeout = window.setTimeout(() => {
          setIsGlitching(false);
          cycle();
        }, burstDuration);
        timeoutsRef.current.push(burstTimeout);
      }, waitDuration);
      
      timeoutsRef.current.push(waitTimeout);
    };
    
    cycle();
    return () => clearAllTimeouts();
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
function PriceDisplay({ integer, decimal, label = "VALOR DO ACESSO", size = "large" }: any) {
  if (size === "small") {
    return (
      <div className="flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41]/20 px-3 py-1 rounded-full backdrop-blur-sm">
        <span className="text-[8px] text-[#00FF41]/60 font-black uppercase tracking-widest">{label}:</span>
        <span className="text-xs font-black text-white italic">R$ {integer},{decimal}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-[9px] font-black tracking-[0.2em] uppercase italic mb-1">{label}</span>
      <div className="flex items-baseline">
        <span className="text-white text-[10px] lg:text-xs font-black mr-1 opacity-60">R$</span>
        <span className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-none">{integer}</span>
        <span className="text-xl lg:text-2xl font-black text-[#00FF41] italic opacity-90 leading-none">,{decimal}</span>
      </div>
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
      const formatted = typeof price === "number"
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
        : String(price || "R$ 0,00");
      
      const cleanPrice = formatted.replace("R$", "").trim();
      const parts = cleanPrice.split(",");
      
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
    <div className="min-h-[100dvh] bg-[#020202] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 relative w-full overflow-x-hidden wms-access-terminal">
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

      <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] py-0 lg:py-6 px-0 lg:px-4">
        
        {/* Main Container */}
        <div className="w-full max-w-[1100px] bg-[#0A0A0A]/90 backdrop-blur-3xl lg:rounded-[32px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] overflow-hidden min-h-screen lg:min-h-0 lg:max-h-none">
          
          {/* LEFT COLUMN: Authority & Visual */}
          <div className={`p-6 lg:p-10 flex flex-col transition-all duration-500 ${hasPaymentData ? 'lg:py-6 lg:max-h-[700px]' : 'lg:py-10'}`}>
            
            {/* Header */}
            <header className={`relative transition-all duration-500 ${hasPaymentData ? 'mb-4 lg:mb-6' : 'mb-8 lg:mb-10'}`}>
              <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                <div className={`relative flex items-center justify-center border border-[#00FF41]/20 rounded-xl p-1 bg-black/80 shadow-[0_0_30px_rgba(0,255,65,0.1)] group overflow-hidden transition-all duration-500 ${hasPaymentData ? 'w-10 h-10 lg:w-12 lg:h-12' : 'w-14 h-14 lg:w-18 lg:h-18'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 to-transparent"></div>
                  <div className="w-full h-full rounded-lg border border-dashed border-[#00FF41]/20 flex items-center justify-center overflow-hidden">
                    {logoIconSlot}
                  </div>
                </div>
                
                <div className="flex-1">
                  <GlitchTitle text="WEB MONEY SOCIETY" className={`font-black tracking-tighter text-white uppercase italic leading-none block mb-1.5 transition-all duration-500 ${hasPaymentData ? 'text-lg lg:text-xl' : 'text-2xl lg:text-3xl'}`} />
                  <div className="flex items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-[#00FF41]/5 border border-[#00FF41]/10 text-[8px] font-black text-[#00FF41]/70 tracking-[0.2em] rounded uppercase italic">
                      {hasPaymentData ? 'TERMINAL_SECURE' : 'ESTADO PRIVADO'}
                    </span>
                    <div className="h-[1px] w-6 bg-[#00FF41]/10"></div>
                  </div>
                </div>
              </div>
              
              {!hasPaymentData && (
                <div className="relative pl-5 border-l-2 border-[#00FF41]/30">
                  <p className="text-gray-400 text-xs lg:text-[13px] font-medium leading-relaxed italic max-w-md">
                    Acesso exclusivo ao terminal de operações WMS. Execute sua visão com método e tecnologia de ponta.
                  </p>
                </div>
              )}
            </header>

            {/* Main Media Showcase */}
            <div className={`relative w-full bg-black rounded-2xl border border-white/5 overflow-hidden shadow-2xl group transition-all duration-500 ${hasPaymentData ? 'hidden lg:block aspect-video lg:max-w-[340px] mx-auto mb-4 lg:mb-6' : 'aspect-[16/10] mb-8 lg:mb-10'}`}>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center scale-105 group-hover:scale-100 transition-transform duration-700">
                {mainMediaSlot}
              </div>
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xl border border-[#00FF41]/20 px-2.5 py-1 rounded-md z-20 flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse"></div>
                 <span className="text-[8px] text-[#00FF41] font-black uppercase tracking-widest italic">CONTEÚDO PROTEGIDO</span>
              </div>
            </div>

            {/* Proof Section - Escondida no mobile se tiver paymentData */}
            <div className={`grid gap-3 transition-all duration-500 ${hasPaymentData ? 'hidden lg:grid grid-cols-3 max-w-[340px] mx-auto' : 'grid-cols-1 md:grid-cols-3 mt-auto'}`}>

              {[
                { label: 'OPERAÇÃO', slot: proofMedia1Slot },
                { label: 'REDE', slot: proofMedia2Slot },
                { label: 'RESULTADO', slot: proofMedia3Slot }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center gap-2 group hover:bg-[#00FF41]/5 transition-all duration-300 ${hasPaymentData ? 'flex-col justify-center text-center' : ''}`}>
                  <div className={`bg-black border border-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#00FF41]/20 transition-colors ${hasPaymentData ? 'w-8 h-6' : 'w-10 h-7'}`}>
                    {card.slot}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`font-black text-gray-500 uppercase tracking-widest italic group-hover:text-[#00FF41]/60 transition-all ${hasPaymentData ? 'text-[6px]' : 'text-[8px]'}`}>{card.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Transactional */}
          <div className="bg-[#050505]/90 p-6 lg:p-10 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 relative overflow-hidden">
            
            {/* Payment Header */}
            <div className={`relative z-10 transition-all duration-500 ${hasPaymentData ? 'mb-6 lg:mb-8' : 'mb-8 lg:mb-10'}`}>
              {hasPaymentData ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-[#00FF41]/5 border border-[#00FF41]/10 px-4 py-3 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_10px_#00FF41] animate-pulse"></div>
                      <h2 className="text-[10px] lg:text-xs font-black text-[#00FF41] tracking-[0.2em] uppercase italic">PIX GERADO</h2>
                    </div>
                    <PriceDisplay integer={integerPart} decimal={decimalPart} label="TOTAL" size="small" />
                  </div>
                  <div className="flex flex-col gap-1 pl-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                      Escaneie o QR ou copie o código. 
                    </p>
                    <p className="text-[9px] text-[#00FF41]/60 font-bold uppercase tracking-widest leading-relaxed italic">
                      O acesso será liberado após a confirmação.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <PriceDisplay integer={integerPart} decimal={decimalPart} />
                  <div className="flex items-center gap-2 bg-[#00FF41]/5 border border-[#00FF41]/10 px-3 py-2 rounded-xl">
                    <div className="w-1 h-1 rounded-full bg-[#00FF41]/40"></div>
                    <span className="text-[9px] text-[#00FF41]/60 font-bold uppercase tracking-widest">LIBERAÇÃO AUTOMÁTICA VIA PIX</span>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Area */}
            <div className={`flex-1 relative z-10 flex flex-col wms-access-pix-panel ${hasPaymentData ? 'payment-focus' : ''}`}>
               <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 ${hasPaymentData ? 'p-0 bg-transparent border-none' : 'p-6 lg:p-8'}`}>
                  {hasPaymentData ? (
                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                       {pixSlot}
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                       {formSlot}
                    </div>
                  )}
               </div>
            </div>

            {/* Trust Section */}
            <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-white/10 bg-white/[0.02] rounded-xl flex items-center justify-center p-2 shadow-lg">
                  {trustBadgeSlot}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[9px] font-black tracking-widest uppercase italic">PAGAMENTO SEGURO</span>
                  <p className="text-[#00FF41]/50 text-[8px] font-bold uppercase tracking-widest italic">TERMINAL PROTEGIDO</p>
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

        /* SCOPED PIX PANEL OVERRIDES */
        .wms-access-pix-panel {
          width: 100%;
        }

        /* Status Badge Overrides */
        .wms-access-pix-panel h3 {
          display: inline-flex !important;
          background: rgba(0, 255, 65, 0.1) !important;
          border: 1px solid rgba(0, 255, 65, 0.2) !important;
          color: var(--wms-neon) !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.15em !important;
          margin-bottom: 1.5rem !important;
          font-style: italic !important;
        }
        
        /* Replace text content of h3 if it says something wrong */
        .wms-access-pix-panel h3::after {
          content: "AGUARDANDO PAGAMENTO" !important;
          display: block !important;
        }
        .wms-access-pix-panel h3 {
          font-size: 0 !important; /* Hide original text */
        }

        /* Remove subtext that might be redundant */
        .wms-access-pix-panel .text-center.mb-8 p {
          display: none !important;
        }

        /* Copy Field Block Refinement */
        .wms-access-pix-panel div[class*="bg-white/"][class*="p-4"].rounded-xl {
          padding: 0.85rem 1rem !important;
          background: rgba(255, 255, 255, 0.015) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 14px !important;
          margin-bottom: 0.85rem !important;
          width: 100% !important;
        }

        /* Target the label "Pix Copia e Cola" */
        .wms-access-pix-panel span[class*="text-gray-400"],
        .wms-access-pix-panel p[class*="text-gray-400"] {
          font-size: 9px !important;
          font-weight: 800 !important;
          color: #666 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          margin-bottom: 0.4rem !important;
          display: block !important;
          text-align: left !important;
        }

        .wms-access-pix-panel .font-mono.text-xs {
          font-size: 9px !important;
          line-height: 1.5 !important;
          color: #999 !important;
          text-align: left !important;
          word-break: break-all !important;
          overflow-wrap: anywhere !important;
          max-height: 54px !important;
          overflow-y: auto !important;
          scrollbar-width: none !important;
          white-space: normal !important;
        }
        .wms-access-pix-panel .font-mono.text-xs::-webkit-scrollbar { display: none; }

        /* Remove small copy button next to field */
        .wms-access-pix-panel div[class*="justify-between"] button {
          display: none !important;
        }

        /* Main Copy Button Style */
        .wms-access-pix-panel button.w-full.py-4 {
          height: 3rem !important;
          font-size: 0.75rem !important;
          border-radius: 12px !important;
          font-weight: 900 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          background: var(--wms-neon) !important;
          color: black !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(0, 255, 65, 0.1) !important;
          transition: all 0.2s ease !important;
          font-style: italic !important;
          margin-top: 0.25rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .wms-access-pix-panel button.w-full.py-4:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(0, 255, 65, 0.2) !important;
          filter: brightness(1.05);
        }

        /* Secondary Actions Style - Ghost Links */
        .wms-access-pix-panel .flex.flex-col.gap-2.mt-6,
        .wms-access-pix-panel .flex.flex-wrap.justify-center.gap-4.mt-8 {
          margin-top: 1.25rem !important;
          gap: 0.6rem !important;
        }

        .wms-access-pix-panel a, 
        .wms-access-pix-panel button[class*="text-[9px]"],
        .wms-access-pix-panel button[class*="text-xs"][class*="text-gray-500"] {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #666 !important;
          padding: 8px 12px !important;
          border-radius: 10px !important;
          height: auto !important;
          font-size: 8px !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          box-shadow: none !important;
          transition: all 0.2s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-decoration: none !important;
          text-transform: uppercase !important;
        }

        .wms-access-pix-panel a:hover, 
        .wms-access-pix-panel button:hover {
          color: #888 !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* QR Code Card Refinement */
        .wms-access-pix-panel .bg-white.p-4 {
          padding: 0.6rem !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.5) !important;
          border: 4px solid #080808 !important;
          width: 180px !important;
          height: 180px !important;
          margin-bottom: 0.5rem !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        @media (max-width: 1024px) {
          .wms-access-pix-panel {
            padding-bottom: 2rem !important;
          }
          .wms-access-pix-panel .bg-white.p-4 {
            width: 180px !important;
            height: 180px !important;
            max-width: 80vw !important;
            max-height: 80vw !important;
          }
          .wms-access-pix-panel button.w-full.py-4 {
            height: 3.25rem !important;
            font-size: 0.75rem !important;
          }
          /* Garantir que o container do checkout no mobile não corte conteúdo */
          .wms-access-terminal, 
          .wms-access-terminal > div,
          .wms-access-terminal .max-w-\[1100px\] {
            height: auto !important;
            min-height: 100vh !important;
            overflow: visible !important;
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
                className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-[#00FF41] transition-colors italic"
              >
                {field.field_label}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-12 bg-white/[0.04] border-white/5 text-white focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00FF41]/30 focus:border-[#00FF41]/50 transition-all rounded-xl placeholder:text-gray-700 text-sm px-5"
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
          className="w-full h-14 bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-black uppercase tracking-[0.1em] text-sm lg:text-base rounded-2xl shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all active:scale-[0.98] italic"
        >
          {loading ? "CONECTANDO..." : (checkout.cta_text || "LIBERAR ACESSO AGORA")}
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

