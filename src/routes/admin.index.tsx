import { createFileRoute } from "@tanstack/react-router";
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

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: pCount }, { count: oCount }, { count: sCount }] = await Promise.all([
        supabase.from("checkout_projects").select("*", { count: 'exact', head: true }),
        supabase.from("orders").select("*", { count: 'exact', head: true }),
        supabase.from("orders").select("*", { count: 'exact', head: true }).eq("status", "paid")
      ]);

      setStats({
        projects: pCount || 0,
        orders: oCount || 0,
        paidOrders: sCount || 0
      });
    };
    fetchStats();
  }, []);

  return (
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
