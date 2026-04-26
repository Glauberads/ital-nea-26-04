import { motion } from "framer-motion";
import { CreditCard, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import montagem01 from "@/assets/montagem-01.jpeg";
import montagem03 from "@/assets/montagem-03.jpeg";
import montagem04 from "@/assets/montagem-04.jpeg";
import montagem06 from "@/assets/montagem-06.jpeg";
import montagem07 from "@/assets/montagem-07.jpeg";
import montagem09 from "@/assets/montagem-09.jpeg";
import montagem10 from "@/assets/montagem-10.jpeg";
import montagem11 from "@/assets/montagem-11.jpeg";

interface ProjectImage {
  id: string;
  url_imagem: string;
  titulo: string | null;
  subtitulo: string | null;
}

const fallbackProjects: ProjectImage[] = [
  { id: "1", url_imagem: montagem01, titulo: "Cozinha Compacta", subtitulo: "Projeto sob medida para apartamento, maximizando cada centímetro com armários superiores e bancada em mármore." },
  { id: "2", url_imagem: montagem03, titulo: "Cozinha Gourmet", subtitulo: "Ambientação moderna com acabamento em vidro reflecta, nichos iluminados e integração com eletrodomésticos embutidos." },
  { id: "3", url_imagem: montagem04, titulo: "Escritório Executivo", subtitulo: "Mesa em L com acabamento amadeirado e detalhes ripados, unindo elegância e funcionalidade para o dia a dia corporativo." },
  { id: "4", url_imagem: montagem06, titulo: "Diretoria Completa", subtitulo: "Projeto completo com painel escuro, vitrines em vidro e bancada extensa para reuniões e atendimento." },
  { id: "5", url_imagem: montagem07, titulo: "Sala de Gerência", subtitulo: "Mobiliário planejado com estante modular, frigobar embutido e mesa em L para máxima produtividade." },
  { id: "6", url_imagem: montagem09, titulo: "Sala de Reuniões", subtitulo: "Mesa de reunião para 10 pessoas com painel em madeira e acabamento premium para ambientes corporativos." },
  { id: "7", url_imagem: montagem10, titulo: "Sala de Conferências", subtitulo: "Projeto com painel ripado para TV, iluminação de LED embutida e mesa modular para videoconferências." },
  { id: "8", url_imagem: montagem11, titulo: "Escritório Premium", subtitulo: "Ambiente completo com estante sob medida, nichos decorativos, vitrines em vidro e mesa executiva." },
];

const getTargetDate = () => {
  const stored = localStorage.getItem("promo_target");
  if (stored) {
    const date = new Date(stored);
    if (date.getTime() > Date.now()) return date;
  }
  const target = new Date(Date.now() + 48 * 60 * 60 * 1000);
  localStorage.setItem("promo_target", target.toISOString());
  return target;
};

const PromotionSection = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [projects, setProjects] = useState<ProjectImage[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("galeria_midia")
        .select("id, url_imagem, titulo, subtitulo")
        .eq("categoria", "projetos")
        .order("ordem", { ascending: true });

      if (error || !data || data.length === 0) {
        setProjects(fallbackProjects);
      } else {
        setProjects(data as ProjectImage[]);
      }
      setLoadingProjects(false);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const target = getTargetDate();
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-cta-orange text-cta-orange-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            Condições por tempo LIMITADO!
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">NOSSOS PROJETOS</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cada projeto é desenvolvido sob medida, com materiais de alta qualidade e acabamento impecável. Confira alguns dos ambientes que já transformamos.
          </p>

          {/* Galeria de Projetos com descrições */}
          {loadingProjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-left">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-xl overflow-hidden border border-border bg-secondary group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={project.url_imagem}
                      alt={project.titulo || "Projeto"}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-1">{project.titulo || "Sem título"}</h3>
                    {project.subtitulo && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{project.subtitulo}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Countdown */}
          <div className="flex justify-center gap-4 mb-10">
            {[
              { label: "Horas", value: pad(timeLeft.hours) },
              { label: "Minutos", value: pad(timeLeft.minutes) },
              { label: "Segundos", value: pad(timeLeft.seconds) },
            ].map((item) => (
              <div key={item.label} className="bg-secondary rounded-xl p-4 min-w-[80px] border border-border">
                <div className="text-3xl md:text-4xl font-bold text-gold">{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
            <div className="flex items-center gap-3 bg-secondary px-6 py-4 rounded-xl border border-border">
              <CreditCard className="w-8 h-8 text-gold" />
              <div className="text-left">
                <div className="font-bold">Pague em até 36X</div>
                <div className="text-sm text-muted-foreground">no boleto</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary px-6 py-4 rounded-xl border border-border">
              <CalendarClock className="w-8 h-8 text-gold" />
              <div className="text-left">
                <div className="font-bold">Entrada para até</div>
                <div className="text-sm text-muted-foreground">90 dias</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
            className="inline-flex items-center gap-2 bg-cta-orange text-cta-orange-foreground font-bold text-lg px-8 py-4 rounded-lg hover:brightness-110 transition-all"
          >
            NÃO PERCA ESSA OPORTUNIDADE
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionSection;
