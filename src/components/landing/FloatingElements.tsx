import { MessageCircle } from "lucide-react";

const FloatingElements = () => {
  return (
    <>
      {/* WhatsApp Button - bottom left */}
      <button
        onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
        className="fixed bottom-6 left-6 z-50 bg-cta-green text-cta-green-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat bubble - bottom right */}
      <button
        onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-card border border-border rounded-full pl-4 pr-5 py-3 shadow-lg hover:scale-105 transition-transform group"
      >
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          👩
        </div>
        <span className="text-sm max-w-[200px] text-foreground">
          Olá, gostaria de um atendimento em menos de 5min? 😉
        </span>
      </button>
    </>
  );
};

export default FloatingElements;
