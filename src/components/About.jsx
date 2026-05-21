import React, { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Seemaa from "../img/seemaa.png";
import Review from "./Review";
import BookConsultation from "./Booking";
import Footer from "./Footer";
import serviceBg from "../img/servicebg.png";
import aboutseemaapic2 from "../img/aboutseemaapic2.webp";
import CountUp from "./CountUp";
const About = () => {
  const sectionRefMobile = useRef(null);
  const sectionRefDesktop = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRefMobile.current) observer.observe(sectionRefMobile.current);
    if (sectionRefDesktop.current) observer.observe(sectionRefDesktop.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {isMobile ? (
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-8 my-10">
          <div className="w-full max-w-sm flex flex-col bg-[#7A1E1E] overflow-hidden items-center justify-center my-6 px-4 py-4 rounded-xl animate-slide-up">
            <div className="absolute inset-0 stars animate-stars z-0"></div>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow"></div>
              <div className="absolute bottom-16 right-16 w-56 h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit"></div>
              <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/25 blur-2xl animate-float"></div>
            </div>
            <img
              src={Seemaa}
              alt="Acharya Seemaa Singh"
              loading="lazy"
              className="w-36 max-w-full h-auto object-cover bg-[#FAF9F6] rounded-full shadow-lg mb-4"
            />
            <h2 className="text-2xl font-bold font-serif text-[#F4C430] mb-2 text-center">
              Acharya Seemaa Singh
            </h2>

            <ul className="flex flex-wrap justify-center gap-2 mb-3 text-[#FAF9F6]">
              <li className="px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif">
                Astrologer
              </li>
              <li className="px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif">
                Astro-Healer
              </li>
              <li className="px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif">
                Numerologist
              </li>
              <li className="px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif">
                Tarot Expert
              </li>
              <li className="px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif">
                Cartomancy Expert
              </li>
            </ul>

            <p className="text-[#FAF9F6] text-sm leading-relaxed text-center">
              A distinguished astrologer and astro-healer with over two decades
              of experience guiding individuals through Vedic Astrology,
              Numerology, Tarot, Cartomancy, Aura Reading, Energy Dowsing, and
              Vaastu Consultancy.
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full items-center animate-slide-up">
            <div className="w-full max-w-sm flex flex-col items-center gap-4">
              <img
                src={aboutseemaapic2}
                alt="About Seemaa"
                loading="lazy"
                className="w-full rounded-2xl shadow-xl border-4 border-[#F4C430] object-cover"
              />
            </div>

            <div className="w-full max-w-sm flex flex-col items-center gap-4">
              <h3 className="text-[#7A1E1E] text-2xl mb-2 font-serif">
                Astrological Journey
              </h3>
              <div className="w-full bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md">
                <h4 className="text-xl text-[#F4C430] text-center font-semibold mb-1 font-serif">
                  Academic Excellence
                </h4>
                <p className="text-[#FAF9F6] text-center text-sm leading-relaxed">
                  Topped the Jyotish Visharad program conducted by the Indian
                  Council of Astrological Studies and received the Degree in
                  Jyotish (2001–2002) in Chandigarh.
                </p>
              </div>
              <div className="w-full bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md">
                <h4 className="text-xl text-[#F4C430] text-center font-semibold mb-1 font-serif">
                  Areas of Expertise
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-[#FAF9F6] text-center text-sm leading-relaxed">
                  <li>Vedic Astrology</li>
                  <li>Numerology</li>
                  <li>Tarot Reading</li>
                  <li>Cartomancy</li>
                  <li>Aura Reading</li>
                  <li>Energy Dowsing</li>
                  <li>Vaastu</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="w-full flex justify-center">
            <div className="md:hidden w-full py-10 px-4 flex justify-center">
              <div className="max-w-md w-full text-center">
                <h2 className="text-2xl font-serif font-bold text-[#7A1E1E] mb-2">
                  Acharya Seemaa Singh
                </h2>

                <p className="text-sm font-semibold font-serif text-gray-700 mb-4">
                  Astrologer • Astro-Healer • Numerologist
                </p>

                <p className="text-gray-600 text-sm leading-relaxed">
                  Acharya Seemaa Singh is a trusted spiritual guide with decades
                  of experience in astrology and healing sciences, helping
                  people find clarity and balance in life.
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mt-3">
                  Her compassionate guidance supports individuals in
                  relationships, career growth, health, and overall well-being.
                </p>
              </div>
            </div>
          </section>

          <section
            ref={sectionRefMobile}
            className={`w-full bg-[#7A1E1E] overflow-hidden py-8 px-4 sm:py-12 sm:px-8 rounded-2xl transition-all duration-700 ${
              animate ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
          >
            <div className="absolute inset-0 stars animate-stars z-0"></div>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#F4C430]/40 blur-2xl animate-spin-slow sm:w-44 sm:h-44"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit sm:w-56 sm:h-56 sm:bottom-16 sm:right-16"></div>
              <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-white/25 blur-xl animate-float sm:w-32 sm:h-32"></div>
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#F4C430] text-center py-6 sm:py-8">
                Global Learning & Collaborations
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-center">
                <div className="bg-[#FAF9F6] overflow-hidden rounded-xl p-4 sm:p-6 border-l-4 border-[#F4C430] shadow-md">
                  <h3 className="text-lg sm:text-xl font-bold text-[#7A1E1E] mb-1 sm:mb-2 font-serif">
                    Advanced Studies in Vancouver
                  </h3>
                  <p className="text-[#7A1E1E] leading-relaxed text-xs sm:text-sm">
                    During her stay in Vancouver, Canada, she pursued advanced
                    studies in Aura Reading and Energy Dowsing.
                  </p>
                </div>
                <div className="bg-[#FAF9F6] overflow-hidden rounded-xl p-4 sm:p-6 border-l-4 border-[#F4C430] shadow-md">
                  <h3 className="text-lg sm:text-xl font-bold text-[#7A1E1E] mb-1 sm:mb-2 font-serif">
                    Professional Associations
                  </h3>
                  <p className="text-[#7A1E1E] leading-relaxed text-xs sm:text-sm">
                    Member of Fraser Valley Astrological Guild (FVAG)
                  </p>
                  <p className="text-[#7A1E1E] leading-relaxed text-xs sm:text-sm">
                    Associated with American Institute of Vedic Studies (USA),
                    led by renowned scholar David Frawley
                  </p>
                </div>
                <div className="bg-[#FAF9F6] overflow-hidden col-span-1 sm:col-span-2 rounded-xl p-4 sm:p-6 border-l-4 border-[#F4C430] shadow-md">
                  <h3 className="text-lg sm:text-xl font-bold text-[#7A1E1E] mb-1 sm:mb-2 font-serif">
                    Guest Speaker
                  </h3>
                  <p className="text-[#7A1E1E] leading-relaxed text-xs sm:text-sm">
                    Frequently invited as a guest speaker at YMCA and other
                    prestigious forums, where she shared insights on astrology,
                    healing, and spiritual awareness.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 mt-25 px-8">
          <section className="relative w-full flex flex-col bg-[#7A1E1E] overflow-hidden items-center justify-center animate-slide-up gap-8 p-8 rounded-xl">
            <div className="absolute inset-0 stars animate-stars z-0"></div>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow"></div>
              <div className="absolute bottom-16 right-16 w-56 h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit"></div>
              <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/25 blur-2xl animate-float"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
              <img
                src={Seemaa}
                alt="Acharya Seemaa Singh"
                className="w-60 md:w-80 h-auto mt-5 bg-[#FAF9F6] ring-4 ring-[#F4C430]/50 object-cover rounded-full shadow-xl"
              />

              <div className="flex-1 text-left">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F4C430] mb-4">
                  Acharya Seemaa Singh
                </h2>

                <ul className="flex flex-wrap gap-3 md:gap-4 mb-4 text-[#FAF9F6]">
                  <li className="px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif">
                    Astrologer
                  </li>
                  <li className="px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif">
                    Astro-Healer
                  </li>
                  <li className="px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif">
                    Numerologist
                  </li>
                  <li className="px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif">
                    Tarot Expert
                  </li>
                  <li className="px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif">
                    Cartomancy Expert
                  </li>
                </ul>

                <p className="text-[#FAF9F6] text-base md:text-lg leading-relaxed md:text-justify ">
                  A distinguished astrologer and astro-healer with more than two
                  decades of extensive experience, dedicated to guiding
                  individuals on their life journeys through the profound
                  practices of Vedic Astrology, Numerology, Tarot, Cartomancy,
                  Aura Reading, Energy Dowsing, and Vaastu Consultancy. Renowned
                  for insightful predictions and personalized guidance, helping
                  clients achieve balance, clarity, and fulfillment in all
                  aspects of life.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-4 p-3 rounded-xl w-full max-w-3xl mx-auto mt-2 animate-slide-up bg-[#FAF9F6]">
              <div className="text-center flex-1">
                <h3 className="text-xl md:text-3xl font-bold text-[#7A1E1E]">
                  <CountUp end={20} />+
                </h3>
                <h5 className="text-xs md:text-sm text-[#7A1E1E]/80">
                  Years of Experience
                </h5>
              </div>

              <hr className="w-12 md:w-20 border-[#7A1E1E]/40 md:hidden" />

              <div className="text-center flex-1">
                <h3 className="text-xl md:text-3xl font-bold text-[#7A1E1E]">
                  <CountUp end={50} />
                  K+
                </h3>
                <h5 className="text-xs md:text-sm text-[#7A1E1E]/80">
                  Clients
                </h5>
              </div>

              <hr className="w-12 md:w-20 border-[#7A1E1E]/40 md:hidden" />

              <div className="text-center flex-1">
                <h3 className="text-xl md:text-3xl font-bold text-[#7A1E1E]">
                  <CountUp end={25} />+
                </h3>
                <h5 className="text-xs md:text-sm text-[#7A1E1E]/80">Awards</h5>
              </div>
            </div>
          </section>

          <div
            className="flex flex-row w-full bg-[#FAF9F6] overflow-hidden py-12 items-start justify-center gap-10 animate-slide-up rounded-2xl"
            style={{ backgroundImage: `url(${serviceBg})` }}
          >
            <div className="w-full max-w-sm flex flex-col items-center justify-center gap-4">
              <img
                src={aboutseemaapic2}
                alt="About Seemaa"
                className="w-full mt-13 rounded-2xl shadow-xl border-4 border-[#F4C430] object-cover"
              />
            </div>

            <hr className="hidden md:block bg-[#7A1E1E] w-0.5 h-120" />

            <div className="w-1/2 flex flex-col items-center text-center gap-5">
              <h3 className="text-[#7A1E1E] text-3xl font-bold mb-5 font-serif">
                Astrological Journey & Training
              </h3>
              <div className="w-150 bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md">
                <h4 className="text-2xl text-[#F4C430] font-semibold mb-2 font-serif">
                  Academic Excellence
                </h4>
                <p className="text-[#FAF9F6] text-center leading-relaxed">
                  Topped the Jyotish Visharad program conducted by the Indian
                  Council of Astrological Studies and received the Degree in
                  Jyotish (2001–2002) in Chandigarh.
                </p>
              </div>
              <div className="w-150 bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md">
                <h4 className="text-2xl text-[#F4C430] font-semibold mb-2 font-serif">
                  Areas of Expertise
                </h4>
                <ul className="grid grid-cols-3 gap-2 text-[#FAF9F6] text-center leading-relaxed ">
                  <li>Vedic Astrology</li>
                  <li>Numerology</li>
                  <li>Tarot Reading</li>
                  <li>Cartomancy</li>
                  <li>Aura Reading</li>
                  <li>Energy Dowsing</li>
                  <li>Vaastu</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="w-full py-16 px-4 flex justify-center">
            <div className="max-w-5xl w-full text-center">
              {/* <div className="flex justify-center mb-8">
                <img
                  src={aboutseemaapic1}
                  alt="Acharya Seemaa Singh"
                  className="w-72 h-72 object-cover rounded-2xl shadow-lg"
                />
              </div> */}

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#7A1E1E] mb-4">
                Acharya Seemaa Singh
              </h2>

              <p className="text-lg font-semibold font-serif text-gray-700 mb-6">
                Astrologer • Astro-Healer • Numerologist • Tarot & Cartomancy
                Expert
              </p>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                Acharya Seemaa Singh is a highly respected spiritual guide with
                more than two decades of experience in Vedic Astrology,
                Numerology, Tarot, and Astro-Healing. Her guidance brings
                clarity, balance, and peace to those seeking direction in life.
              </p>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
                Known for her accurate insights and compassionate approach, she
                helps individuals overcome challenges related to relationships,
                career, health, finances, and overall well-being through ancient
                wisdom and modern understanding.
              </p>
            </div>
          </section>

          <section
            ref={sectionRefDesktop}
            className={`w-full bg-[#7A1E1E] overflow-hidden py-12 px-8 rounded-2xl transition-all duration-700 ${
              animate ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          >
            <div className="absolute inset-0 stars animate-stars z-0"></div>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow"></div>
              <div className="absolute bottom-16 right-16 w-56 h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit"></div>
              <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/25 blur-2xl animate-float"></div>
            </div>
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold font-serif text-[#F4C430] text-center py-8">
                Global Learning & Collaborations
              </h2>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-[#FAF9F6] overflow-hidden rounded-xl p-6 border-l-4 border-[#F4C430] shadow-md">
                  <h3 className="text-xl font-serif font-bold text-[#7A1E1E] mb-2">
                    Advanced Studies in Vancouver
                  </h3>
                  <p className="text-[#7A1E1E] leading-relaxed text-sm md:text-base">
                    During her stay in Vancouver, Canada, she pursued advanced
                    studies in Aura Reading and Energy Dowsing.
                  </p>
                </div>
                <div className="bg-[#FAF9F6] overflow-hidden rounded-xl p-6 border-l-4 border-[#F4C430] shadow-md">
                  <h3 className="text-xl font-serif font-bold text-[#7A1E1E] mb-2">
                    Professional Associations
                  </h3>
                  <p className="text-[#7A1E1E] leading-relaxed text-sm md:text-base">
                    Member of Fraser Valley Astrological Guild (FVAG)
                  </p>
                  <p className="text-[#7A1E1E] leading-relaxed text-sm md:text-base">
                    Associated with American Institute of Vedic Studies (USA),
                    led by renowned scholar David Frawley
                  </p>
                </div>
                <div className="col-span-2 bg-[#FAF9F6] overflow-hidden rounded-xl p-6 border-l-4 border-[#F4C430] shadow-md">
                  <h3 className="text-xl font-serif font-bold text-[#7A1E1E] mb-2">
                    Guest Speaker
                  </h3>
                  <p className="text-[#7A1E1E] leading-relaxed text-sm md:text-base">
                    Frequently invited as a guest speaker at YMCA and other
                    prestigious forums, where she shared insights on astrology,
                    healing, and spiritual awareness.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      <Review />
      <BookConsultation />
      <Footer />
    </>
  );
};

export default About;
