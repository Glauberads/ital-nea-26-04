import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  data_exibicao: string | null;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Depoimento[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("depoimentos" as any)
        .select("id, nome, texto, data_exibicao")
        .eq("is_public", true)
        .order("ordem", { ascending: true });
      if (data) setTestimonials(data as any);
    };
    load();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h3 className="text-sm uppercase tracking-widest text-gold mb-3">Depoimentos</h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">O Que Nossos Clientes Dizem</h2>
          <p className="text-muted-foreground">
            <span className="text-gold font-bold">EXCELENTE</span> — Com base em 17 avaliações
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            Google Avaliações
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {t.nome[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.nome}</div>
                  <div className="text-xs text-muted-foreground">{t.data_exibicao}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.texto}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
            className="inline-flex items-center gap-2 bg-cta-green text-cta-green-foreground font-bold px-8 py-4 rounded-lg hover:brightness-110 transition-all"
          >
            SOLICITE SEU ORÇAMENTO
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
