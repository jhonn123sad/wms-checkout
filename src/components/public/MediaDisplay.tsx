import React from "react";
import { MediaValue } from "@/components/admin/MediaField";

export const MediaDisplay = ({ media }: { media: MediaValue | null | undefined }) => {
  if (!media || !media.url) return null;

  if (media.type === "image" || media.type === "gif") {
    return <img src={media.url} alt="" className="w-full h-full object-cover" />;
  }

  if (media.provider === "youtube") {
    let videoId = "";
    if (media.url.includes("v=")) {
      videoId = media.url.split("v=")[1].split("&")[0];
    } else if (media.url.includes("youtu.be/")) {
      videoId = media.url.split("youtu.be/")[1].split("?")[0];
    } else {
      videoId = media.url.split("/").pop() || "";
    }
    
    return (
      <div className="aspect-video w-full">
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  if (media.provider === "vimeo") {
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
      />
    );
  }

  return <div className="p-4 bg-muted text-center text-xs">Formato de mídia não suportado</div>;
};