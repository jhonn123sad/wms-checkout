import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Image as ImageIcon, Type, Layout, Star } from "lucide-react";
import { toast } from "sonner";
import { MediaField, MediaValue } from "@/components/admin/MediaField";

export const Route = createFileRoute("/admin/pages/$id")({
  component: PageEditor,
});

type SectionType = "hero" | "text" | "features" | "media" | "testimonials";

interface Section {
  id?: string;
  type: SectionType;
  content: any;
  sort_order: number;
}

function PageEditor() {
  const { id } = useParams({ from: "/admin/pages/$id" });
  const navigate = useNavigate();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchPage = async () => {
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single();

    if (pageError) {
      toast.error("Erro ao carregar página");
      return;
    }

    setTitle(page.title);
    setSlug(page.slug);
    setStatus(page.status);

    const { data: sectionsData, error: sectionsError } = await supabase
      .from("sections")
      .select("*")
      .eq("page_id", id)
      .order("sort_order", { ascending: true });

    if (sectionsError) {
      toast.error("Erro ao carregar seções");
    } else {
      setSections((sectionsData as any[])?.map(s => ({
        id: s.id,
        type: s.type as SectionType,
        content: s.content,
        sort_order: s.sort_order
      })) || []);
    }
    setIsLoading(false);
  };

  const handleAddSection = (type: SectionType) => {
    const newSection: Section = {
      type,
      content: getDefaultContent(type),
      sort_order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const getDefaultContent = (type: SectionType) => {
    switch (type) {
      case "hero": return { title: "Título do Hero", subtitle: "Subtítulo atraente", cta_text: "Saiba Mais", cta_link: "#" };
      case "text": return { body: "Escreva seu conteúdo aqui..." };
      case "features": return { items: [{ title: "Destaque 1", description: "Descrição" }] };
      case "media": return { media: null, caption: "" };
      case "testimonials": return { items: [{ name: "Cliente", text: "Excelente!", role: "CEO" }] };
      default: return {};
    }
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, content: any) => {
    const newSections = [...sections];
    newSections[index].content = content;
    setSections(newSections);
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast.error("Título e Slug são obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      let pageId = id;
      const pageData: any = { title, slug, status, updated_at: new Date().toISOString() };

      if (isNew) {
        const { data, error } = await supabase.from("pages").insert(pageData).select().single();
        if (error) throw error;
        pageId = data.id;
      } else {
        const { error } = await supabase.from("pages").update(pageData).eq("id", id);
        if (error) throw error;
      }

      // Salvar seções
      if (!isNew) {
        await supabase.from("sections").delete().eq("page_id", pageId);
      }

      const sectionsToInsert = sections.map((s, index) => ({
        page_id: pageId,
        type: s.type,
        content: s.content,
        sort_order: index
      }));

      if (sectionsToInsert.length > 0) {
        const { error: sError } = await supabase.from("sections").insert(sectionsToInsert);
        if (sError) throw sError;
      }

      toast.success("Página salva com sucesso!");
      if (isNew) navigate({ to: "/admin/pages" as any });
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/pages" as any })}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">{isNew ? "Nova Página" : "Editar Página"}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" /> {isSaving ? "Salvando..." : "Salvar Página"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Título da Página</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Home, Sobre, Landing Page" />
          </div>
          <div className="space-y-2">
            <Label>URL (Slug)</Label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>/</span>
              <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="url-da-pagina" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Seções da Página</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleAddSection("hero")}><Layout className="w-3 h-3 mr-1" /> Hero</Button>
            <Button variant="outline" size="sm" onClick={() => handleAddSection("text")}><Type className="w-3 h-3 mr-1" /> Texto</Button>
            <Button variant="outline" size="sm" onClick={() => handleAddSection("media")}><ImageIcon className="w-3 h-3 mr-1" /> Mídia</Button>
            <Button variant="outline" size="sm" onClick={() => handleAddSection("features")}><Star className="w-3 h-3 mr-1" /> Destaques</Button>
          </div>
        </div>

        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="p-12 border-2 border-dashed rounded-lg text-center text-muted-foreground">
              Nenhuma seção adicionada. Use os botões acima para começar.
            </div>
          ) : (
            sections.map((section, index) => (
              <Card key={index} className="relative group">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-6 h-6 text-muted-foreground cursor-grab" />
                </div>
                <CardHeader className="py-3 flex flex-row items-center justify-between bg-muted/30">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">{index + 1}</span>
                    {section.type}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveSection(index)} className="h-8 w-8 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  {section.type === "hero" && (
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Título Principal</Label>
                          <Input value={section.content.title} onChange={(e) => handleUpdateSection(index, { ...section.content, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtítulo</Label>
                          <Input value={section.content.subtitle} onChange={(e) => handleUpdateSection(index, { ...section.content, subtitle: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Texto do Botão</Label>
                          <Input value={section.content.cta_text} onChange={(e) => handleUpdateSection(index, { ...section.content, cta_text: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Link do Botão</Label>
                          <Input value={section.content.cta_link} onChange={(e) => handleUpdateSection(index, { ...section.content, cta_link: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.type === "text" && (
                    <div className="space-y-2">
                      <Label>Conteúdo do Texto (HTML aceito)</Label>
                      <textarea 
                        className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm"
                        value={section.content.body} 
                        onChange={(e) => handleUpdateSection(index, { ...section.content, body: e.target.value })} 
                      />
                    </div>
                  )}

                  {section.type === "media" && (
                    <div className="space-y-4">
                      <MediaField 
                        value={section.content.media} 
                        onChange={(val) => handleUpdateSection(index, { ...section.content, media: val })} 
                      />
                      <div className="space-y-2">
                        <Label>Legenda (opcional)</Label>
                        <Input value={section.content.caption} onChange={(e) => handleUpdateSection(index, { ...section.content, caption: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {section.type === "features" && (
                    <div className="space-y-4">
                      {section.content.items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-start border-l-2 pl-4 py-2 group/item">
                          <div className="flex-1 space-y-2">
                            <Input placeholder="Título" value={item.title} onChange={(e) => {
                              const newItems = [...section.content.items];
                              newItems[i].title = e.target.value;
                              handleUpdateSection(index, { ...section.content, items: newItems });
                            }} />
                            <Input placeholder="Descrição" value={item.description} onChange={(e) => {
                              const newItems = [...section.content.items];
                              newItems[i].description = e.target.value;
                              handleUpdateSection(index, { ...section.content, items: newItems });
                            }} />
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => {
                            const newItems = section.content.items.filter((_: any, idx: number) => idx !== i);
                            handleUpdateSection(index, { ...section.content, items: newItems });
                          }} className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => {
                        const newItems = [...section.content.items, { title: "", description: "" }];
                        handleUpdateSection(index, { ...section.content, items: newItems });
                      }}>
                        <Plus className="w-3 h-3 mr-1" /> Add Destaque
                      </Button>
                    </div>
                  )}

                  {section.type === "testimonials" && (
                    <div className="space-y-4">
                      {section.content.items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-start border-l-2 pl-4 py-2 group/item">
                          <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Nome" value={item.name} onChange={(e) => {
                                const newItems = [...section.content.items];
                                newItems[i].name = e.target.value;
                                handleUpdateSection(index, { ...section.content, items: newItems });
                              }} />
                              <Input placeholder="Cargo/Empresa" value={item.role} onChange={(e) => {
                                const newItems = [...section.content.items];
                                newItems[i].role = e.target.value;
                                handleUpdateSection(index, { ...section.content, items: newItems });
                              }} />
                            </div>
                            <textarea 
                              className="w-full p-2 border rounded-md text-sm"
                              placeholder="Depoimento..."
                              value={item.text}
                              onChange={(e) => {
                                const newItems = [...section.content.items];
                                newItems[i].text = e.target.value;
                                handleUpdateSection(index, { ...section.content, items: newItems });
                              }}
                            />
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => {
                            const newItems = section.content.items.filter((_: any, idx: number) => idx !== i);
                            handleUpdateSection(index, { ...section.content, items: newItems });
                          }} className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => {
                        const newItems = [...section.content.items, { name: "", text: "", role: "" }];
                        handleUpdateSection(index, { ...section.content, items: newItems });
                      }}>
                        <Plus className="w-3 h-3 mr-1" /> Add Depoimento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
