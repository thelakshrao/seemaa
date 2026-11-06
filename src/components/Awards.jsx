import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import award1 from "../img/award1.webp";
import award2 from "../img/award2.webp";
import award3 from "../img/award3.webp";
import award4 from "../img/award4.webp";
import award5 from "../img/award5.webp";
import award6 from "../img/award6.webp";

const awardsData = [
  { title: "On the panel", content: "Acharya Seemaa Singh taking part in a panel discussion at an event.", alt: "Acharya Seemaa Singh seated on a panel at an event", image: award1 },
  { title: "Tarot for Beginners", content: "Presenting her book Tarot for Beginners.", alt: "Acharya Seemaa Singh holding her book Tarot for Beginners", image: award2 },
  { title: "Sharing her book", content: "With a guest and a copy of Tarot for Beginners.", alt: "Acharya Seemaa Singh with a guest and her book Tarot for Beginners", image: award3 },
  { title: "On television", content: "Presenting an astrology segment on a television programme.", alt: "Acharya Seemaa Singh presenting astrology on television", image: award4 },
  { title: "With a guest", content: "Photographed with a guest at an event.", alt: "Acharya Seemaa Singh with a guest at an event", image: award5 },
  { title: "Television appearance", content: "Speaking on a television programme.", alt: "Acharya Seemaa Singh speaking on a television programme", image: award6 },
];

const Awards = () => {
  const [index, setIndex] = useState(0);
  const current = awardsData[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % awardsData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full px-2 sm:px-4 py-8 sm:py-12 bg-[#7A1E1E] overflow-hidden">

      <div className="absolute inset-0 stars animate-stars z-0"></div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-12 right-12 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/25 blur-2xl animate-float"></div>
      </div>

      <h2 className="relative z-10 text-center text-2xl sm:text-3xl md:text-4xl font-serif text-[#F4C430] mb-6 sm:mb-10">
        Achievements & Celebrated Faces
      </h2>
      <p className="relative z-10 text-center -mt-4 mb-6 sm:mb-8">
        <Link to="/press" className="text-[#F4C430] underline font-semibold hover:text-white">
          See where she has been featured →
        </Link>
      </p>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl p-4 sm:p-6 md:p-10">

          <div className="flex flex-col md:flex-row gap-4 sm:gap-8">

            <div className="w-full md:w-1/2 flex flex-col justify-between order-2 md:order-1">

              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 flex-nowrap md:flex-wrap mb-2 sm:mb-4 no-scrollbar">
                {awardsData.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden cursor-pointer border-2 transition-all
                      ${index === i ? "grayscale-0 border-[#7A1E1E]" : "grayscale border-transparent opacity-70"}
                    `}
                  >
                    <img src={item.image} alt={item.alt} className="w-full h-full object-cover"
                    loading="lazy" />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-[#7A1E1E] mb-2 sm:mb-3">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-snug sm:leading-relaxed mb-4 sm:mb-6">
                  {current.content}
                </p>

                <button
                  onClick={() => setIndex((index + 1) % awardsData.length)}
                  className="mt-2 sm:mt-4 text-[#7A1E1E] font-semibold hover:underline text-xs sm:text-sm md:text-base w-fit"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center items-center order-1 md:order-2 mb-4 sm:mb-6 md:mb-0">
              <div className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#F4C430]">
                <img src={current.image} alt={current.alt} className="w-full h-full object-cover" 
                loading="lazy"/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
