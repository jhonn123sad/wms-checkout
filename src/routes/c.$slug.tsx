import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutPageContent } from "@/components/public/CheckoutPageContent";

export const Route = createFileRoute("/c/$slug")({
  loader: async ({ params }) => {
    const { data: checkout, error: checkoutError } = await supabase
      .from("checkouts")
      .select("*")
      .eq("slug", params.slug)
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
        checkout_fields: fields || []
      }
    };
  },
  component: DynamicCheckout,
});

function DynamicCheckout() {
  const { checkout } = Route.useLoaderData();
  return <CheckoutPageContent checkout={checkout} />;
}
