import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSlotMedia } from "@/lib/designMediaSlots";
import React from "react";

/**
 * AnomalyText
 * Sistema de anomalia digital CSS-only, sem hooks ou JS.
 */
function AnomalyText({ text, className = "", intensity = "medium" }: { text: string; className?: string; intensity?: "low" | "medium" | "high" }) {
  return (
    <span className={`anomaly-text ${intensity} ${className}`} data-text={text}>
      {text}
    </span>
  );
}

/**
 * PriceDisplay
 * Renderiza o preço de forma refinada.
 */
function PriceDisplay({ integer, decimal, label = "VALOR DO ACESSO", size = "large" }: any) {
  if (size === "small") {
    return (
      <div className="flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41]/20 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <span className="text-[9px] lg:text-[10px] text-[#00FF41]/60 font-black uppercase tracking-widest">{label}:</span>
        <span className="text-xs font-black text-white italic">R$ <AnomalyText text={integer} className="inline-block" intensity="low" />,<span className="text-[#00FF41]">{decimal}</span></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white/[0.02] border border-white/5 p-4 lg:p-5 rounded-2xl group transition-all duration-300 hover:bg-white/[0.03]">
      <span className="text-gray-500 text-[10px] lg:text-[11px] font-black tracking-[0.25em] uppercase italic mb-1 opacity-60">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-white text-[14px] lg:text-[18px] font-black opacity-40 italic">R$</span>
        <div className="flex items-baseline">
          <span className="text-[40px] lg:text-[52px] font-black text-white italic tracking-tighter leading-none">
            <AnomalyText text={integer} />
          </span>
          <span className="text-[20px] lg:text-[26px] font-black text-[#00FF41] italic leading-none ml-0.5">
            ,{decimal}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse"></div>
        <span className="text-[9px] lg:text-[10px] text-[#00FF41]/60 font-black uppercase tracking-widest italic">Liberação imediata via Pix</span>
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
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 bg-[#00FF41]/5 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[#00FF41]/30 animate-glitch-line"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-[#00FF41]/20 animate-glitch-line [animation-delay:4s]"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00FF41]/10 animate-pulse"></div>
      </div>

      {/* BACKGROUND SCENE */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,65,0.05)_0%,transparent_70%,black_100%)]"></div>
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(0,255,65,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,.5)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        <div className="absolute inset-0 grayscale opacity-10">{heroBackgroundSlot}</div>
        
        {/* Environmental Glitch Blocks */}
        <div className="absolute top-20 left-10 w-48 h-[2px] bg-[#00FF41]/20 blur-[1px] animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-64 h-[1px] bg-[#00FF41]/15 blur-[2px] animate-pulse [animation-delay:2.5s]"></div>
        <div className="absolute top-1/3 right-0 w-24 h-24 border-r border-t border-[#00FF41]/10 opacity-30"></div>
        <div className="absolute bottom-1/4 left-0 w-32 h-32 border-l border-b border-[#00FF41]/10 opacity-30"></div>
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
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col font-black tracking-tighter text-white uppercase italic leading-[0.95] mb-3">
                    <span className="text-[14px] lg:text-[18px] opacity-70"><AnomalyText text="FAÇA PARTE DA" intensity="low" /></span>
                    <span className="text-[28px] lg:text-[46px] block">
                      <AnomalyText text="MAIOR" className="text-[#00FF41]" intensity="high" /> <AnomalyText text="BIBLIOTECA" intensity="medium" />
                    </span>
                    <span className="text-[20px] lg:text-[32px] opacity-90">
                      <AnomalyText text="DO DIGITAL" intensity="high" />
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-[#00FF41]/15 border border-[#00FF41]/30 text-[10px] lg:text-[11px] font-black text-[#00FF41] tracking-[0.2em] rounded uppercase italic shadow-[0_0_10px_rgba(0,255,65,0.1)]">
                      <AnomalyText text="ACESSO EXCLUSIVO" intensity="low" />
                    </span>
                    <div className="h-[1px] w-8 bg-[#00FF41]/30"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-6 border-l border-[#00FF41]/20">
                <p className="text-gray-400 text-[15px] lg:text-[18px] font-medium leading-relaxed italic max-w-md break-words opacity-80">
                  Uma biblioteca exclusiva para quem quer dominar a era da IA e acessar recursos, prompts, métodos e ferramentas poderosas.
                </p>
              </div>
            </header>

            {/* Main Media Showcase */}
            <div className="relative w-full bg-black rounded-2xl border border-white/5 overflow-hidden shadow-2xl group aspect-[16/10] mb-6 lg:mb-8 max-w-full">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center scale-105 group-hover:scale-100 transition-transform duration-700">
                {mainMediaSlot}
              </div>
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-[#00FF41]/20 px-3 py-1.5 rounded-lg z-20 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]"></div>
                 <span className="text-[10px] lg:text-[11px] text-[#00FF41] font-black uppercase tracking-[0.15em] italic">
                   Faça parte — ou fique para trás
                 </span>
              </div>
            </div>

            {/* Proof Section */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-auto pt-6">
              {[
                { title: 'Prompts', desc: 'Obtenha vantagem', slot: proofMedia1Slot },
                { title: 'Métodos', desc: 'Aplique com clareza', slot: proofMedia2Slot },
                { title: 'Insights', desc: 'Siga com direção', slot: proofMedia3Slot }
              ].map((card, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-2.5 rounded-2xl flex items-center gap-2.5 group hover:bg-[#00FF41]/5 transition-all duration-500 min-w-0 flex-1">
                  <div className="bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#00FF41]/20 transition-colors w-10 h-8 lg:w-12 lg:h-9 shadow-lg">
                    {card.slot}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="font-black text-gray-300 uppercase tracking-[0.05em] italic group-hover:text-[#00FF41]/90 transition-all text-[10px] lg:text-[12px] leading-tight">
                      <AnomalyText text={card.title} intensity={idx === 1 ? "high" : "medium"} />
                    </span>
                    <span className="text-[9px] lg:text-[10px] text-gray-500 font-medium italic leading-tight opacity-80 mt-0.5">{card.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Transactional */}
          <div className="bg-[#050505]/90 p-6 lg:p-10 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 relative overflow-hidden min-w-0 w-full">
            
            {/* Payment Header */}
            <div className="relative z-10 mb-5 lg:mb-6">
              {hasPaymentData ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-[#00FF41]/5 border border-[#00FF41]/10 px-5 py-4 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00FF41] shadow-[0_0_12px_#00FF41] animate-pulse"></div>
                      <h2 className="text-[10px] lg:text-xs font-black text-[#00FF41] tracking-[0.25em] uppercase italic">Pix gerado</h2>
                    </div>
                    <PriceDisplay integer={integerPart} decimal={decimalPart} label="Total" size="small" />
                  </div>
                  <div className="flex flex-col gap-1 pl-1">
                    <p className="text-[10px] lg:text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed break-words opacity-70">
                      Escaneie o QR Code ou copie o código Pix para concluir seu acesso.
                    </p>
                  </div>
                </div>
              ) : (
                <PriceDisplay integer={integerPart} decimal={decimalPart} />
              )}
            </div>

            {/* Checkout Area */}
            <div className="flex-1 relative z-10 flex flex-col min-h-0">
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl transition-all duration-500 shadow-2xl ${hasPaymentData ? 'p-0 overflow-visible' : 'p-5 lg:p-7 overflow-hidden'}`}>
                   {hasPaymentData ? (
                     <div className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl wms-access-pix-panel p-4 sm:p-6 lg:p-8">
                       {pixSlot}
                     </div>
                   ) : formSlot}
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
              <div className="hidden sm:flex flex-col items-end opacity-40 group hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-mono tracking-tighter text-white">WMS_ACCESS_v1.0.8</span>
                <span className="text-[8px] font-mono text-[#00FF41] tracking-tighter uppercase">SECURE_LINK_ENCRYPTED</span>
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

        @keyframes anomaly-glitch-1 {
          0%, 20%, 40%, 60%, 80%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
          22% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, -1px); filter: hue-rotate(90deg) brightness(1.2); }
          24% { clip-path: inset(50% 0 30% 0); transform: translate(2px, 1px); filter: hue-rotate(-90deg); }
          62% { clip-path: inset(20% 0 60% 0); transform: translate(-1px, 2px); }
          64% { clip-path: inset(70% 0 10% 0); transform: translate(1px, -2px); filter: saturate(2); }
          90% { clip-path: inset(40% 0 40% 0); transform: translate(-3px, 0); }
        }

        @keyframes anomaly-glitch-2 {
          0%, 20%, 40%, 60%, 80%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
          25% { clip-path: inset(20% 0 50% 0); transform: translate(3px, 1px); opacity: 0.8; color: var(--wms-cyan); }
          65% { clip-path: inset(60% 0 20% 0); transform: translate(-3px, -1px); opacity: 0.8; color: var(--wms-neon); }
          85% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 2px); opacity: 0.8; color: var(--wms-cyan); }
        }

        .anomaly-text {
          position: relative;
          display: inline-block;
          white-space: nowrap;
        }

        .anomaly-text::before,
        .anomaly-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .anomaly-text::before {
          z-index: -1;
          animation: anomaly-glitch-1 4s infinite linear alternate-reverse;
        }

        .anomaly-text::after {
          z-index: -2;
          animation: anomaly-glitch-2 4s infinite linear alternate-reverse;
          mix-blend-mode: screen;
        }

        .anomaly-text.low::before, .anomaly-text.low::after { animation-duration: 8s; }
        .anomaly-text.medium::before, .anomaly-text.medium::after { animation-duration: 4s; }
        .anomaly-text.high::before, .anomaly-text.high::after { animation-duration: 2s; }


        .sm-scanlines {
           background: linear-gradient(rgba(255,255,255,0) 50%, rgba(255,255,255,0.015) 50%);
           background-size: 100% 3px;
        }

        @keyframes glitch-line {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-glitch-line {
          animation: glitch-line 12s linear infinite;
        }

        /* INPUTS LEGIBILITY */
        .wms-access-terminal input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
          opacity: 1 !important;
        }
        .wms-access-terminal input {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        /* DEFENSIVE PIX PANEL */
        .wms-access-pix-panel {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
        }

        .wms-access-pix-panel * {
          box-sizing: border-box;
          max-width: 100%;
        }

        .wms-access-pix-panel p,
        .wms-access-pix-panel span,
        .wms-access-pix-panel div {
          min-width: 0;
        }

        .wms-access-pix-panel code,
        .wms-access-pix-panel pre {
          overflow-wrap: anywhere;
          word-break: break-word;
          max-width: 100%;
          display: block;
          white-space: pre-wrap;
        }

        .wms-access-pix-panel button {
          max-width: 100%;
          white-space: normal;
          height: auto;
          min-height: 3.5rem;
        }

        .wms-access-pix-panel img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          filter: drop-shadow(0 0 1px white);
        }

        @media (max-width: 1024px) {
          .wms-access-terminal, 
          .wms-access-terminal > div {
            overflow-x: hidden !important;
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

