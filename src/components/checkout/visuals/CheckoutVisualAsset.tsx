import React from "react";
import { MediaDisplay } from "@/components/public/MediaDisplay";
 
 interface CheckoutVisualAssetProps {
   slug: string;
   theme: any;
   content: any;
   className?: string;
 }
 
 export const CheckoutVisualAsset: React.FC<CheckoutVisualAssetProps> = ({ 
   slug, 
   theme, 
   content, 
   className = "" 
 }) => {
  // Extrair mídia do tema ou do banco de dados (passada via theme ou content)
  // Priorizamos a estrutura media_json se disponível
  const media = theme.media || (theme.media_url ? {
    url: theme.media_url,
    type: theme.media_type || "image",
    provider: theme.media_provider || "external"
  } : null);

  return (
    <div className={`relative rounded-[inherit] overflow-hidden bg-black/5 ${className}`}>
      <MediaDisplay media={media} />
    </div>
  );
 };