/**
 * CHECKOUT CORE - NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Página inicial de checkout (Home). Inicia o fluxo de pagamento.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", cpf: "" });

  const handleRedirect = () => {
    navigate({ to: "/admin/checkouts" });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col items-center justify-center p-4 md:p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo</h1>
        <p className="text-[#86868B] mb-8">
          Para realizar vendas, acesse um checkout específico através da URL /c/:slug.
        </p>
        <Button onClick={handleRedirect} className="w-full h-14 bg-black text-white rounded-xl font-semibold">
          Acessar Painel Admin
        </Button>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-[#D2D2D7]/30 p-8 md:p-10 flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-full mb-6">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#86868B]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Pagamento seguro</span>
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-2">Finalize seu acesso</h1>
        <p className="text-[#86868B] text-sm text-center mb-8 leading-relaxed">
          Pague com Pix e receba a liberação após a confirmação do pagamento.
        </p>

        {/* Product Box */}
        <div className="w-full bg-[#F5F5F7] rounded-2xl p-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-base">Produto Teste</h2>
            <p className="text-xs text-[#86868B] mt-0.5">Acesso liberado após confirmação do Pix.</p>
          </div>
          {/* PRODUTO CONFIGURÁVEL NO BANCO DE DADOS - EXIBIÇÃO TEMPORÁRIA R$ 0,50 */}
          <div className="text-lg font-bold">R$ 0,50</div>
        </div>

        {/* Form Fields */}
        <form 
          onSubmit={handleGeneratePix}
          className="w-full space-y-4 mb-8"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#86868B] ml-1">Nome completo</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Como no seu documento"
              className="w-full h-12 px-4 rounded-xl border border-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#86868B] ml-1">CPF</label>
            <input 
              type="text" 
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              placeholder="000.000.000-00"
              className="w-full h-12 px-4 rounded-xl border border-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
            />
          </div>

           {/* Action Button */}
           <button
             type="submit"
             disabled={loading}
             className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base transition-transform active:scale-[0.98] mb-4 disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {loading ? (
               <>
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Gerando Pix...
               </>
             ) : (
               "Gerar Pix"
             )}
           </button>
 
           {loading && (
             <p className="text-[11px] text-[#0071E3] font-medium text-center animate-pulse mb-6">
               Aguarde, estamos gerando seu Pix com segurança.
             </p>
           )}
         </form>
      </div>

      {/* Footer Disclaimer */}
      <footer className="max-w-[440px] mt-10 px-6 pb-8 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[9px] text-[#86868B] text-center leading-relaxed">
          A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui responsabilidade pela entrega ou suporte dos produtos oferecidos pelo vendedor.
        </p>
      </footer>
    </div>
  );
}
