import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/$slug")({
  loader: async ({ params }) => {
    // Redireciona permanentemente para a rota oficial /c/:slug
    throw redirect({
      to: "/c/$slug",
      params: { slug: params.slug },
    });
  },
});
