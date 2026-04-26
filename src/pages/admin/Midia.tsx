import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Trash2, Upload, Loader2, Pencil, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type MidiaItem = Tables<"galeria_midia">;

const Midia = () => {
  const [items, setItems] = useState<MidiaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [categoria, setCategoria] = useState("projetos");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editSubtitulo, setEditSubtitulo] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("galeria_midia")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar imagens", description: error.message, variant: "destructive" });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Selecione uma imagem", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storagePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("galeria")
        .upload(storagePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("galeria")
        .getPublicUrl(storagePath);

      const { error: insertError } = await supabase
        .from("galeria_midia")
        .insert({
          url_imagem: urlData.publicUrl,
          titulo: titulo || null,
          subtitulo: subtitulo || null,
          categoria,
          storage_path: storagePath,
          ordem: items.length,
        });

      if (insertError) throw insertError;

      toast({ title: "Imagem enviada com sucesso!" });
      setTitulo("");
      setSubtitulo("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCategoria("projetos");
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      fetchItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ title: "Erro no upload", description: message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MidiaItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      if (item.storage_path) {
        await supabase.storage.from("galeria").remove([item.storage_path]);
      }
      const { error } = await supabase.from("galeria_midia").delete().eq("id", item.id);
      if (error) throw error;
      toast({ title: "Imagem excluída" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ title: "Erro ao excluir", description: message, variant: "destructive" });
      fetchItems();
    }
  };

  const startEditing = (item: MidiaItem) => {
    setEditingId(item.id);
    setEditTitulo(item.titulo || "");
    setEditSubtitulo(item.subtitulo || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitulo("");
    setEditSubtitulo("");
  };

  const saveEditing = async (id: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("galeria_midia")
        .update({ titulo: editTitulo || null, subtitulo: editSubtitulo || null })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Atualizado com sucesso!" });
      setEditingId(null);
      fetchItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ title: "Erro ao salvar", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Gestão de Mídia</h2>

      {/* Upload Form */}
      <Card className="bg-zinc-900 border-zinc-800 mb-6">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg flex items-center gap-2">
            <Upload className="w-5 h-5" /> Upload de Imagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Imagem</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Título</Label>
              <Input
                placeholder="Ex: Cozinha Gourmet"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Descrição</Label>
            <Textarea
              placeholder="Ex: Ambientação moderna com acabamento em vidro..."
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-zinc-400">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="showroom">Showroom</SelectItem>
                  <SelectItem value="projetos">Projetos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full md:w-auto">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? "Enviando..." : "Enviar Imagem"}
            </Button>
          </div>
          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Preview" className="h-32 rounded-lg object-cover" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Imagens Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg bg-zinc-800" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Nenhuma imagem cadastrada</p>
              <p className="text-sm mt-1">Use o formulário acima para adicionar imagens.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-800/50">
                  <img
                    src={item.url_imagem}
                    alt={item.titulo || "Imagem"}
                    className="w-full h-40 object-cover"
                  />
                  {editingId === item.id ? (
                    <div className="p-3 space-y-2">
                      <Input
                        value={editTitulo}
                        onChange={(e) => setEditTitulo(e.target.value)}
                        placeholder="Título"
                        className="bg-zinc-700 border-zinc-600 text-zinc-200 text-sm"
                      />
                      <Textarea
                        value={editSubtitulo}
                        onChange={(e) => setEditSubtitulo(e.target.value)}
                        placeholder="Descrição"
                        className="bg-zinc-700 border-zinc-600 text-zinc-200 text-sm resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEditing(item.id)} disabled={saving} className="flex-1">
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing} className="border-zinc-600">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      <p className="text-zinc-200 text-sm font-semibold truncate">{item.titulo || "Sem título"}</p>
                      {item.subtitulo && (
                        <p className="text-zinc-400 text-xs mt-0.5 line-clamp-2">{item.subtitulo}</p>
                      )}
                      <span className="text-xs text-zinc-500 bg-zinc-700/80 px-2 py-0.5 rounded mt-2 inline-block">
                        {item.categoria}
                      </span>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => startEditing(item)} className="flex-1 border-zinc-600 text-zinc-300">
                          <Pencil className="w-3 h-3 mr-1" /> Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Midia;
