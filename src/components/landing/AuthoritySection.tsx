import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AuthoritySection = () => {
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    supabase
      .from("configuracoes")
      .select("authority_logo_url")
      .eq("id", true)
      .single()
      .then(({ data }) => {
        const url = (data as any)?.authority_logo_url;
        if (url) setLogoUrl(url);
      });
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-sm uppercase tracking-widest text-gold mb-3">
            Nossa Rede
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto">
            Fazemos parte da maior rede de lojas de móveis planejados da{" "}
            <span className="text-gold">América Latina!</span>
          </h2>
          <div className="my-10 flex justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo da rede Italínea, parceira da Metta"
                loading="lazy"
                decoding="async"
                className="h-auto w-full max-w-[320px] object-contain md:max-w-[520px] lg:max-w-[640px]"
              />
            ) : (
              <div className="h-24 w-full max-w-[320px] md:max-w-[520px] flex items-center justify-center text-muted-foreground text-sm">
                Logo Italínea
              </div>
            )}
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
            className="inline-flex items-center gap-2 bg-cta-green text-cta-green-foreground font-bold text-lg px-8 py-4 rounded-lg hover:brightness-110 transition-all"
          >
            SOLICITE SEU PROJETO DOS SONHOS
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthoritySection;
