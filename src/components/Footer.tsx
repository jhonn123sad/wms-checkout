import { Droplets, Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </span>
            AquaLav
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Cuidado profissional para as suas roupas, com coleta e entrega na sua porta.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-semibold text-foreground mb-3">Contato</h4>
          <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-primary" /> (11) 99999-0000</p>
          <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> ola@aqualav.com</p>
          <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> Rua das Flores, 123 — São Paulo</p>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold text-foreground mb-3">Horário</h4>
          <p className="text-muted-foreground">Seg – Sex: 8h às 19h</p>
          <p className="text-muted-foreground">Sábado: 9h às 14h</p>
          <p className="text-muted-foreground">Domingo: fechado</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AquaLav · Todos os direitos reservados
      </div>
    </footer>
  );
}