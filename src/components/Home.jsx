import React, { useEffect, useState } from "react";
import zodiacWheel from "../img/zodiacwheel.png";
import seemaPng from "../img/seemaapic1.png";
import ganeshgpng from "../img/ganeshg.png";
import seemaaOfferImg from "../img/seemaa.png";
import Navbar from "./Navbar";
import Seemaa from "./Seemaa";
import Service from "./Service";
import Awards from "./Awards";
import Horoscope from "./Horoscope";
import Booking from "./Booking";
import Review from "./Review";
import Book from "./Book";
import Footer from "./Footer";

const scrollToBooking = () => {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
};

const banners = [
  {
    id: 0,
    type: "seemaa",
    bg: "from-[#1a0500] via-[#3B1205] to-[#6B2010]",
    textColor: "text-[#F4E4C1]",
    accentColor: "#cbb05f",
  },
  {
    id: 1,
    type: "regular",
    bg: "from-[#1a0a00] via-[#3B1F1B] to-[#7A1E1E]",
    textColor: "text-[#cbb05f]",
    title: "UNRAVEL THE REALM OF ASTROLOGY",
    subtitle: "Ancient wisdom backed by practical understanding.",
    person: ganeshgpng,
    accentColor: "#cbb05f",
    patternType: "geometric",
  },
  {
    id: 2,
    type: "regular",
    bg: "from-[#060d1f] via-[#0B132B] to-[#1C2541]",
    textColor: "text-[#EAE2B7]",
    title: "Acharya Seemaa Singh, Astrologer & Vastu Expert",
    subtitle:
      "Know about yourself and the purpose of your life through authentic astrology and vastu knowledge.",
    person: seemaPng,
    accentColor: "#EAE2B7",
    patternType: "cosmic",
  },
];

