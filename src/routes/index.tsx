/**
 * CHECKOUT CORE - NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Página inicial de checkout (Home). Inicia o fluxo de pagamento.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

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
