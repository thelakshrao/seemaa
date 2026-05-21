import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import serviceBg from "../img/servicebg.png";
import {
  FaHeart,
  FaBusinessTime,
  FaMoneyBillWave,
  FaUserTie,
  FaChartLine,
  FaHashtag,
  FaStarOfLife,
  FaHome,
} from "react-icons/fa";

const Services = [
  {
    title: "Relationship Challenges",
    desc: "Guidance on overcoming personal conflicts, misunderstandings, and building stronger emotional bonds.",
    icon: <FaHeart size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Business Setbacks",
    desc: "Insights to navigate obstacles in business ventures, recover from losses, and plan strategic growth.",
    icon: <FaBusinessTime size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Financial Struggle",
    desc: "Advice on managing financial difficulties, improving budgeting, and attracting prosperity.",
    icon: <FaMoneyBillWave size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Career Roadblocks",
    desc: "Support for tackling professional challenges, finding growth opportunities, and enhancing career prospects.",
    icon: <FaUserTie size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Transits of the Month",
    desc: "Astrological transits help forecast future trends and planetary movements affecting your life.",
    icon: <FaChartLine size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Astro Numerology",
    desc: "Numerology reveals the occult influence of numbers on personality, destiny, and life paths.",
    icon: <FaHashtag size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Vedic Astrology",
    desc: "Jyotish is the ancient science of light, guiding life decisions through planetary wisdom.",
    icon: <FaStarOfLife size={50} className="text-[#7A1E1E]" />,
  },
  {
    title: "Vedic Vastu",
    desc: "Vastu Shastra balances energies of space for peace, prosperity, and harmony.",
    icon: <FaHome size={50} className="text-[#7A1E1E]" />,
  },
];

const Service = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="w-full px-5 py-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${serviceBg})` }}
    >
      <h2 className="text-4xl py-5 font-semibold text-center text-[#7A1E1E] font-serif">
        Our Services
      </h2>

      <div className="overflow-x-auto sm:overflow-x-hidden">
        <div className="flex gap-6 w-full py-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {Services.map((item, index) => {
            const urlName = item.title.toLowerCase().replace(/\s+/g, "-");

            return (
              <div
                key={index}
                className={`group relative bg-[#F2EDE8] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center p-6 border-2 border-[#F4C430]/40 ${
                  animate ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                }`}
                style={{ minWidth: "300px" }}
              >
                <div className="p-6 bg-[#F4C430]/20 rounded-3xl mb-4 flex justify-center items-center transition-transform duration-700 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#7A1E1E] mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.desc}</p>

                <div className="mt-4">
                  <Link to={`/servicebrief?name=${urlName}`}>
                    <button className="bg-[#7A1E1E] text-[#F2EDE8] px-6 py-2 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer">
                      Consult Now
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Service;
