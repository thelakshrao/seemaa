import { manglik, tarot, books } from "./pageContent.js";
import { serviceFaqs } from "./serviceFaqs.js";

export const SITE_URL = "https://www.seemaaastrologer.com";
export const SITE_NAME = "Acharya Seemaa Singh";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SOCIAL_LINKS = [
  "https://www.facebook.com/astrologerseemasingh",
  "https://www.instagram.com/astrologerseemasingh",
];

export const services = [
  {
    slug: "relationship-challenges",
    title: "Relationship Challenges",
    seoTitle: "Relationship Astrology & Marriage Guidance | Acharya Seemaa Singh",
    description:
      "Astrology guidance for relationship conflicts, marriage problems and emotional bonds, with Vedic astrologer Acharya Seemaa Singh. Book an online consultation.",
  },
  {
    slug: "business-setbacks",
    title: "Business Setbacks",
    seoTitle: "Business Astrology for Setbacks & Growth | Acharya Seemaa Singh",
    description:
      "Vedic astrology insights for business losses, delays and strategic growth. Understand planetary timing and remedies with Acharya Seemaa Singh.",
  },
  {
    slug: "financial-struggle",
    title: "Financial Struggle",
    seoTitle: "Financial Astrology & Money Guidance | Acharya Seemaa Singh",
    description:
      "Astrology-based guidance for money stress, financial planning and prosperity. Consult Vedic astrologer Acharya Seemaa Singh online.",
  },
  {
    slug: "career-roadblocks",
    title: "Career Roadblocks",
    seoTitle: "Career Astrology & Job Guidance | Acharya Seemaa Singh",
    description:
      "Career astrology for job confusion, stalled growth and the right professional direction, from Vedic astrologer Acharya Seemaa Singh.",
  },
  {
    slug: "transits-of-the-month",
    title: "Transits of the Month",
    seoTitle: "Monthly Planetary Transits Forecast | Acharya Seemaa Singh",
    description:
      "Understand how this month's planetary transits may affect your decisions, relationships and emotions, explained by Acharya Seemaa Singh.",
  },
  {
    slug: "astro-numerology",
    title: "Astro Numerology",
    seoTitle: "Astro Numerology: Life Path & Lucky Numbers | Acharya Seemaa Singh",
    description:
      "Numerology and astrology combined: life path, destiny numbers and karmic lessons, with Acharya Seemaa Singh. Book a personal reading.",
  },
  {
    slug: "vedic-astrology",
    title: "Vedic Astrology",
    seoTitle: "Vedic Astrology (Jyotish) Consultation | Acharya Seemaa Singh",
    description:
      "Birth chart (kundli) analysis, doshas, remedies and predictions by Vedic astrologer Acharya Seemaa Singh, with 20+ years of experience.",
  },
  {
    slug: "vedic-vastu",
    title: "Vedic Vastu",
    seoTitle: "Vastu Shastra Consultation for Home & Office | Acharya Seemaa Singh",
    description:
      "Vastu consultation for homes and offices: directions, placements and energy balance for peace and prosperity, by Acharya Seemaa Singh.",
  },
];

export const signs = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const faqLd = (faqs) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

const serviceLd = (name, description, path) => ({
  "@type": "Service",
  name,
  description,
  url: `${SITE_URL}${path}`,
  serviceType: name,
  provider: { "@id": `${SITE_URL}/#seemaa` },
  areaServed: ["India", "Canada", "Worldwide (online)"],
});

const personLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#seemaa`,
  name: "Seemaa Singh",
  alternateName: ["Acharya Seemaa Singh", "Seema Singh"],
  jobTitle: "Vedic Astrologer",
  url: SITE_URL,
  image: OG_IMAGE,
  sameAs: SOCIAL_LINKS,
  knowsAbout: [
    "Vedic astrology",
    "Numerology",
    "Tarot",
    "Vastu Shastra",
    "Aura reading",
    "Energy dowsing",
  ],
  telephone: ["+917696134636", "+12362589866"],
  email: "Info@seemaaastrologer.com",
};

const websiteLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Seemaa Astrologer",
  publisher: { "@id": `${SITE_URL}/#seemaa` },
};

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

