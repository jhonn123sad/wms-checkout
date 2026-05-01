import React from "react";

export interface MediaValue {
  type: "image" | "video" | "gif" | "youtube" | "vimeo";
  source: "supabase" | "external" | "external_url" | "youtube" | "vimeo" | "gdrive";
  url: string;
  embed_url?: string;
  file_path?: string;
  title?: string;
  alt_text?: string;
  id?: string;
}

export const MediaDisplay = ({ media }: { media: MediaValue | null | undefined }) => {
  if (!media || !media.url) {
    return <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground/40 text-xs italic p-4">Sem mídia configurada</div>;
  }

  if (media.type === "image" || media.type === "gif") {
    return <img src={media.url} alt={media.alt_text || media.title || ""} className="w-full h-full object-cover" />;
  }

  if (media.type === "youtube" || media.source === "youtube") {
    const embed = media.embed_url || toYouTubeEmbed(media.url);
    return (
      <div className="aspect-video w-full">
        <iframe 
          src={embed}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  if (media.type === "vimeo" || media.source === "vimeo") {
    const videoId = media.url.split("/").pop();
    return (
      <div className="aspect-video w-full">
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <video 
        src={media.url} 
        className="w-full h-full object-cover" 
        autoPlay 
        loop 
        muted 
        playsInline 
        controls
      />
    );
  }

  return <div className="p-4 bg-muted text-center text-xs">Formato de mídia não suportado</div>;
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