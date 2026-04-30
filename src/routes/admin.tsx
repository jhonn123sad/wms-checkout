import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingCart, User } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-b md:border-r border-border p-6 flex flex-col gap-6">
        <div className="font-bold text-xl flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Admin Checkouts
        </div>
        
        <nav className="flex flex-col gap-1">
          <Link 
            to="/admin/checkouts" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <LayoutDashboard className="w-4 h-4" />
            Checkouts
          </Link>
          <Link 
            to="/admin/projects" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            Legacy Projects
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Ir para o Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
