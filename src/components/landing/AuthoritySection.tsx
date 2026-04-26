import { motion } from "framer-motion";
import italineaLogo from "@/assets/italinea-logo.png";

const AuthoritySection = () => {
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
            <img
              src={italineaLogo}
              alt="Logo da rede Italínea, parceira da Metta"
              loading="lazy"
              decoding="async"
              className="h-auto w-full max-w-[320px] object-contain md:max-w-[520px] lg:max-w-[640px]"
            />
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
