import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const TrackingScripts = () => {
  const location = useLocation();
  const [config, setConfig] = useState<{
    google_ads_id: string;
    facebook_pixel_id: string;
    gtm_id: string;
  } | null>(null);

  // Apenas landing pública: bloqueia /admin e /login
  const isPublicPage =
    !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/login");

  useEffect(() => {
    if (!isPublicPage) return;
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("google_ads_id, facebook_pixel_id, gtm_id")
        .eq("id", true)
        .single();

      if (data) {
        setConfig({
          google_ads_id: data.google_ads_id || "",
          facebook_pixel_id: data.facebook_pixel_id || "",
          gtm_id: (data as any).gtm_id || "",
        });
      }
    };
    fetchConfig();
  }, [isPublicPage]);

  useEffect(() => {
    if (!config || !isPublicPage) return;

    // Google Tag Manager
    if (config.gtm_id && /^GTM-[A-Z0-9]+$/i.test(config.gtm_id)) {
      const existingGtm = document.querySelector(`script[data-gtm-id]`);
      if (!existingGtm) {
        const gtmScript = document.createElement("script");
        gtmScript.setAttribute("data-gtm-id", config.gtm_id);
        gtmScript.textContent = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${config.gtm_id}');
        `;
        document.head.appendChild(gtmScript);

        // noscript fallback no body
        const noscript = document.createElement("noscript");
        noscript.setAttribute("data-gtm-noscript", config.gtm_id);
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtm_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);
      }
    }

    // Google Ads / gtag
    if (config.google_ads_id) {
      const existingGtag = document.querySelector(`script[src*="googletagmanager.com/gtag"]`);
      if (!existingGtag) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.google_ads_id}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement("script");
        inlineScript.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.google_ads_id}');
        `;
        document.head.appendChild(inlineScript);
      }
    }

    // Facebook Pixel
    if (config.facebook_pixel_id) {
      const existingPixel = document.querySelector(`script[data-fb-pixel]`);
      if (!existingPixel) {
        const pixelScript = document.createElement("script");
        pixelScript.setAttribute("data-fb-pixel", "true");
        pixelScript.textContent = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${config.facebook_pixel_id}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(pixelScript);
      }
    }
  }, [config, isPublicPage]);

  return null;
};

export default TrackingScripts;
