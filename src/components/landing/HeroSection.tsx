import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpeg";

const HeroSection = () => {
  const [headline, setHeadline] = useState("Móveis Planejados Barueri e Região");
  const [highlight, setHighlight] = useState("com Condições Exclusivas!");
  const [subtitle, setSubtitle] = useState(
    "Solicite seu orçamento de forma rápida e fácil!"
  );

  useEffect(() => {
    supabase
      .from("configuracoes")
      .select("hero_headline, hero_headline_highlight, hero_subtitle")
      .eq("id", true)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const d = data as any;
        if (d.hero_headline) setHeadline(d.hero_headline);
        if (d.hero_headline_highlight) setHighlight(d.hero_headline_highlight);
        if (d.hero_subtitle) setSubtitle(d.hero_subtitle);
      });
  }, []);

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
        >
          {headline}
          <br />
          <span className="text-amber-400">{highlight}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
        <motion.button
          onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="inline-flex items-center gap-2 bg-cta-green text-cta-green-foreground font-bold text-lg px-8 py-4 rounded-lg hover:brightness-110 transition-all animate-pulse-glow"
        >
          SOLICITE SEU ORÇAMENTO <Play className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;

