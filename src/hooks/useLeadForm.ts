import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LeadData {
  nome: string;
  email?: string;
  whatsapp: string;
  local_imovel?: string;
  interesse?: string;
  tem_projeto?: boolean;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
  };
}

async function fireWebhookAsync(leadPayload: Record<string, unknown>) {
  try {
    const { data } = await supabase
      .from("configuracoes")
      .select("webhook_url, webhook_active")
      .eq("id", true)
      .single();

    if (!data?.webhook_active || !data?.webhook_url) return;

    // Fire-and-forget: don't await
    fetch(data.webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload),
    }).catch((err) => console.error("Webhook error:", err));
  } catch (err) {
    console.error("Erro ao verificar webhook:", err);
  }
}

export function useLeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLead = async (data: LeadData) => {
    setLoading(true);
    setError(null);

    const utms = getUtmParams();

    const leadPayload = {
      nome: data.nome,
      email: data.email || null,
      whatsapp: data.whatsapp,
      local_imovel: data.local_imovel || null,
      interesse: data.interesse || null,
      tem_projeto: data.tem_projeto ?? null,
      ...utms,
    };

    const { error: dbError } = await supabase.from("leads").insert(leadPayload);

    setLoading(false);

    if (dbError) {
      console.error("Erro ao salvar lead:", dbError.message);
      setError("Erro ao enviar. Tente novamente.");
      return;
    }

    setSuccess(true);

    // Async webhook – não bloqueia o fluxo do usuário
    fireWebhookAsync({ ...leadPayload, created_at: new Date().toISOString() });

    // Build WhatsApp message with prefix
    const isGads = utms.utm_source === "google" || utms.utm_source === "gads";
    const prefix = isGads ? "*[G-Ads]* " : "";
    const projetoText = data.tem_projeto ? "já tenho" : "não tenho";
    const interesseText = data.interesse || "móveis planejados";

    const msg = `${prefix}Olá! Meu nome é ${data.nome}. Estou buscando ${interesseText} e ${projetoText} projeto. Vim pelo site!`;
    setTimeout(() => {
      window.open(`https://wa.me/5511940059909?text=${encodeURIComponent(msg)}`, "_blank");
    }, 2000);
  };

  return { submitLead, loading, success, error };
}
