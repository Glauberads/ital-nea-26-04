import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";

interface PersonalizacaoConfig {
  header_logo_url: string;
  about_logo_url: string;
  about_factory_url: string;
  about_metta_logo_url: string;
  authority_logo_url: string;
  header_logo_white: boolean;
  about_logo_white: boolean;
  hero_headline: string;
  hero_headline_highlight: string;
  hero_subtitle: string;
}

const defaultConfig: PersonalizacaoConfig = {
  header_logo_url: "",
  about_logo_url: "",
  about_factory_url: "",
  about_metta_logo_url: "",
  authority_logo_url: "",
  header_logo_white: true,
  about_logo_white: false,
  hero_headline: "",
  hero_headline_highlight: "",
  hero_subtitle: "",
};

type UploadSlot = "header" | "about" | "factory" | "metta" | "authority";

const slotToField: Record<UploadSlot, keyof PersonalizacaoConfig> = {
  header: "header_logo_url",
  about: "about_logo_url",
  factory: "about_factory_url",
  metta: "about_metta_logo_url",
  authority: "authority_logo_url",
};

const Personalizacao = () => {
  const [config, setConfig] = useState<PersonalizacaoConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadSlot | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("*")
        .eq("id", true)
        .single();

      if (data) {
        setConfig({
          header_logo_url: (data as any).header_logo_url || "",
          about_logo_url: (data as any).about_logo_url || "",
          about_factory_url: (data as any).about_factory_url || "",
          about_metta_logo_url: (data as any).about_metta_logo_url || "",
          authority_logo_url: (data as any).authority_logo_url || "",
          header_logo_white: (data as any).header_logo_white ?? true,
          about_logo_white: (data as any).about_logo_white ?? true,
          hero_headline: (data as any).hero_headline || "",
          hero_headline_highlight: (data as any).hero_headline_highlight || "",
          hero_subtitle: (data as any).hero_subtitle || "",
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const uploadLogo = async (file: File, slot: UploadSlot) => {
    setUploading(slot);
    try {
      const ext = file.name.split(".").pop();
      const path = `${slot}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
      setConfig((c) => ({
        ...c,
        [slotToField[slot]]: pub.publicUrl,
      }));
      toast.success("Imagem enviada! Clique em salvar para aplicar.");
    } catch (e: any) {
      toast.error("Erro no upload: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("configuracoes")
      .update({
        header_logo_url: config.header_logo_url,
        about_logo_url: config.about_logo_url,
        about_factory_url: config.about_factory_url,
        about_metta_logo_url: config.about_metta_logo_url,
        authority_logo_url: config.authority_logo_url,
        header_logo_white: config.header_logo_white,
        about_logo_white: config.about_logo_white,
        hero_headline: config.hero_headline,
        hero_headline_highlight: config.hero_headline_highlight,
        hero_subtitle: config.hero_subtitle,
      } as any)
      .eq("id", true);

    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success("Personalização salva!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const ImageUploader = ({
    slot,
    label,
    url,
    white,
    onWhiteChange,
    showWhiteToggle = true,
  }: {
    slot: UploadSlot;
    label: string;
    url: string;
    white?: boolean;
    onWhiteChange?: (v: boolean) => void;
    showWhiteToggle?: boolean;
  }) => (
    <div className="space-y-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
      <Label className="text-zinc-200 font-semibold">{label}</Label>
      <div
        className={`h-32 rounded-md flex items-center justify-center overflow-hidden ${
          white ? "bg-zinc-800" : "bg-white"
        }`}
      >
        {url ? (
          <img
            src={url}
            alt={label}
            className={`max-h-full max-w-full object-contain ${
              white ? "brightness-0 invert" : ""
            }`}
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-zinc-500" />
        )}
      </div>

      {showWhiteToggle && onWhiteChange && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Exibir em branco</span>
          <Switch checked={white} onCheckedChange={onWhiteChange} />
        </div>
      )}

      <div className="flex gap-2">
        <Input
          type="file"
          accept="image/*"
          disabled={uploading === slot}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadLogo(f, slot);
          }}
          className="bg-zinc-900 border-zinc-700 text-zinc-100 file:text-zinc-100"
        />
        {uploading === slot && (
          <Loader2 className="w-5 h-5 animate-spin text-primary self-center" />
        )}
      </div>
      <Input
        value={url}
        onChange={(e) =>
          setConfig((c) => ({
            ...c,
            [slotToField[slot]]: e.target.value,
          }))
        }
        placeholder="ou cole uma URL"
        className="bg-zinc-900 border-zinc-700 text-zinc-100"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Personalização</h1>
        <p className="text-zinc-400 text-sm">
          Edite as logos, imagens e a headline principal do site.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <Upload className="w-5 h-5" /> Logos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <ImageUploader
            slot="header"
            label="Logo do Cabeçalho"
            url={config.header_logo_url}
            white={config.header_logo_white}
            onWhiteChange={(v) =>
              setConfig((c) => ({ ...c, header_logo_white: v }))
            }
          />
          <ImageUploader
            slot="about"
            label="Logo Sobre Nós (Italínea)"
            url={config.about_logo_url}
            white={config.about_logo_white}
            onWhiteChange={(v) =>
              setConfig((c) => ({ ...c, about_logo_white: v }))
            }
          />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Seção Sobre Nós
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <ImageUploader
            slot="factory"
            label="Imagem da Fábrica / Showroom"
            url={config.about_factory_url}
            showWhiteToggle={false}
          />
          <ImageUploader
            slot="metta"
            label="Logo Metta Planejados"
            url={config.about_metta_logo_url}
            showWhiteToggle={false}
          />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Seção Nossa Rede
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            slot="authority"
            label="Logo Italínea (Nossa Rede)"
            url={config.authority_logo_url}
            showWhiteToggle={false}
          />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Headline Principal (Hero)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Headline</Label>
            <Input
              value={config.hero_headline}
              onChange={(e) =>
                setConfig((c) => ({ ...c, hero_headline: e.target.value }))
              }
              className="bg-zinc-950 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Destaque (segunda linha)</Label>
            <Input
              value={config.hero_headline_highlight}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  hero_headline_highlight: e.target.value,
                }))
              }
              className="bg-zinc-950 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Subtítulo</Label>
            <Input
              value={config.hero_subtitle}
              onChange={(e) =>
                setConfig((c) => ({ ...c, hero_subtitle: e.target.value }))
              }
              className="bg-zinc-950 border-zinc-700 text-zinc-100"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary hover:bg-primary/90"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Salvar alterações
      </Button>
    </div>
  );
};

export default Personalizacao;
