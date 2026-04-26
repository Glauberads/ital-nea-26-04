import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Loader2, Send, Webhook, MapPin } from "lucide-react";

interface MarketingConfig {
  google_ads_id: string;
  google_ads_label: string;
  facebook_pixel_id: string;
  gtm_id: string;
  modal_titulo: string;
  modal_subtitulo: string;
  modal_cta_texto: string;
  webhook_url: string;
  webhook_active: boolean;
  webhook_get_url: string;
  webhook_get_active: boolean;
  maps_embed_url: string;
}

const defaultConfig: MarketingConfig = {
  google_ads_id: "",
  google_ads_label: "",
  facebook_pixel_id: "",
  gtm_id: "",
  modal_titulo: "",
  modal_subtitulo: "",
  modal_cta_texto: "",
  webhook_url: "",
  webhook_active: false,
  webhook_get_url: "",
  webhook_get_active: false,
  maps_embed_url: "",
};

const Marketing = () => {
  const [config, setConfig] = useState<MarketingConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .eq("id", true)
        .single();

      if (!error && data) {
        setConfig({
          google_ads_id: data.google_ads_id || "",
          google_ads_label: data.google_ads_label || "",
          facebook_pixel_id: data.facebook_pixel_id || "",
          gtm_id: (data as any).gtm_id || "",
          modal_titulo: data.modal_titulo || "",
          modal_subtitulo: data.modal_subtitulo || "",
          modal_cta_texto: data.modal_cta_texto || "",
          webhook_url: data.webhook_url || "",
          webhook_active: data.webhook_active ?? false,
          webhook_get_url: data.webhook_get_url || "",
          webhook_get_active: data.webhook_get_active ?? false,
          maps_embed_url: data.maps_embed_url || "",
        });
      }
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("configuracoes")
      .update({
        google_ads_id: config.google_ads_id,
        google_ads_label: config.google_ads_label,
        facebook_pixel_id: config.facebook_pixel_id,
        gtm_id: config.gtm_id,
        modal_titulo: config.modal_titulo,
        modal_subtitulo: config.modal_subtitulo,
        modal_cta_texto: config.modal_cta_texto,
        webhook_url: config.webhook_url,
        webhook_active: config.webhook_active,
        webhook_get_url: config.webhook_get_url,
        webhook_get_active: config.webhook_get_active,
        maps_embed_url: config.maps_embed_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);

    setSaving(false);

    if (error) {
      toast.error("Erro ao salvar configurações.");
      console.error(error);
    } else {
      toast.success("Configurações salvas com sucesso!");
    }
  };

  const handleTestWebhook = async () => {
    if (!config.webhook_url) {
      toast.error("Informe a URL do Webhook antes de testar.");
      return;
    }

    setTesting(true);

    const samplePayload = {
      test: true,
      nome: "Lead de Teste",
      whatsapp: "11999999999",
      email: "teste@exemplo.com",
      interesse: "Cozinha Planejada",
      local_imovel: "São Paulo - SP",
      tem_projeto: false,
      utm_source: "teste",
      utm_medium: "webhook",
      utm_campaign: "teste_admin",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(config.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      });

      if (res.ok) {
        toast.success(`Webhook respondeu com sucesso! Status: ${res.status}`);
      } else {
        toast.error(`Webhook retornou erro. Status: ${res.status}`);
      }
    } catch (err) {
      console.error("Erro ao testar webhook:", err);
      toast.error("Falha ao conectar com o Webhook. Verifique a URL.");
    }

    setTesting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Configurações de Marketing</h2>

      <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">Rastreamento & Pixels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-300">ID do Google Ads</Label>
            <Input
              value={config.google_ads_id}
              onChange={(e) => setConfig({ ...config, google_ads_id: e.target.value })}
              placeholder="AW-123456789"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">Formato: AW-XXXXXXXXX</p>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Label de Conversão do Google Ads</Label>
            <Input
              value={config.google_ads_label}
              onChange={(e) => setConfig({ ...config, google_ads_label: e.target.value })}
              placeholder="AbCdEfGhIjK"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">ID do Pixel do Facebook</Label>
            <Input
              value={config.facebook_pixel_id}
              onChange={(e) => setConfig({ ...config, facebook_pixel_id: e.target.value })}
              placeholder="123456789012345"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Google Tag Manager ID</Label>
            <Input
              value={config.gtm_id}
              onChange={(e) => setConfig({ ...config, gtm_id: e.target.value.trim() })}
              placeholder="GTM-XXXXXXX"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">
              Formato: GTM-XXXXXXX. O script será injetado automaticamente apenas na landing page pública.
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Salvando..." : "Salvar Rastreamento & Pixels"}
          </Button>

          <div className="border-t border-zinc-800 pt-6 mt-2" />
          <p className="text-zinc-300 text-lg font-semibold mb-4">Textos do Modal de Orçamento</p>

          <div className="space-y-2">
            <Label className="text-zinc-300">Título do Modal (Exit Intent)</Label>
            <Input
              value={config.modal_titulo}
              onChange={(e) => setConfig({ ...config, modal_titulo: e.target.value })}
              placeholder="Espere! Não vá embora 🚀"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Subtítulo do Modal</Label>
            <Input
              value={config.modal_subtitulo}
              onChange={(e) => setConfig({ ...config, modal_subtitulo: e.target.value })}
              placeholder="Preencha e receba atendimento prioritário pelo WhatsApp"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Texto do Botão CTA</Label>
            <Input
              value={config.modal_cta_texto}
              onChange={(e) => setConfig({ ...config, modal_cta_texto: e.target.value })}
              placeholder="INICIAR PROJETO"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>

      {/* Webhook Section */}
      <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Automações e Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-300">URL do Webhook (POST)</Label>
            <Input
              value={config.webhook_url}
              onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })}
              placeholder="https://hooks.zapier.com/... ou https://n8n.exemplo.com/webhook/..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">
              Os dados do lead serão enviados via POST em JSON assim que o formulário for submetido.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Ativar envio automático</Label>
              <p className="text-xs text-zinc-500 mt-1">
                Quando ativo, cada novo lead será enviado para a URL configurada.
              </p>
            </div>
            <Switch
              checked={config.webhook_active}
              onCheckedChange={(checked) => setConfig({ ...config, webhook_active: checked })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Salvando..." : "Salvar Webhook"}
            </Button>

            <Button
              variant="outline"
              onClick={handleTestWebhook}
              disabled={testing || !config.webhook_url}
              className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {testing ? "Enviando..." : "Testar Webhook"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook GET Section */}
      <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Consulta de Leads Existentes (GET)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
            <p className="text-sm text-zinc-300 font-medium mb-1">💡 Como funciona?</p>
            <p className="text-xs text-zinc-500">
              Se ativo, o sistema consultará esta URL via <strong className="text-zinc-400">GET</strong> passando os dados como <strong className="text-zinc-400">query params</strong>. Exemplo:
            </p>
            <code className="block text-xs text-zinc-400 bg-zinc-900 rounded px-3 py-2 mt-2 break-all">
              https://sua-url.com/check-lead?whatsapp=11999999999
            </code>
            <p className="text-xs text-zinc-500 mt-2">
              Configure seu servidor ou automação (ex: n8n, Make, Zapier) para receber o parâmetro <code className="text-zinc-400">whatsapp</code> via query string.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">URL de Consulta (GET)</Label>
            <Input
              value={config.webhook_get_url}
              onChange={(e) => setConfig({ ...config, webhook_get_url: e.target.value })}
              placeholder="https://api.exemplo.com/check-lead"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">
              A URL receberá: <code className="text-zinc-400">?whatsapp=11999999999</code>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Habilitar Consulta</Label>
              <p className="text-xs text-zinc-500 mt-1">
                Quando ativo, ao preencher o WhatsApp no modal, o sistema verificará se o lead já existe.
              </p>
            </div>
            <Switch
              checked={config.webhook_get_active}
              onCheckedChange={(checked) => setConfig({ ...config, webhook_get_active: checked })}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Salvando..." : "Salvar Consulta GET"}
          </Button>
        </CardContent>
      </Card>

      {/* Localização / Google Maps */}
      <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização da Loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
            <p className="text-sm text-zinc-300 font-medium mb-1">📍 Como obter o link?</p>
            <p className="text-xs text-zinc-500">
              Vá ao <strong className="text-zinc-400">Google Maps</strong> → Clique em <strong className="text-zinc-400">Compartilhar</strong> → <strong className="text-zinc-400">Incorporar um mapa</strong> e cole o código HTML completo ou apenas o link aqui.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Link de Incorporação do Google Maps</Label>
            <Textarea
              value={config.maps_embed_url}
              onChange={(e) => setConfig({ ...config, maps_embed_url: e.target.value })}
              placeholder='Cole aqui o iframe ou URL do Google Maps. Ex: <iframe src="https://www.google.com/maps/embed?..." ...'
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[100px]"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            {saving ? "Salvando..." : "Atualizar Mapa"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketing;
