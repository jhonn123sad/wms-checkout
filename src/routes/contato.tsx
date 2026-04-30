import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — AquaLav Lavanderia" },
      { name: "description", content: "Agende sua coleta ou tire dúvidas. Estamos prontos para atender." },
      { property: "og:title", content: "Contato — AquaLav" },
      { property: "og:description", content: "Fale com a AquaLav e agende sua coleta." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="bg-[image:var(--gradient-soft)] py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Vamos conversar</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Agende uma coleta ou tire suas dúvidas. Respondemos rapidinho.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          {sent ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-[image:var(--gradient-hero)] flex items-center justify-center text-primary-foreground">
                <Send className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Pedido recebido!</h2>
              <p className="mt-2 text-muted-foreground">Em breve entraremos em contato para confirmar sua coleta.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <h2 className="text-2xl font-bold text-foreground">Agendar coleta</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nome" name="nome" placeholder="Seu nome" />
                <Field label="Telefone" name="telefone" placeholder="(11) 99999-0000" />
              </div>
              <Field label="E-mail" name="email" type="email" placeholder="voce@email.com" />
              <Field label="Endereço" name="endereco" placeholder="Rua, número, bairro" />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mensagem</label>
                <textarea
                  rows={4}
                  placeholder="Conte o que você precisa lavar..."
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-[var(--transition-smooth)]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)]"
              >
                <Send className="h-4 w-4" /> Enviar pedido
              </button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-2 space-y-4">
          <InfoCard icon={Phone} title="Telefone" text="(11) 99999-0000" />
          <InfoCard icon={Mail} title="E-mail" text="ola@aqualav.com" />
          <InfoCard icon={MapPin} title="Endereço" text="Rua das Flores, 123 — São Paulo, SP" />
          <InfoCard icon={Clock} title="Horário" text="Seg–Sex 8h–19h · Sáb 9h–14h" />
        </aside>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-[var(--transition-smooth)]"
      />
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex gap-4 items-start hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]">
      <div className="h-11 w-11 shrink-0 rounded-xl bg-[image:var(--gradient-hero)] flex items-center justify-center text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground mt-0.5">{text}</div>
      </div>
    </div>
  );
}