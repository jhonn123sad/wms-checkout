import { createFileRoute } from "@tanstack/react-router";
import { AdminMaintenance } from "./admin";

export const Route = createFileRoute("/admin/projects/$id")({
  component: AdminMaintenance,
});
