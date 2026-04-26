import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import InputMask from "react-input-mask";
import { supabase } from "@/integrations/supabase/client";

interface InterestOption {
  label: string;
  value: string;
  emoji: string | null;
}

const fallbackOptions: InterestOption[] = [
  { label: "Cozinha Planejada", value: "cozinha planejada", emoji: "🍳" },
  { label: "Apartamento Completo", value: "moveis planejados para apartamento", emoji: "🏢" },
  { label: "Dormitório/Sala", value: "dormitório e sala", emoji: "🏠" },
  { label: "Outros Ambientes", value: "outros ambientes", emoji: "🛋️" },
];

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
  };
}

function buildWhatsAppUrl(nome: string, interesse: string, temProjeto: boolean, isExitIntent: boolean) {
  const utms = getUtmParams();
  const isGads = utms.utm_source === "google" || utms.utm_source === "gads";

  let prefix = "";
  if (isGads && isExitIntent) {
    prefix = "*[G-Ads | Recuperação]* ";
  } else if (isGads) {
    prefix = "*[G-Ads]* ";
  }

  const projetoText = temProjeto ? "já tenho" : "não tenho";
  const msg = `${prefix}Olá! Meu nome é ${nome}. Estou buscando ${interesse} e ${projetoText} projeto. Vim pelo site!`;
  return `https://wa.me/5511940059909?text=${encodeURIComponent(msg)}`;
}

const defaultTexts = {
  modal_titulo: "Espere! Não vá embora 🚀",
  modal_subtitulo: "Preencha e receba atendimento prioritário pelo WhatsApp",
  modal_cta_texto: "INICIAR PROJETO",
};

const LeadQualificationModal = () => {
  const [open, setOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [interesse, setInteresse] = useState("");
  const [temProjeto, setTemProjeto] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interestOptions, setInterestOptions] = useState<InterestOption[]>(fallbackOptions);
  const [textos, setTextos] = useState(defaultTexts);
  const [clienteExistente, setClienteExistente] = useState(false);
  const [checkingLead, setCheckingLead] = useState(false);
  const [webhookGetConfig, setWebhookGetConfig] = useState<{ url: string; active: boolean }>({ url: "", active: false });

  useEffect(() => {
    const fetchData = async () => {
      const [optRes, configRes] = await Promise.all([
        supabase.from("opcoes_formulario").select("label, value, emoji").eq("ativo", true).order("posicao", { ascending: true }),
        supabase.from("configuracoes").select("modal_titulo, modal_subtitulo, modal_cta_texto, webhook_get_url, webhook_get_active").eq("id", true).single(),
      ]);
      if (optRes.data && optRes.data.length > 0) setInterestOptions(optRes.data);
      if (configRes.data) {
        setTextos({
          modal_titulo: configRes.data.modal_titulo || defaultTexts.modal_titulo,
          modal_subtitulo: configRes.data.modal_subtitulo || defaultTexts.modal_subtitulo,
          modal_cta_texto: configRes.data.modal_cta_texto || defaultTexts.modal_cta_texto,
        });
        setWebhookGetConfig({
          url: configRes.data.webhook_get_url || "",
          active: configRes.data.webhook_get_active ?? false,
        });
      }
    };
    fetchData();
  }, []);
  const openModal = useCallback((exitIntent = false) => {
    // If lead already submitted, go straight to WhatsApp
    const saved = localStorage.getItem("lead_saved");
    if (saved) {
      const data = JSON.parse(saved);
      window.open(buildWhatsAppUrl(data.nome, data.interesse || "móveis planejados", data.temProjeto ?? false, exitIntent), "_blank");
      return;
    }
    setIsExitIntent(exitIntent);
    setOpen(true);
  }, []);

  // Listen for custom event from CTA buttons
  useEffect(() => {
    const handler = () => openModal(false);
    window.addEventListener("openLeadModal", handler);
    return () => window.removeEventListener("openLeadModal", handler);
  }, [openModal]);

  // Exit intent
  useEffect(() => {
    if (sessionStorage.getItem("exit_shown")) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        openModal(true);
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
  }, [openModal]);

  const handleWhatsAppBlur = async () => {
    const digits = whatsapp.replace(/\D/g, "");
    if (!webhookGetConfig.active || !webhookGetConfig.url || digits.length < 11) return;

    setCheckingLead(true);
    try {
      const res = await fetch(`${webhookGetConfig.url}?whatsapp=${digits}`);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && !data.fallback && (data.clientExists || data.existe || data.found)) {
          setClienteExistente(true);
        }
      }
    } catch (err) {
      console.warn("Consulta GET falhou, prosseguindo normalmente:", err);
    }
    setCheckingLead(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (nome.trim().length < 2) e.nome = "Nome é obrigatório";
    if (whatsapp.replace(/\D/g, "").length < 11) e.whatsapp = "WhatsApp inválido";
    if (!interesse) e.interesse = "Selecione um interesse";
    if (temProjeto === null) e.temProjeto = "Selecione uma opção";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const utms = getUtmParams();
    await supabase.from("leads").insert({
      nome,
      whatsapp,
      interesse,
      tem_projeto: temProjeto,
      ...utms,
    });

    localStorage.setItem("lead_saved", JSON.stringify({ nome, interesse, temProjeto }));
    setLoading(false);
    setOpen(false);
    window.open(buildWhatsAppUrl(nome, interesse, temProjeto!, isExitIntent), "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(9,9,11,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border p-6 md:p-8 relative"
            style={{ backgroundColor: "hsl(240 6% 6%)", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1 text-foreground">
              {isExitIntent ? textos.modal_titulo : "Solicite seu Orçamento"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {textos.modal_subtitulo}
            </p>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.nome && <p className="text-destructive text-xs mt-1">{errors.nome}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <InputMask
                  mask="(99) 99999-9999"
                  value={whatsapp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setWhatsapp(e.target.value); setClienteExistente(false); }}
                  onBlur={handleWhatsAppBlur}
                >
                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                    <input
                      {...inputProps}
                      placeholder="WhatsApp (99) 99999-9999"
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </InputMask>
                {checkingLead && <p className="text-xs text-muted-foreground mt-1">Verificando...</p>}
                {clienteExistente && (
                  <p className="text-xs text-cta-green mt-1">
                    ✅ Identificamos que você já é nosso cliente! Redirecionando para o seu consultor...
                  </p>
                )}
                {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp}</p>}
              </div>

              {/* Interesse */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">O que você busca?</p>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setInteresse(opt.value)}
                      className={`text-left text-sm px-3 py-2.5 rounded-xl border transition-all ${
                        interesse === opt.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
                {errors.interesse && <p className="text-destructive text-xs mt-1">{errors.interesse}</p>}
              </div>

              {/* Tem projeto */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Você já tem projeto?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "✅ Já tenho projeto", value: true },
                    { label: "📐 Não tenho projeto", value: false },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setTemProjeto(opt.value)}
                      className={`text-sm px-3 py-2.5 rounded-xl border transition-all ${
                        temProjeto === opt.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.temProjeto && <p className="text-destructive text-xs mt-1">{errors.temProjeto}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-cta-green text-cta-green-foreground font-bold text-lg py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? "ENVIANDO..." : textos.modal_cta_texto}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                🚀 Atendimento prioritário em menos de 5 min
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadQualificationModal;
