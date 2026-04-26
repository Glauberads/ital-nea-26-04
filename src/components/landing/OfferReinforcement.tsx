import { motion } from "framer-motion";
import { CreditCard, CalendarClock } from "lucide-react";

const OfferReinforcement = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Os móveis planejados dos seus sonhos <span className="text-gold">estão aqui!</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-gold" />
              <span>Pagamento em até 36x no boleto</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarClock className="w-6 h-6 text-gold" />
              <span>Entrada em até 90 dias</span>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
            className="inline-flex items-center gap-2 bg-cta-green text-cta-green-foreground font-bold text-lg px-8 py-4 rounded-lg hover:brightness-110 transition-all"
          >
            QUERO MEU ORÇAMENTO
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferReinforcement;
