import { Link } from "@tanstack/react-router";
import { Droplets } from "lucide-react";

const links = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/precos", label: "Preços" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="text-foreground">AquaLav</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-[var(--transition-smooth)] hover:text-foreground hover:bg-secondary"
              activeProps={{ className: "px-4 py-2 text-sm font-medium rounded-full bg-secondary text-foreground" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contato"
          className="hidden sm:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:opacity-90"
        >
          Agendar coleta
        </Link>
      </div>
    </header>
  );
}