export const pages = {
  "/": {
    title: "Seema Singh | Acharya Seemaa Singh, Vedic Astrologer & Tarot",
    description:
      "Consult Seema Singh (Acharya Seemaa Singh), Vedic astrologer with 20+ years of experience in India and Canada. Kundli, tarot, numerology and Vastu.",
    jsonLd: graph(websiteLd, personLd),
  },
  "/about": {
    title: "About Seema Singh (Acharya Seemaa Singh) | Astrologer & Author",
    description:
      "Meet Seema Singh, also written Seemaa Singh: Vedic astrologer, tarot expert and author of Tarot for Beginners, with over two decades of experience.",
    jsonLd: graph(
      {
        "@type": "AboutPage",
        url: `${SITE_URL}/about`,
        name: "About Acharya Seemaa Singh",
        about: { "@id": `${SITE_URL}/#seemaa` },
      },
      personLd
    ),
  },
  "/horoscope": {
    title: "Zodiac Signs: Personality, Traits & Predictions | Acharya Seemaa Singh",
    description:
      "Explore all 12 zodiac signs (Rashi): personality, traits and guidance from Vedic astrologer Acharya Seemaa Singh.",
  },
  "/consultation": {
    title: "Book an Astrology Consultation Online | Acharya Seemaa Singh",
    description:
      "Book a 1-to-1 online astrology consultation with Acharya Seemaa Singh. Choose your date, time slot and duration.",
  },
  "/contact": {
    title: "Contact Acharya Seemaa Singh | Astrology Consultations",
    description:
      "Contact Acharya Seemaa Singh for astrology, tarot, numerology and Vastu consultations. Phone, email and booking details.",
  },
};

services.forEach((s) => {
  const path = `/services/${s.slug}`;
  const faqs = serviceFaqs[s.slug] || [];
  pages[path] = {
    title: s.seoTitle,
    description: s.description,
    jsonLd: graph(
      serviceLd(s.title, s.description, path),
      ...(faqs.length ? [faqLd(faqs)] : []),
      personLd
    ),
  };
});

signs.forEach((sign) => {
  pages[`/horoscope/${sign}`] = {
    title: `${cap(sign)} Zodiac Sign: Personality & Traits | Acharya Seemaa Singh`,
    description: `${cap(sign)} personality, strengths and traits explained by Vedic astrologer Acharya Seemaa Singh. Book a personal horoscope reading.`,
  };
});

const manglikDesc =
  "Check Manglik (Mangal) dosha in your kundli with Vedic astrologer Acharya Seemaa Singh. Understand Mars placement, cancellation, marriage matching and remedies.";
pages["/services/manglik-dosha"] = {
  title: "Manglik Dosha Check Online & Consultation | Acharya Seemaa Singh",
  description: manglikDesc,
  jsonLd: graph(
    serviceLd("Manglik Dosha Check & Consultation", manglikDesc, "/services/manglik-dosha"),
    faqLd(manglik.faqs),
    personLd
  ),
};

const tarotDesc =
  "Book an online tarot reading with Acharya Seemaa Singh, author of Tarot for Beginners. Guidance on career, love, finances and health.";
pages["/services/tarot-reading"] = {
  title: "Tarot Card Reading Online | Acharya Seemaa Singh (Seema Singh)",
  description: tarotDesc,
  jsonLd: graph(
    serviceLd("Tarot Card Reading", tarotDesc, "/services/tarot-reading"),
    faqLd(tarot.faqs),
    personLd
  ),
};

const tarotBook = books.find((b) => b.key === "tarot");
pages["/books"] = {
  title: "Books by Acharya Seemaa Singh | Tarot for Beginners & More",
  description:
    "Books by Seema Singh (Acharya Seemaa Singh): Tarot for Beginners, Healing Through Mantra and The Rock That Was Not.",
  jsonLd: graph(
    {
      "@type": "Book",
      name: tarotBook.title,
      description: tarotBook.description,
      isbn: tarotBook.isbn.replace(/-/g, ""),
      author: { "@id": `${SITE_URL}/#seemaa` },
      publisher: { "@type": "Organization", name: tarotBook.publisher },
    },
    personLd
  ),
};

pages["/press"] = {
  title: "Acharya Seemaa Singh in the Media | TV, Radio & Press Features",
  description:
    "Media outlets in India and Canada that have featured Seema Singh (Acharya Seemaa Singh), including OMNI Television, Spice Radio, PTC News and Dainik Bhaskar.",
};

export const notFoundSeo = {
  title: "Page not found | Acharya Seemaa Singh",
  description: "This page could not be found.",
  noindex: true,
};

export function normalizePath(pathname) {
  if (!pathname) return "/";
  let p = pathname.split("?")[0].split("#")[0];
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

export function getSeo(pathname) {
  const path = normalizePath(pathname);
  const page = pages[path];
  if (!page) return { ...notFoundSeo, path };
  return { ...page, path, canonical: `${SITE_URL}${path === "/" ? "/" : path}` };
}