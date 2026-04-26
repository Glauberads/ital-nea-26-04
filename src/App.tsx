import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Leads from "./pages/admin/Leads.tsx";
import Midia from "./pages/admin/Midia.tsx";
import Marketing from "./pages/admin/Marketing.tsx";
import FormOptions from "./pages/admin/FormOptions.tsx";
import RedesSociais from "./pages/admin/RedesSociais.tsx";
import Depoimentos from "./pages/admin/Depoimentos.tsx";
import Personalizacao from "./pages/admin/Personalizacao.tsx";
import NotFound from "./pages/NotFound.tsx";
import TrackingScripts from "./components/TrackingScripts.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TrackingScripts />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="midia" element={<Midia />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="formulario" element={<FormOptions />} />
              <Route path="redes-sociais" element={<RedesSociais />} />
              <Route path="depoimentos" element={<Depoimentos />} />
              <Route path="personalizacao" element={<Personalizacao />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
