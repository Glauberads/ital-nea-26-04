import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import fabricaImg from "@/assets/fabrica.jpg";
import logoMetta from "@/assets/logo-metta.png";
import logoItalineaDefault from "@/assets/logo-italinea.png";

const AboutSection = () => {
  const [italineaLogo, setItalineaLogo] = useState<string>(logoItalineaDefault);
  const [white, setWhite] = useState<boolean>(true);

  useEffect(() => {
    supabase
      .from("configuracoes")
      .select("about_logo_url, about_logo_white")
      .eq("id", true)
      .single()
      .then(({ data }) => {
        const url = (data as any)?.about_logo_url;
        if (url) setItalineaLogo(url);
        const w = (data as any)?.about_logo_white;
        if (typeof w === "boolean") setWhite(w);
      });
  }, []);

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden"
          >
            <img
              src={fabricaImg}
              alt="Showroom Metta Italínea"
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-sm uppercase tracking-widest text-gold mb-3">
              Sobre Nós
            </h3>
            <img
              src={italineaLogo}
              alt="Italínea"
              className={`h-12 w-auto mb-5 ${white ? "brightness-0 invert" : "brightness-0"}`}
              loading="lazy"
            />
            <p className="text-muted-foreground text-lg leading-relaxed">
              Somos a maior rede de móveis planejados da América Latina, especialistas em transformar projetos em vidas felizes.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Desde 1997, levamos qualidade, tecnologia e soluções inteligentes às pessoas, sempre inovando.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Contamos com um moderno parque fabril de 54 mil m², em expansão para 125 mil m², garantindo excelência em cada detalhe.
            </p>

            <img
              src={logoMetta}
              alt="Metta Móveis Planejados"
              className="h-16 w-auto mt-8"
              loading="lazy"
            />

            <p className="text-muted-foreground text-lg leading-relaxed mt-6">
              Há 16 anos, a Metta Planejados transforma ideias em projetos e projetos em sonhos realizados.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Com dedicação, qualidade e atenção aos detalhes, desenvolvemos soluções em móveis planejados que unem funcionalidade, beleza e personalidade.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Cada ambiente é pensado de forma única, respeitando o estilo e a necessidade de cada cliente, sempre com compromisso, transparência e excelência em cada etapa.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Mais do que planejar espaços, realizamos sonhos e criamos experiências que fazem a diferença no dia a dia.
            </p>
            <p className="text-foreground text-lg leading-relaxed mt-4 font-semibold">
              Metta Planejados – planejando com propósito, realizando com excelência.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
