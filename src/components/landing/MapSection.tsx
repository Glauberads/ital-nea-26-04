import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.2!2d-46.876!3d-23.51!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMwJzM2LjAiUyA0NsKwNTInMzMuNiJX!5e0!3m2!1spt-BR!2sbr!4v1";

const STORE_ADDRESS = "Rua Campos Sales, 980 - Vila Boa Vista, Barueri - SP";
const STORE_LAT = "-23.51";
const STORE_LNG = "-46.876";

const extractSrc = (input: string): string => {
  if (!input) return "";
  const match = input.match(/src=["']([^"']+)["']/);
  return match ? match[1] : input.trim();
};

const MapSection = () => {
  const [embedUrl, setEmbedUrl] = useState(DEFAULT_EMBED_URL);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("maps_embed_url")
        .eq("id", true)
        .single();

      if (data?.maps_embed_url) {
        const url = extractSrc(data.maps_embed_url);
        if (url) setEmbedUrl(url);
      }
    };
    fetch();
  }, []);

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;
  const wazeLink = `https://waze.com/ul?ll=${STORE_LAT},${STORE_LNG}&navigate=yes`;

  return (
    <section className="py-16 bg-secondary" id="localizacao">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-6 h-6 text-gold" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Nossa <span className="text-gold">Localização</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visite nosso showroom e conheça de perto a qualidade dos nossos móveis planejados.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="w-full rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da loja"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-semibold text-lg">Metta Italínea</h3>
              <p className="text-sm text-muted-foreground">{STORE_ADDRESS}, 06411-150</p>
              <p className="text-sm text-muted-foreground">Seg à Sáb, 09h40 às 19h00</p>
            </div>

            <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="outline" className="w-full gap-2 border-border hover:bg-accent">
                <ExternalLink className="w-4 h-4" />
                Abrir no Google Maps
              </Button>
            </a>

            <a href={wazeLink} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="outline" className="w-full gap-2 border-border hover:bg-accent">
                <Navigation className="w-4 h-4" />
                Abrir no Waze
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
