import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AboutSection = () => {
  const [italineaLogo, setItalineaLogo] = useState<string>("");
  const [mettaLogo, setMettaLogo] = useState<string>("");
  const [factoryImg, setFactoryImg] = useState<string>("");
  const [white, setWhite] = useState<boolean>(true);

  useEffect(() => {
    supabase
      .from("configuracoes")
      .select("about_logo_url, about_logo_white, about_factory_url, about_metta_logo_url")
      .eq("id", true)
      .single()
      .then(({ data }) => {
        if (data) {
          const d = data as any;
          if (d.about_logo_url) setItalineaLogo(d.about_logo_url);
          if (d.about_factory_url) setFactoryImg(d.about_factory_url);
          if (d.about_metta_logo_url) setMettaLogo(d.about_metta_logo_url);
          if (typeof d.about_logo_white === "boolean") setWhite(d.about_logo_white);
        }
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
            {factoryImg ? (
              <img
                src={factoryImg}
                alt="Showroom Metta Italínea"
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-[400px] bg-secondary flex items-center justify-center text-muted-foreground">
                Imagem do Showroom
              </div>
            )}
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
            {italineaLogo && (
              <img
                src={italineaLogo}
                alt="Italínea"
                className={`h-12 w-auto mb-5 ${white ? "brightness-0 invert" : "brightness-0"}`}
                loading="lazy"
              />
            )}
            <p className="text-muted-foreground text-lg leading-relaxed">
              Somos a maior rede de móveis planejados da América Latina, especialistas em transformar projetos em vidas felizes.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Desde 1997, levamos qualidade, tecnologia e soluções inteligentes às pessoas, sempre inovando.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Contamos com um moderno parque fabril de 54 mil m², em expansão para 125 mil m², garantindo excelência em cada detalhe.
            </p>

            {mettaLogo && (
              <img
                src={mettaLogo}
                alt="Metta Móveis Planejados"
                className="h-16 w-auto mt-8"
                loading="lazy"
              />
            )}

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
