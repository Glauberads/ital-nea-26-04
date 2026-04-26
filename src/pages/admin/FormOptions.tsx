import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Save, Loader2 } from "lucide-react";

interface OpcaoFormulario {
  id: string;
  label: string;
  value: string;
  emoji: string | null;
  posicao: number;
  ativo: boolean;
}

interface OpcaoLocal {
  id: string;
  label: string;
  value: string;
  posicao: number;
  ativo: boolean;
}

const FormOptions = () => {
  const [opcoes, setOpcoes] = useState<OpcaoFormulario[]>([]);
  const [locais, setLocais] = useState<OpcaoLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocais, setLoadingLocais] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [formTitulo, setFormTitulo] = useState("");
  const [formSubtitulo, setFormSubtitulo] = useState("");
  const [formCta, setFormCta] = useState("");
  const [savingTexts, setSavingTexts] = useState(false);
  const [newLocalLabel, setNewLocalLabel] = useState("");
  const [newLocalValue, setNewLocalValue] = useState("");
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);
  const [editLocalLabel, setEditLocalLabel] = useState("");
  const [editLocalValue, setEditLocalValue] = useState("");

  const fetchOpcoes = async () => {
    const { data, error } = await supabase
      .from("opcoes_formulario")
      .select("*")
      .order("posicao", { ascending: true });
    if (!error && data) setOpcoes(data);
    setLoading(false);
  };

  const fetchLocais = async () => {
    const { data, error } = await supabase
      .from("opcoes_local" as any)
      .select("*")
      .order("posicao", { ascending: true });
    if (!error && data) setLocais(data as any);
    setLoadingLocais(false);
  };

  const fetchTextos = async () => {
    const { data } = await supabase
      .from("configuracoes")
      .select("form_titulo, form_subtitulo, form_cta_texto")
      .eq("id", true)
      .single();
    if (data) {
      setFormTitulo(data.form_titulo || "");
      setFormSubtitulo(data.form_subtitulo || "");
      setFormCta(data.form_cta_texto || "");
    }
  };

  useEffect(() => { fetchOpcoes(); fetchTextos(); fetchLocais(); }, []);

  const handleAdd = async () => {
    if (!newLabel.trim() || !newValue.trim()) {
      toast.error("Preencha nome e valor da opção");
      return;
    }
    const nextPos = opcoes.length > 0 ? Math.max(...opcoes.map(o => o.posicao)) + 1 : 0;
    const { error } = await supabase.from("opcoes_formulario").insert({
      label: newLabel.trim(),
      value: newValue.trim(),
      emoji: newEmoji.trim() || "📦",
      posicao: nextPos,
    });
    if (error) { toast.error("Erro ao adicionar"); return; }
    toast.success("Opção adicionada!");
    setNewLabel(""); setNewValue(""); setNewEmoji("");
    fetchOpcoes();
  };

  const handleToggle = async (id: string, ativo: boolean) => {
    const { error } = await supabase.from("opcoes_formulario").update({ ativo: !ativo }).eq("id", id);
    if (error) { toast.error("Erro ao atualizar"); return; }
    setOpcoes(prev => prev.map(o => o.id === id ? { ...o, ativo: !ativo } : o));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("opcoes_formulario").delete().eq("id", id);
    if (error) { toast.error("Erro ao remover"); return; }
    toast.success("Opção removida");
    setOpcoes(prev => prev.filter(o => o.id !== id));
  };

  const startEdit = (o: OpcaoFormulario) => {
    setEditingId(o.id);
    setEditLabel(o.label);
    setEditValue(o.value);
    setEditEmoji(o.emoji || "");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("opcoes_formulario").update({
      label: editLabel.trim(),
      value: editValue.trim(),
      emoji: editEmoji.trim() || "📦",
    }).eq("id", editingId);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Opção atualizada!");
    setEditingId(null);
    fetchOpcoes();
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const updated = [...opcoes];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    const promises = updated.map((o, i) =>
      supabase.from("opcoes_formulario").update({ posicao: i }).eq("id", o.id)
    );
    await Promise.all(promises);
    setOpcoes(updated.map((o, i) => ({ ...o, posicao: i })));
  };

  const moveDown = async (index: number) => {
    if (index >= opcoes.length - 1) return;
    const updated = [...opcoes];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    const promises = updated.map((o, i) =>
      supabase.from("opcoes_formulario").update({ posicao: i }).eq("id", o.id)
    );
    await Promise.all(promises);
    setOpcoes(updated.map((o, i) => ({ ...o, posicao: i })));
  };

  const handleSaveTexts = async () => {
    setSavingTexts(true);
    const { error } = await supabase
      .from("configuracoes")
      .update({
        form_titulo: formTitulo,
        form_subtitulo: formSubtitulo,
        form_cta_texto: formCta,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);
    setSavingTexts(false);
    if (error) { toast.error("Erro ao salvar textos"); } else { toast.success("Textos salvos!"); }
  };

  // --- Local options CRUD ---
  const handleAddLocal = async () => {
    if (!newLocalLabel.trim() || !newLocalValue.trim()) {
      toast.error("Preencha nome e valor do local");
      return;
    }
    const nextPos = locais.length > 0 ? Math.max(...locais.map(o => o.posicao)) + 1 : 0;
    const { error } = await (supabase.from("opcoes_local" as any) as any).insert({
      label: newLocalLabel.trim(),
      value: newLocalValue.trim(),
      posicao: nextPos,
    });
    if (error) { toast.error("Erro ao adicionar local"); return; }
    toast.success("Local adicionado!");
    setNewLocalLabel(""); setNewLocalValue("");
    fetchLocais();
  };

  const handleToggleLocal = async (id: string, ativo: boolean) => {
    const { error } = await (supabase.from("opcoes_local" as any) as any).update({ ativo: !ativo }).eq("id", id);
    if (error) { toast.error("Erro ao atualizar"); return; }
    setLocais(prev => prev.map(o => o.id === id ? { ...o, ativo: !ativo } : o));
  };

  const handleDeleteLocal = async (id: string) => {
    const { error } = await (supabase.from("opcoes_local" as any) as any).delete().eq("id", id);
    if (error) { toast.error("Erro ao remover"); return; }
    toast.success("Local removido");
    setLocais(prev => prev.filter(o => o.id !== id));
  };

  const startEditLocal = (o: OpcaoLocal) => {
    setEditingLocalId(o.id);
    setEditLocalLabel(o.label);
    setEditLocalValue(o.value);
  };

  const saveEditLocal = async () => {
    if (!editingLocalId) return;
    const { error } = await (supabase.from("opcoes_local" as any) as any).update({
      label: editLocalLabel.trim(),
      value: editLocalValue.trim(),
    }).eq("id", editingLocalId);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Local atualizado!");
    setEditingLocalId(null);
    fetchLocais();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Personalização do Formulário</h2>

      {/* Textos do Formulário */}
      <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">Textos do Formulário de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Título do Formulário</Label>
            <Input value={formTitulo} onChange={e => setFormTitulo(e.target.value)} placeholder="Solicite seu orçamento agora mesmo!" className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Subtítulo do Formulário</Label>
            <Input value={formSubtitulo} onChange={e => setFormSubtitulo(e.target.value)} placeholder="Preencha o formulário abaixo..." className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Texto do Botão CTA</Label>
            <Input value={formCta} onChange={e => setFormCta(e.target.value)} placeholder="ENVIAR INTERESSE" className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
          </div>
          <Button onClick={handleSaveTexts} disabled={savingTexts} className="w-full sm:w-auto">
            {savingTexts ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {savingTexts ? "Salvando..." : "Salvar Textos"}
          </Button>
        </CardContent>
      </Card>

      {/* Add new option */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">Adicionar Nova Opção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Emoji (ex: 🍳)"
              value={newEmoji}
              onChange={e => setNewEmoji(e.target.value)}
              className="w-full sm:w-20 bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder="Nome (ex: Cozinha Planejada)"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder="Valor/keyword (ex: cozinha planejada)"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Options table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">
            Opções do campo "O que você busca?"
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-zinc-500">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400 w-12">Ordem</TableHead>
                  <TableHead className="text-zinc-400 w-16">Emoji</TableHead>
                  <TableHead className="text-zinc-400">Nome</TableHead>
                  <TableHead className="text-zinc-400">Valor</TableHead>
                  <TableHead className="text-zinc-400 w-20">Ativo</TableHead>
                  <TableHead className="text-zinc-400 w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opcoes.map((opcao, index) => (
                  <TableRow key={opcao.id} className="border-zinc-800">
                    <TableCell className="text-zinc-400">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="text-xs text-zinc-500 hover:text-zinc-200 disabled:opacity-30"
                        >▲</button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === opcoes.length - 1}
                          className="text-xs text-zinc-500 hover:text-zinc-200 disabled:opacity-30"
                        >▼</button>
                      </div>
                    </TableCell>
                    {editingId === opcao.id ? (
                      <>
                        <TableCell>
                          <Input value={editEmoji} onChange={e => setEditEmoji(e.target.value)}
                            className="w-16 bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </TableCell>
                        <TableCell>
                          <Input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </TableCell>
                        <TableCell>
                          <Input value={editValue} onChange={e => setEditValue(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={saveEdit}>
                              <Check className="w-4 h-4 text-green-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="w-4 h-4 text-zinc-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-xl">{opcao.emoji}</TableCell>
                        <TableCell className="text-zinc-100 font-medium">{opcao.label}</TableCell>
                        <TableCell className="text-zinc-400">{opcao.value}</TableCell>
                        <TableCell>
                          <Switch checked={opcao.ativo} onCheckedChange={() => handleToggle(opcao.id, opcao.ativo)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(opcao)}>
                              <Pencil className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(opcao.id)}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Local options - Add */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">Adicionar Novo Local do Imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Nome (ex: São Paulo Capital)"
              value={newLocalLabel}
              onChange={e => setNewLocalLabel(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder="Valor (ex: São Paulo Capital)"
              value={newLocalValue}
              onChange={e => setNewLocalValue(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Button onClick={handleAddLocal} className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Local options - Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">
            Opções do campo "Local do Imóvel"
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loadingLocais ? (
            <p className="text-zinc-500">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400">Nome</TableHead>
                  <TableHead className="text-zinc-400">Valor</TableHead>
                  <TableHead className="text-zinc-400 w-20">Ativo</TableHead>
                  <TableHead className="text-zinc-400 w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locais.map((local) => (
                  <TableRow key={local.id} className="border-zinc-800">
                    {editingLocalId === local.id ? (
                      <>
                        <TableCell>
                          <Input value={editLocalLabel} onChange={e => setEditLocalLabel(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </TableCell>
                        <TableCell>
                          <Input value={editLocalValue} onChange={e => setEditLocalValue(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={saveEditLocal}>
                              <Check className="w-4 h-4 text-green-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingLocalId(null)}>
                              <X className="w-4 h-4 text-zinc-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-zinc-100 font-medium">{local.label}</TableCell>
                        <TableCell className="text-zinc-400">{local.value}</TableCell>
                        <TableCell>
                          <Switch checked={local.ativo} onCheckedChange={() => handleToggleLocal(local.id, local.ativo)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => startEditLocal(local)}>
                              <Pencil className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteLocal(local.id)}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormOptions;
