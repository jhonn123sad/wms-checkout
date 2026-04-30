import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/precos")({
  head: () => ({
    meta: [
      { title: "Preços — AquaLav Lavanderia" },
      { name: "description", content: "Preços transparentes para lavagem, passadoria e planos mensais." },
      { property: "og:title", content: "Preços — AquaLav" },
      { property: "og:description", content: "Planos e valores da AquaLav." },
    ],
  }),
  component: Precos,
});

const plans = [
  {
    name: "Avulso",
    price: "R$ 8",
    unit: "/kg",
    desc: "Perfeito para usar quando precisar.",
    features: ["Lavagem e secagem", "Coleta acima de 5kg", "Entrega em 48h"],
  },
  {
    name: "Mensal",
    price: "R$ 149",
    unit: "/mês",
    desc: "Ideal para casa ou solteiro(a).",
    features: ["Até 20kg por mês", "Coleta semanal grátis", "Passadoria inclusa", "Entrega em 24h"],
    highlighted: true,
  },
  {
    name: "Família",
    price: "R$ 279",
    unit: "/mês",
    desc: "Para famílias e residências maiores.",
    features: ["Até 40kg por mês", "Coleta 2x por semana", "Passadoria inclusa", "Roupas de cama inclusas"],
  },
];

const items = [
  ["Camisa social", "R$ 12"],
  ["Calça social", "R$ 14"],
  ["Vestido", "R$ 22"],
  ["Terno (2 peças)", "R$ 45"],
  ["Edredom casal", "R$ 60"],
  ["Tênis", "R$ 35"],
];

function Precos() {
  return (
    <div>
      <section className="bg-[image:var(--gradient-soft)] py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Preços simples</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Sem letras miúdas. Escolha o plano que faz sentido pra você.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={
                p.highlighted
                  ? "rounded-3xl bg-[image:var(--gradient-hero)] p-8 shadow-[var(--shadow-glow)] text-primary-foreground relative md:-translate-y-3"
                  : "rounded-3xl border border-border bg-card p-8"
              }
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground shadow">
                  Mais popular
                </span>
              )}
              <h3 className={p.highlighted ? "text-xl font-semibold" : "text-xl font-semibold text-foreground"}>{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className={p.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>{p.unit}</span>
              </div>
              <p className={p.highlighted ? "mt-2 text-sm text-primary-foreground/90" : "mt-2 text-sm text-muted-foreground"}>{p.desc}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={p.highlighted ? "h-4 w-4 mt-0.5 shrink-0" : "h-4 w-4 mt-0.5 shrink-0 text-primary"} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contato"
                className={
                  p.highlighted
                    ? "mt-8 inline-flex w-full justify-center rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:scale-[1.02] transition-[var(--transition-smooth)]"
                    : "mt-8 inline-flex w-full justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-[var(--transition-smooth)]"
                }
              >
                Escolher plano
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-foreground text-center">Preços por peça</h2>
          <p className="text-center text-muted-foreground mt-2">Para pedidos pontuais</p>
          <div className="mt-8 max-w-2xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
            {items.map(([name, price], i) => (
              <div
                key={name}
                className={
                  "flex items-center justify-between px-6 py-4 " +
                  (i !== items.length - 1 ? "border-b border-border" : "")
                }
              >
                <span className="text-foreground">{name}</span>
                <span className="font-semibold text-primary">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}