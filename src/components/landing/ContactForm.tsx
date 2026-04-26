import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import InputMask from "react-input-mask";
import { useLeadForm } from "@/hooks/useLeadForm";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório").max(100),
  email: z.string().email("E-mail inválido").max(255),
  whatsapp: z.string().min(14, "Telefone inválido"),
  local: z.string().min(1, "Selecione o local"),
});

type FormData = z.infer<typeof schema>;

const ContactForm = () => {
  const defaultTexts = {
    titulo: "Solicite seu orçamento agora mesmo!",
    subtitulo: "Preencha o formulário abaixo que em breve nossa equipe entrará em contato com você!",
    cta: "ENVIAR INTERESSE",
  };

  const [textos, setTextos] = useState(defaultTexts);
  const [locais, setLocais] = useState<{ label: string; value: string }[]>([
    { label: "São Paulo Capital", value: "São Paulo Capital" },
    { label: "Grande SP", value: "Grande SP" },
    { label: "Interior SP", value: "Interior SP" },
    { label: "Outro", value: "Outro" },
  ]);

  useEffect(() => {
    const fetchTextos = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("form_titulo, form_subtitulo, form_cta_texto")
        .eq("id", true)
        .single();
      if (data) {
        setTextos({
          titulo: data.form_titulo || defaultTexts.titulo,
          subtitulo: data.form_subtitulo || defaultTexts.subtitulo,
          cta: data.form_cta_texto || defaultTexts.cta,
        });
      }
    };
    const fetchLocais = async () => {
      const { data } = await supabase
        .from("opcoes_local" as any)
        .select("label, value")
        .eq("ativo", true)
        .order("posicao", { ascending: true });
      if (data && data.length > 0) {
        setLocais(data as any);
      }
    };
    fetchTextos();
    fetchLocais();
  }, []);

  const { submitLead, loading, success } = useLeadForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    submitLead({
      nome: data.nome,
      email: data.email,
      whatsapp: data.whatsapp,
      local_imovel: data.local,
    });
  };

  return (
    <section id="contato" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-8 md:p-10"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <CheckCircle className="w-16 h-16 text-cta-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Recebemos seu contato!</h3>
              <p className="text-muted-foreground">
                Em breve nossa equipe entrará em contato. Redirecionando para o WhatsApp...
              </p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                {textos.titulo}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                {textos.subtitulo}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input
                    {...register("nome")}
                    placeholder="Nome completo"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.nome && <p className="text-destructive text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="E-mail"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <InputMask
                    mask="(99) 99999-9999"
                    {...register("whatsapp")}
                  >
                    {(inputProps: any) => (
                      <input
                        {...inputProps}
                        placeholder="Telefone / WhatsApp"
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </InputMask>
                  {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp.message}</p>}
                </div>
                <div>
                  <select
                    {...register("local")}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue=""
                  >
                    <option value="" disabled>Local do imóvel</option>
                    {locais.map((loc) => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                  {errors.local && <p className="text-destructive text-xs mt-1">{errors.local.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cta-green text-cta-green-foreground font-bold text-lg py-4 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? "ENVIANDO..." : textos.cta}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
