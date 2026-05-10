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
    <div className="min-h-[100dvh] bg-[#020202] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 overflow-y-auto lg:overflow-hidden relative flex items-center justify-center p-0 lg:p-6">
      {/* GLOBAL HUD OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.08]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 scanline animate-scanline"></div>
      </div>

      {/* HERO_BACKGROUND_SLOT */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.05)_0%,transparent_70%,black_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[#00FF41]/3 to-cyan-500/3 blur-[180px] animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(0,255,65,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,.5)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        <div className="absolute inset-0">
          {heroBackgroundSlot}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1280px] h-full lg:h-[min(880px,94dvh)] bg-[#0A0A0A]/60 backdrop-blur-3xl lg:rounded-[40px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column - 60% Content & Media */}
        <div className="flex-[1.5] p-6 lg:p-14 lg:pr-10 flex flex-col h-full overflow-y-auto lg:overflow-y-auto custom-scrollbar relative">
          
          {/* Header Area */}
          <header className="mb-10 lg:mb-12 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              {/* LOGO_ICON_SLOT */}
              <div className="w-20 h-20 relative flex items-center justify-center border border-[#00FF41]/20 rounded-full p-1.5 bg-black/80 shadow-[0_0_30px_rgba(0,255,65,0.1)] group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 to-cyan-500/10 opacity-40 rounded-full"></div>
                <div className="w-full h-full rounded-full border border-dashed border-[#00FF41]/20 flex items-center justify-center overflow-hidden">
                  {logoIconSlot}
                </div>
                {/* Orbital Ring */}
                <div className="absolute -inset-2 border border-[#00FF41]/5 rounded-full animate-spin-slow"></div>
              </div>
              
              <div>
                <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white uppercase italic animate-glitch-premium mb-3" data-text={checkout.title || "WEB MONEY SOCIETY"}>
                  {checkout.title || "WEB MONEY SOCIETY"}
                </h1>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-white/50 tracking-[0.2em] rounded-sm uppercase italic">
                    ACESSO PRIVADO
                  </span>
                  <span className="px-3 py-1 bg-[#00FF41]/5 border border-[#00FF41]/20 text-[9px] font-black text-[#00FF41]/60 tracking-[0.2em] rounded-sm uppercase italic">
                    MEMBRO WMS
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/5 border border-cyan-500/20 text-[9px] font-black text-cyan-400/60 tracking-[0.2em] rounded-sm uppercase italic">
                    PIX READY
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm lg:text-lg max-w-2xl font-medium leading-relaxed italic border-l-2 border-[#00FF41]/30 pl-8">
              {checkout.subtitle || "Acesso privado para quem quer entrar no jogo com método, visão e execução. Conteúdo prático e estratégias validadas pela Sociedade."}
            </p>
          </header>

          {/* MAIN_MEDIA_SLOT - The Central Visual Area */}
          <div className="flex-1 relative min-h-[340px] lg:min-h-[400px] bg-[#050505]/80 rounded-3xl border border-white/5 overflow-hidden mb-10 shadow-2xl group/media transition-all hover:border-[#00FF41]/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            
            {/* Viewport HUD Decor */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-white/10"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-white/10"></div>
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_10px]"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center group-hover/media:scale-105 transition-transform duration-1000">
              {mainMediaSlot}
            </div>

            {/* Content Badge */}
            <div className="absolute top-6 right-8 bg-[#00FF41]/10 border border-[#00FF41]/20 px-3 py-1 rounded-sm z-20">
               <span className="text-[9px] text-[#00FF41] font-black uppercase tracking-widest italic">CONTEÚDO_EXCLUSIVO</span>
            </div>

            {/* Bottom HUD Data */}
            <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end z-20 opacity-40">
               <div className="text-[8px] text-gray-500 font-mono font-bold tracking-widest uppercase text-center md:text-left">
                  NODE_STABLE // STREAM_X82
               </div>
               <div className="text-[8px] text-gray-500 font-mono font-bold tracking-widest uppercase text-center md:text-right">
                  WMS_TERMINAL_V.2.4
               </div>
            </div>
          </div>

          {/* Proof Units */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-auto pb-4">
            {[
              { id: '1', label: 'Sinal Privado', slot: proofMedia1Slot },
              { id: '2', label: 'Estratégias Práticas', slot: proofMedia2Slot },
              { id: '3', label: 'Comunidade Ativa', slot: proofMedia3Slot }
            ].map((card, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.04] transition-all hover:translate-y-[-2px]">
                  <div className="w-16 h-10 bg-black border border-white/5 rounded-lg flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    {card.slot}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase italic mb-0.5">{card.label}</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-1 rounded-full bg-[#00FF41]/20"></div>
                      <div className="w-1 h-1 rounded-full bg-[#00FF41]/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - 40% Checkout Terminal */}
        <div className="flex-[1] bg-[#050505]/40 p-8 lg:p-14 flex flex-col border-l border-white/5 relative h-full overflow-y-auto custom-scrollbar">
          
          {/* Terminal Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] sm-scanlines"></div>

          {/* Checkout Header */}
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex flex-col">
              <h2 className="text-[12px] font-black text-[#00FF41] tracking-[0.5em] uppercase italic mb-1.5">ACCESS_CHECKPOINT</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">Checkout Seguro // Ativo</span>
              </div>
            </div>
            
            {/* SIDE_VISUAL_SLOT */}
            <div className="w-14 h-14 bg-black border border-white/5 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
              {sideVisualSlot}
            </div>
          </div>

          <div className="mb-12 relative z-10 group/price pr-4">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/price:opacity-30 transition-opacity">
               <div className="w-4 h-4 border-t border-r border-[#00FF41]"></div>
            </div>
            <span className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase italic mb-3 block">Entrada Única • Acesso Imediato</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">R$ {integerPart}</span>
              <span className="text-3xl lg:text-4xl font-black text-[#00FF41] italic opacity-80 animate-pulse-slow">,{decimalPart}</span>
            </div>
          </div>

          <div className="flex-1 space-y-10 flex flex-col relative z-10">
            {/* PIX / FORM Area */}
            <div className="relative">
              <div className="p-8 lg:p-10 border border-white/5 bg-white/[0.01] rounded-3xl relative overflow-hidden backdrop-blur-xl group/form hover:border-white/10 transition-colors shadow-inner">
                 {hasPaymentData ? pixSlot : formSlot}
              </div>
            </div>

            <div className="mt-5 text-center">
              <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] italic">AMBIENTE PROTEGIDO // LIBERAÇÃO ATIVA</span>
            </div>
          </div>

          {/* Footer - TRUST_BADGE_SLOT */}
          <footer className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 border border-white/5 bg-white/[0.03] rounded-2xl flex items-center justify-center p-3 relative group/badge overflow-hidden transition-all hover:border-[#00FF41]/20">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.1)_0%,transparent_70%)] opacity-0 group-hover/badge:opacity-100 duration-500"></div>
                 <div className="relative z-10 flex items-center justify-center w-full h-full overflow-hidden">
                   {trustBadgeSlot}
                 </div>
               </div>
               <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-[11px] font-black tracking-[0.2em] uppercase italic">PAGAMENTO SEGURO</span>
                  </div>
                  <p className="text-gray-600 text-[9px] font-bold leading-tight uppercase tracking-widest italic">
                    LIBERAÇÃO IMEDIATA DO ACESSO DIGITAL
                  </p>
               </div>
            </div>
            
            <div className="flex gap-1.5 opacity-5 hover:opacity-20 transition-opacity hidden lg:flex">
               <div className="w-8 h-4 bg-white rounded-sm"></div>
               <div className="w-8 h-4 bg-white rounded-sm"></div>
            </div>
          </footer>
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
          animation: spin 90s linear infinite;
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
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
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
          opacity: 0.8;
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
          0% { clip: rect(10px, 9999px, 30px, 0); transform: skew(0.5deg); opacity: 0.4; }
          20% { clip: rect(40px, 9999px, 50px, 0); transform: skew(-0.5deg); opacity: 0.8; }
          40% { clip: rect(20px, 9999px, 80px, 0); transform: skew(1deg); opacity: 0.5; }
          60% { clip: rect(70px, 9999px, 90px, 0); transform: skew(-1deg); opacity: 0.7; }
          80% { clip: rect(30px, 9999px, 60px, 0); transform: skew(0.5deg); opacity: 0.3; }
          100% { clip: rect(50px, 9999px, 100px, 0); transform: skew(-0.5deg); opacity: 0.6; }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(70px, 9999px, 100px, 0); transform: skew(-0.8deg); opacity: 0.3; }
          20% { clip: rect(20px, 9999px, 40px, 0); transform: skew(0.8deg); opacity: 0.7; }
          40% { clip: rect(50px, 9999px, 70px, 0); transform: skew(-1.2deg); opacity: 0.4; }
          60% { clip: rect(10px, 9999px, 20px, 0); transform: skew(1.2deg); opacity: 0.8; }
          80% { clip: rect(80px, 9999px, 110px, 0); transform: skew(-0.8deg); opacity: 0.5; }
          100% { clip: rect(30px, 9999px, 60px, 0); transform: skew(0.8deg); opacity: 0.3; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 65, 0.1);
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
    <MediaDisplay media={mainMedia} />
  ) : (
    <div className="flex flex-col items-center justify-center opacity-10">
      <div className="text-white font-black uppercase tracking-[1.5em] text-4xl lg:text-7xl select-none mb-4 -rotate-2 text-center">
        MAIN_MEDIA
      </div>
      <div className="text-white text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
        IMAGEM, VÍDEO OU MÍDIA
      </div>
    </div>
  );
  
  const heroBackgroundSlot = heroBackground ? (
    <div className="w-full h-full object-cover">
      <MediaDisplay media={heroBackground} />
    </div>
  ) : null;

  const proofMedia1Slot = renderSlot(proofMedia1, "PROOF_1");
  const proofMedia2Slot = renderSlot(proofMedia2, "PROOF_2");
  const proofMedia3Slot = renderSlot(proofMedia3, "PROOF_3");
  const trustBadgeSlot = renderSlot(trustBadge, "TRUST");
  const sideVisualSlot = renderSlot(sideVisual, "SIDE");

  // --- RENDER FORM ---
  const renderForm = () => (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {(checkout.checkout_fields || [])
          .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((field: any) => (
            <div key={field.id || field.field_name} className="group space-y-2">
              <Label 
                htmlFor={field.field_name} 
                className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-[#00FF41] transition-colors italic"
              >
                {field.field_label}
                {field.required && <span className="text-[#00FF41] ml-1 opacity-50">*</span>}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type?.replace("hidden:", "") || "text"}
                placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                required={field.required}
                className="h-14 bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05] focus:ring-1 focus:ring-[#00FF41]/30 focus:border-[#00FF41]/50 transition-all rounded-2xl placeholder:text-gray-700 text-sm px-6"
                value={formData[field.field_name] || ""}
                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
              />
            </div>
          ))}
      </div>

      <div className="pt-4">
        <div className="relative group cursor-pointer active:scale-[0.98] transition-transform">
          <div className="absolute -inset-[2px] bg-gradient-to-r from-[#00FF41]/40 via-cyan-400/40 to-[#00FF41]/40 rounded-2xl blur-[15px] opacity-10 group-hover:opacity-40 transition-opacity duration-700 animate-pulse"></div>
          <div className="relative w-full h-20 bg-gradient-to-br from-[#00FF41] via-[#00cc33] to-cyan-500 p-[1px] rounded-2xl shadow-lg">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-full bg-black hover:bg-[#00FF41]/5 flex items-center justify-center relative overflow-hidden rounded-[15px] transition-colors border-none"
            >
              <span className="text-[#00FF41] group-hover:text-white font-black uppercase tracking-[0.4em] text-sm lg:text-lg relative z-10 italic transition-colors">
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
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderForm()}
    </form>
  );

  const pixSlot = (
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
