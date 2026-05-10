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

  React.useEffect(() => {
    const cycle = () => {
      const burstDuration = 350 + Math.random() * 300;
      const waitDuration = 4000 + Math.random() * 3000;
      
      setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
          cycle();
        }, burstDuration);
      }, waitDuration);
    };
    
    cycle();
  }, []);

  return (
    <div className={`relative inline-block ${className} ${isGlitching ? "glitch-active" : ""}`} data-text={text}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span className="absolute inset-0 z-0 text-[#00FF41] opacity-70 translate-x-[2px] -translate-y-[1px] mix-blend-screen overflow-hidden whitespace-nowrap">
            {text}
          </span>
          <span className="absolute inset-0 z-0 text-[#00e5ff] opacity-70 -translate-x-[2px] translate-y-[1px] mix-blend-screen overflow-hidden whitespace-nowrap">
            {text}
          </span>
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-[#00FF41]/20 to-transparent w-full h-[1px] top-1/2 animate-scan-line-burst pointer-events-none"></div>
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
  const formattedPrice = typeof price === "number"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
    : price;

  const [integerPart, decimalPart] = formattedPrice.replace("R$", "").trim().split(",");

  return (
    <div className="min-h-[100dvh] bg-[#020202] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 relative overflow-x-hidden wms-access-terminal">
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

      <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] py-0 lg:py-10 px-0 lg:px-6">
        
        {/* Main Container */}
        <div className="w-full max-w-[1150px] bg-[#0A0A0A]/80 backdrop-blur-3xl lg:rounded-[40px] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col lg:grid lg:grid-cols-[1.15fr_0.85fr] overflow-hidden min-h-screen lg:min-h-0">
          
          {/* LEFT COLUMN: Authority & Visual */}
          <div className={`p-6 lg:p-12 flex flex-col ${hasPaymentData ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Header */}
            <header className="mb-8 lg:mb-12 relative">
              <div className="flex items-center gap-5 lg:gap-7 mb-6">
                <div className="w-14 h-14 lg:w-20 lg:h-20 relative flex items-center justify-center border border-[#00FF41]/20 rounded-2xl p-1 bg-black/80 shadow-[0_0_30px_rgba(0,255,65,0.1)] group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 to-transparent"></div>
                  <div className="w-full h-full rounded-xl border border-dashed border-[#00FF41]/30 flex items-center justify-center overflow-hidden">
                    {logoIconSlot}
                  </div>
                </div>
                
                <div className="flex-1">
                  <GlitchTitle text="WEB MONEY SOCIETY" className="text-2xl lg:text-4xl font-black tracking-tighter text-white uppercase italic leading-none block mb-2" />
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[#00FF41]/5 border border-[#00FF41]/20 text-[9px] font-black text-[#00FF41]/80 tracking-[0.2em] rounded uppercase italic">
                      ESTADO PRIVADO
                    </span>
                    <div className="h-[1px] w-8 bg-[#00FF41]/20"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-6 border-l-2 border-[#00FF41]/40">
                <p className="text-gray-400 text-xs lg:text-[13px] font-medium leading-relaxed italic max-w-lg">
                  Acesso exclusivo ao terminal de operações WMS. Execute sua visão com método e tecnologia de ponta.
                </p>
              </div>
            </header>

            {/* Main Media Showcase */}
            <div className="relative aspect-[16/10] w-full bg-black rounded-2xl lg:rounded-3xl border border-white/5 overflow-hidden mb-8 lg:mb-10 shadow-2xl group">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {mainMediaSlot}
              </div>
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-[#00FF41]/30 px-3 py-1.5 rounded-lg z-20 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse"></div>
                 <span className="text-[9px] text-[#00FF41] font-black uppercase tracking-widest italic">CONTEÚDO PRIVADO</span>
              </div>
            </div>

            {/* Proof Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto">
              {[
                { label: 'OPERAÇÃO', slot: proofMedia1Slot },
                { label: 'REDE', slot: proofMedia2Slot },
                { label: 'RESULTADO', slot: proofMedia3Slot }
              ].map((card, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex items-center gap-4 group hover:bg-[#00FF41]/5 transition-all duration-300">
                  <div className="w-12 h-9 bg-black border border-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#00FF41]/30 transition-colors">
                    {card.slot}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic group-hover:text-[#00FF41]/60">{card.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Transactional */}
          <div className="bg-[#050505]/80 p-6 lg:p-12 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 relative overflow-hidden">
            
            {/* Payment Header */}
            <div className="relative z-10 mb-8 lg:mb-10">
              {hasPaymentData ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></div>
                      <h2 className="text-xs font-black text-[#00FF41] tracking-[0.3em] uppercase italic">PIX GERADO</h2>
                    </div>
                    <PriceDisplay integer={integerPart} decimal={decimalPart} label="TOTAL" size="small" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    Escaneie o QR ou copie o código. O acesso será liberado <span className="text-white">imediatamente</span>.
                  </p>
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
               <div className={`bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 ${hasPaymentData ? 'p-0 bg-transparent border-none' : 'p-6 lg:p-8'}`}>
                  {hasPaymentData ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <footer className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-white/10 bg-white/[0.03] rounded-2xl flex items-center justify-center p-2.5 shadow-xl">
                  {trustBadgeSlot}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[10px] font-black tracking-widest uppercase italic">PAGAMENTO SEGURO</span>
                  <p className="text-[#00FF41]/60 text-[9px] font-bold uppercase tracking-widest italic">TERMINAL PROTEGIDO</p>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-end opacity-20">
                <span className="text-[8px] font-mono">WMS_ACCESS_v1.0.4</span>
                <span className="text-[8px] font-mono text-[#00FF41]">SECURE_CONNECTION</span>
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
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan-line-burst { animation: scan-line-burst 0.5s linear infinite; }

        .glitch-active {
          animation: glitch-skew 0.3s cubic-bezier(.25,.46,.45,.94) both infinite;
        }
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(2deg); }
          40% { transform: skew(-1deg); }
          60% { transform: skew(1deg); }
          80% { transform: skew(-2deg); }
          100% { transform: skew(0deg); }
        }

        .sm-scanlines {
           background: linear-gradient(rgba(255,255,255,0) 50%, rgba(255,255,255,0.02) 50%);
           background-size: 100% 4px;
        }

        /* SCOPED PIX PANEL OVERRIDES */
        .wms-access-pix-panel {
          width: 100%;
        }

        /* Remove small copy button next to field */
        .wms-access-pix-panel div.flex.items-center.justify-between.px-1 button {
          display: none !important;
        }

        /* Hide specific elements to focus mode */
        .payment-focus h3, .payment-focus .text-center.mb-8 p {
          display: none !important;
        }

        /* Large Action Button Style */
        .wms-access-pix-panel button {
          height: 3.5rem !important;
          font-size: 0.85rem !important;
          border-radius: 18px !important;
          font-weight: 900 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          background: var(--wms-neon) !important;
          color: black !important;
          border: none !important;
          box-shadow: 0 0 30px rgba(0, 255, 65, 0.2) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-style: italic !important;
          margin-top: 0.5rem !important;
        }

        .wms-access-pix-panel button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 0 40px rgba(0, 255, 65, 0.3) !important;
          filter: brightness(1.1);
        }

        /* Secondary Actions Style */
        .wms-access-pix-panel a, 
        .wms-access-pix-panel button.text-\[9px\] {
          background: rgba(255,255,255,0.03) !important;
          border: 1px border rgba(255,255,255,0.05) !important;
          color: #888 !important;
          padding: 10px 16px !important;
          border-radius: 12px !important;
          height: auto !important;
          font-size: 8px !important;
          letter-spacing: 0.2em !important;
          box-shadow: none !important;
        }

        .wms-access-pix-panel a:hover, 
        .wms-access-pix-panel button.text-\[9px\]:hover {
          color: white !important;
          background: rgba(255,255,255,0.08) !important;
          transform: none !important;
        }

        /* QR Code Card Refinement */
        .wms-access-pix-panel .bg-white.p-4 {
          padding: 1rem !important;
          border-radius: 20px !important;
          box-shadow: 0 0 40px rgba(0,0,0,0.5) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          width: 220px !important;
          height: 220px !important;
        }

        @media (max-width: 1024px) {
          .wms-access-pix-panel button {
            height: 3.25rem !important;
            font-size: 0.75rem !important;
          }
          .wms-access-pix-panel .bg-white.p-4 {
            width: 180px !important;
            height: 180px !important;
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

export default function App() {
  return <WmsAccessTerminalCheckout 
    checkout={{ price: 147.90 }}
    formData={{}}
    loading={false}
    handleInputChange={() => {}}
    handleSubmit={(e: any) => e.preventDefault()}
    InlinePixPanel={() => <div className="p-10 border border-white/10 rounded-xl text-center">PIX_PANEL_MOCK</div>}
  />;
}
