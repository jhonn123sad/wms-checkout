/**
 * CHECKOUT DINÂMICO UNIFICADO
 * Busca checkouts públicos e páginas pelo slug.
 */
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutPageContent } from "@/components/public/CheckoutPageContent";

export const Route = createFileRoute("/c/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;
    
    const { data: checkout, error } = await supabase
      .from("checkouts")
      .select("*, checkout_fields(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[route.c.$slug] erro:", error);
      throw new Error("Erro ao carregar checkout.");
    }

    if (!checkout) {
      throw new Error("Checkout não encontrado.");
    }

    const isPublished = checkout.active === true || checkout.status === 'published';
    if (!isPublished) {
      throw new Error("Este checkout não está mais ativo.");
    }

    return { checkout };
  },
  component: DynamicCheckout,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
      <div className="max-w-md w-full bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
        <h1 className="text-xl font-bold mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button onClick={() => window.location.href = "/"} className="text-green-500 font-semibold hover:underline">
          Voltar ao início
        </button>
      </div>
    </div>
  )
});

function DynamicCheckout() {
  const { checkout } = Route.useLoaderData();
  return <CheckoutPageContent checkout={checkout} />;
}
