import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/pagamento/$orderId")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.functions.invoke("get-order-payment-data", {
      method: "GET",
      headers: {},
      body: undefined as any,
      // @ts-ignore — supabase-js v2 supports query via fetch URL only; we pass orderId via body fallback
    });
    // supabase.functions.invoke doesn't support query params natively;
    // call directly via fetch instead:
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-order-payment-data?orderId=${encodeURIComponent(params.orderId)}`;
    const resp = await fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    });
    if (!resp.ok) throw new Error(`HTTP_${resp.status}`);
    const json = await resp.json();
    if (json?.error) throw new Error(json.error);
    // suppress unused vars
    void data; void error;
    return json;
  },
  component: PaymentReal,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-8 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-[#1D1D1F] mb-2">Ops! Algo deu errado</h1>
          <p className="text-[#86868B] text-sm mb-8 leading-relaxed">
            Não foi possível carregar os dados do pagamento. Verifique sua conexão ou tente novamente.
          </p>
          
          <div className="w-full space-y-3">
            <button 
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="w-full bg-black text-white h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Tentar novamente
            </button>
            <Link to="/" className="w-full h-12 rounded-xl font-semibold text-sm text-[#86868B] flex items-center justify-center hover:bg-[#F5F5F7] transition-all">
              Voltar ao checkout
            </Link>
            <Link to="/pagamento/demo-preview" className="w-full h-12 rounded-xl font-semibold text-[11px] text-[#0071E3] flex items-center justify-center uppercase tracking-wider">
              Abrir modo demonstração
            </Link>
          </div>
        </div>
      </div>
    );
  }
});

function PaymentReal() {
  const loaderData = Route.useLoaderData();
  
  // Safe data extraction
  const data = {
    orderId: loaderData?.orderId || "Indisponível",
    status: loaderData?.status || "pendente",
    amount_cents: typeof loaderData?.amount_cents === 'number' ? loaderData.amount_cents : 0,
    qr_code: loaderData?.qr_code || "",
    qr_code_base64: typeof loaderData?.qr_code_base64 === 'string' && loaderData.qr_code_base64.startsWith('data:image') 
      ? loaderData.qr_code_base64 
      : null
  };

  const price = (data.amount_cents / 100).toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  const hasQrCode = data.qr_code.length > 0;
  const hasQrImage = data.qr_code_base64 !== null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-8 md:p-10 flex flex-col items-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-full mb-6">
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></div>
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
            {data.status === 'waiting_payment' ? 'Aguardando pagamento' : String(data.status)}
          </span>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">Pague com Pix</h1>
        <div className="text-3xl font-bold text-center mb-8">{price}</div>

        {/* QR Code */}
        <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center border border-[#D2D2D7]/50 shadow-sm mb-8 overflow-hidden">
          {hasQrImage ? (
            <img src={data.qr_code_base64!} alt="QR Code Pix" className="w-full h-full p-2 object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 18h1v1h-1zM18 14h1v1h-1z"/></svg>
              </div>
              <p className="text-[10px] text-[#86868B] leading-tight">
                {hasQrCode ? "QR Code visual indisponível. Use o código abaixo." : "QR Code ainda não gerado."}
              </p>
            </div>
          )}
        </div>

        {/* Pix Code Box */}
        <div className="w-full space-y-3 mb-8">
          <p className="text-xs font-semibold text-[#86868B] text-center uppercase tracking-wide">Código Copia e Cola</p>
          <div className="w-full bg-[#F5F5F7] rounded-xl p-3 border border-[#D2D2D7]/50 overflow-hidden">
            <p className="text-[10px] font-mono break-all text-[#86868B] text-center leading-tight select-all">
              {hasQrCode ? data.qr_code : "Código Pix ainda não disponível."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <button 
            disabled={!hasQrCode}
            onClick={() => {
              navigator.clipboard.writeText(data.qr_code);
              toast.success("Código Pix copiado!");
            }}
            className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base transition-transform active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100"
          >
            Copiar código Pix
          </button>
          <Link 
            to="/"
            className="w-full flex items-center justify-center h-12 rounded-xl font-semibold text-sm text-[#86868B] hover:bg-[#F5F5F7] transition-all"
          >
            Voltar
          </Link>
        </div>
      </div>

      {/* Debug Box (Temporary) */}
      <div className="mt-8 p-3 rounded-lg bg-black/5 border border-black/10 text-[9px] font-mono text-gray-500 max-w-[440px] w-full">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Source: Real</span>
          <span>Order: {data.orderId.slice(0, 8)}...</span>
          <span>Status: {data.status}</span>
          <span>HasQR: {hasQrCode ? "Yes" : "No"}</span>
          <span>HasImg: {hasQrImage ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
}