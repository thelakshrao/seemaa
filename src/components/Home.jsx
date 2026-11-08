import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Seemaa from "./Seemaa";
import Service from "./Service";
import Awards from "./Awards";
import Horoscope from "./Horoscope";
import Booking from "./Booking";
import Review from "./Review";
import Book from "./Book";
import Footer from "./Footer";
import bgWelcome from "../img/banner-welcome.webp";
import bgManglik from "../img/banner-manglik.webp";
import bgTarot from "../img/banner-tarot.webp";
import bgTarotClass from "../img/banner-tarot-class.webp";

const go = (id) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const GOLD = "#cbb05f";
const CREAM = "#F4E4C1";
const g = (a) => `${GOLD}${a}`;

const DIWALI_ENABLED = true;
const DIWALI_CODE = "DIWALI2K26";
const DIWALI_START = new Date("2026-11-08T00:00:00+05:30").getTime();
const DIWALI_END = new Date("2026-11-10T23:59:59+05:30").getTime();
const BULB_COLORS = ["#ffb347", "#ff6b6b", "#ffe27a", "#ff9f43"];
const SPARKLES = [
  { left: "46%", top: "16%", size: 18, delay: "0s" },
  { left: "60%", top: "72%", size: 14, delay: "1s" },
  { left: "72%", top: "20%", size: 16, delay: "2s" },
  { left: "88%", top: "64%", size: 20, delay: "0.6s" },
  { left: "38%", top: "80%", size: 12, delay: "1.6s" },
];

const isDiwaliTime = () => {
  const now = Date.now();
  return DIWALI_ENABLED && now >= DIWALI_START && now <= DIWALI_END;
};

const banners = [
  {
    id: 0,
    img: bgWelcome,
    mobPos: "50% 50%",
    eyebrow: "Vedic Astrology & Vastu",
    title: "Acharya Seemaa Singh",
    tagline: "Astrologer · Vastu Expert · Life Coach",
    text: "20+ years of authentic Vedic knowledge and 50,000+ consultations, with practical guidance for career, relationships, health and life's purpose.",
    stats: [
      { num: "20+", label: "Years Exp." },
      { num: "50K+", label: "Clients" },
      { num: "100%", label: "Authentic" },
    ],
    cta: "Book Consultation",
  },
  {
    id: 1,
    img: bgManglik,
    mobPos: "100% 50%",
    eyebrow: "Manglik Dosh",
    title: "Is Mars affecting your marriage?",
    tagline: "Manglik Dosh analysis & remedies",
    text: "Find out if Mars in your kundli creates Manglik Dosh, how strong it really is, and which simple, shastra-based remedies help.",
    chips: ["Kundli analysis", "Match-making", "Practical remedies"],
    cta: "Check My Kundli",
  },
  {
    id: 2,
    img: bgTarot,
    mobPos: "88% 50%",
    eyebrow: "Tarot Card Reading",
    title: "Clear answers from the cards",
    tagline: "Love · Career · Money · Life decisions",
    text: "An honest, personal tarot reading with Seemaa Ji. Ask the question on your mind and leave with clarity and a way forward.",
    chips: ["Love & relationships", "Career & money", "Yes / No guidance"],
    cta: "Book Tarot Reading",
  },
  {
    id: 3,
    img: bgTarotClass,
    mobPos: "84% 50%",
    eyebrow: "Tarot Classes",
    title: "Learn tarot from Seemaa Ji",
    tagline: "Step by step, from your first card to full spreads",
    text: "Learn card meanings, spreads and intuition in simple language, with live practice.",
    chips: ["Beginner friendly", "Live practice", "Step by step"],
    cta: "Join Tarot Classes",
  },
];

const diwaliBanner = {
  id: 0,
  diwali: true,
  img: bgWelcome,
  mobPos: "50% 50%",
  eyebrow: "Happy Diwali",
  title: "Shubh Deepawali",
  tagline: "Light up the year ahead with Vedic guidance",
  text: "Warm Diwali wishes from Acharya Seemaa Singh. Celebrate with 10% off your online consultation using the code below.",
  cta: "Book Consultation",
};

