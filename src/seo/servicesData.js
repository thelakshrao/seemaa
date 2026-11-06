import {
  FaHeart,
  FaBusinessTime,
  FaMoneyBillWave,
  FaUserTie,
  FaChartLine,
  FaHashtag,
  FaStarOfLife,
  FaHome,
  FaFire,
  FaMagic,
} from "react-icons/fa";
import { manglik, tarot } from "./pageContent";
import { serviceFaqs } from "./serviceFaqs";

// Single source of truth for the home-page cards and the service pages.
// Order here = order on screen. Manglik Dosha and Tarot Reading go first.
export const services = [
  {
    slug: "manglik-dosha",
    title: "Manglik Dosha",
    short: "Check Mars placement in your kundli, understand cancellations, and get clarity before marriage.",
    h1: manglik.h1,
    description: manglik.intro,
    sections: manglik.sections,
    faqs: manglik.faqs,
    ctaLabel: "Check My Kundli",
    Icon: FaFire,
  },
  {
    slug: "tarot-reading",
    title: "Tarot Reading",
    short: "Card readings for career, love, finances and health, from the author of Tarot for Beginners.",
    h1: tarot.h1,
    description: tarot.intro,
    sections: tarot.sections,
    faqs: tarot.faqs,
    ctaLabel: "Book a Tarot Reading",
    Icon: FaMagic,
  },
  {
    slug: "relationship-challenges",
    title: "Relationship Challenges",
    short: "Guidance on overcoming personal conflicts, misunderstandings, and building stronger emotional bonds.",
    description:
      "Get guidance on resolving emotional conflicts, improving understanding, healing misunderstandings, and building stronger emotional bonds. This service focuses on helping individuals and couples restore harmony and create healthier relationships.",
    faqs: serviceFaqs["relationship-challenges"],
    Icon: FaHeart,
  },
  {
    slug: "business-setbacks",
    title: "Business Setbacks",
    short: "Insights to navigate obstacles in business ventures, recover from losses, and plan strategic growth.",
    description:
      "Receive insights to navigate business obstacles, recover from failures, understand market challenges, and plan your strategic growth. This service helps you make better business decisions with clarity and confidence.",
    faqs: serviceFaqs["business-setbacks"],
    Icon: FaBusinessTime,
  },
  {
    slug: "financial-struggle",
    title: "Financial Struggle",
    short: "Advice on managing financial difficulties, improving budgeting, and attracting prosperity.",
    description:
      "Learn how to manage financial difficulties, improve planning, budgeting, savings, and attract prosperity. This service offers guidance on overcoming money-related stress and creating long-term stability.",
    faqs: serviceFaqs["financial-struggle"],
    Icon: FaMoneyBillWave,
  },
  {
    slug: "career-roadblocks",
    title: "Career Roadblocks",
    short: "Support for tackling professional challenges, finding growth opportunities, and enhancing career prospects.",
    description:
      "Get support in tackling professional challenges, career confusion, finding the right opportunities, job growth, and enhancing career prospects with the right direction and clarity.",
    faqs: serviceFaqs["career-roadblocks"],
    Icon: FaUserTie,
  },
  {
    slug: "transits-of-the-month",
    title: "Transits of the Month",
    short: "Astrological transits help forecast future trends and planetary movements affecting your life.",
    description:
      "Astrological transits help forecast future trends and planetary movements affecting your life. Understand how current cosmic shifts influence your decisions and emotional patterns.",
    faqs: serviceFaqs["transits-of-the-month"],
    Icon: FaChartLine,
  },
  {
    slug: "astro-numerology",
    title: "Astro Numerology",
    short: "Numerology reveals the occult influence of numbers on personality, destiny, and life paths.",
    description:
      "Numerology reveals the hidden influence of numbers on personality, destiny, decision-making, and life events. This service helps you understand life paths, lucky numbers, and karmic lessons.",
    faqs: serviceFaqs["astro-numerology"],
    Icon: FaHashtag,
  },
  {
    slug: "vedic-astrology",
    title: "Vedic Astrology",
    short: "Jyotish is the ancient science of light, guiding life decisions through planetary wisdom.",
    description:
      "Jyotish, the ancient science of light, guides your life decisions through planetary wisdom. Get deep insights into your birth chart, doshas, remedies, and predictions.",
    faqs: serviceFaqs["vedic-astrology"],
    Icon: FaStarOfLife,
  },
  {
    slug: "vedic-vastu",
    title: "Vedic Vastu",
    short: "Vastu Shastra balances energies of space for peace, prosperity, and harmony.",
    description:
      "Vastu Shastra balances home and office energies for peace, prosperity, and harmony. Learn how directions, placements, and structures influence your well-being and success.",
    faqs: serviceFaqs["vedic-vastu"],
    Icon: FaHome,
  },
];

export const servicesBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
