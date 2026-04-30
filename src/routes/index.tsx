import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Truck, Sparkles, Clock, Shirt, ShieldCheck, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-laundry.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AquaLav — Lavanderia com coleta e entrega" },
      { name: "description", content: "Lavanderia profissional com coleta grátis, lavagem cuidadosa e entrega rápida. Suas roupas em mãos especialistas." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-soft)]" aria-hidden />
        <div className="container mx-auto relative px-4 py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Coleta e entrega grátis
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Suas roupas <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">limpas</span> sem sair de casa
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Lavagem profissional com produtos premium, secagem cuidadosa e entrega no mesmo dia. Você relaxa, a gente cuida.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contato"
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:opacity-90 hover:shadow-[var(--shadow-glow)]"
              >
                Agendar coleta
              </Link>
              <Link
                to="/precos"
                className="inline-flex items-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition-[var(--transition-smooth)] hover:bg-secondary"
              >
                Ver preços
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "10k+", l: "Pedidos" },
                { n: "4.9★", l: "Avaliação" },
                { n: "24h", l: "Entrega" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-foreground">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-[image:var(--gradient-hero)] opacity-20 blur-3xl rounded-full" aria-hidden />
            <img
              src={heroImage}
              alt="Toalhas brancas dobradas, frescas e perfumadas"
              width={1536}
              height={1024}
              className="relative rounded-3xl shadow-[var(--shadow-soft)] w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Por que a AquaLav?</h2>
          <p className="mt-3 text-muted-foreground">Cuidamos de cada peça como se fosse nossa.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Truck, title: "Coleta e entrega", desc: "Buscamos e entregamos no horário que você escolher." },
            { icon: Leaf, title: "Produtos ecológicos", desc: "Detergentes biodegradáveis e suaves para a pele." },
            { icon: Clock, title: "Pronto em 24h", desc: "Lavagem expressa disponível no mesmo dia." },
            { icon: Shirt, title: "Cuidado peça a peça", desc: "Separação por cor, tecido e tipo de lavagem." },
            { icon: ShieldCheck, title: "Garantia total", desc: "Algum problema? Refazemos sem custo." },
            { icon: Sparkles, title: "Perfume duradouro", desc: "Suas roupas voltam com cheirinho de novo." },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary group-hover:bg-[image:var(--gradient-hero)] group-hover:text-primary-foreground transition-[var(--transition-smooth)]">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-10">
        <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-10 md:p-16 text-center shadow-[var(--shadow-soft)]">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Pronto para sentir o cheiro de roupa nova?
          </h2>
          <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">
            Agende sua primeira coleta e ganhe 20% de desconto.
          </p>
          <Link
            to="/contato"
            className="mt-8 inline-flex items-center rounded-full bg-background px-8 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:scale-105"
          >
            Quero agendar
          </Link>
        </div>
      </section>
    </div>
  );
}
