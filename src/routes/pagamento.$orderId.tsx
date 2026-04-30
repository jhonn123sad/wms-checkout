/**
 * CHECKOUT CORE - NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Página de exibição do Pix e monitoramento de pagamento (Polling).
 */
import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";

type PaymentSearch = {
  token?: string;
};

export const Route = createFileRoute("/pagamento/$orderId")({
  validateSearch: (search: Record<string, unknown>): PaymentSearch => {
    return {
      token: search.token as string | undefined,
    };
  },
  loader: async ({ params, deps }) => {
    const token = (deps as any).token;
    if (!token) {
      console.error("[Loader] Token de acesso não fornecido na URL");
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const url = `${supabaseUrl}/functions/v1/get-order-payment-data?orderId=${encodeURIComponent(params.orderId)}&token=${encodeURIComponent(token || "")}`;
    const resp = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (!resp.ok) throw new Error(`HTTP_${resp.status}`);
    const json = await resp.json();
    if (json?.error) throw new Error(json.error);
    return json;
  },
  loaderDeps: ({ search: { token } }) => ({ token }),
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
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(loaderData?.status || "pendente");

  useEffect(() => {
    if (currentStatus === 'paid') return;
    const token = (Route.useSearch() as PaymentSearch).token;

    const orderId = loaderData?.orderId;
    if (!orderId) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const statusUrl = `${supabaseUrl}/functions/v1/get-order-status?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(token || "")}`;

    console.log("[polling] Inicando verificação de status para order:", orderId);

    const checkStatus = async () => {
      try {
        const resp = await fetch(statusUrl, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });
        
        if (!resp.ok) {
          console.error("[polling] Falha ao verificar status:", resp.status);
          return;
        }

        const data = await resp.json();
        console.log("[polling] Status recebido:", data.status, "Redirect URL:", data.thank_you_url);
        
        if (data.status === 'paid') {
          console.log("[polling] Pagamento CONFIRMADO! Iniciando redirecionamento...");
          setCurrentStatus('paid');
          toast.success("Pagamento confirmado!");
          
          if (data.thank_you_url) {
            console.log("[polling] Redirecionando para:", data.thank_you_url);
            window.location.href = data.thank_you_url;
          } else {
            console.warn("[polling] thank_you_url não encontrado na resposta");
          }
        }
      } catch (err) {
        console.error("[polling] Erro ao buscar status:", err);
      }
    };

    const interval = setInterval(checkStatus, 7000); // 7 segundos
    return () => clearInterval(interval);
  }, [loaderData?.orderId, currentStatus]);
  
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
          <div className={`h-2 w-2 rounded-full animate-pulse ${currentStatus === 'paid' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
            {currentStatus === 'paid' ? 'Pagamento confirmado' : (currentStatus === 'waiting_payment' ? 'Aguardando pagamento' : String(currentStatus))}
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
          <span>Status: {currentStatus}</span>
          <span>HasQR: {hasQrCode ? "Yes" : "No"}</span>
          <span>HasImg: {hasQrImage ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
}