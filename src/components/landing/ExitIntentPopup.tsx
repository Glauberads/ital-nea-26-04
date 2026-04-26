import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLeadForm } from "@/hooks/useLeadForm";

const schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "Telefone inválido"),
});

type FormData = z.infer<typeof schema>;

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const { submitLead, loading, success } = useLeadForm();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (sessionStorage.getItem("exit_shown")) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setShow(true);
        sessionStorage.setItem("exit_shown", "1");
        document.removeEventListener("mouseout", handler);
      }
    };
    const timeout = setTimeout(() => {
      document.addEventListener("mouseout", handler);
    }, 5000);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseout", handler);
    };
  }, []);

  const onSubmit = (data: FormData) => {
    submitLead({
      nome: data.nome,
      email: data.email,
      whatsapp: data.whatsapp,
    });
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => setShow(false), 3000);
    }
  }, [success]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl overflow-hidden max-w-2xl w-full grid md:grid-cols-2"
          >
            <div
              className="hidden md:block bg-cover bg-center min-h-[300px]"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80')" }}
            />
            <div className="p-6 md:p-8 relative">
              <button
                onClick={() => setShow(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              {success ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-bold mb-2">Obrigado!</h3>
                  <p className="text-sm text-muted-foreground">Redirecionando para o WhatsApp...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">NÃO VÁ EMBORA AGORA!</h3>
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">
                    APROVEITE AS CONDIÇÕES EXCLUSIVAS
                  </span>
                  <p className="text-sm text-muted-foreground mb-5">
                    Preencha seus dados que te retornaremos em breve!
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                      <input
                        {...register("nome")}
                        placeholder="Nome"
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.nome && <p className="text-destructive text-xs mt-1">{errors.nome.message}</p>}
                    </div>
                    <div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="E-mail"
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <input
                        {...register("whatsapp")}
                        placeholder="WhatsApp"
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-cta-green text-cta-green-foreground font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {loading ? "ENVIANDO..." : "ENVIAR INTERESSE"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
