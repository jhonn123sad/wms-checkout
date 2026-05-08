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
  ],
  sales_long_v1: [
    {
      slot_key: "hero_background",
      label: "Imagem/Fundo do Hero",
      description: "fundo ou imagem principal do topo (16:9)",
      section_type: "media_slot",
      accepted: ["image", "gif", "video", "external"]
    },
    {
      slot_key: "hero_product",
      label: "Mockup/Produto Principal",
      description: "imagem principal do produto/oferta (4:5)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "vsl_video",
      label: "Vídeo de Vendas / VSL",
      description: "vídeo principal da oferta (16:9)",
      section_type: "media_slot",
      accepted: ["video", "youtube", "vimeo", "drive", "external"]
    },
    {
      slot_key: "proof_image_1",
      label: "Prova Visual 1",
      description: "print, depoimento ou prova (1:1 ou 4:5)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "proof_image_2",
      label: "Prova Visual 2",
      description: "segunda prova visual (1:1 ou 4:5)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "bonus_mockup",
      label: "Mockup de Bônus",
      description: "imagem de bônus/extra (4:5 ou PNG)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    }
  ],
  compact_offer_v1: [
    {
      slot_key: "cover_image",
      label: "Imagem Principal",
      description: "imagem principal do produto (1:1 ou 4:5)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "side_image",
      label: "Imagem Secundária",
      description: "imagem lateral/de apoio (4:5 ou 3:4)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "trust_badge",
      label: "Selo/Prova Visual",
      description: "selo, garantia ou destaque (PNG ou 1:1)",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
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
