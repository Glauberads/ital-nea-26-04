import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Lead {
  id: string;
  created_at: string | null;
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  local_imovel: string | null;
  interesse: string | null;
  tem_projeto: boolean | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setLeads(data);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const exportCSV = () => {
    const headers = ["Data", "Nome", "E-mail", "WhatsApp", "Local", "Interesse", "Tem Projeto", "UTM Source", "UTM Medium", "UTM Campaign"];
    const rows = leads.map((l) => [
      l.created_at ? new Date(l.created_at).toLocaleString("pt-BR") : "",
      l.nome || "", l.email || "", l.whatsapp || "", l.local_imovel || "",
      l.interesse || "", l.tem_projeto === null ? "" : l.tem_projeto ? "Sim" : "Não",
      l.utm_source || "", l.utm_medium || "", l.utm_campaign || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-100">Leads Capturados</h2>
        <Button onClick={exportCSV} disabled={leads.length === 0} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-300 text-lg">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} encontrado{leads.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-zinc-500">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400">Data</TableHead>
                  <TableHead className="text-zinc-400">Nome</TableHead>
                  <TableHead className="text-zinc-400">E-mail</TableHead>
                  <TableHead className="text-zinc-400">WhatsApp</TableHead>
                  <TableHead className="text-zinc-400">Local</TableHead>
                  <TableHead className="text-zinc-400">Interesse</TableHead>
                  <TableHead className="text-zinc-400">Projeto?</TableHead>
                  <TableHead className="text-zinc-400">UTM Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-zinc-800">
                    <TableCell className="text-zinc-300 text-xs">
                      {lead.created_at ? new Date(lead.created_at).toLocaleString("pt-BR") : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-100 font-medium">{lead.nome || "—"}</TableCell>
                    <TableCell className="text-zinc-300">{lead.email || "—"}</TableCell>
                    <TableCell className="text-zinc-300">{lead.whatsapp || "—"}</TableCell>
                    <TableCell className="text-zinc-400">{lead.local_imovel || "—"}</TableCell>
                    <TableCell className="text-zinc-400">{lead.interesse || "—"}</TableCell>
                    <TableCell className="text-zinc-400">{lead.tem_projeto === null ? "—" : lead.tem_projeto ? "Sim" : "Não"}</TableCell>
                    <TableCell className="text-zinc-400">{lead.utm_source || "—"}</TableCell>
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

export default Leads;
