import { useNavigate } from "react-router-dom";
import seemaaPic from "../img/seemaa.png";
import CountUp from "./CountUp";

const Seemaa = () => {
  const navigate = useNavigate();
  return (
    <section className="flex w-full px-4 py-12 bg-[#FAF9F6] flex-col">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 animate-slide-up">
        <div className="flex flex-col md:flex-1 items-center gap-4 animate-slide-up">
          <div className="flex items-center md:flex-col gap-4 md:gap-2">
            <img
              src={seemaaPic}
              alt="Seemaa"
              className="w-36 md:w-80 h-auto object-contain rounded-3xl shadow-xl ring-4 ring-[#F4C430]/50"
              loading="lazy"
            />

            <div className="flex flex-col md:hidden">
              <span className="text-l font-bold font-serif text-[#7A1E1E]">
                Seemaa Singh
              </span>
              <span className="text-sm text-[#7A1E1E]/80">Astrologer</span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center mt-2">
            <span className="text-2xl font-bold font-serif text-[#7A1E1E]">
              Seemaa Singh
            </span>
            <span className="text-lg text-[#7A1E1E]/80">Astrologer</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 md:space-y-6 text-center md:text-justify animate-slide-up">
          <h1 className="text-2xl md:text-5xl font-serif font-bold text-[#7A1E1E]">
            Welcome
          </h1>
          <p className="text-sm md:text-lg leading-relaxed">
            <span className="font-semibold font-serif text-[#7A1E1E]">SEEMAA</span> – A Research scholar & astrologer. Seemaa carved her niche in the field of astrology since her young age. She was always attracted to the mystery of future-telling and got her education from Bhartiya Vidya Bhawan, Chandigarh, India. After completion of her course in astrology she found herself incomplete and restless because somewhere in her mind she was not satisfied with her studies in astrology. She devoted two years of her life for advanced studies in astrology from her guru who taught her the judicious application and use of Mithraism and Occultism.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
            <button
              onClick={() => {
                document.getElementById("booking")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-[#7A1E1E] text-[#FAF9F6] font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:bg-[#F4C430] hover:text-[#7A1E1E] transition text-sm sm:text-base cursor-pointer font-serif"
            >
              Book Consultant
            </button>
            <button
              onClick={() => navigate("/about")}
              className="border-2 border-[#7A1E1E] text-[#7A1E1E] font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-[#7A1E1E] hover:text-[#FAF9F6] transition text-sm sm:text-base cursor-pointer font-serif"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 rounded-xl w-full max-w-3xl mx-auto mt-6 animate-slide-up">

        <div className="text-center flex-1">
          <h3 className="text-l md:text-3xl font-bold text-[#7A1E1E]">
            <CountUp end={20} />+
          </h3>
          <h5 className="text-xs md:text-sm text-[#7A1E1E]/80">
            Years of Experience
          </h5>
        </div>

        <hr className="w-16 md:w-20 border-[#7A1E1E]/40 md:hidden" />

        <div className="text-center flex-1">
          <h3 className="text-l md:text-3xl font-bold text-[#7A1E1E]">
            <CountUp end={50} />K+
          </h3>
          <h5 className="text-xs md:text-sm text-[#7A1E1E]/80">Clients</h5>
        </div>

        <hr className="w-16 md:w-20 border-[#7A1E1E]/40 md:hidden" />

        <div className="text-center flex-1">
          <h3 className="text-l md:text-3xl font-bold text-[#7A1E1E]">
            <CountUp end={25} />+
          </h3>
          <h5 className="text-xs md:text-sm text-[#7A1E1E]/80">Awards</h5>
        </div>

      </div>
    </section>
  );
};

export default Seemaa;
