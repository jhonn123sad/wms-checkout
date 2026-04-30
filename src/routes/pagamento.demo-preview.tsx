import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pagamento/demo-preview")({
  component: PaymentDemo,
});

function PaymentDemo() {
  const pixCode = "00020101021226850014br.gov.bcb.pix0136e1234567-89ab-cdef-0123-456789abcdef520400005303986540525.005802BR5913PRODUTO TESTE6009SAO PAULO62070503***6304ABCD";

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-8 md:p-10 flex flex-col items-center">
        
         {/* Warning for internal use */}
         <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
           <p className="text-[10px] text-amber-700 font-bold text-center uppercase">
             Ambiente de Teste Interno
           </p>
         </div>
 
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-full mb-6">
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></div>
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Aguardando pagamento</span>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">Pague com Pix</h1>
        <div className="text-3xl font-bold text-center mb-8">R$ 25,00</div>

        {/* QR Code Placeholder */}
        <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm mb-8">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
            <rect x="14" y="14" width="3" height="3"></rect>
            <rect x="18" y="18" width="3" height="3"></rect>
            <rect x="14" y="18" width="1" height="1"></rect>
            <rect x="18" y="14" width="1" height="1"></rect>
          </svg>
        </div>

        {/* Pix Code Box */}
        <div className="w-full space-y-3 mb-8">
          <p className="text-xs font-semibold text-[#86868B] text-center uppercase tracking-wide">Código Copia e Cola</p>
          <div className="w-full bg-[#F5F5F7] rounded-xl p-3 border border-[#D2D2D7]/50 overflow-hidden">
            <p className="text-[10px] font-mono break-all text-[#86868B] text-center leading-tight">
              {pixCode}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 mb-6">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(pixCode);
              alert("Código Pix copiado!");
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

        {/* Demo Message */}
        <div className="w-full bg-[#F5F5F7] border border-[#D2D2D7]/50 rounded-xl p-4">
          <p className="text-[12px] text-[#86868B] text-center leading-relaxed italic">
            Modo demonstração: QR Code e código Pix fictícios.
          </p>
        </div>
      </div>
    </div>
  );
}