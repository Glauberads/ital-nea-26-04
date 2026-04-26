import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoMettaDefault from "@/assets/logo_branco.png";

const Header = () => {
  const [logoUrl, setLogoUrl] = useState<string>(logoMettaDefault);
  const [white, setWhite] = useState<boolean>(true);

  useEffect(() => {
    supabase
      .from("configuracoes")
      .select("header_logo_url, header_logo_white")
      .eq("id", true)
      .single()
      .then(({ data }) => {
        const url = (data as any)?.header_logo_url;
        if (url) setLogoUrl(url);
        const w = (data as any)?.header_logo_white;
        if (typeof w === "boolean") setWhite(w);
      });
  }, []);

  return (
    <header className="bg-[hsl(220,50%,15%)] py-4 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="Metta Italínea - Móveis Planejados"
            className={`h-12 md:h-16 w-auto object-contain ${
              white ? "brightness-0 invert" : ""
            }`}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
