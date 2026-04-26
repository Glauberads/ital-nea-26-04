import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ShowroomImage {
  id: string;
  url_imagem: string;
  titulo: string | null;
  subtitulo: string | null;
  categoria: string;
}

const fallbackImages: ShowroomImage[] = [
  { id: "1", url_imagem: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", titulo: "Ambiente Planejado", subtitulo: "Conheça nosso showroom com ambientes completos e inspiradores.", categoria: "showroom" },
  { id: "2", url_imagem: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80", titulo: "Sala de Estar", subtitulo: "Móveis sob medida com acabamento premium.", categoria: "showroom" },
  { id: "3", url_imagem: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80", titulo: "Quarto Planejado", subtitulo: "Soluções inteligentes para o seu espaço.", categoria: "showroom" },
  { id: "4", url_imagem: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80", titulo: "Cozinha Premium", subtitulo: "Funcionalidade e design em cada detalhe.", categoria: "showroom" },
];

const ShowroomSection = () => {
  const [images, setImages] = useState<ShowroomImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("galeria_midia")
        .select("id, url_imagem, titulo, subtitulo, categoria")
        .eq("categoria", "showroom")
        .order("ordem", { ascending: true });

      if (error || !data || data.length === 0) {
        setImages(fallbackImages);
      } else {
        setImages(data as ShowroomImage[]);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <section className="py-20 bg-secondary/50" id="showroom">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            Visite-nos!
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Nosso Showroom
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Venha conhecer de perto nossos ambientes planejados. Cada detalhe pensado para inspirar o seu próximo projeto.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl overflow-hidden bg-card border border-border flex flex-col"
              >
                <div className="overflow-hidden">
                  <img
                    src={img.url_imagem}
                    alt={img.titulo || "Showroom"}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-sm mb-1">{img.titulo || "Sem título"}</h3>
                  {img.subtitulo && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{img.subtitulo}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="#contato"
            className="inline-flex items-center gap-2 bg-cta-green text-cta-green-foreground font-bold px-8 py-4 rounded-lg hover:brightness-110 transition-all"
          >
            AGENDE SUA VISITA
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShowroomSection;
