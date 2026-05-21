import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logoastrologer.png";
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

const services = [
  "Relationship Challenges",
  "Business Setbacks",
  "Financial Struggle",
  "Career Roadblocks",
  "Transits of the Month",
  "Astro Numerology",
  "Vedic Astrology",
  "Vedic Vastu",
];

const horoscopes = [
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

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [horoscopeOpen, setHoroscopeOpen] = useState(false);
  const navigate = useNavigate();

  const generateServiceUrl = (title) =>
    `/servicebrief?name=${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-[#7A1E1E] shadow-md fixed w-full top-0 left-0 z-50">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 sm:h-13" loading="lazy"/>
        </Link>

        <div className="hidden md:flex space-x-6 text-lg gap-4 items-center">
          <Link to="/" className="text-[#FAF9F6] font-serif hover:text-[#F4C430]">
            Home
          </Link>

          <Link to="/about" className="text-[#FAF9F6] font-serif hover:text-[#F4C430]">
            About
          </Link>

          <div className="relative group">
            <button className="text-[#FAF9F6] font-serif hover:text-[#F4C430] transition-colors duration-300">
              Services
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg w-64 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 divide-y divide-[#F4C430]/30">
              {services.map((s) => (
                <Link
                  key={s}
                  to={generateServiceUrl(s)}
                  className="block px-4 py-3 text-[#7A1E1E] hover:bg-[#F4C430]/20 font-serif font-semibold transition-all duration-200"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="text-[#FAF9F6] font-serif hover:text-[#F4C430] transition-colors duration-300">
              Horoscope
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg w-56 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 divide-y divide-[#F4C430]/30">
              {horoscopes.map((h) => (
                <Link
                  key={h.name}
                  to="/horoscopebrief"
                  state={{ selectedSign: h.name }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#F4C430]/20 transition-all duration-200"
                >
                  <img
                    src={h.image}
                    alt={h.name}
                    className="w-8 h-8 rounded-full border border-[#F4C430]/50"
                  />
                  <span className="text-[#7A1E1E] font-serif font-semibold">
                    {h.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link to="/contact" className="text-[#FAF9F6] font-serif hover:text-[#F4C430]">
            Contact Us
          </Link>
        </div>

        <button
          onClick={() => navigate("/cunsultation")}
          className="hidden md:block bg-[#F4C430] text-[#7A1E1E] w-42 py-2 rounded-full font-serif font-semibold cursor-pointer"
        >
          Book Consultation
        </button>

        <div className="flex items-center md:hidden">
          <button className="text-3xl text-[#F4C430]" onClick={() => setOpen(!open)}>
            {open ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg z-50 p-6 flex flex-col gap-4 rounded-r-3xl overflow-y-auto">
          <Link
            to="/"
            className="text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430]"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430]"
            onClick={() => setOpen(false)}
          >
            About
          </Link>

          <div>
            <button
              className="text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430] w-full text-left"
              onClick={() => setServiceOpen(!serviceOpen)}
            >
              Services
            </button>
            {serviceOpen && (
              <div className="mt-2 flex flex-col bg-white shadow-lg rounded-xl p-2 divide-y divide-[#F4C430]/30">
                {services.map((s) => (
                  <Link
                    key={s}
                    to={generateServiceUrl(s)}
                    className="text-[#7A1E1E] px-3 py-2 hover:bg-[#F4C430]/30 rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              className="text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430] w-full text-left"
              onClick={() => setHoroscopeOpen(!horoscopeOpen)}
            >
              Horoscope
            </button>
            {horoscopeOpen && (
              <div className="mt-2 flex flex-col bg-white shadow-lg rounded-xl p-2 divide-y divide-[#F4C430]/30">
                {horoscopes.map((h) => (
                  <Link
                    key={h.name}
                    to="/horoscopebrief"
                    state={{ selectedSign: h.name }}
                    className="flex items-center gap-2 text-[#7A1E1E] px-3 py-2 hover:bg-[#F4C430]/30 rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-8 h-8 rounded-full border border-[#F4C430]/50"
                    />
                    <span className="font-serif font-semibold">{h.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className="text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430]"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>

          <button
            onClick={() => {
              navigate("/cunsultation");
              setOpen(false);
            }}
            className="bg-[#F4C430] text-[#7A1E1E] w-48 py-2 rounded-full font-serif font-semibold"
          >
            Book Consultation
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
