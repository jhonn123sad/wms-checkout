DO $$
DECLARE
    new_checkout_id UUID;
BEGIN
    INSERT INTO public.checkouts (title, subtitle, slug, price, cta_text, media_type, media_url, design_key)
    VALUES ('WMS Novo Teste', 'Experiência minimalista estilo Apple para sua comunidade premium.', 'wms-novo-teste', 47.00, 'Garantir meu acesso', 'image', 'https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/comunidade-wms/edite_essa_imagem_202604160528.jpeg', 'apple_v1')
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      price = EXCLUDED.price,
      cta_text = EXCLUDED.cta_text,
      media_type = EXCLUDED.media_type,
      media_url = EXCLUDED.media_url,
      design_key = EXCLUDED.design_key
    RETURNING id INTO new_checkout_id;

    -- Delete existing fields to reset them
    DELETE FROM public.checkout_fields WHERE checkout_id = new_checkout_id;

    -- Insert new fields
    INSERT INTO public.checkout_fields (checkout_id, field_name, field_label, required, sort_order) VALUES
    (new_checkout_id, 'customer_name', 'Nome Completo', true, 1),
    (new_checkout_id, 'customer_email', 'E-mail', true, 2),
    (new_checkout_id, 'customer_phone', 'WhatsApp', true, 3);
END $$;
