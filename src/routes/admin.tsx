import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingCart, FileText, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate({ to: "/admin-login" });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate({ to: "/admin-login" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-b md:border-r border-border p-6 flex flex-col gap-6 sticky top-0 h-screen">
        <div className="font-bold text-xl flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Admin CMS
        </div>
        
        <nav className="flex flex-col gap-1">
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            to="/admin/pages" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <FileText className="w-4 h-4" />
            Páginas
          </Link>
          <Link 
            to="/admin/checkouts" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            Checkouts
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-border flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LayoutDashboard className="w-4 h-4" />
            Ver Site Público
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="justify-start px-0 text-muted-foreground hover:text-destructive hover:bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Painel
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-muted/10">
        <Outlet />
      </main>
    </div>
  );
}

