import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SeemaaPic from "../img/seemaapic2.webp";
import aries from "../img/aries.webp";
import taurus from "../img/taurus.webp";
import gemini from "../img/gemini.webp";
import cancer from "../img/cancer.webp";
import leo from "../img/leo.webp";
import virgo from "../img/virgo.webp";
import libra from "../img/libra.webp";
import scorpio from "../img/scorpio.webp";
import sagittarius from "../img/sagittarius.webp";
import capricorn from "../img/capricorn.webp";
import aquarius from "../img/aquarius.webp";
import pisces from "../img/pisces.webp";
import Navbar from "./Navbar";
import Booking from "./Booking";
import Footer from "./Footer";

const horoscopeBriefs = {
  ARIES:
    "Aries are courageous, determined, confident, and enthusiastic. They are natural leaders. " +
    "They love challenges and take initiative in most situations. " +
    "Aries are highly energetic and love adventure. " +
    "They can sometimes be impulsive but are always honest. " +
    "Their passion inspires others around them.",

  TAURUS:
    "Taurus are reliable, patient, practical, devoted, and responsible. " +
    "They enjoy stability and comfort in life. " +
    "Taurus values loyalty and has a strong sense of perseverance. " +
    "They appreciate beauty and are often drawn to art and nature. " +
    "They can be stubborn, but their determination helps them achieve goals.",

  GEMINI:
    "Gemini are adaptable, curious, affectionate, and quick-witted. " +
    "They love learning and communication, often making great conversationalists. " +
    "Geminis are versatile and enjoy variety in life. " +
    "They can be playful and social, making friends easily. " +
    "Their curiosity drives them to explore new ideas constantly.",

  CANCER:
    "Cancer are loyal, emotional, sympathetic, and persuasive. " +
    "They value family and home above all else. " +
    "Cancers are deeply intuitive and often sense the emotions of others. " +
    "They are nurturing and protective of loved ones. " +
    "Their strong emotional depth allows them to connect meaningfully.",

  LEO:
    "Leo are creative, passionate, generous, and cheerful. " +
    "They love being in the spotlight and inspiring others. " +
    "Leos are natural leaders with a strong sense of pride. " +
    "They are warm-hearted and often very charismatic. " +
    "Their confidence and determination help them achieve great things.",

  VIRGO:
    "Virgo are loyal, analytical, kind, hardworking, and practical. " +
    "They value precision, order, and attention to detail. " +
    "Virgos are excellent problem-solvers and planners. " +
    "They often seek perfection in their work and personal life. " +
    "Their helpful nature makes them dependable friends and partners.",

  LIBRA:
    "Libra are cooperative, diplomatic, gracious, and fair-minded. " +
    "They value harmony and strong relationships. " +
    "Libras are social and enjoy connecting with people. " +
    "They are idealistic and often seek balance in all areas of life. " +
    "Their charm and tact make them natural peacemakers.",

  SCORPIO:
    "Scorpio are resourceful, brave, passionate, and stubborn. " +
    "They are deeply emotional and highly intuitive. " +
    "Scorpios are determined and often achieve great success. " +
    "They value loyalty and expect the same from others. " +
    "Their intensity and focus make them powerful leaders.",

  SAGITTARIUS:
    "Sagittarius are generous, idealistic, and have a great sense of humor. " +
    "They love adventure, travel, and exploring new horizons. " +
    "Sagittarians are optimistic and enthusiastic. " +
    "They value freedom and independence. " +
    "Their curiosity and philosophical nature make them lifelong learners.",

  CAPRICORN:
    "Capricorn are responsible, disciplined, self-controlled, and good managers. " +
    "They aim high and work diligently to achieve their goals. " +
    "Capricorns value tradition and structure. " +
    "They are practical, patient, and reliable. " +
    "Their perseverance allows them to overcome challenges effectively.",

  AQUARIUS:
    "Aquarius are progressive, original, independent, and humanitarian. " +
    "They love innovation and thinking outside the box. " +
    "Aquarians are often visionaries and forward-thinkers. " +
    "They value friendship and equality. " +
    "Their creativity and intellect inspire those around them.",

  PISCES:
    "Pisces are compassionate, artistic, intuitive, gentle, and wise. " +
    "They are deeply empathetic and often understand others' emotions. " +
    "Pisces are imaginative and love creative expression. " +
    "They are kind-hearted and often help those in need. " +
    "Their dreamy nature allows them to see possibilities others might miss.",
};