const Home = () => {
  const [active, setActive] = useState(0);
  const total = banners.length;

  useEffect(() => {
    const interval = setInterval(() => setActive((p) => (p + 1) % total), 7500);
    return () => clearInterval(interval);
  }, [total]);

  const prev = () => setActive((active - 1 + total) % total);
  const next = () => setActive((active + 1) % total);
  const banner = banners[active];

  const NavArrow = ({ dir, onClick }) => (
    <button
      onClick={onClick}
      className={`absolute ${dir === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white w-10 h-10 rounded-full border border-white/20 transition-all text-lg`}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );

  const Dots = () => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`nav-dot ${active === i ? "active" : ""}`}
          />
        ))}
      </div>
      <div className="progress-bar">
        <div key={active} className="progress-fill" />
      </div>
    </div>
  );

  const MobileDots = () => (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
      {banners.map((_, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={`nav-dot ${active === i ? "active" : ""}`}
        />
      ))}
    </div>
  );

  const StarField = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="stars" />
      <div className="stars2" />
    </div>
  );

  return (
    <>
      <Navbar />
      <section className="w-full mt-25 overflow-hidden">
        <div className="hidden md:block">
          {banner.type === "seemaa" && (
            <div
              key="seemaa-desk"
              className={`max-w-350 w-full mx-auto min-h-90 rounded-2xl overflow-hidden relative grain-overlay bg-linear-to-r ${banner.bg}`}
            >
              <StarField />
              <div className="absolute inset-0 geo-pattern pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(203,176,95,0.12), inset 0 0 80px rgba(0,0,0,0.3)",
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`,
                }}
              />
              <NavArrow dir="left" onClick={prev} />
              <NavArrow dir="right" onClick={next} />

              {/* Left text content */}
              <div className="relative z-20 w-1/2 px-12 pt-8 pb-8 flex flex-col justify-center min-h-90 slide-in">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="h-px w-8"
                    style={{ background: banner.accentColor + "80" }}
                  />
                  <span
                    className="text-xs font-semibold tracking-[0.25em] uppercase opacity-70"
                    style={{ color: banner.accentColor }}
                  >
                    ✦ Vedic Astrology & Vastu
                  </span>
                </div>
                <h1
                  className="text-4xl font-serif font-bold leading-tight text-[#F4E4C1]"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                >
                  Acharya Seemaa Singh
                </h1>
                <p
                  className="mt-1 text-lg font-medium"
                  style={{ color: banner.accentColor }}
                >
                  Astrologer · Vastu Expert · Life Coach
                </p>
                <p className="mt-3 text-sm text-[#F2EDE8]/80 max-w-sm leading-relaxed">
                  With over 20 years of experience and 50,000+ consultations,
                  Seemaa Ji blends authentic Vedic knowledge with practical
                  guidance — helping you navigate career, relationships, health,
                  and life's purpose.
                </p>
                <div className="flex items-center gap-4 mt-5 mb-5">
                  {[
                    { num: "20+", label: "Years Exp." },
                    { num: "50K+", label: "Clients" },
                    { num: "100%", label: "Authentic" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p
                        className="text-xl font-bold font-serif"
                        style={{ color: banner.accentColor }}
                      >
                        {stat.num}
                      </p>
                      <p className="text-[#F2EDE8]/60 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() =>
                      document
                        .getElementById("services")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="border px-6 py-2.5 rounded-full font-semibold font-serif text-sm transition-all cursor-pointer hover:bg-white/10"
                    style={{
                      borderColor: banner.accentColor + "60",
                      color: banner.accentColor,
                    }}
                  >
                    Explore Services
                  </button>
                  <button
                    onClick={scrollToBooking}
                    className="px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer transition-all hover:scale-105 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                      color: "#3B1F1B",
                    }}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>

              <div className="absolute right-0 top-0 h-full w-1/2 flex justify-end items-end overflow-hidden">
                <img
                  src={seemaaOfferImg}
                  alt="Acharya Seemaa Singh"
                  className="h-full object-cover object-top"
                  style={{
                    maskImage:
                      "linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)",
                  }}
                />
              </div>
              <Dots />
            </div>
          )}

          {banner.type === "regular" && (
            <div
              key={`regular-desk-${banner.id}`}
              className={`max-w-350 w-full mx-auto min-h-90 rounded-2xl overflow-hidden relative grain-overlay bg-linear-to-r ${banner.bg}`}
            >
              <StarField />
              <div
                className={`absolute inset-0 pointer-events-none ${banner.patternType === "geometric" ? "geo-pattern" : "cosmic-pattern"}`}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1px rgba(${banner.patternType === "geometric" ? "203,176,95" : "234,226,183"},0.12), inset 0 0 80px rgba(0,0,0,0.3)`,
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`,
                }}
              />
              <NavArrow dir="left" onClick={prev} />
              <NavArrow dir="right" onClick={next} />
              <div
                className={`relative z-20 w-1/2 px-12 pt-8 pb-8 flex flex-col justify-center min-h-90 ${banner.textColor} slide-in`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="h-px w-8"
                    style={{ background: banner.accentColor + "80" }}
                  />
                  <span
                    className="text-xs font-semibold tracking-[0.25em] uppercase opacity-70"
                    style={{ color: banner.accentColor }}
                  >
                    {banner.id === 1
                      ? "✦ Ancient Wisdom"
                      : "✦ Trusted Guidance"}
                  </span>
                </div>
                <h1
                  className="text-4xl font-serif font-bold leading-tight"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                >
                  {banner.title}
                </h1>
                <p className="mt-4 text-base text-[#F2EDE8]/80 max-w-sm leading-relaxed">
                  {banner.subtitle}
                </p>
                <div className="flex items-center gap-3 my-5">
                  <div
                    className="h-px flex-1 max-w-16"
                    style={{
                      background: `linear-gradient(90deg, ${banner.accentColor}60, transparent)`,
                    }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: banner.accentColor + "80" }}
                  />
                  <div
                    className="h-px w-6"
                    style={{ background: banner.accentColor + "40" }}
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() =>
                      document
                        .getElementById("services")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="border px-6 py-2.5 rounded-full font-semibold font-serif text-sm transition-all cursor-pointer hover:bg-white/10"
                    style={{
                      borderColor: banner.accentColor + "60",
                      color: banner.accentColor,
                    }}
                  >
                    Explore Services
                  </button>
                  <button
                    onClick={scrollToBooking}
                    className="px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer transition-all hover:scale-105 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                      color: "#3B1F1B",
                    }}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full flex justify-center items-center overflow-hidden">
                <div className="relative w-96 aspect-square">
                  <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-25"
                    style={{ background: banner.accentColor }}
                  />
                  <img
                    src={zodiacWheel}
                    className="absolute inset-0 w-full h-full animate-spin-slow opacity-60"
                    loading="lazy"
                    alt="Wheel"
                  />
                  <img
                    src={banner.person}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 z-10 drop-shadow-2xl"
                    loading="lazy"
                    alt="Person"
                  />
                </div>
              </div>
              <Dots />
            </div>
          )}
        </div>

        <div className="md:hidden">
          {banner.type === "seemaa" && (
            <div
              key="seemaa-mob"
              className={`mx-4 rounded-2xl overflow-hidden relative min-h-100 grain-overlay bg-linear-to-br ${banner.bg}`}
            >
              <StarField />
              <div className="absolute inset-0 geo-pattern pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                }}
              />
              <div className="absolute right-0 bottom-0 h-3/4 w-1/2 z-0">
                <img
                  src={seemaaOfferImg}
                  alt="Acharya Seemaa Singh"
                  className="h-full w-full object-cover object-top"
                  style={{
                    maskImage:
                      "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 90%)",
                    WebkitMaskImage:
                      "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 90%)",
                    opacity: 0.45,
                  }}
                />
              </div>
              <div className="relative z-10 flex flex-col text-center px-6 py-10 slide-in">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div
                    className="h-px w-6"
                    style={{ background: banner.accentColor + "80" }}
                  />
                  <span
                    className="text-xs font-semibold tracking-widest uppercase opacity-70"
                    style={{ color: banner.accentColor }}
                  >
                    ✦ Vedic Astrology & Vastu
                  </span>
                  <div
                    className="h-px w-6"
                    style={{ background: banner.accentColor + "80" }}
                  />
                </div>
                <h1 className="text-2xl font-serif font-bold leading-snug text-[#F4E4C1]">
                  Acharya Seemaa Singh
                </h1>
                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: banner.accentColor }}
                >
                  Astrologer · Vastu Expert · Life Coach
                </p>
                <p className="mt-3 text-sm text-[#F2EDE8]/75 leading-relaxed max-w-xs mx-auto">
                  20+ years of authentic Vedic wisdom guiding 50,000+ clients
                  through life, career, relationships & beyond.
                </p>
                <div className="flex justify-center gap-6 mt-4 mb-5">
                  {[
                    { num: "20+", label: "Years" },
                    { num: "50K+", label: "Clients" },
                    { num: "100%", label: "Authentic" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p
                        className="text-lg font-bold font-serif"
                        style={{ color: banner.accentColor }}
                      >
                        {stat.num}
                      </p>
                      <p className="text-[#F2EDE8]/60 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() =>
                      document
                        .getElementById("services")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="border px-6 py-2 rounded-full font-semibold font-serif text-sm cursor-pointer"
                    style={{
                      borderColor: banner.accentColor + "60",
                      color: banner.accentColor,
                    }}
                  >
                    Explore Services
                  </button>
                  <button
                    onClick={scrollToBooking}
                    className="px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                      color: "#3B1F1B",
                    }}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
              <MobileDots />
            </div>
          )}

          {banner.type === "regular" && (
            <div
              key={`regular-mob-${banner.id}`}
              className={`mx-4 rounded-2xl overflow-hidden relative min-h-100 grain-overlay bg-linear-to-br ${banner.bg}`}
            >
              <StarField />
              <div
                className={`absolute inset-0 pointer-events-none ${banner.patternType === "geometric" ? "geo-pattern" : "cosmic-pattern"}`}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`,
                }}
              />
              {banner.id === 2 ? (
                <>
                  <div
                    className={`relative z-20 text-center px-6 pt-3 ${banner.textColor} slide-in`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2 mt-1">
                      <div
                        className="h-px w-6"
                        style={{ background: banner.accentColor + "60" }}
                      />
                      <span
                        className="text-xs tracking-widest uppercase opacity-60"
                        style={{ color: banner.accentColor }}
                      >
                        ✦ Trusted Guidance
                      </span>
                      <div
                        className="h-px w-6"
                        style={{ background: banner.accentColor + "60" }}
                      />
                    </div>
                    <h1 className="text-xl font-bold leading-snug">
                      {banner.title}
                    </h1>
                    <p className="mt-2 text-sm text-[#F2EDE8]/80">
                      {banner.subtitle}
                    </p>
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={scrollToBooking}
                        className="px-6 py-2 rounded-full font-serif font-semibold text-sm cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                          color: "#3B1F1B",
                        }}
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
                    <div className="relative w-72 aspect-square">
                      <div
                        className="absolute inset-0 rounded-full blur-3xl opacity-20"
                        style={{ background: banner.accentColor }}
                      />
                      <img
                        src={zodiacWheel}
                        className="absolute inset-0 w-full h-full animate-spin-slow opacity-55"
                        alt="Wheel"
                        loading="lazy"
                      />
                      <img
                        src={banner.person}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 z-10 drop-shadow-2xl"
                        alt="Person"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={zodiacWheel}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 animate-spin-slow opacity-55"
                    alt="Wheel"
                    loading="lazy"
                  />
                  <div
                    className={`relative z-20 text-center px-6 pt-40 ${banner.textColor} slide-in`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div
                        className="h-px w-6"
                        style={{ background: banner.accentColor + "60" }}
                      />
                      <span
                        className="text-xs tracking-widest uppercase opacity-60"
                        style={{ color: banner.accentColor }}
                      >
                        ✦ Ancient Wisdom
                      </span>
                      <div
                        className="h-px w-6"
                        style={{ background: banner.accentColor + "60" }}
                      />
                    </div>
                    <h1 className="text-xl font-bold font-serif leading-snug">
                      {banner.title}
                    </h1>
                    <p className="mt-2 text-sm text-[#F2EDE8]/80">
                      {banner.subtitle}
                    </p>
                    <div className="mt-3 flex flex-col items-center gap-3">
                      <button
                        onClick={() =>
                          document
                            .getElementById("services")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="border px-6 py-2.5 rounded-full font-semibold font-serif text-sm cursor-pointer"
                        style={{
                          borderColor: banner.accentColor + "60",
                          color: banner.accentColor,
                        }}
                      >
                        Explore Services
                      </button>
                      <button
                        onClick={scrollToBooking}
                        className="px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                          color: "#3B1F1B",
                        }}
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                </>
              )}
              <MobileDots />
            </div>
          )}
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