export interface DesignMediaSlot {
  slot_key: string;
  label: string;
  description: string;
  section_type: "media_slot" | "gallery_slot";
  accepted: string[];
}

export const DESIGN_MEDIA_SLOTS: Record<string, DesignMediaSlot[]> = {
  custom_media_v1: [
    {
      slot_key: "hero_image",
      label: "Imagem principal",
      description: "Imagem principal do topo do checkout",
      section_type: "media_slot",
      accepted: ["image", "gif", "video", "youtube", "vimeo", "drive", "external"]
    },
    {
      slot_key: "main_video",
      label: "Vídeo principal",
      description: "Vídeo principal do checkout",
      section_type: "media_slot",
      accepted: ["video", "youtube", "vimeo", "drive", "external"]
    },
    {
      slot_key: "gallery",
      label: "Galeria",
      description: "Galeria de imagens ou mídias adicionais",
      section_type: "gallery_slot",
      accepted: ["image", "gif", "video", "external"]
    }
  ]
};

/**
 * Retorna os slots esperados para o design.
 */
export const getDesignSlots = (designKey: string): DesignMediaSlot[] => {
  return DESIGN_MEDIA_SLOTS[designKey] || [];
};

/**
 * Procura em checkout_sections por um slot_key específico.
 */
export const getSlot = (sections: any[], slotKey: string) => {
  return sections?.find(s => s.content?.slot_key === slotKey);
};

/**
 * Retorna o objeto de mídia de um slot específico.
 */
export const getSlotMedia = (sections: any[], slotKey: string) => {
  const slot = getSlot(sections, slotKey);
  return slot?.content?.media;
};

/**
 * Retorna os itens de galeria de um slot específico.
 */
export const getGalleryItems = (sections: any[], slotKey: string) => {
  const slot = getSlot(sections, slotKey);
  return slot?.content?.items || [];
};

/**
 * DOCUMENTAÇÃO PARA NOVOS DESIGNS:
 * Todo design novo deve:
 * 1. Declarar seus slots em DESIGN_MEDIA_SLOTS acima.
 * 2. Não hardcodar mídias importantes no código.
 * 3. Buscar mídias editáveis por slot_key usando getSlotMedia ou getGalleryItems.
 * 4. Manter a integração de Pix via CheckoutPageContent/InlinePixPanel.
 * 5. Nunca chamar create-pix diretamente (deve ser via formulário padrão).
 */
