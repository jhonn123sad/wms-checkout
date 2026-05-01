import React from "react";

export interface MediaValue {
  type: "image" | "video" | "gif" | "youtube" | "vimeo";
  source?: "supabase" | "external" | "external_url" | "youtube" | "vimeo" | "gdrive";
  url: string;
  embed_url?: string;
  file_path?: string;
  title?: string;
  alt_text?: string;
  id?: string;
}

export const MediaDisplay = ({ media }: { media: MediaValue | null | undefined | any }) => {
  if (!media) return null;

  // Prioridade: extrair de campos diretos ou do objeto media_json
  let type = media.type || media.media_type;
  let url = media.url || media.media_url;
  const source = media.source;

  // Se não tiver type mas tiver url, tenta deduzir
  if (!type && url) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      type = "youtube";
    } else if (url.includes("vimeo.com")) {
      type = "vimeo";
    } else if (url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i)) {
      type = "image";
    } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      type = "video";
    }
  }

  if (!url) return null;

  if (type === "image" || type === "gif") {
    return (
      <img 
        src={url} 
        alt={media.alt_text || media.title || "Checkout Media"} 
        className="w-full h-full object-cover" 
        onError={(e) => {
          console.error("[MediaDisplay] Erro ao carregar imagem:", url);
          (e.target as any).style.display = 'none';
        }}
      />
    );
  }

  if (type === "youtube" || source === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
    const embed = media.embed_url || toYouTubeEmbed(url);
    return (
      <div className="aspect-video w-full bg-black">
        <iframe 
          src={embed}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="YouTube Video"
        />
      </div>
    );
  }

  if (type === "vimeo" || source === "vimeo" || url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return (
      <div className="aspect-video w-full bg-black">
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Vimeo Video"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <video 
        src={url} 
        className="w-full h-full object-cover" 
        autoPlay 
        loop 
        muted 
        playsInline 
        controls
      />
    );
  }

  return null;
};

function toYouTubeEmbed(url: string): string {
  let videoId = "";
  try {
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1].split("?")[0];
    } else {
      videoId = url.split("/").pop() || "";
    }
  } catch {
    videoId = "";
  }
  return `https://www.youtube.com/embed/${videoId}`;
}