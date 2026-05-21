import React from "react";
import { useNavigate } from "react-router-dom";
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

const Horoscope = () => {
  const navigate = useNavigate();

  const handleClick = (sign) => {
    navigate("/horoscopebrief", { state: { selectedSign: sign.name } });
  };

  return (
    <section className="w-full py-14 px-4 bg-[#FFF9F2]">
      <h2 className="text-center text-3xl md:text-4xl font-serif text-[#7A1E1E] mb-4">
        Know What Your Zodiac Sign Says About You
      </h2>

      <p className="text-center text-sm md:text-base text-[#7A1E1E]/80 mb-10">
        Click on the Rashi to know about your Personality, Traits, Life
        Predictions, and Remedies!
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-6">
        {signs.map((sign, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => handleClick(sign)}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={sign.image}
                alt={sign.name}
                loading="lazy"
                className="w-16 h-16 md:w-18 md:h-18 object-contain"
              />
            </div>

            <p className="mt-3 text-sm font-serif font-semibold tracking-wide text-[#7A1E1E]">
              {sign.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Horoscope;
