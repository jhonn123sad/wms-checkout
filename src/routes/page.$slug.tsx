/**
 * ROTA PÚBLICA PARA PÁGINAS
 * Renderiza páginas criadas no admin pelo slug.
 */
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/page/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;
    
    // Ignorar slugs reservados se necessário, mas tanstack router prioriza rotas estáticas
    const { data: page, error } = await supabase
      .from("pages")
      .select("*, sections(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error("Erro ao carregar página.");
    if (!page) throw new Error("Página não encontrada.");

    return { page };
  },
  component: PublicPage,
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-gray-600 mb-6">Página não encontrada.</p>
        <button onClick={() => window.location.href = "/"} className="text-blue-500 font-semibold hover:underline">
          Voltar ao início
        </button>
      </div>
    </div>
  )
});

function PublicPage() {
  const { page } = Route.useLoaderData();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Aqui entraria o renderizador de seções que o usuário mencionou já existir */}
      <div className="p-20 text-center">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        <p className="text-gray-500 italic">Renderizador de seções em desenvolvimento...</p>
        <pre className="mt-8 text-left bg-gray-100 p-4 rounded text-xs overflow-auto max-w-2xl mx-auto">
          {JSON.stringify(page.sections, null, 2)}
        </pre>
      </div>
    </div>
  );
}
