import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, Pencil, X } from "lucide-react";

interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  data_exibicao: string | null;
  ordem: number;
  is_public: boolean;
}

const Depoimentos = () => {
  const [items, setItems] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", texto: "", data_exibicao: "" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("depoimentos" as any)
      .select("*")
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar depoimentos");
    else setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({ nome: "", texto: "", data_exibicao: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.texto.trim()) {
      toast.error("Nome e texto são obrigatórios");
      return;
    }
    setSaving(true);
    if (editingId) {
      const { error } = await supabase
        .from("depoimentos" as any)
        .update({
          nome: form.nome,
          texto: form.texto,
          data_exibicao: form.data_exibicao || null,
        })
        .eq("id", editingId);
      if (error) toast.error("Erro ao atualizar");
      else toast.success("Depoimento atualizado");
    } else {
      const { error } = await supabase.from("depoimentos" as any).insert({
        nome: form.nome,
        texto: form.texto,
        data_exibicao: form.data_exibicao || null,
        ordem: items.length + 1,
      });
      if (error) toast.error("Erro ao criar");
      else toast.success("Depoimento criado");
    }
    setSaving(false);
    resetForm();
    fetchItems();
  };

  const handleEdit = (d: Depoimento) => {
    setEditingId(d.id);
    setForm({
      nome: d.nome,
      texto: d.texto,
      data_exibicao: d.data_exibicao || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este depoimento?")) return;
    const { error } = await supabase.from("depoimentos" as any).delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Depoimento excluído");
      fetchItems();
    }
  };

  const togglePublic = async (id: string, value: boolean) => {
    const { error } = await supabase
      .from("depoimentos" as any)
      .update({ is_public: value })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar visibilidade");
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_public: value } : i)));
      toast.success(value ? "Tornado público" : "Tornado privado");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Depoimentos</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Gerencie os depoimentos exibidos na landing page.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-lg">
            {editingId ? "Editar depoimento" : "Novo depoimento"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Nome do cliente</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Maria S."
                className="bg-zinc-950 border-zinc-800 text-zinc-100"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Data exibida</Label>
              <Input
                value={form.data_exibicao}
                onChange={(e) => setForm({ ...form, data_exibicao: e.target.value })}
                placeholder="Há 2 semanas"
                className="bg-zinc-950 border-zinc-800 text-zinc-100"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-300">Texto do depoimento</Label>
            <Textarea
              value={form.texto}
              onChange={(e) => setForm({ ...form, texto: e.target.value })}
              rows={3}
              placeholder="Excelente atendimento..."
              className="bg-zinc-950 border-zinc-800 text-zinc-100"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {editingId ? "Atualizar" : "Adicionar"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-lg">Lista de depoimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-6">Nenhum depoimento cadastrado.</p>
          ) : (
            <div className="space-y-3">
              {items.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-zinc-100">{d.nome}</span>
                      <span className="text-xs text-zinc-500">{d.data_exibicao}</span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2">{d.texto}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={d.is_public}
                        onCheckedChange={(v) => togglePublic(d.id, v)}
                      />
                      <span className="text-xs text-zinc-400 w-14">
                        {d.is_public ? "Público" : "Privado"}
                      </span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(d)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(d.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Depoimentos;
