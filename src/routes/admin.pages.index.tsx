import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Edit, Trash2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/pages/index" as any)({
  component: PagesIndex,
});

function PagesIndex() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erro ao carregar páginas");
    } else {
      setPages(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta página?")) return;
    
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir página");
    } else {
      toast.success("Página excluída");
      fetchPages();
    }
  };

  const handleDuplicate = async (page: any) => {
    const { id, created_at, updated_at, ...pageData } = page;
    const newPage = {
      ...pageData,
      title: `${pageData.title} (Cópia)`,
      slug: `${pageData.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: "draft"
    };

    const { data, error } = await supabase.from("pages").insert(newPage).select().single();
    
    if (error) {
      toast.error("Erro ao duplicar página: " + error.message);
    } else {
      // Duplicar seções também
      const { data: sections } = await supabase.from("sections").select("*").eq("page_id", id);
      if (sections && sections.length > 0) {
        const newSections = sections.map(({ id: sId, page_id, ...sData }) => ({
          ...sData,
          page_id: data.id
        }));
        await supabase.from("sections").insert(newSections);
      }
      
      toast.success("Página duplicada com sucesso");
      fetchPages();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Páginas</h1>
          <p className="text-muted-foreground">Crie e edite o conteúdo dinâmico do seu site.</p>
        </div>
        <Link to="/admin/pages/$id" params={{ id: "new" }} className="[&.active]:bg-transparent">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Nova Página
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Carregando páginas...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 border-2 border-dashed rounded-lg text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Nenhuma página encontrada</h3>
            <p className="text-muted-foreground mb-6">Comece criando sua primeira página personalizada.</p>
            <Link to="/admin/pages/$id" params={{ id: "new" }}>
              <Button variant="outline">Criar Página</Button>
            </Link>
          </div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="flex items-center justify-between p-4 bg-card border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    /{page.slug}
                    <Badge variant={page.status === "published" ? "default" : "secondary"} className="text-[10px] py-0 px-1 h-4">
                      {page.status}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" title="Ver página">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="ghost" size="icon" onClick={() => handleDuplicate(page)} title="Duplicar">
                  <Copy className="w-4 h-4" />
                </Button>
                <Link to="/admin/pages/$id" params={{ id: page.id }}>
                  <Button variant="ghost" size="icon" title="Editar">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(page.id)} title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}