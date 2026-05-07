import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, ExternalLink, Copy, Trash2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin-v2/checkouts/")({
  component: AdminV2CheckoutsList,
});

function AdminV2CheckoutsList() {
  const [checkouts, setCheckouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCheckouts(); }, []);

  const fetchCheckouts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("checkouts").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar checkouts");
    else setCheckouts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir permanentemente este checkout?")) return;
    const { error } = await supabase.from("checkouts").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else { toast.success("Excluído"); fetchCheckouts(); }
  };

  const handleDuplicate = async (checkout: any) => {
    const { id, created_at, updated_at, ...data } = checkout;
    const newSlug = `${data.slug}-copia-${Date.now().toString().slice(-4)}`;
    const { data: newCheckout, error } = await supabase.from("checkouts").insert([{
      ...data,
      title: `${data.title} (cópia)`,
      slug: newSlug,
      active: false,
      status: "draft"
    }]).select().single();

    if (error) { toast.error("Erro ao duplicar: " + error.message); return; }

    const { data: fields } = await supabase.from("checkout_fields").select("*").eq("checkout_id", id);
    if (fields?.length) {
      await supabase.from("checkout_fields").insert(fields.map(({ id, created_at, checkout_id, ...f }) => ({ ...f, checkout_id: newCheckout.id })));
    }

    const { data: sections } = await supabase.from("checkout_sections").select("*").eq("checkout_id", id);
    if (sections?.length) {
      await supabase.from("checkout_sections").insert(sections.map(({ id, created_at, updated_at, checkout_id, ...s }) => ({ ...s, checkout_id: newCheckout.id })));
    }

    toast.success("Checkout duplicado com sucesso!");
    fetchCheckouts();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Checkouts V2</h1>
          <p className="text-muted-foreground">Nova interface administrativa oficial</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCheckouts} disabled={loading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
          </Button>
          <Link to="/admin-v2/checkouts/new">
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Novo Checkout</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-48 animate-pulse bg-muted" />) : 
         checkouts.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col">
            <div className="h-32 bg-muted relative">
              {item.media_type === "image" && item.media_url ? <img src={item.media_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-black/80 text-white text-xs">Video/Custom Preview</div>}
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Ativo" : "Inativo"}</Badge>
                <Badge variant="outline" className="bg-background/80">{item.design_key}</Badge>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg truncate" title={item.title}>{item.title}</h3>
                <p className="text-xs text-muted-foreground">/{item.slug}</p>
                <p className="text-sm font-semibold text-primary mt-1">R$ {Number(item.price).toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase">Criado em: {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center justify-end gap-1 pt-2 border-t">
                <a href={`/c/${item.slug}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-accent rounded-md"><ExternalLink className="w-4 h-4" /></a>
                <button onClick={() => handleDuplicate(item)} className="p-2 hover:bg-accent rounded-md"><Copy className="w-4 h-4" /></button>
                <Link to="/admin-v2/checkouts/$id" params={{ id: item.id }} className="p-2 hover:bg-accent rounded-md"><Edit className="w-4 h-4" /></Link>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-accent text-destructive rounded-md"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
