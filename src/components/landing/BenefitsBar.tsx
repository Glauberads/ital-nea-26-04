import { MapPin, CreditCard, ShieldCheck, MessageCircle } from "lucide-react";

const BenefitsBar = () => {
  return (
    <div className="bg-secondary text-foreground py-2 text-xs md:text-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex flex-wrap justify-center md:justify-between items-center gap-3 md:gap-0 px-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" /> Barueri - SP
        </span>
        <span className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-gold" /> Pague em até 36x
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" /> 5 anos de garantia
        </span>
        <a
          href="https://wa.me/5511940059909?text=gads Olá, vim pelo site e tenho interesse em um projeto de móveis planejados"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-cta-green transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-cta-green" /> Contato Rápido
        </a>
      </div>
    </div>
  );
};

export default BenefitsBar;
