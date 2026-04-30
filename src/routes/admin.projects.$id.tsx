import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/projects/$id")({
  component: () => <div>Legacy Project View</div>,
});
