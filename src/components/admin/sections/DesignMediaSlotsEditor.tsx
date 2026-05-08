import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Layout, Grid, Info } from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getDesignSlots, getSlot, DESIGN_MEDIA_SLOTS } from "@/lib/designMediaSlots";
import { CheckoutSection } from "./SectionEditor";

interface DesignMediaSlotsEditorProps {
  checkoutId: string;
  designKey: string;
  sections: CheckoutSection[];
  setSections: (sections: CheckoutSection[] | ((prev: CheckoutSection[]) => CheckoutSection[])) => void;
  setRemovedSectionIds: (ids: string[] | ((prev: string[]) => string[])) => void;
}

export function DesignMediaSlotsEditor({
  checkoutId,
  designKey,
  sections,
  setSections,
  setRemovedSectionIds
}: DesignMediaSlotsEditorProps) {
  const expectedSlots = getDesignSlots(designKey);

  const addMissingSlots = () => {
    const newSections = [...sections];
    let addedCount = 0;

    expectedSlots.forEach(slot => {
      const existing = getSlot(sections, slot.slot_key);
      if (!existing) {
        const newSection: CheckoutSection = {
          checkout_id: checkoutId,
          section_type: slot.section_type as any,
          active: true,
          sort_order: newSections.length + 1,
          content: {
            slot_key: slot.slot_key,
            label: slot.label,
            description: slot.description,
            ...(slot.section_type === "media_slot" ? { media: null } : { items: [] })
          }
        };
        newSections.push(newSection);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setSections(newSections);
      toast.success(`${addedCount} slots adicionados!`);
    } else {
      toast.info("Todos os slots padrão já existem.");
    }
  };

  const updateSlotContent = (slotKey: string, contentUpdate: any) => {
    setSections(prev => prev.map(s => {
      if (s.content?.slot_key === slotKey) {
        return {
          ...s,
          content: { ...s.content, ...contentUpdate }
        };
      }
      return s;
    }));
  };

  const toggleSlotActive = (slotKey: string, active: boolean) => {
    setSections(prev => prev.map(s => {
      if (s.content?.slot_key === slotKey) {
        return { ...s, active };
      }
      return s;
    }));
  };

  const removeSlot = (slotKey: string) => {
    const slot = getSlot(sections, slotKey);
    if (slot?.id) {
      setRemovedSectionIds(prev => [...prev, slot.id!]);
    }
    setSections(prev => prev.filter(s => s.content?.slot_key !== slotKey));
    toast.info(`Slot ${slotKey} removido da visualização.`);
  };

  if (expectedSlots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Mídias do Design</h2>
        </div>
        <Button size="sm" variant="outline" onClick={addMissingSlots}>
          <Plus className="w-4 h-4 mr-1" /> Adicionar slots padrão
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {expectedSlots.map(slot => {
          const section = getSlot(sections, slot.slot_key);
          
          if (!section) {
            return (
              <Card key={slot.slot_key} className="p-6 border-dashed bg-muted/20 flex flex-col items-center justify-center text-center space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium text-muted-foreground">{slot.label}</h3>
                  <p className="text-xs text-muted-foreground/70">{slot.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                   const newSection: CheckoutSection = {
                      checkout_id: checkoutId,
                      section_type: slot.section_type as any,
                      active: true,
                      sort_order: sections.length + 1,
                      content: {
                        slot_key: slot.slot_key,
                        label: slot.label,
                        description: slot.description,
                        ...(slot.section_type === "media_slot" ? { media: null } : { items: [] })
                      }
                    };
                    setSections(prev => [...prev, newSection]);
                }}>
                  Criar slot
                </Button>
              </Card>
            );
          }

          return (
            <Card key={slot.slot_key} className="p-5 border-2">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase tracking-wider text-primary">{slot.label}</span>
                  <span className="text-xs text-muted-foreground">{slot.description}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Ativo</span>
                    <Switch 
                      checked={section.active} 
                      onCheckedChange={(val) => toggleSlotActive(slot.slot_key, val)}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSlot(slot.slot_key)}
                    className="text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {slot.section_type === "media_slot" ? (
                  <div className="space-y-2">
                    <MediaField 
                      value={section.content.media} 
                      onChange={(val) => updateSlotContent(slot.slot_key, { media: val })}
                      pathPrefix={checkoutId === "new" ? "temp" : `checkouts/${checkoutId}/sections`}
                      disabled={checkoutId === "new"}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {(section.content.items || []).map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="p-3 border rounded relative bg-background/50">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6 text-destructive"
                            onClick={() => {
                              const newItems = [...(section.content.items || [])];
                              newItems.splice(itemIdx, 1);
                              updateSlotContent(slot.slot_key, { items: newItems });
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
                                updateSlotContent(slot.slot_key, { items: newItems });
                              }}
                              pathPrefix={checkoutId === "new" ? "temp" : `checkouts/${checkoutId}/sections`}
                              disabled={checkoutId === "new"}
                            />
                            <Input 
                              placeholder="Legenda"
                              value={item.caption || ""}
                              onChange={(e) => {
                                const newItems = [...(section.content.items || [])];
                                newItems[itemIdx] = { ...newItems[itemIdx], caption: e.target.value };
                                updateSlotContent(slot.slot_key, { items: newItems });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const newItems = [...(section.content.items || []), { media: null, caption: "" }];
                          updateSlotContent(slot.slot_key, { items: newItems });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
