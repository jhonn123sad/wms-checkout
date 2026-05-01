/**
 * ROTA DE CHECKOUT DINÂMICO
 * Este arquivo apenas carrega os dados e renderiza o CheckoutCoreContainer.
 */
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutCoreContainer } from "@/components/checkout/CheckoutCoreContainer";

export const Route = createFileRoute("/c/$slug")({
  loader: async ({ params }) => {
    const { data: project, error: pError } = await supabase
      .from("checkout_projects")
      .select("*")
      .eq("slug", params.slug)
      .eq("active", true)
      .maybeSingle();

    if (pError || !project) {
      throw new Error("Projeto não encontrado ou inativo.");
    }

    const { data: offer, error: oError } = await supabase
      .from("checkout_offers")
      .select("*")
      .eq("project_id", project.id)
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (oError || !offer) {
      throw new Error("Oferta ativa não encontrada para este projeto.");
    }

    return { project, offer };
  },
  component: DynamicCheckout,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-500 mb-6">{error.message}</p>
        <button 
          onClick={() => window.location.href = "/"}
          className="text-blue-600 font-semibold hover:underline"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  )
});

function DynamicCheckout() {
  const { project, offer } = Route.useLoaderData();
  
  // Inject checkout media into theme/content for the visual components
  const projectWithMedia = {
    ...project,
    headline: project.headline || project.title,
    subheadline: project.subheadline || project.subtitle,
    theme_json: {
      ...(project.theme_json || {}),
      media_url: project.media_url,
      media_type: project.media_type,
    }
  };

  return <CheckoutCoreContainer project={projectWithMedia} offer={offer} />;
}
