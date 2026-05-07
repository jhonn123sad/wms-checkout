import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Plus, Trash2, ExternalLink, Copy, AlertCircle, GripVertical } from "lucide-react";
import { MediaField, MediaValue } from "@/components/admin/MediaField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin-v2/checkouts/$id")({
  component: AdminV2EditCheckout,
});

function AdminV2EditCheckout() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkout, setCheckout] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [removedFieldIds, setRemovedFieldIds] = useState<string[]>([]);
  const [removedSectionIds, setRemovedSectionIds] = useState<string[]>([]);

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    const { data: cData, error: cErr } = await supabase.from("checkouts").select("*").eq("id", id).single();
    if (cErr) { toast.error("Erro ao carregar"); navigate({ to: "/admin-v2/checkouts" }); return; }
    setCheckout(cData);

    const { data: fData } = await supabase.from("checkout_fields").select("*").eq("checkout_id", id).order("sort_order");
    setFields(fData || []);

    const { data: sData } = await supabase.from("checkout_sections").select("*").eq("checkout_id", id).order("sort_order");
    setSections(sData || []);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update Checkout
      const { error: cErr } = await supabase.from("checkouts").update({
        ...checkout,
        updated_at: new Date().toISOString()
      }).eq("id", id);
      if (cErr) throw cErr;

      // 2. Fields CRUD
      if (removedFieldIds.length) await supabase.from("checkout_fields").delete().in("id", removedFieldIds);
      for (const f of fields) {
        if (f.id) await supabase.from("checkout_fields").update({ ...f, checkout_id: id }).eq("id", f.id);
        else await supabase.from("checkout_fields").insert([{ ...f, checkout_id: id }]);
      }

      // 3. Sections CRUD
      if (removedSectionIds.length) await supabase.from("checkout_sections").delete().in("id", removedSectionIds);
      for (const s of sections) {
        if (s.id) await supabase.from("checkout_sections").update({ ...s, checkout_id: id }).eq("id", s.id);
        else await supabase.from("checkout_sections").insert([{ ...s, checkout_id: id }]);
      }

      toast.success("Tudo salvo com sucesso!");
      setRemovedFieldIds([]);
      setRemovedSectionIds([]);
      fetchAll();
    } catch (e: any) {
      toast.error("Erro ao salvar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin-v2/checkouts" })}><ArrowLeft className="w-4 h-4" /></Button>
          <h1 className="text-2xl font-bold truncate max-w-[400px]">{checkout.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="basico" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="basico">1. Básico</TabsTrigger>
          <TabsTrigger value="midia">2. Mídia</TabsTrigger>
          <TabsTrigger value="campos">3. Campos</TabsTrigger>
          <TabsTrigger value="design" disabled={checkout.design_key !== "custom_media_v1"}>4. Design Livre</TabsTrigger>
          <TabsTrigger value="publicacao">5. Publicação</TabsTrigger>
        </TabsList>

        <TabsContent value="basico" className="mt-6 space-y-6">
          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2"><Label>Título</Label><Input value={checkout.title} onChange={e => setCheckout({...checkout, title: e.target.value})} /></div>
              <div className="space-y-2"><Label>Subtítulo</Label><Input value={checkout.subtitle || ""} onChange={e => setCheckout({...checkout, subtitle: e.target.value})} /></div>
              <div className="space-y-2">
                <Label>Design Principal</Label>
                <Select value={checkout.design_key} onValueChange={v => setCheckout({...checkout, design_key: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["default_v1", "apple_v1", "receitas_v1", "comunidade_v1", "visagismo_v1", "reservado_v1", "custom_media_v1"].map(k => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Slug URL</Label><Input value={checkout.slug} onChange={e => setCheckout({...checkout, slug: e.target.value})} /></div>
                <div className="space-y-2"><Label>Preço (R$)</Label><Input type="number" value={checkout.price} onChange={e => setCheckout({...checkout, price: parseFloat(e.target.value) || 0})} /></div>
              </div>
              <div className="space-y-2"><Label>CTA (Texto do Botão)</Label><Input value={checkout.cta_text} onChange={e => setCheckout({...checkout, cta_text: e.target.value})} /></div>
              <div className="space-y-2"><Label>Pix expira em (minutos)</Label><Input type="number" value={checkout.pix_expiration_minutes || 30} onChange={e => setCheckout({...checkout, pix_expiration_minutes: parseInt(e.target.value) || 30})} /></div>
            </div>
            <div className="col-span-full space-y-2">
              <Label>Redirect de Sucesso (Obrigatório para automação)</Label>
              <Input value={checkout.success_redirect_url || ""} onChange={e => setCheckout({...checkout, success_redirect_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2"><Switch checked={checkout.active} onCheckedChange={v => setCheckout({...checkout, active: v})} /><Label>Ativo</Label></div>
              <div className="flex items-center gap-2">
                <Label className="mr-2">Status</Label>
                <Select value={checkout.status || "published"} onValueChange={v => setCheckout({...checkout, status: v})}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="published">Publicado</SelectItem><SelectItem value="draft">Rascunho</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="midia" className="mt-6">
          <Card className="p-6">
            <Label className="text-lg font-bold mb-4 block">Mídia Principal do Checkout</Label>
            <MediaField 
              value={checkout.media_url ? { url: checkout.media_url, type: checkout.media_type, source: (checkout.media_json as any)?.source || "external_url" } : undefined}
              onChange={(v) => setCheckout({ ...checkout, media_url: v?.url || "", media_type: v?.type || "image", media_json: v || null })}
              pathPrefix={`checkouts/${checkout.slug}`}
            />
          </Card>
        </TabsContent>

        <TabsContent value="campos" className="mt-6 space-y-4">
          <div className="flex justify-between items-center"><h3 className="text-lg font-bold">Campos do Formulário</h3><Button size="sm" onClick={() => setFields([...fields, { field_name: "", field_label: "", field_type: "text", active: true, required: true, sort_order: fields.length + 1 }])}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button></div>
          <div className="space-y-2">
            {fields.map((f, i) => (
              <Card key={f.id || i} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="space-y-1"><Label className="text-[10px]">Label</Label><Input value={f.field_label} onChange={e => { const n = [...fields]; n[i].field_label = e.target.value; setFields(n); }} /></div>
                <div className="space-y-1"><Label className="text-[10px]">Name (DB)</Label><Input value={f.field_name} onChange={e => { const n = [...fields]; n[i].field_name = e.target.value; setFields(n); }} disabled={["customer_name", "customer_email"].includes(f.field_name)} /></div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1"><Switch checked={f.active} onCheckedChange={v => { const n = [...fields]; n[i].active = v; setFields(n); }} /><span className="text-xs">Ativo</span></div>
                  <div className="flex items-center gap-1"><Switch checked={f.required} onCheckedChange={v => { const n = [...fields]; n[i].required = v; setFields(n); }} /><span className="text-xs">Obrigatório</span></div>
                </div>
                <div className="flex justify-end gap-1">
                  <Select value={f.field_type} onValueChange={v => { const n = [...fields]; n[i].field_type = v; setFields(n); }}>
                    <SelectTrigger className="h-8 w-24 text-[10px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="text">Texto</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="phone">Fone</SelectItem><SelectItem value="cpf">CPF</SelectItem><SelectItem value="number">Número</SelectItem></SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => { if(f.id) setRemovedFieldIds([...removedFieldIds, f.id]); setFields(fields.filter((_, idx) => idx !== i)); }} disabled={["customer_name", "customer_email"].includes(f.field_name)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="mt-6 space-y-4">
          <div className="flex justify-between items-center"><h3 className="text-lg font-bold">Seções do Design Livre</h3><Button size="sm" onClick={() => setSections([...sections, { section_type: "text", content: { title: "", body: "" }, active: true, sort_order: sections.length + 1 }])}><Plus className="w-4 h-4 mr-1" /> Adicionar Seção</Button></div>
          <div className="space-y-4">
            {sections.map((s, i) => (
              <Card key={s.id || i} className="p-6 space-y-4 relative">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2"><GripVertical className="w-4 h-4 text-muted-foreground" /><Select value={s.section_type} onValueChange={v => { const n = [...sections]; n[i].section_type = v; setSections(n); }}><SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger><SelectContent>{["hero", "text", "media", "gallery", "benefits", "checkout_form"].map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                  <div className="flex items-center gap-2"><Switch checked={s.active} onCheckedChange={v => { const n = [...sections]; n[i].active = v; setSections(n); }} /><Button variant="ghost" size="icon" onClick={() => { if(s.id) setRemovedSectionIds([...removedSectionIds, s.id]); setSections(sections.filter((_, idx) => idx !== i)); }} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></div>
                </div>
                
                {s.section_type === "text" && (
                  <div className="space-y-2"><Label>Título</Label><Input value={s.content.title} onChange={e => { const n = [...sections]; n[i].content.title = e.target.value; setSections(n); }} /><Label>Corpo</Label><textarea className="w-full min-h-[100px] rounded-md border p-2 text-sm" value={s.content.body} onChange={e => { const n = [...sections]; n[i].content.body = e.target.value; setSections(n); }} /></div>
                )}
                {s.section_type === "hero" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Título Hero</Label><Input value={s.content.title} onChange={e => { const n = [...sections]; n[i].content.title = e.target.value; setSections(n); }} /><Label>Subtítulo</Label><Input value={s.content.subtitle} onChange={e => { const n = [...sections]; n[i].content.subtitle = e.target.value; setSections(n); }} /></div>
                    <div><Label>Mídia Hero</Label><MediaField value={s.content.media} onChange={v => { const n = [...sections]; n[i].content.media = v || {}; setSections(n); }} pathPrefix={`checkouts/${checkout.slug}/hero`} /></div>
                  </div>
                )}
                {s.section_type === "media" && (
                  <div className="grid grid-cols-2 gap-4">
                    <MediaField value={s.content.media} onChange={v => { const n = [...sections]; n[i].content.media = v || {}; setSections(n); }} pathPrefix={`checkouts/${checkout.slug}/media`} />
                    <div className="space-y-2"><Label>Legenda</Label><Input value={s.content.caption} onChange={e => { const n = [...sections]; n[i].content.caption = e.target.value; setSections(n); }} /></div>
                  </div>
                )}
                {s.section_type === "benefits" && (
                  <div className="space-y-2">
                    <Label>Título da Seção</Label><Input value={s.content.title} onChange={e => { const n = [...sections]; n[i].content.title = e.target.value; setSections(n); }} />
                    <Label>Itens (um por linha)</Label><textarea className="w-full h-24 border rounded p-2 text-sm" value={s.content.items?.join("\n")} onChange={e => { const n = [...sections]; n[i].content.items = e.target.value.split("\n"); setSections(n); }} />
                  </div>
                )}
                {s.section_type === "checkout_form" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Título do Box</Label><Input value={s.content.title} onChange={e => { const n = [...sections]; n[i].content.title = e.target.value; setSections(n); }} /></div>
                    <div className="space-y-2"><Label>Subtítulo do Box</Label><Input value={s.content.subtitle} onChange={e => { const n = [...sections]; n[i].content.subtitle = e.target.value; setSections(n); }} /></div>
                  </div>
                )}
                {s.section_type === "gallery" && (
                   <div>
                     <Label>Galeria de Imagens</Label>
                     <div className="grid grid-cols-2 gap-2 mt-2">
                       {(s.content.items || []).map((item: any, gIdx: number) => (
                         <div key={gIdx} className="border p-2 rounded relative">
                           <MediaField value={item.media} onChange={v => { const n = [...sections]; n[i].content.items[gIdx].media = v || {}; setSections(n); }} />
                           <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6" onClick={() => { const n = [...sections]; n[i].content.items.splice(gIdx, 1); setSections(n); }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                         </div>
                       ))}
                       <Button variant="outline" className="h-full min-h-[100px]" onClick={() => { const n = [...sections]; if(!n[i].content.items) n[i].content.items = []; n[i].content.items.push({ media: {}, caption: "" }); setSections(n); }}><Plus className="w-4 h-4 mr-2" /> Item</Button>
                     </div>
                   </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="publicacao" className="mt-6 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Publicação e Testes</h3>
            <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase text-muted-foreground">URL do Checkout</p><p className="font-mono text-sm">/c/{checkout.slug}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/c/${checkout.slug}`); toast.success("Copiado!"); }}><Copy className="w-4 h-4 mr-2" /> Copiar</Button>
                <a href={`/c/${checkout.slug}`} target="_blank" rel="noreferrer"><Button size="sm"><ExternalLink className="w-4 h-4 mr-2" /> Abrir</Button></a>
              </div>
            </div>
            {!checkout.success_redirect_url && <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex gap-3 text-yellow-600"><AlertCircle className="w-5 h-5 flex-shrink-0" /><p className="text-xs"><strong>Atenção:</strong> Configure uma URL de sucesso na aba Básico para que seus clientes sejam redirecionados após o pagamento.</p></div>}
            {(!fields.find(f => f.field_name === "customer_name" && f.active) || !fields.find(f => f.field_name === "customer_email" && f.active)) && <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg flex gap-3 text-destructive"><AlertCircle className="w-5 h-5 flex-shrink-0" /><p className="text-xs"><strong>Erro Crítico:</strong> Os campos 'customer_name' e 'customer_email' devem estar ativos para o checkout funcionar.</p></div>}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
