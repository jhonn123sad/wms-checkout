import { MediaDisplay } from "@/components/public/MediaDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, ChevronRight, CheckCircle2, ShieldCheck, Zap, Globe, Award } from "lucide-react";
import { getSlotMedia } from "@/lib/designMediaSlots";
import React from "react";

/**
 * WmsLiquidVisualShell
 * 
 * Este componente é responsável exclusivamente pela camada visual (UI/UX).
 * Ele recebe elementos pré-processados e os renderiza no layout.
 */
function WmsLiquidVisualShell({
  checkout,
  title,
  subtitle,
  price,
  ctaText,
  heroSlot,
  proofSlot,
  trustBadgeSlot,
  formSlot,
  pixSlot,
  hasPaymentData,
}: any) {
  const displayTitle = title || "Crie renda com IA sem aparecer";
  const displaySubtitle =
    subtitle ||
    "Aprenda a construir páginas e Influencers AI no Instagram, mesmo começando do zero.";

  const rawPrice = price ?? checkout?.price;

  const formattedPrice =
    typeof rawPrice === "number"
      ? rawPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : rawPrice || "R$37";

  const benefits = [
    {
      label: "Sem aparecer",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 18h.01" />
          <path d="M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
        </svg>
      ),
    },
    {
      label: "Sem programação",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
        </svg>
      ),
    },
    {
      label: "Método prático",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 12 2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
    {
      label: "Comunidade de execução",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute right-[10%] top-[20%] h-[30%] w-[30%] rounded-full bg-cyan-100/45 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,0.45)_42%,rgba(226,239,255,0.5)_100%)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="space-y-5 lg:col-span-7 xl:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                <path d="M19 15 20 18l3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600/80">
                WMS — Web Money Society
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                {displayTitle.includes("sem aparecer") ? (
                  <>
                    Crie renda com IA{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                      sem aparecer
                    </span>
                  </>
                ) : (
                  displayTitle
                )}
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
                {displaySubtitle}
              </p>
            </div>

            <div className="grid max-w-md grid-cols-2 gap-3">
              {benefits.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/45 p-3 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative hidden pt-4 md:block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-[60px]" />

              <div className="relative aspect-video max-h-[260px] overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/25 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_video]:h-full [&_video]:w-full [&_video]:object-cover">
                  {heroSlot}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_45%,rgba(255,255,255,0.18))]" />
              </div>
            </div>
          </section>

          <section className="relative lg:col-span-5 xl:col-span-6">
            <div className="relative z-20">
              <div className="relative rounded-[2.5rem] border border-white/60 bg-gradient-to-b from-white/90 to-white/45 p-1 shadow-[0_32px_80px_-16px_rgba(15,23,42,0.16)] backdrop-blur-3xl sm:rounded-[3rem]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                <div className="space-y-5 p-5 sm:p-7 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-900">
                        {checkout?.title || "Checkout"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Complete sua inscrição agora
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 line-through">
                        R$ 197
                      </div>
                      <div className="text-4xl font-bold tracking-tight text-slate-950">
                        {formattedPrice}
                      </div>
                      <div className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                        OFERTA LIMITADA
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-slate-200/60" />

                  <div className="rounded-[2rem] border border-white/80 bg-slate-50/45 p-3 shadow-inner backdrop-blur-xl sm:p-4">
                    {hasPaymentData ? pixSlot : formSlot}
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 13c0 5-3.5 7.5-7.3 8.8a2 2 0 0 1-1.4 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1v7Z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        Ambiente Seguro
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 12 2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        Pix Seguro
                      </div>
                    </div>

                    <div className="flex justify-center text-slate-300">
                      <div className="max-h-12 max-w-[160px] overflow-hidden [&>*]:max-h-12 [&_img]:max-h-12 [&_img]:w-auto [&_img]:object-contain">
                        {trustBadgeSlot}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-[-18px] z-30 hidden items-center justify-center sm:flex lg:-right-8 lg:bottom-20">
                <div className="rounded-3xl border border-white/90 bg-white/80 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
                  <div className="max-h-14 max-w-[180px] overflow-hidden [&>*]:max-h-14 [&_img]:max-h-14 [&_img]:w-auto [&_img]:object-contain">
                    {proofSlot}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-blue-200/25 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-indigo-200/25 blur-3xl" />
          </section>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.12)_100%)]" />
      </div>
    </div>
  );
}

/**
 * WmsLiquidCheckout
 * 
 * Componente principal que gerencia a integração de dados e lógica.
 * Passa os elementos prontos para o WmsLiquidVisualShell.
 */
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

  // --- SLOT: HERO ---
  const heroSlot = heroVisual ? (
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
  );

  // --- SLOT: PROOF ---
  const proofSlot = proofVisual ? (
    <MediaDisplay media={proofVisual} />
  ) : null;

  // --- SLOT: TRUST BADGE ---
  const trustBadgeSlot = trustBadge ? (
    <MediaDisplay media={trustBadge} />
  ) : (
    <ShieldCheck className="w-8 h-8 text-blue-500 opacity-30" />
  );

  // --- RENDER FORM (Contrato preservado) ---
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

  // --- FORM SLOT ---
  const formSlot = (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderForm()}
    </form>
  );

  // --- PIX SLOT (Contrato preservado) ---
  const pixSlot = (
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
  );

  // --- RENDER VISUAL SHELL ---
  return (
    <WmsLiquidVisualShell 
      checkout={checkout}
      title={checkout.title || "Crie renda com IA sem aparecer"}
      subtitle={checkout.subtitle || "Aprenda a construir páginas e Influencers AI no Instagram, mesmo começando do zero."}
      price={new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(checkout.price)}
      heroSlot={heroSlot}
      proofSlot={proofSlot}
      trustBadgeSlot={trustBadgeSlot}
      formSlot={formSlot}
      pixSlot={pixSlot}
      hasPaymentData={!!paymentData}
    />
  );
}