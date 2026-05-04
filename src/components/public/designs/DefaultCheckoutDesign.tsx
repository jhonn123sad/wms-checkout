import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Utensils, 
  Clock, 
  BookOpen,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { toast } from "sonner";

interface DesignProps {
  checkout: any;
  formData: Record<string, string>;
  loading: boolean;
  paymentData: any;
  paymentStatus: string;
  mediaData: any;
  handleSubmit: (e: React.FormEvent) => Promise<any>;
  handleInputChange: (name: string, value: string) => void;
  handleResetPayment: () => void;
  InlinePixPanel: any;
}

export function DefaultCheckoutDesign({
  checkout,
  formData,
  loading,
  paymentData,
  paymentStatus,
  mediaData,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
  InlinePixPanel
}: DesignProps) {
  const activeFields = (checkout.checkout_fields || [])
    .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      <main className="w-full max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black">{checkout.title}</h1>
            <p className="text-xl text-gray-400">{checkout.subtitle}</p>
            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
              <MediaDisplay media={mediaData} />
            </div>
          </div>
          <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
            {paymentData ? (
              <InlinePixPanel 
                paymentData={paymentData}
                paymentStatus={paymentStatus}
                onReset={handleResetPayment}
                formatPrice={(cents: number) => `R$ ${(cents / 100).toFixed(2)}`}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-3xl font-black mb-6">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkout.price)}
                </div>
                {activeFields.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label>{field.field_label}</Label>
                    <Input
                      className="bg-white/5 border-white/10"
                      value={formData[field.field_name] || ""}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                      required={field.required}
                    />
                  </div>
                ))}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-16 bg-green-500 hover:bg-green-400 text-black font-black flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    checkout.cta_text
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