const signs = [
  { name: "ARIES", image: aries },
  { name: "TAURUS", image: taurus },
  { name: "GEMINI", image: gemini },
  { name: "CANCER", image: cancer },
  { name: "LEO", image: leo },
  { name: "VIRGO", image: virgo },
  { name: "LIBRA", image: libra },
  { name: "SCORPIO", image: scorpio },
  { name: "SAGITTARIUS", image: sagittarius },
  { name: "CAPRICORN", image: capricorn },
  { name: "AQUARIUS", image: aquarius },
  { name: "PISCES", image: pisces },
];

const HoroscopeBrief = () => {
  const location = useLocation();
  const [selected, setSelected] = useState("ARIES");

  useEffect(() => {
    if (location.state?.selectedSign) {
      setSelected(location.state.selectedSign);
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  return (
    <>
      <Navbar />
      <section id="horoscope" className="w-full h-auto mt-15 py-2 px-4 bg-[#FFF9F2]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-10 animate-slide-up">
          <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 md:w-64 md:h-64 rounded-full bg-white flex items-center justify-center p-4 sm:p-6 shadow-lg">
            <img
              src={signs.find((s) => s.name === selected).image}
              alt={selected}
              loading="lazy"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="flex-1 text-[#7A1E1E] flex flex-col justify-center text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-serif font-bold mb-3">
              {selected}
            </h2>
            <p className="text-sm sm:text-base md:text-lg md:text-justify text-center leading-6 sm:leading-7 md:leading-8">
              {horoscopeBriefs[selected]}
            </p>
          </div>
        </div>

        <div className="text-center mb-10 mt-20 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A1E1E] font-bold mb-3">
            Discover Your Zodiac Sign
          </h1>
          <p className="text-[#7A1E1E]/80 text-sm sm:text-base md:text-lg">
            Click on a sign to know about your personality, traits, and life
            predictions.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 animate-slide-up">
          {signs.map((sign) => (
            <div
              key={sign.name}
              className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-transform duration-300 ${
                selected === sign.name
                  ? "bg-[#F4C430]/30 shadow-lg scale-105"
                  : "bg-white shadow-md hover:scale-105"
              }`}
              onClick={() => setSelected(sign.name)}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden p-2">
                <img
                  src={sign.image}
                  alt={sign.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 object-contain"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm md:text-base font-serif font-semibold text-[#7A1E1E] tracking-wide text-center">
                {sign.name}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full py-16 px-4 flex justify-center">
          <div className="max-w-5xl w-full text-center">
            <div className="flex justify-center mb-8">
              <img
                src={SeemaaPic}
                alt="Acharya Seemaa Singh"
                className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#7A1E1E] mb-4">
              Acharya Seemaa Singh
            </h2>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
              Acharya Seemaa Singh is a renowned astrologer with years of
              experience in reading zodiac signs and providing precise horoscope
              guidance. Her deep understanding of planetary positions and
              astrological charts allows her to deliver accurate predictions.
              Known for her empathetic approach, she not only predicts but also
              guides her clients on remedies and life choices. Many people trust
              her for personal, professional, and spiritual insights. Her
              dedication and expertise make her one of the most respected names
              in astrology today.
            </p>
          </div>
        </div>
      </section>

      <Booking />
      <Footer />
    </>
  );
};

export default HoroscopeBrief;
