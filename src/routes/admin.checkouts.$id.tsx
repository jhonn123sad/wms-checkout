import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Copy, Layout, Settings, Image, Grid } from "lucide-react";
import { MediaField, MediaValue } from "@/components/admin/MediaField";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckoutSectionsEditor } from "@/components/admin/sections/CheckoutSectionsEditor";
import { DesignMediaSlotsEditor } from "@/components/admin/sections/DesignMediaSlotsEditor";
import { CheckoutSection } from "@/components/admin/sections/SectionEditor";


export const Route = createFileRoute("/admin/checkouts/$id")({
  component: CheckoutEditPage,
});

const cleanFieldType = (type?: string) => {
  const raw = (type || "text").trim();

  if (raw === "hidden:email") return "email";
  if (raw === "hidden:tel") return "phone";
  if (raw === "hidden:phone") return "phone";
  if (raw === "hidden:cpf") return "cpf";
  if (raw === "hidden:text") return "text";
  if (raw.startsWith("hidden:")) return raw.replace(/^hidden:/, "") || "text";

  if (raw === "tel") return "phone";

  return raw;
};

type CheckoutFieldForm = {
  id?: string;
  checkout_id?: string;
  field_name: string;
  field_label: string;
  field_type: string;
  active: boolean;
  required: boolean;
  sort_order: number;
};

function CheckoutEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkout, setCheckout] = useState<any>({
    title: "",
    subtitle: "",
    slug: "",
    price: 0,
    cta_text: "Liberar acesso agora",
    media_url: "",
    media_type: "image",
    active: true,
    success_redirect_url: "",
  });
  
  const [fields, setFields] = useState<CheckoutFieldForm[]>([]);
  const [removedFieldIds, setRemovedFieldIds] = useState<string[]>([]);
  const [originalFields, setOriginalFields] = useState<CheckoutFieldForm[]>([]);

  const [sections, setSections] = useState<CheckoutSection[]>([]);
  const [removedSectionIds, setRemovedSectionIds] = useState<string[]>([]);
  const [originalSections, setOriginalSections] = useState<CheckoutSection[]>([]);

  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchCheckout();
    } else {
      setFields([
        {
          field_name: "customer_name",
          field_label: "Nome Completo",
          field_type: "text",
          active: true,
          required: true,
          sort_order: 1
        },
        {
          field_name: "customer_email",
          field_label: "E-mail",
          field_type: "email",
          active: true,
          required: true,
          sort_order: 2
        }
      ]);
    }
  }, [id]);

  const fetchCheckout = async () => {
    setLoading(true);
    try {
      const { data: checkoutData, error: checkoutError } = await supabase
        .from("checkouts")
        .select("*")
        .eq("id", id)
        .single();

      if (checkoutError) {
        toast.error("Erro ao carregar checkout: " + checkoutError.message);
        navigate({ to: "/admin/checkouts" });
        return;
      }

      setCheckout({
        ...checkoutData,
        success_redirect_url: checkoutData.success_redirect_url || ""
      });

      const { data: fieldsData, error: fieldsError } = await supabase
        .from("checkout_fields")
        .select("*")
        .eq("checkout_id", id)
        .order("sort_order", { ascending: true });

      if (fieldsError) {
        console.warn("Erro ao buscar campos:", fieldsError);
        setFields([]);
      } else {
        const normalized = (fieldsData || []).map((f, index) => ({
          id: f.id,
          checkout_id: f.checkout_id,
          field_name: f.field_name || "",
          field_label: f.field_label || "",
          field_type: cleanFieldType(f.field_type),
          active: f.active === true,
          required: f.required === true,
          sort_order: f.sort_order ?? index + 1,
        }));
        setFields(normalized);
        setOriginalFields(JSON.parse(JSON.stringify(normalized)));
      }

      // Buscar seções
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("checkout_sections")
        .select("*")
        .eq("checkout_id", id)
        .order("sort_order", { ascending: true });

      if (sectionsError) {
        console.warn("Erro ao buscar seções:", sectionsError);
        setSections([]);
      } else {
        const normalizedSections = (sectionsData || []).map(s => ({
          ...s,
          active: s.active === true,
          section_type: s.section_type as any
        }));
        setSections(normalizedSections);
        setOriginalSections(JSON.parse(JSON.stringify(normalizedSections)));
      }
    } catch (err: any) {
      toast.error("Erro inesperado ao carregar checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validar campos
    for (const f of fields) {
      if (!f.field_name.trim() || !f.field_label.trim()) {
        toast.error("Todos os campos devem ter Nome Técnico e Label");
        return;
      }
    }

    const names = fields.map(f => f.field_name.trim());
    const hasDuplicate = names.some((name, index) => names.indexOf(name) !== index);
    if (hasDuplicate) {
      toast.error("Não é permitido nomes técnicos duplicados");
      return;
    }

    setSaving(true);
    try {
      let checkoutId = id;
      
      const checkoutPayload: any = {
        title: checkout.title,
        subtitle: checkout.subtitle,
        slug: checkout.slug,
        price: checkout.price,
        cta_text: checkout.cta_text,
        active: checkout.active,
        media_url: checkout.media_url,
        media_type: checkout.media_type,
        media_json: checkout.media_json,
        design_key: checkout.design_key,
        success_redirect_url: checkout.success_redirect_url?.trim() || null,
        updated_at: new Date().toISOString()
      };

      if (isNew) {
        const { data, error } = await supabase
          .from("checkouts")
          .insert([checkoutPayload])
          .select()
          .single();
        if (error) throw error;
        checkoutId = data.id;
      } else {
        const { error } = await supabase
          .from("checkouts")
          .update(checkoutPayload)
          .eq("id", id);
        if (error) throw error;
      }

      // Processar campos (CRUD SEGURO)
      // 1. Update/Insert campos
      for (const field of fields) {
        const fieldPayload = {
          checkout_id: checkoutId,
          field_name: field.field_name.trim(),
          field_label: field.field_label.trim(),
          field_type: cleanFieldType(field.field_type),
          active: field.active === true,
          required: field.required === true,
          sort_order: field.sort_order
        };

        if (field.id) {
          const { error: upError } = await supabase
            .from("checkout_fields")
            .update(fieldPayload)
            .eq("id", field.id);
          if (upError) throw upError;
        } else {
          const { error: insError } = await supabase
            .from("checkout_fields")
            .insert([fieldPayload]);
          if (insError) throw insError;
        }
      }

      // 2. Deletar somente os IDs explicitamente removidos
      if (removedFieldIds.length > 0) {
        const { error: delError } = await supabase
          .from("checkout_fields")
          .delete()
          .in("id", removedFieldIds);
        if (delError) throw delError;
      }

      // 3. Processar SEÇÕES (CRUD SEGURO)
      if (checkout.design_key === "custom_media_v1" || sections.length > 0) {
        // Validação: apenas um checkout_form ativo
        const activeForms = sections.filter(s => s.section_type === "checkout_form" && s.active);
        if (activeForms.length > 1) {
          throw new Error("Apenas um formulário de checkout pode estar ativo por vez.");
        }

        for (const section of sections) {
          const sectionPayload = {
            checkout_id: checkoutId,
            section_type: section.section_type,
            sort_order: section.sort_order,
            active: section.active === true,
            content: section.content
          };

          if (section.id) {
            const { error: upError } = await supabase
              .from("checkout_sections")
              .update(sectionPayload)
              .eq("id", section.id);
            if (upError) throw upError;
          } else {
            const { error: insError } = await supabase
              .from("checkout_sections")
              .insert([sectionPayload]);
            if (insError) throw insError;
          }
        }

        // Deletar removidas
        if (removedSectionIds.length > 0) {
          const { error: delError } = await supabase
            .from("checkout_sections")
            .delete()
            .in("id", removedSectionIds);
          if (delError) throw delError;
        }
      }

      toast.success("Checkout salvo com sucesso!");
      navigate({ to: "/admin/checkouts" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    setFields(prev => [...prev, { 
      field_name: "", 
      field_label: "", 
      field_type: "text", 
      active: true, 
      required: false, 
      sort_order: prev.length + 1 
    }]);
  };

  const removeField = (index: number) => {
    const fieldToRemove = fields[index];
    if (fieldToRemove.id) {
      setRemovedFieldIds(prev => [...prev, fieldToRemove.id!]);
    }
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof CheckoutFieldForm, value: any) => {
    setFields(prev =>
      prev.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    );
  };

  const copyDiagnostic = () => {
    const diagnostic = {
      checkout,
      fields,
      originalFields,
      removedFieldIds,
      sections: sections.map(s => ({
        id: s.id,
        section_type: s.section_type,
        active: s.active,
        sort_order: s.sort_order,
        content: s.content
      })),
      savePayload: {
        checkout,
        fieldsPayload: fields.map(f => ({
          id: f.id,
          field_name: f.field_name,
          field_type: f.field_type,
          active: f.active,
          required: f.required
        })),
        sectionsPayload: sections.map(s => ({
          id: s.id,
          section_type: s.section_type,
          active: s.active,
          sort_order: s.sort_order,
          content: s.content
        })),
        removedFieldIds,
        removedSectionIds
      },
      timestamp: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(diagnostic, null, 2));
    toast.success("Diagnóstico copiado!");
  };

  const mediaValue: MediaValue | undefined = checkout.media_url ? {
    url: checkout.media_url,
    type: checkout.media_type as any,
    source: (checkout.media_json as any)?.source || "external_url"
  } : undefined;

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/checkouts" })}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Novo Checkout" : "Editar Checkout"}</h1>
      </div>

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Dados do Checkout
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Image className="w-4 h-4" /> Design Livre
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-6">
          {checkout.design_key !== "custom_media_v1" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Design Livre disponível apenas para <span className="font-bold">custom_media_v1</span>. 
                    Altere o design abaixo para habilitar o editor de seções.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Informações Básicas</h2>
                
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input 
                    value={checkout.title || ""} 
                    onChange={(e) => setCheckout({ ...checkout, title: e.target.value })}
                    placeholder="Ex: Acesso Reservado"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input 
                    value={checkout.subtitle || ""} 
                    onChange={(e) => setCheckout({ ...checkout, subtitle: e.target.value })}
                    placeholder="Ex: Conteúdo exclusivo liberado após confirmação"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Slug da URL</Label>
                    <Input 
                      value={checkout.slug || ""} 
                      onChange={(e) => setCheckout({ ...checkout, slug: e.target.value })}
                      placeholder="acesso-reservado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={checkout.price || 0} 
                      onChange={(e) => setCheckout({ ...checkout, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Texto do Botão (CTA)</Label>
                  <Input 
                    value={checkout.cta_text || ""} 
                    onChange={(e) => setCheckout({ ...checkout, cta_text: e.target.value })}
                    placeholder="Liberar acesso agora"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Página de obrigado / URL de entrega</Label>
                  <Input 
                    type="url"
                    value={checkout.success_redirect_url || ""} 
                    onChange={(e) => setCheckout({ ...checkout, success_redirect_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

            <div className="space-y-2 pt-2 border-t">
              <Label>Design do Checkout</Label>
              <Select 
                value={checkout.design_key || "default"} 
                onValueChange={(val) => setCheckout({ ...checkout, design_key: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="custom_media_v1">Design Livre (Mídia + Seções)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label>Status Ativo</Label>
              <Switch 
                checked={checkout.active === true} 
                onCheckedChange={(checked) => setCheckout({ ...checkout, active: checked })}
              />
            </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Mídia do Checkout</h2>
                <MediaField 
                  value={mediaValue} 
                  onChange={(val) => setCheckout({ 
                    ...checkout, 
                    media_url: val?.url || "", 
                    media_type: val?.type || "image",
                    media_json: val ? { source: val.source } : null
                  })}
                  pathPrefix={`checkouts/${id}`}
                />
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold">Campos do Formulário</h2>
                  <Button size="sm" variant="outline" onClick={addField}>
                    <Plus className="w-4 h-4 mr-1" /> Novo Campo
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/30 space-y-3 relative">
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                          <Input 
                            placeholder="Ex: Nome Completo" 
                            value={field.field_label}
                            onChange={(e) => updateField(index, "field_label", e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nome Técnico</Label>
                          <Input 
                            placeholder="Ex: customer_name" 
                            value={field.field_name}
                            onChange={(e) => updateField(index, "field_name", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tipo</Label>
                        <Select 
                          value={field.field_type} 
                          onValueChange={(val) => updateField(index, "field_type", val)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="phone">Telefone</SelectItem>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="textarea">Área de Texto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4 pt-2 border-t">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={field.active === true}
                              onCheckedChange={(checked) => updateField(index, "active", checked === true)}
                            />
                            <span className="text-xs font-medium">Ativo</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={field.required === true}
                              onCheckedChange={(checked) => updateField(index, "required", checked === true)}
                            />
                            <span className="text-xs font-medium">Obrigatório</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeField(index)} 
                          className="text-destructive h-8 w-8 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-4">Nenhum campo adicionado.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-8 animate-in fade-in duration-300">
          {checkout.design_key !== "custom_media_v1" ? (
            <Card className="p-12 text-center space-y-4">
              <Layout className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
              <h3 className="text-lg font-medium">Design Livre Indisponível</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                O Design Livre está disponível apenas quando a chave de design é <span className="font-bold">custom_media_v1</span>.
              </p>
            </Card>
          ) : (
            <>
              <DesignMediaSlotsEditor
                checkoutId={id}
                designKey={checkout.design_key}
                sections={sections}
                setSections={setSections}
                setRemovedSectionIds={setRemovedSectionIds}
              />

              <Collapsible className="space-y-4 pt-8 border-t">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                      <Grid className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-bold text-muted-foreground group-hover:text-primary transition-colors">Avançado / Blocos de Conteúdo</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <Card className="p-6">
                    <CheckoutSectionsEditor 
                      sections={sections}
                      setSections={setSections}
                      setRemovedSectionIds={setRemovedSectionIds}
                      checkoutId={id}
                    />
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Button 
        className="w-full py-6 text-lg font-bold" 
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Salvando..." : "Salvar Checkout"}
      </Button>


      <div className="pt-8 border-t">
        <Collapsible open={debugOpen} onOpenChange={setDebugOpen} className="space-y-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                {debugOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="font-semibold text-muted-foreground">Diagnóstico</span>
              </Button>
            </CollapsibleTrigger>
            {debugOpen && (
              <Button variant="outline" size="sm" onClick={copyDiagnostic} className="gap-2">
                <Copy className="w-4 h-4" /> Copiar diagnóstico
              </Button>
            )}
          </div>
          <CollapsibleContent className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-[10px] leading-tight">
              {JSON.stringify({
                checkout,
                fields,
                originalFields,
                removedFieldIds,
                sections,
                originalSections,
                removedSectionIds
              }, null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}