/**
 * ROTA DE CHECKOUT DINÂMICO UNIFICADA
 * Esta rota busca dados na tabela public.checkouts e renderiza o checkout real.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutPageContent } from "@/components/public/CheckoutPageContent";

export const Route = createFileRoute("/c/$slug")({
  loader: async ({ params }) => {
    const slugOrId = params.slug;
    
    // Tenta buscar por slug ou por ID (caso seja UUID)
    let query = supabase
      .from("checkouts")
      .select("*, checkout_fields(*)");
    
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    if (isUUID) {
      query = query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`);
    } else {
      query = query.eq("slug", slugOrId);
    }

    const { data: checkout, error } = await query.maybeSingle();

    if (error) {
      console.error("[route.c.$slug] erro ao buscar checkout:", error);
      throw new Error("Erro ao carregar checkout.");
    }

    if (!checkout) {
      throw new Error("Checkout não encontrado.");
    }

    if (!checkout.active && checkout.status !== 'published') {
      throw new Error("Este checkout não está mais ativo.");
    }

    return { checkout };
  },
  component: DynamicCheckout,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
      <div className="max-w-md w-full bg-[#1a1a1a] p-8 rounded-2xl shadow-sm border border-[#333]">
        <h1 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button 
          onClick={() => window.location.href = "/"}
          className="text-green-500 font-semibold hover:underline"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  )
});

function DynamicCheckout() {
  const { checkout } = Route.useLoaderData();
  console.log("[Route c.$slug] Renderizando checkout:", checkout.slug);
  return (
    <>
      <div style={{ background: 'red', color: 'white', padding: '20px', textAlign: 'center', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 99999 }}>
        TESTE ROTA C.$SLUG ATIVA
      </div>
      <CheckoutPageContent checkout={checkout} />
    </>
  );
}
