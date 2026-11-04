import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeo, SITE_NAME, OG_IMAGE } from "../seo/seoData";

function setTag(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeo(pathname);
    document.title = seo.title;

    setTag('meta[name="description"]', "meta", { name: "description", content: seo.description });
    setTag('meta[name="robots"]', "meta", {
      name: "robots",
      content: seo.noindex ? "noindex, follow" : "index, follow",
    });
    if (seo.canonical) {
      setTag('link[rel="canonical"]', "link", { rel: "canonical", href: seo.canonical });
      setTag('meta[property="og:url"]', "meta", { property: "og:url", content: seo.canonical });
    }
    setTag('meta[property="og:title"]', "meta", { property: "og:title", content: seo.title });
    setTag('meta[property="og:description"]', "meta", { property: "og:description", content: seo.description });
    setTag('meta[property="og:type"]', "meta", { property: "og:type", content: "website" });
    setTag('meta[property="og:site_name"]', "meta", { property: "og:site_name", content: SITE_NAME });
    setTag('meta[property="og:image"]', "meta", { property: "og:image", content: OG_IMAGE });
    setTag('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary_large_image" });

    document.head.querySelectorAll("script[data-seo-jsonld]").forEach((n) => n.remove());
    if (seo.jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo-jsonld", "");
      s.text = JSON.stringify(seo.jsonLd);
      document.head.appendChild(s);
    }
  }, [pathname]);

  return null;
}
