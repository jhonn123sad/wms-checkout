import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin-v2/checkouts/new")({
  component: AdminV2NewCheckout,
});

const TEMPLATES = [
  { id: "template_basico", name: "Básico (Padrão)", design: "default_v1", sections: [] },
  { id: "template_livre_midias", name: "Livre Mídias (Design V1)", design: "custom_media_v1", sections: [
    { type: "hero", content: { title: "Oferta Especial", subtitle: "Garanta seu acesso exclusivo", media: {} }, order: 1 },
    { type: "media", content: { media: {}, caption: "Veja o que preparamos para você" }, order: 2 },
    { type: "benefits", content: { title: "Vantagens", items: ["Acesso imediato", "Suporte VIP", "Bônus exclusivos"] }, order: 3 },
    { type: "checkout_form", content: { title: "Finalize seu pedido", subtitle: "Dados de pagamento seguros" }, order: 4 }
  ]},
  { id: "template_vendas_video", name: "Página de Vendas (Vídeo)", design: "custom_media_v1", sections: [
    { type: "hero", content: { title: "Assista ao vídeo abaixo", subtitle: "", media: { type: "youtube" } }, order: 1 },
    { type: "text", content: { title: "Sobre o produto", body: "Este treinamento foi criado para ajudar você..." }, order: 2 },
    { type: "gallery", content: { items: [{ media: {}, caption: "Depoimento 1" }, { media: {}, caption: "Depoimento 2" }] }, order: 3 },
    { type: "checkout_form", content: { title: "Inscreva-se", subtitle: "" }, order: 4 }
  ]}
];

function AdminV2NewCheckout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState("template_basico");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: 0,
    cta_text: "Liberar acesso agora",
    success_redirect_url: "",
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.slug) { toast.error("Preencha título e slug"); return; }
    setLoading(true);
    try {
      const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
      
      const { data: checkout, error: cError } = await supabase.from("checkouts").insert([{
        ...formData,
        active: true,
        status: "published",
        design_key: template.design,
        pix_expiration_minutes: 30,
        media_type: "image",
        media_url: ""
      }]).select().single();

      if (cError) throw cError;

      const fields = [
        { field_name: "customer_name", field_label: "Nome Completo", field_type: "text", active: true, required: true, sort_order: 1, checkout_id: checkout.id },
        { field_name: "customer_email", field_label: "E-mail", field_type: "email", active: true, required: true, sort_order: 2, checkout_id: checkout.id }
      ];
      if (templateId === "template_vendas_video") {
        fields.push({ field_name: "customer_phone", field_label: "WhatsApp", field_type: "phone", active: true, required: true, sort_order: 3, checkout_id: checkout.id });
      }
      
      await supabase.from("checkout_fields").insert(fields);

      if (template.sections.length > 0) {
        await supabase.from("checkout_sections").insert(template.sections.map(s => ({
          checkout_id: checkout.id,
          section_type: s.type,
          content: s.content,
          sort_order: s.order,
          active: true
        })));
      }

      toast.success("Checkout criado!");
      navigate({ to: "/admin-v2/checkouts/$id", params: { id: checkout.id } });
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin-v2/checkouts" })}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-3xl font-bold">Novo Checkout</h1>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Escolha um Template</Label>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplateId(t.id)} className={`p-4 border rounded-lg text-left transition-colors flex items-center justify-between ${templateId === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"}`}>
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-[10px] text-muted-foreground">{t.design}</p></div>
                  {templateId === t.id && <Sparkles className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Título do Checkout</Label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Curso de PHP" />
          </div>

          <div className="space-y-2">
            <Label>Slug (URL personalizada)</Label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">/c/</span>
              <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")})} placeholder="meu-produto-top" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input value={formData.cta_text} onChange={e => setFormData({...formData, cta_text: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Link de Sucesso (Redirecionamento)</Label>
            <Input type="url" value={formData.success_redirect_url} onChange={e => setFormData({...formData, success_redirect_url: e.target.value})} placeholder="https://..." />
          </div>
        </div>

        <Button className="w-full h-12 text-lg font-bold" onClick={handleCreate} disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Checkout"}
        </Button>
      </Card>
    </div>
  );
}
