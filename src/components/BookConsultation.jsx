import React, { useEffect, useRef, useState } from "react";
import zodiacWheel from "../img/zodiacwheel.png";
import seemaapic1 from "../img/seemaafullpic.png";
import Navbar from "./Navbar";
import Booking from "./Booking";
import Footer from "./Footer";

const BookConsultation = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full mt-20 bg-gray-50 flex justify-center px-3 md:px-6 animate-slide-up">
        <section
          ref={sectionRef}
          className="w-full max-w-6xl relative py-10 md:py-24 my-4 md:my-10 flex flex-col items-center justify-center px-4 md:px-8 bg-linear-to-r from-[#7A1E1E] to-[#3B1F1B] overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="absolute w-32 h-32 md:w-72 md:h-72 rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse" />
            <div className="w-32 h-32 md:w-96 md:h-96 rounded-full overflow-hidden animate-spin-slow opacity-80">
              <img
                src={zodiacWheel}
                alt="Zodiac Wheel"
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="relative z-10 text-xl md:text-5xl font-serif font-bold mb-2 md:mb-3 text-center text-[#F2EDE8]">
            Over 50,000 People Found Clarity
          </h1>

          <p className="relative z-10 text-sm md:text-2xl font-serif mb-2 md:mb-3 text-center text-[#F2EDE8]">
            What are you thinking about today? Let the stars guide you.
          </p>

          <p className="relative z-10 max-w-md md:max-w-xl text-xs md:text-lg text-[#F2EDE8] text-center mb-4 md:mb-5">
            Discover your true path with personalized insights from Acharya
            Seemaa Singh, a renowned astrologer, numerologist, and healer.
          </p>

          <button
            onClick={() => {
              document.getElementById("booking")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="relative z-10 bg-[#F4C430] text-[#7A1E1E] w-36 md:w-52 py-2 md:py-3 rounded-full font-serif font-semibold cursor-pointer text-xs md:text-base"
          >
            Book Consultation
          </button>
        </section>
      </div>

      <section className="w-full bg-[#FFF6EB] py-12 md:py-20 px-3 md:px-4 animate-slide-up">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-serif text-[#7A1E1E] mb-2 md:mb-3">
            How the Consultation Process Flows
          </h2>
          <p className="text-xs md:text-base text-gray-600 mb-8 md:mb-14">
            Clear • Simple • Effective
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {[
              {
                step: "STEP 1",
                title: "Schedule Your Call",
                desc: "Choose a time slot and briefly share what you'd like guidance on.",
              },
              {
                step: "STEP 2",
                title: "One-on-One Insight",
                desc: "Connect with an astrologer for focused, personalized guidance.",
              },
              {
                step: "STEP 3",
                title: "Clarity & Direction",
                desc: "Leave with confidence, clarity, and practical next steps.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-white border border-[#923131]  rounded-xl
              p-4 md:p-8 w-full md:w-1/3"
              >
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2
                bg-white border border-[#923131] 
                px-3 py-0.5 md:px-4 md:py-1
                rounded-full text-[10px] md:text-sm font-semibold"
                >
                  {item.step}
                </span>

                <h3 className="text-base md:text-xl font-serif text-[#7A1E1E] mb-2 md:mb-4 mt-2">
                  {item.title}
                </h3>

                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-[#FFF9F4]">
        <h2 className="text-center text-2xl md:text-4xl font-serif mb-10">
          Why Choose{" "}
          <span className="text-[#7A1E1E]">Acharya Seemaa Singh?</span>
        </h2>

        <div
          ref={sectionRef}
          className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center"
        >
          <div
            className={`flex justify-center transition-all duration-1000 ease-out transform ${
              animate
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-yellow-200 to-orange-100 blur-2xl"></div>
              <img
                src={seemaapic1}
                alt="Acharya Seemaa Singh"
                loading="lazy"
                className="relative rounded-full max-w-xs md:max-w-sm w-full object-cover"
              />
            </div>
          </div>

          <div
            className={`space-y-5 transition-all duration-1000 ease-out transform ${
              animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                ☞ Vast Experience & Deep Knowledge
              </h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                With over two decades of expertise in Vedic Astrology,
                Numerology, Tarot, Cartomancy, Aura Reading, Energy Dowsing, and
                Vaastu, Acharya Seemaa Singh blends classical wisdom with
                intuitive insight to guide individuals toward clarity and
                balance.
              </p>
            </div>

            <div className="bg-[#FFF3E6] rounded-xl p-5 shadow-sm border">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                ☞ Compassionate Healer & Ethical Guidance
              </h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                A natural healer with deep empathy, she believes astrology is a
                tool for empowerment and healing — not fear. Every consultation
                is conducted with honesty, confidentiality, and karmic
                integrity.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                ☞ Rare Expertise & Global Recognition
              </h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                One of the few experts in Cartomancy using playing cards,
                Acharya Seemaa Singh has international exposure from Canada,
                media features, radio shows, and guest lectures — making her
                guidance both trusted and globally respected.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Booking />
      <Footer />
    </>
  );
};

export default BookConsultation;
