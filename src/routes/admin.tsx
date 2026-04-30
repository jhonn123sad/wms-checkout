import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminMaintenance,
});

export function AdminMaintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Admin temporariamente desativado</h1>
          <p className="text-gray-600 text-balance">
            O checkout está funcionando. A configuração será feita diretamente pelo Supabase nesta versão MVP.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/">Voltar ao checkout</Link>
        </Button>
      </div>
    </div>
  );
}
