import { MediaDisplay } from "@/components/public/MediaDisplay";

interface CustomMediaBlockRendererProps {
  section: {
    section_type: string;
    content: any;
  };
  checkout_form?: React.ReactNode;
}

export function CustomMediaBlockRenderer({ section, checkout_form }: CustomMediaBlockRendererProps) {
  const { section_type, content } = section;

  switch (section_type) {
    case "hero":
      return (
        <section className="py-12 md:py-20 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {content.tag && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
              {content.tag}
            </div>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
              {content.subtitle}
            </p>
          )}
          {content.media && (
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/5 bg-[#141414] shadow-2xl mt-8">
              <MediaDisplay media={content.media} />
            </div>
          )}
        </section>
      );

    case "text":
      return (
        <section className="py-8 md:py-12 prose prose-invert max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {content.title && <h2 className="text-2xl md:text-3xl font-bold">{content.title}</h2>}
            <div className="text-gray-400 leading-relaxed whitespace-pre-line text-lg">
              {content.text}
            </div>
          </div>
        </section>
      );

    case "media":
      return (
        <section className="py-8 md:py-12 w-full max-w-5xl mx-auto px-4">
          <div className="aspect-video rounded-3xl overflow-hidden border border-white/5 bg-[#141414] shadow-2xl">
            <MediaDisplay media={content.media} />
          </div>
          {content.caption && (
            <p className="mt-4 text-center text-sm text-gray-500">{content.caption}</p>
          )}
        </section>
      );

    case "gallery":
      return (
        <section className="py-12 md:py-20 w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.items?.map((item: any, idx: number) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#141414]">
                <MediaDisplay media={item} />
              </div>
            ))}
          </div>
        </section>
      );

    case "benefits":
      return (
        <section className="py-12 md:py-20 w-full max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.items?.map((benefit: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                  {/* Aquí poderíamos mapear ícones mas por agora um default */}
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case "checkout_form":
      return (
        <section id="checkout-anchor" className="py-12 md:py-24 flex flex-col items-center scroll-mt-10">
          <div className="w-full max-w-[480px]">
            {checkout_form}
          </div>
        </section>
      );

    default:
      return null;
  }
}
