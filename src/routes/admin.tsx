 import { useEffect, useState, ReactNode } from "react";
 import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
 import { LayoutDashboard, Settings, LogOut, Briefcase, AlertTriangle, Loader2 } from "lucide-react";
 import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
 
 function AdminErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
   const router = useRouter();
   return (
     <div className="p-8">
       <Alert variant="destructive">
         <AlertTriangle className="h-4 w-4" />
         <AlertTitle>Erro no Admin</AlertTitle>
         <AlertDescription className="mt-2">
           <p className="mb-4">Ocorreu um erro ao carregar esta seção do painel.</p>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => { router.invalidate(); reset(); }}>
               Tentar novamente
             </Button>
             <Button variant="outline" size="sm" asChild>
               <Link to="/admin">Ir para Dashboard</Link>
             </Button>
           </div>
         </AlertDescription>
       </Alert>
       {import.meta.env.DEV && (
         <pre className="mt-4 p-4 bg-red-50 text-red-800 rounded text-xs overflow-auto">
           {error.message}
         </pre>
       )}
     </div>
   );
 }

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
   errorComponent: AdminErrorComponent,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
     let isMounted = true;
    const checkAuth = async () => {
       try {
        const { data: { session } } = await supabase.auth.getSession();
 
         if (!session) {
          if (isMounted) {
            navigate({ to: "/admin/login" });
          }
        } else {
          if (isMounted) {
            setChecking(false);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) {
          navigate({ to: "/admin/login" });
        }
      }
    };

    checkAuth();
 
     return () => {
       isMounted = false;
     };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

   if (checking) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
     );
   }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Checkout Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors [&.active]:bg-black [&.active]:text-white"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/admin/projects" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors [&.active]:bg-black [&.active]:text-white"
          >
            <Briefcase size={20} />
            <span className="font-medium">Projetos</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Painel de Controle</h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
