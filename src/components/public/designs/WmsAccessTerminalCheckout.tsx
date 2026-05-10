import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSlotMedia } from "@/lib/designMediaSlots";
import React from "react";

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
      {/* GLOBAL HUD OVERLAYS - Moved behind content (z-0) to avoid covering Pix/Forms */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 scanline animate-scanline"></div>
      </div>

      {/* HERO_BACKGROUND_SLOT */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.05)_0%,transparent_70%,black_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[#00FF41]/3 to-cyan-500/3 blur-[180px] animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(0,255,65,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,.5)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        <div className="absolute inset-0">
          {heroBackgroundSlot}
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] py-0 lg:py-12 px-0 lg:px-6">
        
        {/* Container Principal */}
        <div className="w-full max-w-[1200px] bg-[#0A0A0A]/70 backdrop-blur-3xl lg:rounded-[32px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] overflow-hidden min-h-screen lg:min-h-0">
          
          {/* Left Column - Content & Media */}
          <div className="p-6 lg:p-12 lg:pr-8 flex flex-col">
            
            {/* Header Area */}
            <header className="mb-8 lg:mb-10 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                {/* LOGO_ICON_SLOT */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 relative flex items-center justify-center border border-[#00FF41]/20 rounded-full p-1.5 bg-black/80 shadow-[0_0_30px_rgba(0,255,65,0.1)] group shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 to-cyan-500/10 opacity-40 rounded-full"></div>
                  <div className="w-full h-full rounded-full border border-dashed border-[#00FF41]/20 flex items-center justify-center overflow-hidden">
                    {logoIconSlot}
                  </div>
                  <div className="absolute -inset-2 border border-[#00FF41]/5 rounded-full animate-spin-slow"></div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-white uppercase italic animate-glitch-premium mb-2 break-words" data-text={checkout.title || "WEB MONEY SOCIETY"}>
                    {checkout.title || "WEB MONEY SOCIETY"}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[8px] font-black text-white/50 tracking-[0.15em] rounded-sm uppercase italic">
                      ACESSO PRIVADO
                    </span>
                    <span className="px-2 py-0.5 bg-[#00FF41]/5 border border-[#00FF41]/20 text-[8px] font-black text-[#00FF41]/60 tracking-[0.15em] rounded-sm uppercase italic">
                      MEMBRO WMS
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00FF41]/50 to-transparent"></div>
                <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic pl-6">
                  {checkout.subtitle || "Acesso privado para quem quer entrar no jogo com método, visão e execução. Conteúdo prático e estratégias validadas pela Sociedade."}
                </p>
              </div>
            </header>

            {/* MAIN_MEDIA_SLOT */}
            <div className="relative aspect-video w-full bg-[#050505]/80 rounded-2xl border border-white/5 overflow-hidden mb-8 shadow-2xl group/media transition-all hover:border-[#00FF41]/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
              {/* HUD elements */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/10"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/10"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full transform group-hover/media:scale-105 transition-transform duration-1000 flex items-center justify-center">
                  {mainMediaSlot}
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-[#00FF41]/20 px-2 py-1 rounded-sm z-20">
                 <span className="text-[8px] text-[#00FF41] font-black uppercase tracking-widest italic">STREAM_ENCRYPTED</span>
              </div>
            </div>

            {/* Proof Units */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto">
              {[
                { id: '1', label: 'Sinal Privado', slot: proofMedia1Slot },
                { id: '2', label: 'Estratégias', slot: proofMedia2Slot },
                { id: '3', label: 'Comunidade', slot: proofMedia3Slot }
              ].map((card, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-12 h-8 bg-black border border-white/5 rounded flex items-center justify-center overflow-hidden shrink-0">
                    {card.slot}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-black text-gray-500 uppercase italic truncate">{card.label}</span>
                    <div className="flex gap-0.5">
                      <div className="w-2 h-0.5 rounded-full bg-[#00FF41]/40"></div>
                      <div className="w-0.5 h-0.5 rounded-full bg-[#00FF41]/40"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Checkout Terminal */}
          <div className="bg-[#050505]/60 p-6 lg:p-12 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 relative">
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] sm-scanlines"></div>

            {/* Checkout Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex flex-col">
                <h2 className="text-[10px] font-black text-[#00FF41] tracking-[0.4em] uppercase italic mb-1">ACCESS_POINT</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#00FF41] animate-pulse"></div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest italic">Checkout Ativo</span>
                </div>
              </div>
              
              <div className="w-12 h-12 bg-black border border-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                {sideVisualSlot}
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-8 relative z-10">
              <span className="text-gray-500 text-[9px] font-black tracking-[0.2em] uppercase italic mb-2 block">VALOR DO ACESSO</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl lg:text-6xl font-black text-white italic tracking-tighter">R$ {integerPart}</span>
                <span className="text-2xl lg:text-3xl font-black text-[#00FF41] italic opacity-80">,{decimalPart}</span>
              </div>
            </div>

            {/* Main Form/Pix Area */}
            <div className="flex-1 relative z-10 flex flex-col">
              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:p-8 shadow-inner relative overflow-hidden flex flex-col justify-center">
                 {/* This container will hold either the form or the Pix area */}
                 <div className="w-full relative z-20">
                    {hasPaymentData ? (
                      <div className="bg-transparent">
                        {pixSlot}
                      </div>
                    ) : (
                      formSlot
                    )}
                 </div>
              </div>

              {!hasPaymentData && (
                <div className="mt-4 text-center">
                  <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] italic">TECNOLOGIA DE PAGAMENTO PUSHINPAY</span>
                </div>
              )}
            </div>

            {/* Footer Trust Section */}
            <footer className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 border border-white/5 bg-white/[0.03] rounded-xl flex items-center justify-center p-2 shrink-0">
                {trustBadgeSlot}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[10px] font-black tracking-[0.15em] uppercase italic">PAGAMENTO SEGURO</span>
                <p className="text-gray-600 text-[8px] font-bold uppercase tracking-widest italic">
                  LIBERAÇÃO IMEDIATA DO ACESSO
                </p>
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
        .animate-scanline {
          animation: scanline 12s linear infinite;
        }
        .scanline {
          width: 100%;
          height: 150px;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 255, 65, 0.08) 50%, transparent 100%);
        }
        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-sweep {
          animation: sweep 1.5s ease-in-out infinite;
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-glitch-premium {
          position: relative;
        }
        .animate-glitch-premium::after, .animate-glitch-premium::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.6;
          z-index: -1;
        }
        .animate-glitch-premium::before {
          color: #00FF41;
          animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
          clip: rect(20px, 9999px, 60px, 0);
          left: -1px;
        }
        .animate-glitch-premium::after {
          color: #00E5FF;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
          clip: rect(80px, 9999px, 120px, 0);
          left: 1px;
        }
        @keyframes glitch-anim-1 {
          0% { clip: rect(10px, 9999px, 30px, 0); transform: skew(0.5deg); }
          20% { clip: rect(40px, 9999px, 50px, 0); transform: skew(-0.5deg); }
          40% { clip: rect(20px, 9999px, 80px, 0); transform: skew(1deg); }
          60% { clip: rect(70px, 9999px, 90px, 0); transform: skew(-1deg); }
          80% { clip: rect(30px, 9999px, 60px, 0); transform: skew(0.5deg); }
          100% { clip: rect(50px, 9999px, 100px, 0); transform: skew(-0.5deg); }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(70px, 9999px, 100px, 0); transform: skew(-0.8deg); }
          20% { clip: rect(20px, 9999px, 40px, 0); transform: skew(0.8deg); }
          40% { clip: rect(50px, 9999px, 70px, 0); transform: skew(-1.2deg); }
          60% { clip: rect(10px, 9999px, 20px, 0); transform: skew(1.2deg); }
          80% { clip: rect(80px, 9999px, 110px, 0); transform: skew(-0.8deg); }
          100% { clip: rect(30px, 9999px, 60px, 0); transform: skew(0.8deg); }
        }
        .sm-scanlines {
           background: linear-gradient(rgba(255,255,255,0) 50%, rgba(255,255,255,0.02) 50%);
           background-size: 100% 4px;
        }
        @media (max-width: 1024px) {
           .animate-glitch-premium::after, .animate-glitch-premium::before {
              display: none;
           }
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

  // Helper para renderizar slots com fallback visual (placeholder)
  const renderSlot = (media: any, fallbackLabel: string) => {
    if (media) return <MediaDisplay media={media} />;
    return (
      <div className="w-full h-full flex items-center justify-center p-2">
        <span className="text-[7px] text-white/10 font-black uppercase tracking-tighter text-center italic leading-none">
          {fallbackLabel}
        </span>
      </div>
    );
  };

  const logoIconSlot = renderSlot(logoIcon, "LOGO_ICON");
  const mainMediaSlot = mainMedia ? (
    <div className="w-full h-full flex items-center justify-center">
      <MediaDisplay media={mainMedia} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center opacity-10 p-6">
      <div className="text-white font-black uppercase tracking-[1em] text-2xl lg:text-4xl select-none mb-2 -rotate-1 text-center">
        TERMINAL_MEDIA
      </div>
      <div className="text-white text-[8px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
        READY FOR UPLOAD
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
                {field.required && <span className="text-[#00FF41] ml-0.5 opacity-50">*</span>}
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
        <div className="relative group cursor-pointer active:scale-[0.98] transition-transform">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00FF41]/30 via-cyan-400/30 to-[#00FF41]/30 rounded-xl blur-[10px] opacity-10 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="relative w-full h-16 bg-gradient-to-br from-[#00FF41] via-[#00cc33] to-cyan-500 p-[1px] rounded-xl shadow-lg">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-full bg-black hover:bg-[#00FF41]/5 flex items-center justify-center relative overflow-hidden rounded-[11px] transition-colors border-none"
            >
              <span className="text-[#00FF41] group-hover:text-white font-black uppercase tracking-[0.2em] text-sm lg:text-base relative z-10 italic transition-colors whitespace-normal text-center px-4 leading-tight">
                {loading ? "GERANDO ACESSO..." : (checkout.cta_text || "ENTRAR NA SOCIEDADE")}
              </span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-sweep transition-transform duration-1000"></div>
            </Button>
          </div>
        </div>
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
