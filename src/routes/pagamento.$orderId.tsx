import { createFileRoute, Link } from "@tanstack/react-router";
import { getOrderData } from "@/server/payments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/pagamento/$orderId")({
  loader: async ({ params }) => {
    try {
      return await getOrderData({ data: { orderId: params.orderId } });
    } catch (err) {
      throw err;
    }
  },
  component: PaymentReal,
  errorComponent: () => (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Pedido não encontrado</h1>
      <Link to="/" className="text-blue-600 font-semibold">Voltar ao início</Link>
    </div>
  )
});

function PaymentReal() {
  const data = Route.useLoaderData();
  const price = (data.amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-8 md:p-10 flex flex-col items-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-full mb-6">
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></div>
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
            {data.status === 'waiting_payment' ? 'Aguardando pagamento' : data.status}
          </span>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">Pague com Pix</h1>
        <div className="text-3xl font-bold text-center mb-8">{price}</div>

        {/* QR Code */}
        <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center border border-[#D2D2D7]/50 shadow-sm mb-8 overflow-hidden">
          {data.qr_code_base64 ? (
            <img src={data.qr_code_base64} alt="QR Code Pix" className="w-full h-full p-2" />
          ) : (
            <div className="text-[10px] text-center text-muted-foreground p-4">
              QR Code gerado. Use o código abaixo para pagar.
            </div>
          )}
        </div>

        {/* Pix Code Box */}
        <div className="w-full space-y-3 mb-8">
          <p className="text-xs font-semibold text-[#86868B] text-center uppercase tracking-wide">Código Copia e Cola</p>
          <div className="w-full bg-[#F5F5F7] rounded-xl p-3 border border-[#D2D2D7]/50 overflow-hidden">
            <p className="text-[10px] font-mono break-all text-[#86868B] text-center leading-tight">
              {data.qr_code}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(data.qr_code);
              toast.success("Código Pix copiado!");
            }}
            className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base transition-transform active:scale-[0.98]"
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
    </div>
  );
}