const Home = () => {
  const [active, setActive] = useState(0);
  const [diwali, setDiwali] = useState(false);
  const [copied, setCopied] = useState(false);
  const total = banners.length;

  useEffect(() => {
    setDiwali(isDiwaliTime());
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % total), 7500);
    return () => clearInterval(t);
  }, [total]);

  const prev = () => setActive((active - 1 + total) % total);
  const next = () => setActive((active + 1) % total);
  const list = diwali
    ? banners.map((x) => (x.id === 0 ? diwaliBanner : x))
    : banners;
  const b = list[active];
  const welcome = b.id === 0;

  const copyCode = () => {
    const p = navigator.clipboard?.writeText(DIWALI_CODE);
    if (!p) return;
    p.then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const Arrow = ({ dir, onClick }) => (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous banner" : "Next banner"}
      className={`hidden xl:block absolute ${dir === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white w-10 h-10 rounded-full border border-white/20 transition-all text-lg`}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );

  return (
    <>
      {diwali && (
        <style>{`
          @keyframes dw-twinkle { 0%,100% { opacity: .55; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.1); } }
          @keyframes dw-float { 0%,100% { transform: translateY(0); opacity: .5; } 50% { transform: translateY(-10px); opacity: 1; } }
          .dw-bulb { display: block; width: 9px; height: 13px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow: 0 0 10px 3px currentColor; animation: dw-twinkle 1.6s ease-in-out infinite; }
          .dw-spark { position: absolute; animation: dw-float 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .dw-bulb, .dw-spark { animation: none; } }
        `}</style>
      )}
      <Navbar />
      <section className="w-full mt-25 overflow-hidden">
        <div
          key={b.id}
          className="max-w-350 w-full mx-auto rounded-2xl overflow-hidden relative bg-[#140503] xl:aspect-1400/520"
        >
          <img
            src={b.img}
            alt={b.diwali ? "Happy Diwali from Acharya Seemaa Singh" : b.title}
            className="w-full h-72 sm:h-80 md:h-96 xl:h-full xl:absolute xl:inset-0 object-cover"
            style={{ objectPosition: b.mobPos }}
          />

          {b.diwali && (
            <>
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 15% 100%, rgba(255,140,40,0.28), transparent 55%), radial-gradient(circle at 90% 0%, rgba(255,190,80,0.18), transparent 50%)",
                }}
              />
              <div className="absolute top-1 inset-x-6 h-px z-30 pointer-events-none" style={{ background: g("55") }} aria-hidden="true" />
              <div className="absolute top-0 inset-x-6 z-30 flex justify-between pointer-events-none" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="dw-bulb"
                    style={{
                      color: BULB_COLORS[i % 4],
                      background: BULB_COLORS[i % 4],
                      marginTop: i % 2 ? 7 : 2,
                      animationDelay: `${(i % 4) * 0.4}s`,
                    }}
                  />
                ))}
              </div>
              {SPARKLES.map((s, i) => (
                <span
                  key={i}
                  className="dw-spark hidden xl:block z-30 pointer-events-none"
                  aria-hidden="true"
                  style={{ left: s.left, top: s.top, fontSize: s.size, color: GOLD, animationDelay: s.delay }}
                >
                  ✦
                </span>
              ))}
            </>
          )}

          {welcome && (
            <div className="hidden xl:block absolute inset-y-0 left-0 w-[36%] z-20 bg-linear-to-r from-[#1a0500]/85 via-[#1a0500]/50 to-transparent" />
          )}

          <Arrow dir="left" onClick={prev} />
          <Arrow dir="right" onClick={next} />

          <div
            className={`relative z-30 px-6 pt-6 pb-2 text-center slide-in xl:absolute xl:inset-y-0 xl:left-0 xl:pl-16 xl:pr-4 xl:text-left xl:flex xl:flex-col ${welcome ? "xl:w-[34%] xl:justify-start xl:pt-10 xl:pb-0" : "xl:w-[44%] xl:justify-center xl:py-0"}`}
          >
            <div className="flex items-center justify-center xl:justify-start gap-2 mb-3">
              <div className="h-px w-8" style={{ background: g("80") }} />
              <span className="text-xs font-semibold tracking-[0.2em]" style={{ color: GOLD }}>
                ✦ {b.eyebrow}
              </span>
            </div>
            <h2
              className="text-2xl xl:text-4xl font-serif font-bold leading-tight"
              style={{ color: CREAM, textShadow: "0 2px 20px rgba(0,0,0,.6)" }}
            >
              {b.title}
            </h2>
            <p className="mt-1 text-sm xl:text-base font-semibold" style={{ color: GOLD }}>
              {b.tagline}
            </p>
            <p className={`mt-3 text-sm text-[#F2EDE8]/85 max-w-md mx-auto xl:mx-0 leading-relaxed ${welcome ? "xl:hidden" : ""}`}>
              {b.text}
            </p>
            <div className="mt-4">
              {b.diwali ? (
                <div className="flex flex-col items-center xl:items-start gap-2">
                  <span className="text-xs tracking-wide text-[#F2EDE8]/80">
                    Festive offer · 10% off
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    aria-label={`Copy coupon code ${DIWALI_CODE}`}
                    className="flex items-center gap-3 rounded-full px-4 py-2 border-2 border-dashed cursor-pointer backdrop-blur-sm"
                    style={{ borderColor: GOLD, background: "rgba(0,0,0,.35)", color: CREAM }}
                  >
                    <span className="font-serif font-bold tracking-widest text-base" style={{ color: GOLD }}>
                      {DIWALI_CODE}
                    </span>
                    <span className="text-xs uppercase tracking-wide">
                      {copied ? "Copied!" : "Tap to copy"}
                    </span>
                  </button>
                </div>
              ) : b.stats ? (
                <div className="flex justify-center xl:justify-start gap-6">
                  {b.stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-xl font-bold font-serif" style={{ color: GOLD }}>{s.num}</p>
                      <p className="text-[#F2EDE8]/60 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center xl:justify-start gap-2">
                  {b.chips.map((c) => (
                    <span
                      key={c}
                      className="text-xs font-serif px-3 py-1 rounded-full border"
                      style={{ borderColor: g("66"), color: CREAM, background: "rgba(0,0,0,.3)" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap justify-center xl:justify-start mt-5">
              <button
                onClick={go("booking")}
                className="px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer transition-all hover:scale-105 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #fff8dc)`, color: "#3B1F1B" }}
              >
                {b.cta}
              </button>
              <button
                onClick={go("services")}
                className="border px-6 py-2.5 rounded-full font-semibold font-serif text-sm cursor-pointer hover:bg-white/10"
                style={{ borderColor: g("80"), color: GOLD }}
              >
                Explore Services
              </button>
            </div>
          </div>

          {b.side && (
            <div className="hidden xl:flex absolute z-30 right-16 inset-y-0 w-[22%] flex-col justify-center gap-3">
              {b.side.map((s) => (
                <button
                  key={s}
                  onClick={go("services")}
                  className="text-left font-serif text-sm px-4 py-3 rounded-xl border backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
                  style={{ borderColor: g("55"), color: CREAM, background: "rgba(0,0,0,.25)" }}
                >
                  ✦ {s}
                </button>
              ))}
            </div>
          )}

          <div className="relative z-40 flex flex-col items-center gap-2 pb-4 xl:pb-0 xl:absolute xl:bottom-3 xl:left-1/2 xl:-translate-x-1/2">
            <div className="flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to banner ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`nav-dot ${active === i ? "active" : ""}`}
                />
              ))}
            </div>
            <div className="progress-bar hidden xl:block">
              <div key={active} className="progress-fill" />
            </div>
          </div>
        </div>
      </section>

      <Seemaa />
      <Service />
      <Awards />
      <Horoscope />
      <Booking />
      <Review />
      <Book />
      <Footer />
    </>
  );
};

export default Home;