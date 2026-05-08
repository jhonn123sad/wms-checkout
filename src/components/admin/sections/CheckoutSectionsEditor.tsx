import { Button } from "@/components/ui/button";
import { Plus, Layout } from "lucide-react";
import { SectionEditor, CheckoutSection, SectionType } from "./SectionEditor";
import { toast } from "sonner";

interface CheckoutSectionsEditorProps {
  sections: CheckoutSection[];
  setSections: (sections: CheckoutSection[] | ((prev: CheckoutSection[]) => CheckoutSection[])) => void;
  setRemovedSectionIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  checkoutId: string;
  disabled?: boolean;
}

export function CheckoutSectionsEditor({ 
  sections, 
  setSections, 
  setRemovedSectionIds,
  checkoutId,
  disabled = false
}: CheckoutSectionsEditorProps) {
  
  const addSection = (type: SectionType) => {
    // Validação: apenas um checkout_form por checkout
    if (type === "checkout_form") {
      const alreadyHas = sections.some(s => s.section_type === "checkout_form" && s.active);
      if (alreadyHas) {
        toast.warning("Atenção: Já existe um formulário de checkout ativo. Você pode adicionar outro, mas apenas um deve estar ativo por vez.");
      }
    }

    const defaultContent: any = {
      hero: { title: "", subtitle: "", media: null },
      text: { title: "", body: "" },
      media: { media: null, caption: "" },
      gallery: { items: [] },
      benefits: { title: "", items: [] },
      checkout_form: { title: "", subtitle: "" },
      media_slot: { media: null },
      gallery_slot: { items: [] }
    };

    const newSection: CheckoutSection = {
      checkout_id: checkoutId,
      section_type: type,
      sort_order: sections.length + 1,
      active: true,
      content: defaultContent[type] || {}
    };

    setSections(prev => [...prev, newSection]);
    toast.success(`Seção ${type} adicionada!`);
  };

  const updateSection = (index: number, updated: CheckoutSection) => {
    setSections(prev => prev.map((s, i) => i === index ? updated : s));
  };

  const removeSection = (index: number) => {
    const section = sections[index];
    if (section.id) {
      setRemovedSectionIds(prev => [...prev, section.id!]);
    }
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSections(prev => {
      const next = [...prev];
      [next[index], next[index - 1]] = [next[index - 1], next[index]];
      return next.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    setSections(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Seções do Checkout</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => addSection("hero")}>
            <Plus className="w-4 h-4 mr-1" /> Hero
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("text")}>
            <Plus className="w-4 h-4 mr-1" /> Texto
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("media")}>
            <Plus className="w-4 h-4 mr-1" /> Mídia
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("gallery")}>
            <Plus className="w-4 h-4 mr-1" /> Galeria
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("benefits")}>
            <Plus className="w-4 h-4 mr-1" /> Benefícios
          </Button>
          <Button size="sm" variant="outline" onClick={() => addSection("checkout_form")}>
            <Plus className="w-4 h-4 mr-1" /> Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, index) => (
          <SectionEditor 
            key={section.id || `new-${index}`}
            section={section}
            index={index}
            totalSections={sections.length}
            onUpdate={(updated) => updateSection(index, updated)}
            onRemove={() => removeSection(index)}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
          />
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
            <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-20" />
            <p className="text-muted-foreground">Nenhuma seção adicionada. Use os botões acima para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
