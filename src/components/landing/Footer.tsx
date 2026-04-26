import { useEffect, useState } from "react";
import { Phone, Mail, Clock, MapPin, Instagram, Facebook, Youtube, Music2, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoMetta from "@/assets/logo_branco.png";

interface SocialLinks {
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
}

const normalizeUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const Footer = () => {
  const [social, setSocial] = useState<SocialLinks>({
    instagram_url: null,
    facebook_url: null,
    youtube_url: null,
    tiktok_url: null,
    twitter_url: null,
  });

  useEffect(() => {
    const fetchSocial = async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("instagram_url, facebook_url, youtube_url, tiktok_url, twitter_url")
        .eq("id", true)
        .maybeSingle();

      if (error) {
        console.error("[Footer] erro ao buscar redes sociais:", error);
        return;
      }
      if (data) setSocial(data);
    };
    fetchSocial();
  }, []);

  const socialItems = [
    { url: normalizeUrl(social.instagram_url), Icon: Instagram, label: "Instagram" },
    { url: normalizeUrl(social.facebook_url), Icon: Facebook, label: "Facebook" },
    { url: normalizeUrl(social.youtube_url), Icon: Youtube, label: "YouTube" },
    { url: normalizeUrl(social.tiktok_url), Icon: Music2, label: "TikTok" },
    { url: normalizeUrl(social.twitter_url), Icon: Twitter, label: "Twitter" },
  ].filter((item) => item.url);

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Logo */}
          <div>
            <img
              src={logoMetta}
              alt="Metta Italínea - Móveis Planejados"
              className="h-12 w-auto object-contain mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Móveis planejados premium para transformar sua casa.
            </p>
          </div>

          {/* Contato */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold mb-3">Contato</h4>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 text-gold" />
              <span>11 4198-5399 | 4198-8598</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4 text-gold" />
              <span>contato@mettaplanejados.com.br</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-gold" />
              <span>Seg à Sáb, 09h00 às 18h00</span>
            </div>
            <a
              href="https://www.google.com/maps/search/Rua+Campos+Sales+980+Vila+Boa+Vista+Barueri+SP"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="w-4 h-4 text-gold mt-0.5" />
              <span>Rua Campos Sales, 980 - Vila Boa Vista, Barueri - SP, 06411-150</span>
            </a>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-bold mb-3 text-sm">Redes Sociais</h4>
            {socialItems.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Configure os links no painel administrativo.
              </p>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {socialItems.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Metta Italínea. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
