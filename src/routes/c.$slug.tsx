import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutPageContent } from "@/components/public/CheckoutPageContent";

export const Route = createFileRoute("/c/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;

    const { data: checkout, error: checkoutError } = await supabase
      .from("checkouts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (checkoutError) {
      console.error("[c.$slug] erro ao buscar checkout:", checkoutError);
      throw new Error("Erro ao carregar checkout.");
    }

    if (!checkout) {
      throw new Error("Checkout não encontrado.");
    }

    const isPublished = checkout.active === true || checkout.status === "published";

    if (!isPublished) {
      throw new Error("Este checkout não está mais ativo.");
    }

    const { data: fields, error: fieldsError } = await supabase
      .from("checkout_fields")
      .select("*")
      .eq("checkout_id", checkout.id)
      .order("sort_order", { ascending: true });

    if (fieldsError) {
      console.warn("[c.$slug] erro ao buscar checkout_fields:", fieldsError);
    }

    return {
      checkout: {
        ...checkout,
        checkout_fields: fields || [],
      },
    };
  },

  component: DynamicCheckout,

  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
      <div className="max-w-md w-full bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
        <h1 className="text-xl font-bold mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="text-green-500 font-semibold hover:underline"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  ),
});

function DynamicCheckout() {
  const { checkout } = Route.useLoaderData();
  return <CheckoutPageContent checkout={checkout} />;
}
