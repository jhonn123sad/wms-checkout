import { CustomMediaBlockRenderer } from "./blocks/CustomMediaBlockRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, ChevronRight } from "lucide-react";

export function CustomMediaV1Design(props: any) {
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

  // Filtrar seções e ordenar por sort_order (embora já venha ordenado)
  const sections = (checkout.checkout_sections || [])
    .filter((s: any) => s.active !== false)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  // Componente de formulário isolado para ser injetado nas seções
  const renderCheckoutForm = () => (
    <Card className="overflow-hidden bg-[#111111]/80 backdrop-blur-2xl border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2.5rem] relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500/10 blur-[100px] pointer-events-none"></div>
      
      <div className="p-8 md:p-10 relative z-10">
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Investimento Único</span>
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-black text-white tracking-tighter">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(checkout.price)}
              </div>
            </div>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
        </div>

        {paymentData ? (
          <div className="animate-in zoom-in-95 duration-500">
            <InlinePixPanel 
              paymentData={paymentData}
              paymentStatus={paymentStatus}
              onReset={handleResetPayment}
              formatPrice={(cents: number) => new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(cents / 100)}
              theme={{
                button: "#22c55e",
                buttonText: "#000000",
                accent: "#22c55e",
                card: "transparent"
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {(checkout.checkout_fields || [])
                .filter((f: any) => f.active !== false && !f.field_type?.startsWith("hidden:"))
                .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                .map((field: any) => (
                  <div key={field.id || field.field_name} className="group space-y-2">
                    <Label 
                      htmlFor={field.field_name} 
                      className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-green-500 transition-colors"
                    >
                      {field.field_label}
                      {field.required && <span className="text-green-500 ml-1 opacity-50">*</span>}
                    </Label>
                    <Input
                      id={field.field_name}
                      type={field.field_type?.replace("hidden:", "") || "text"}
                      placeholder={`Digite seu ${field.field_label.toLowerCase()}`}
                      required={field.required}
                      className="h-14 bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.05] focus:ring-1 focus:ring-green-500/30 focus:border-green-500/50 transition-all rounded-2xl placeholder:text-gray-700 text-sm px-6"
                      value={formData[field.field_name] || ""}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                    />
                  </div>
                ))}
            </div>

            <div className="pt-4 space-y-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 md:h-20 text-lg font-black bg-green-500 hover:bg-green-400 text-black transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-[0_20px_40px_-12px_rgba(34,197,94,0.4)] relative group overflow-hidden"
              >
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <span className="animate-pulse tracking-tight">Gerando Pix...</span>
                  ) : (
                    <>
                      <span className="tracking-tight italic">{checkout.cta_text || "GARANTIR ACESSO AGORA"}</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </Button>
              
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                  <Lock className="w-3 h-3 text-green-500" />
                  <span>Pagamento 100% Seguro</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#22c55e_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <main className="relative z-10 w-full flex flex-col items-center">
        {sections.length > 0 ? (
          sections.map((section: any) => (
            <CustomMediaBlockRenderer 
              key={section.id} 
              section={section} 
              checkout_form={renderCheckoutForm()}
            />
          ))
        ) : (
          /* Fallback se não houver seções: exibe o formulário centralizado */
          <div className="py-24 w-full max-w-[480px] px-4">
            {renderCheckoutForm()}
          </div>
        )}
      </main>
    </div>
  );
}
