import { createFileRoute } from "@tanstack/react-router";
import { Shirt, Wind, Sparkles, Bed, Briefcase, Footprints } from "lucide-react";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — AquaLav Lavanderia" },
      { name: "description", content: "Lavagem, secagem, passadoria, lavagem a seco e cuidados especiais para todo tipo de tecido." },
      { property: "og:title", content: "Serviços — AquaLav" },
      { property: "og:description", content: "Conheça todos os serviços da AquaLav." },
    ],
  }),
  component: Servicos,
});

const services = [
  { icon: Shirt, title: "Lavagem comum", desc: "Roupas do dia a dia com separação cuidadosa por cor e tecido." },
  { icon: Wind, title: "Lavagem a seco", desc: "Para ternos, vestidos e peças delicadas que pedem cuidado especial." },
  { icon: Sparkles, title: "Passadoria", desc: "Acabamento impecável com vapor profissional para um caimento perfeito." },
  { icon: Bed, title: "Roupas de cama", desc: "Edredons, cobertores e lençóis com lavagem profunda e higienização." },
  { icon: Briefcase, title: "Roupa social", desc: "Camisas, ternos e vestidos prontos para o trabalho ou ocasiões especiais." },
  { icon: Footprints, title: "Tênis e calçados", desc: "Limpeza profissional que devolve o brilho aos seus calçados favoritos." },
];

function Servicos() {
  return (
    <div>
      <section className="bg-[image:var(--gradient-soft)] py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Nossos serviços</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Soluções completas em lavanderia, do básico ao especial.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-border bg-card p-7 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
                <s.icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}