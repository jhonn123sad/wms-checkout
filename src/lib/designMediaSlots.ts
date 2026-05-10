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
      description: "Fundo ou imagem principal do topo. Proporção recomendada: 16:9 ou 1920x1080.",
      section_type: "media_slot",
      accepted: ["image", "gif", "video", "youtube", "vimeo", "drive", "external"]
    },
    {
      slot_key: "hero_product",
      label: "Mockup/Produto Principal",
      description: "Imagem principal do produto/oferta. Proporção recomendada: 4:5 ou 1080x1350.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "vsl_video",
      label: "Vídeo de Vendas / VSL",
      description: "Vídeo principal da oferta. Proporção recomendada: 16:9.",
      section_type: "media_slot",
      accepted: ["video", "youtube", "vimeo", "drive", "external"]
    },
    {
      slot_key: "proof_image_1",
      label: "Prova Visual 1",
      description: "Print, depoimento, antes/depois ou prova. Proporção recomendada: 1:1 ou 4:5.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "proof_image_2",
      label: "Prova Visual 2",
      description: "Segunda prova visual. Proporção recomendada: 1:1 ou 4:5.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "bonus_mockup",
      label: "Mockup de Bônus",
      description: "Imagem de bônus/entrega/extra. Proporção recomendada: 4:5 ou PNG transparente.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    }
  ],
  compact_offer_v1: [
    {
      slot_key: "cover_image",
      label: "Imagem Principal",
      description: "Imagem principal do produto/oferta. Proporção recomendada: 1:1 ou 4:5.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "side_image",
      label: "Imagem Secundária",
      description: "Imagem lateral/de apoio. Proporção recomendada: 4:5 ou 3:4.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "trust_badge",
      label: "Selo/Prova Visual",
      description: "Selo, garantia, prova ou destaque visual. PNG transparente ou 1:1.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    }
  ],
  wms_liquid_v1: [
    {
      slot_key: "hero_visual",
      label: "Visual principal",
      description: "Imagem, mockup ou arte principal do checkout WMS. Proporção sugerida: 1:1 ou 4:5.",
      section_type: "media_slot",
      accepted: ["image", "gif", "video", "youtube", "vimeo", "drive", "external"]
    },
    {
      slot_key: "proof_visual",
      label: "Prova / mockup secundário",
      description: "Imagem de apoio, print, mockup da comunidade ou visual de autoridade. Proporção sugerida: 16:9 ou 4:3.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    {
      slot_key: "trust_badge",
      label: "Selo de confiança",
      description: "Selo, ícone, garantia ou elemento visual pequeno de confiança. Proporção sugerida: 1:1.",
      section_type: "media_slot",
      accepted: ["image", "gif", "external"]
    },
    wms_access_terminal_v1: [
      {
        slot_key: "logo_icon",
        label: "Logo / Ícone WMS",
        description: "Logo PNG transparente ou emblema principal da Web Money Society. Proporção sugerida 1:1.",
        section_type: "media_slot",
        accepted: ["image", "gif", "external"]
      },
      {
        slot_key: "main_media",
        label: "Mídia Principal",
        description: "Imagem, vídeo, thumbnail, mockup, print ou arte principal do checkout. Deve funcionar como mídia dominante. Proporção sugerida 16:9.",
        section_type: "media_slot",
        accepted: ["image", "gif", "video", "youtube", "vimeo", "drive", "external"]
      },
      {
        slot_key: "hero_background",
        label: "Fundo / Textura do Hero",
        description: "Imagem ou textura opcional para fundo visual. Deve ter fallback quando vazio. Proporção sugerida 1920x1080.",
        section_type: "media_slot",
        accepted: ["image", "gif", "external"]
      },
      {
        slot_key: "proof_media_1",
        label: "Prova Visual 1",
        description: "Print, prova, mini mídia ou benefício visual. Proporção sugerida 1:1 ou 4:3.",
        section_type: "media_slot",
        accepted: ["image", "gif", "external"]
      },
      {
        slot_key: "proof_media_2",
        label: "Prova Visual 2",
        description: "Segunda prova, print, mini mídia ou benefício visual. Proporção sugerida 1:1 ou 4:3.",
        section_type: "media_slot",
        accepted: ["image", "gif", "external"]
      },
      {
        slot_key: "proof_media_3",
        label: "Prova Visual 3",
        description: "Terceira prova, print, mini mídia ou benefício visual. Proporção sugerida 1:1 ou 4:3.",
        section_type: "media_slot",
        accepted: ["image", "gif", "external"]
      },
      {
        slot_key: "trust_badge",
        label: "Selo de Confiança",
        description: "Selo, garantia, segurança, liberação imediata ou badge visual. Proporção sugerida 1:1, PNG transparente.",
        section_type: "media_slot",
        accepted: ["image", "gif", "external"]
      },
      {
        slot_key: "side_visual",
        label: "Visual Secundário",
        description: "Mockup, avatar, print, imagem lateral ou detalhe visual de apoio. Proporção sugerida 1:1 ou 4:5.",
        section_type: "media_slot",
        accepted: ["image", "gif", "video", "external"]
      }
    ]

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
