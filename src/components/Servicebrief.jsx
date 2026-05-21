import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Bookcunsultation from "./Booking";
import Footer from "./Footer";
import seemaapic1 from "../img/seemaapic1.png";
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

const servicesData = {
  "relationship-challenges": {
    title: "Relationship Challenges",
    icon: <FaHeart size={60} className="text-[#7A1E1E]" />,
    description:
      "Get guidance on resolving emotional conflicts, improving understanding, healing misunderstandings, and building stronger emotional bonds. This service focuses on helping individuals and couples restore harmony and create healthier relationships.",
  },
  "business-setbacks": {
    title: "Business Setbacks",
    icon: <FaBusinessTime size={60} className="text-[#7A1E1E]" />,
    description:
      "Receive insights to navigate business obstacles, recover from failures, understand market challenges, and plan your strategic growth. This service helps you make better business decisions with clarity and confidence.",
  },
  "financial-struggle": {
    title: "Financial Struggle",
    icon: <FaMoneyBillWave size={60} className="text-[#7A1E1E]" />,
    description:
      "Learn how to manage financial difficulties, improve planning, budgeting, savings, and attract prosperity. This service offers guidance on overcoming money-related stress and creating long-term stability.",
  },
  "career-roadblocks": {
    title: "Career Roadblocks",
    icon: <FaUserTie size={60} className="text-[#7A1E1E]" />,
    description:
      "Get support in tackling professional challenges, career confusion, finding the right opportunities, job growth, and enhancing career prospects with the right direction and clarity.",
  },
  "transits-of-the-month": {
    title: "Transits of the Month",
    icon: <FaChartLine size={60} className="text-[#7A1E1E]" />,
    description:
      "Astrological transits help forecast future trends and planetary movements affecting your life. Understand how current cosmic shifts influence your decisions and emotional patterns.",
  },
  "astro-numerology": {
    title: "Astro Numerology",
    icon: <FaHashtag size={60} className="text-[#7A1E1E]" />,
    description:
      "Numerology reveals the hidden influence of numbers on personality, destiny, decision-making, and life events. This service helps you understand life paths, lucky numbers, and karmic lessons.",
  },
  "vedic-astrology": {
    title: "Vedic Astrology",
    icon: <FaStarOfLife size={60} className="text-[#7A1E1E]" />,
    description:
      "Jyotish, the ancient science of light, guides your life decisions through planetary wisdom. Get deep insights into your birth chart, doshas, remedies, and predictions.",
  },
  "vedic-vastu": {
    title: "Vedic Vastu",
    icon: <FaHome size={60} className="text-[#7A1E1E]" />,
    description:
      "Vastu Shastra balances home and office energies for peace, prosperity, and harmony. Learn how directions, placements, and structures influence your well-being and success.",
  },
};

export default function ServiceBrief() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const serviceName = params.get("name");

  const service = servicesData[serviceName];

  useEffect(() => {
    if (service) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [serviceName, service]);

  if (!service) {
    return <div className="p-10 text-center text-red-600 text-xl">Service not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col md:flex-row gap-6 px-4 md:px-20 py-10 items-center md:items-start bg-[#F2EDE8] mt-20">
        <div className="flex justify-center md:w-1/2 mb-6 md:mb-0">
          <div className="p-6 md:p-8 bg-[#F4C430]/20 rounded-3xl shadow-lg flex justify-center items-center w-48 md:w-64 h-48 md:h-64">
            {service.icon}
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-4">{service.title}</h1>
          <p className="text-gray-700 text-sm md:text-lg leading-relaxed">{service.description}</p>
          <button
            onClick={() => navigate("/cunsultation")}
            className="mt-6 bg-[#7A1E1E] text-[#F2EDE8] px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
      <section className="py-12 px-4 md:px-20 bg-[#F2EDE8] flex flex-col md:flex-row items-center gap-6">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-4">About Acharya Seemaa Singh</h2>
          <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
            Acharya Seemaa Singh is a distinguished astrologer and astro-healer with over two decades of experience guiding individuals through Vedic Astrology, Numerology, Tarot, Aura Reading, Energy Dowsing, and Vastu consultancy. She combines ancient wisdom with modern insights to provide accurate predictions and practical solutions.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={seemaapic1}
            alt="Acharya Seemaa Singh"
            className="rounded-3xl w-48 md:w-96 h-48 md:h-96 object-cover shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      <section className="py-12 px-4 md:px-20 bg-[#F2EDE8] text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6">Why Choose Us</h2>
        <p className="text-gray-700 text-sm md:text-lg max-w-3xl mx-auto mb-8">
          We prioritize personal guidance, accurate analysis, and holistic solutions to improve your life. Our clients trust us for clarity, reliability, and deep insight into personal, professional, and financial aspects of life.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-centermb-2">Expert Guidance</h3>
            <p className="text-gray-700 text-xs md:text-sm">Decades of expertise in astrology and numerology ensure precise insights and remedies.</p>
          </div>
          <div className="bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-centermb-2">Personalized Approach</h3>
            <p className="text-gray-700 text-xs md:text-sm">Tailored solutions to fit your unique life situation and challenges.</p>
          </div>
          <div className="bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-centermb-2">Trusted Results</h3>
            <p className="text-gray-700 text-xs md:text-sm">Proven client satisfaction with meaningful outcomes in relationships, career, and finance.</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-20 bg-[#F2EDE8]">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6">Our Services</h2>
        <div className="overflow-x-auto flex gap-4 md:grid md:grid-cols-4">
          {Object.values(servicesData).map((item, index) => (
            <div
              key={index}
              className="shrink md:shrink-0 bg-[#F2EDE8] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center p-4 md:p-6 border-2 border-[#F4C430]/40 min-w-62.5 md:min-w-0"
            >
              <div className="p-4 md:p-6 bg-[#F4C430]/20 rounded-3xl mb-4 flex justify-center items-center transition-transform duration-700 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-lg md:text-xl font-serif  font-semibold text-[#7A1E1E] mb-2">{item.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm">{item.description}</p>
              <button
                onClick={() => navigate("/cunsultation")}
                className="mt-4 bg-[#7A1E1E] text-[#F2EDE8] font-serif text-center px-4 md:px-6 py-2 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <Bookcunsultation />
      <Footer />
    </>
  );
}
