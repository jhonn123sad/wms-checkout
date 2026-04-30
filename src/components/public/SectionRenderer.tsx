import React from "react";
import { MediaValue } from "@/components/admin/MediaField";

interface SectionProps {
  type: string;
  content: any;
}

export const SectionRenderer = ({ type, content }: SectionProps) => {
  switch (type) {
    case "hero":
      return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20 px-6">
          {content.media && (
            <div className="absolute inset-0 z-0">
              <MediaDisplay media={content.media} />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          <div className="relative z-10 text-center max-w-4xl mx-auto text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.title}</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">{content.subtitle}</p>
            {content.cta_text && (
              <a 
                href={content.cta_link} 
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
              >
                {content.cta_text}
              </a>
            )}
          </div>
        </section>
      );

    case "text":
      return (
        <section className="py-16 px-6 max-w-3xl mx-auto prose prose-lg dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: content.body }} />
        </section>
      );

    case "media":
      return (
        <section className="py-12 px-6 max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <MediaDisplay media={content.media} />
          </div>
          {content.caption && <p className="text-center text-muted-foreground mt-4 text-sm italic">{content.caption}</p>}
        </section>
      );

    case "features":
      return (
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {content.items?.map((item: any, i: number) => (
                <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    default:
      return <div className="p-8 text-center text-muted-foreground">Seção não suportada: {type}</div>;
  }
};

const MediaDisplay = ({ media }: { media: MediaValue }) => {
  if (!media) return null;

  if (media.type === "image" || media.type === "gif") {
    return <img src={media.url} alt="" className="w-full h-full object-cover" />;
  }

  if (media.provider === "youtube") {
    const videoId = media.url.includes("v=") ? media.url.split("v=")[1].split("&")[0] : media.url.split("/").pop();
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

  return <div className="p-4 bg-muted text-center text-xs">Formato de mídia não suportado ({media.provider})</div>;
};