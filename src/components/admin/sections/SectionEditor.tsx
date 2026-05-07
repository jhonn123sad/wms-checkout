import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { MediaField, MediaValue } from "@/components/admin/MediaField";

export type SectionType = "hero" | "text" | "media" | "gallery" | "benefits" | "checkout_form";

export interface CheckoutSection {
  id?: string;
  checkout_id: string;
  section_type: SectionType;
  sort_order: number;
  active: boolean;
  content: any;
}

interface SectionEditorProps {
  section: CheckoutSection;
  index: number;
  totalSections: number;
  onUpdate: (updated: CheckoutSection) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SectionEditor({ 
  section, 
  index, 
  totalSections, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown 
}: SectionEditorProps) {
  const updateContent = (key: string, value: any) => {
    onUpdate({
      ...section,
      content: {
        ...section.content,
        [key]: value
      }
    });
  };

  const renderContentFields = () => {
    switch (section.section_type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título do Hero</Label>
              <Input 
                value={section.content?.title || ""} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo do Hero</Label>
              <Input 
                value={section.content?.subtitle || ""} 
                onChange={(e) => updateContent("subtitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Mídia do Hero</Label>
              <MediaField 
                value={section.content?.media} 
                onChange={(val) => updateContent("media", val)}
              />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={section.content?.title || ""} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Texto / Corpo</Label>
              <Textarea 
                value={section.content?.body || ""} 
                onChange={(e) => updateContent("body", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mídia</Label>
              <MediaField 
                value={section.content?.media} 
                onChange={(val) => updateContent("media", val)}
              />
            </div>
            <div className="space-y-2">
              <Label>Legenda</Label>
              <Input 
                value={section.content?.caption || ""} 
                onChange={(e) => updateContent("caption", e.target.value)}
              />
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-4">
            <Label>Itens da Galeria</Label>
            <div className="grid grid-cols-1 gap-4">
              {(section.content?.items || []).map((item: any, itemIdx: number) => (
                <div key={itemIdx} className="p-3 border rounded relative bg-background/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 text-destructive"
                    onClick={() => {
                      const newItems = [...(section.content.items || [])];
                      newItems.splice(itemIdx, 1);
                      updateContent("items", newItems);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="space-y-2">
                    <MediaField 
                      value={item.media} 
                      onChange={(val) => {
                        const newItems = [...(section.content.items || [])];
                        newItems[itemIdx] = { ...newItems[itemIdx], media: val };
                        updateContent("items", newItems);
                      }}
                    />
                    <Input 
                      placeholder="Legenda"
                      value={item.caption || ""}
                      onChange={(e) => {
                        const newItems = [...(section.content.items || [])];
                        newItems[itemIdx] = { ...newItems[itemIdx], caption: e.target.value };
                        updateContent("items", newItems);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newItems = [...(section.content?.items || []), { media: null, caption: "" }];
                  updateContent("items", newItems);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Item
              </Button>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título da Seção</Label>
              <Input 
                value={section.content?.title || ""} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Benefícios / Itens</Label>
              <div className="space-y-2">
                {(section.content?.items || []).map((benefit: string, bIdx: number) => (
                  <div key={bIdx} className="flex gap-2">
                    <Input 
                      value={benefit} 
                      onChange={(e) => {
                        const newItems = [...(section.content.items || [])];
                        newItems[bIdx] = e.target.value;
                        updateContent("items", newItems);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const newItems = [...(section.content.items || [])];
                        newItems.splice(bIdx, 1);
                        updateContent("items", newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const newItems = [...(section.content?.items || []), ""];
                    updateContent("items", newItems);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Benefício
                </Button>
              </div>
            </div>
          </div>
        );

      case "checkout_form":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título do Formulário</Label>
              <Input 
                value={section.content?.title || ""} 
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Ex: Complete sua inscrição"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo do Formulário</Label>
              <Input 
                value={section.content?.subtitle || ""} 
                onChange={(e) => updateContent("subtitle", e.target.value)}
                placeholder="Ex: Preencha os dados abaixo"
              />
            </div>
          </div>
        );

      default:
        return <div>Tipo de seção desconhecido</div>;
    }
  };

  return (
    <Card className="p-4 border-2">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
            {section.section_type}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={index === 0}
              onClick={onMoveUp}
              className="h-8 w-8"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={index === totalSections - 1}
              onClick={onMoveDown}
              className="h-8 w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Ativo</span>
            <Switch 
              checked={section.active} 
              onCheckedChange={(val) => onUpdate({ ...section, active: val })}
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRemove}
            className="text-destructive h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {renderContentFields()}
      </div>
    </Card>
  );
}
