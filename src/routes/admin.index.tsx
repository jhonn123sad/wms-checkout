import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    orders: 0,
    paidOrders: 0
  });

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     const fetchStats = async () => {
       try {
         const [pRes, oRes, sRes] = await Promise.all([
           supabase.from("checkout_projects").select("*", { count: 'exact', head: true }),
           supabase.from("orders").select("*", { count: 'exact', head: true }),
           supabase.from("orders").select("*", { count: 'exact', head: true }).eq("status", "paid")
         ]);
 
         setStats({
           projects: pRes.count || 0,
           orders: oRes.count || 0,
           paidOrders: sRes.count || 0
         });
       } catch (err: any) {
         console.error("Error fetching stats:", err);
         setError("Erro ao carregar estatísticas");
       } finally {
         setLoading(false);
       }
     };
     fetchStats();
   }, []);
 
   if (loading) {
     return (
       <div className="flex items-center justify-center h-48">
         <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    </div>
  );
}

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel Admin</h1>
          <p className="text-gray-500">Bem-vindo ao centro de controle do seu checkout.</p>
        </div>
        <Button asChild>
          <Link to="/admin/projects" className="flex items-center gap-2">
            <Briefcase size={18} />
            Ver Projetos
            <ArrowRight size={18} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Total de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.projects}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Total de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Vendas Pagas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{stats.paidOrders}</p>
        </CardContent>
      </Card>
    </div>
  );
}
