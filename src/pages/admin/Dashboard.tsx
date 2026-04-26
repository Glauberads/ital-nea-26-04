import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Clock, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: total } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: today } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);

      const { count: week } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString());

      setStats({
        total: total ?? 0,
        today: today ?? 0,
        week: week ?? 0,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total de Leads", value: stats.total, icon: Users, iconClass: "kpi-icon-cyan", isConversion: false },
    { label: "Leads Hoje", value: stats.today, icon: TrendingUp, iconClass: "kpi-icon-green", isConversion: false },
    { label: "Últimos 7 dias", value: stats.week, icon: Clock, iconClass: "kpi-icon-purple", isConversion: false },
    { label: "Taxa de Conversão", value: "—", icon: BarChart3, iconClass: "kpi-icon-magenta", isConversion: true },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className={`bg-zinc-900 border-zinc-800 ${card.isConversion ? "kpi-card-conversion" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{card.label}</CardTitle>
              <card.icon className={`w-5 h-5 ${card.iconClass} ${card.isConversion ? "kpi-icon-pulse" : ""}`} />
            </CardHeader>
            <CardContent>
              <div className={`kpi-value font-bold text-zinc-100 ${card.isConversion ? "kpi-value-conversion text-4xl" : "text-3xl"}`}>{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
