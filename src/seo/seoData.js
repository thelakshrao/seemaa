
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
    title: "Acharya Seemaa Singh | Vedic Astrologer, Tarot, Numerology & Vastu",
    description:
      "Consult Acharya Seemaa Singh, a Vedic astrologer with 20+ years of experience serving clients in India and Canada. Kundli, tarot, numerology, Vastu and more.",
    jsonLd: graph(websiteLd, personLd),
  },
  "/about": {
    title: "About Acharya Seemaa Singh | Astrologer, Author & Teacher",
    description:
      "Meet Acharya Seemaa Singh: Vedic astrologer, tarot expert, author of Tarot for Beginners, with over two decades of experience guiding clients worldwide.",
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
  const url = `${SITE_URL}/services/${s.slug}`;
  pages[`/services/${s.slug}`] = {
    title: s.seoTitle,
    description: s.description,
    jsonLd: graph(
      {
        "@type": "Service",
        name: s.title,
        description: s.description,
        url,
        serviceType: s.title,
        provider: { "@id": `${SITE_URL}/#seemaa` },
        areaServed: ["India", "Canada", "Worldwide (online)"],
      },
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
