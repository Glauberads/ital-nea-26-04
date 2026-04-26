import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface SocialConfig {
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  tiktok_url: string;
  twitter_url: string;
}

const defaultConfig: SocialConfig = {
  instagram_url: "",
  facebook_url: "",
  youtube_url: "",
  tiktok_url: "",
  twitter_url: "",
};

const fields: { key: keyof SocialConfig; label: string; placeholder: string }[] = [
  { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/seuperfil" },
  { key: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/suapagina" },
  { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/@seucanal" },
  { key: "tiktok_url", label: "TikTok", placeholder: "https://tiktok.com/@seuperfil" },
  { key: "twitter_url", label: "Twitter / X", placeholder: "https://x.com/seuperfil" },
];

const RedesSociais = () => {
  const [config, setConfig] = useState<SocialConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("instagram_url, facebook_url, youtube_url, tiktok_url, twitter_url")
        .eq("id", true)
        .single();

      if (data) {
        setConfig({
          instagram_url: data.instagram_url ?? "",
          facebook_url: data.facebook_url ?? "",
          youtube_url: data.youtube_url ?? "",
          tiktok_url: data.tiktok_url ?? "",
          twitter_url: data.twitter_url ?? "",
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("configuracoes")
      .update({ ...config, updated_at: new Date().toISOString() })
      .eq("id", true);

    if (error) {
      toast.error("Erro ao salvar configurações.");
    } else {
      toast.success("Redes sociais atualizadas!");
    }
    setSaving(false);
  };

  if (loading) {
    return <p className="text-zinc-500">Carregando...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-100">Redes Sociais</h2>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">Links das Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label>{f.label}</Label>
              <Input
                value={config[f.key]}
                onChange={(e) => setConfig((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RedesSociais;
