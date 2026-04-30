import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/projects/$id")({
  component: ProjectEdit,
});

function ProjectEdit() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<any>({
    name: "",
    slug: "",
    active: true,
    headline: "Finalize seu acesso",
    subheadline: "Pague com Pix e receba a liberação imediata.",
    thank_you_url: "",
    pix_expiration_minutes: 15,
    collect_name: true,
    collect_cpf: true,
    collect_phone: false,
    collect_email: false,
    theme_json: {
      primaryColor: "#000000",
      buttonColor: "#000000",
      backgroundColor: "#F5F5F7",
      logoUrl: ""
    },
    legal_text: ""
  });
  const [offer, setOffer] = useState<any>({
    name: "Oferta Principal",
    description: "Acesso liberado após confirmação",
    price_cents: 50,
    active: true
  });

  useEffect(() => {
    if (id !== "new") {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const { data: proj } = await supabase
      .from("checkout_projects")
      .select("*")
      .eq("id", id)
      .single();
    
    if (proj) {
      setProject(proj);
      const { data: off } = await supabase
        .from("checkout_offers")
        .select("*")
        .eq("project_id", id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();
      if (off) setOffer(off);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let projectId = id;
      if (id === "new") {
        const { data, error } = await supabase
          .from("checkout_projects")
          .insert([project])
          .select()
          .single();
        if (error) throw error;
        projectId = data.id;
      } else {
        const { error } = await supabase
          .from("checkout_projects")
          .update(project)
          .eq("id", id);
        if (error) throw error;
      }

      // Save/Update offer
      const offerData = { ...offer, project_id: projectId };
      if (offer.id) {
        await supabase.from("checkout_offers").update(offerData).eq("id", offer.id);
      } else {
        await supabase.from("checkout_offers").insert([offerData]);
      }

      toast.success("Projeto salvo com sucesso!");
      navigate({ to: "/admin/projects" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{id === "new" ? "Novo Projeto" : "Editar Projeto"}</h1>
          <p className="text-gray-500">Configure os detalhes do seu checkout</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/admin/projects" })}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Projeto"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="fields">Campos</TabsTrigger>
          <TabsTrigger value="theme">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Projeto</Label>
                  <Input 
                    value={project.name} 
                    onChange={e => setProject({...project, name: e.target.value})} 
                    placeholder="Ex: Meu Produto Digital"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug da URL</Label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 rounded-l-md px-3 h-10 flex items-center text-gray-500 text-sm">/c/</span>
                    <Input 
                      className="rounded-l-none"
                      value={project.slug} 
                      onChange={e => setProject({...project, slug: e.target.value})} 
                      placeholder="url-amigavel"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (Cents)</Label>
                  <Input 
                    type="number"
                    value={offer.price_cents} 
                    onChange={e => setOffer({...offer, price_cents: parseInt(e.target.value)})} 
                  />
                  <p className="text-xs text-gray-400">Ex: 5000 = R$ 50,00</p>
                </div>
                <div className="space-y-2">
                  <Label>Expiração Pix (Minutos)</Label>
                  <Input 
                    type="number"
                    value={project.pix_expiration_minutes} 
                    onChange={e => setProject({...project, pix_expiration_minutes: parseInt(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Status do Projeto</Label>
                  <p className="text-sm text-gray-500">Ative ou desative este checkout publicamente</p>
                </div>
                <Switch 
                  checked={project.active} 
                  onCheckedChange={checked => setProject({...project, active: checked})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Textos da Página</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Headline (Título)</Label>
                <Input 
                  value={project.headline} 
                  onChange={e => setProject({...project, headline: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Subheadline (Subtítulo)</Label>
                <Textarea 
                  value={project.subheadline} 
                  onChange={e => setProject({...project, subheadline: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>URL de Obrigado (Redirecionamento)</Label>
                <Input 
                  value={project.thank_you_url} 
                  onChange={e => setProject({...project, thank_you_url: e.target.value})} 
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Texto Legal / Disclaimer</Label>
                <Textarea 
                  value={project.legal_text} 
                  onChange={e => setProject({...project, legal_text: e.target.value})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campos do Formulário</CardTitle>
              <CardDescription>Selecione quais dados coletar do cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Coletar Nome", key: "collect_name" },
                { label: "Coletar CPF", key: "collect_cpf" },
                { label: "Coletar Telefone", key: "collect_phone" },
                { label: "Coletar Email", key: "collect_email" },
              ].map(field => (
                <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>{field.label}</Label>
                  <Switch 
                    checked={project[field.key as keyof typeof project] as boolean} 
                    onCheckedChange={checked => setProject({...project, [field.key]: checked})} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor Principal</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 p-1"
                      value={project.theme_json?.primaryColor || "#000000"} 
                      onChange={e => setProject({...project, theme_json: {...project.theme_json, primaryColor: e.target.value}})} 
                    />
                    <Input 
                      value={project.theme_json?.primaryColor || "#000000"} 
                      onChange={e => setProject({...project, theme_json: {...project.theme_json, primaryColor: e.target.value}})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor do Botão</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-12 p-1"
                      value={project.theme_json?.buttonColor || "#000000"} 
                      onChange={e => setProject({...project, theme_json: {...project.theme_json, buttonColor: e.target.value}})} 
                    />
                    <Input 
                      value={project.theme_json?.buttonColor || "#000000"} 
                      onChange={e => setProject({...project, theme_json: {...project.theme_json, buttonColor: e.target.value}})} 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL do Logo</Label>
                <Input 
                  value={project.theme_json?.logoUrl || ""} 
                  onChange={e => setProject({...project, theme_json: {...project.theme_json, logoUrl: e.target.value}})} 
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
