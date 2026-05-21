import React, {useState} from "react";
import { Link } from "react-router-dom";
import logo from "../img/logoastrologer.png";

const Footer = () => {
  const [openPolicy, setOpenPolicy] = useState(null);
  return (
    <footer className="w-full bg-[#7A1E1E] text-white">
      <hr className="bg-[#7A1E1E] w-full h-0.5" />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1">
            <img src={logo} alt="Seemaa Astrologer" loading="lazy" className="w-28 mb-4" />
            <p className="text-white/80 text-xs leading-relaxed">
              Authentic Vedic Astrology & Spiritual Guidance for Life Balance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <p className="mt-2 text-xs text-white/80">
              <a href="tel:+917696134636" className="hover:text-white">
                +91 7696134636
              </a>{" "}
              <br />
              <a href="tel:+12362589866" className="hover:text-white">
                +1 236-258-9866
              </a>
            </p>
            <p className="mt-2 text-xs text-white/80">
              <a
                href="mailto:Info@seemaaastrologer.com"
                className="hover:text-white"
              >
                Info@seemaaastrologer.com
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link
                  to="/servicebrief?name=vedic-astrology"
                  className="hover:text-white"
                >
                  Vedic Astrology
                </Link>
              </li>
              <li>
                <Link
                  to="/servicebrief?name=vedic-vastu"
                  className="hover:text-white"
                >
                  Vastu
                </Link>
              </li>
              <li>
                <Link
                  to="/servicebrief?name=transits-of-the-month"
                  className="hover:text-white"
                >
                  Transits of the Month
                </Link>
              </li>
              <li>
                <Link
                  to="/servicebrief?name=astro-numerology"
                  className="hover:text-white"
                >
                  Numerology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/cunsultation" className="hover:text-white">
                  Appointment
                </a>
              </li>
              <li>
                <a href="/horoscopebrief" className="hover:text-white">
                  Horoscope
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
        <h4 className="font-semibold mb-3">Policy</h4>
        <ul className="space-y-2 text-xs text-white/80">
          <li
            className="cursor-pointer hover:text-white"
            onClick={() => setOpenPolicy("disclaimer")}
          >
            Disclaimer
          </li>
          <li
            className="cursor-pointer hover:text-white"
            onClick={() => setOpenPolicy("privacy")}
          >
            Privacy Policy
          </li>
          <li
            className="cursor-pointer hover:text-white"
            onClick={() => setOpenPolicy("payment")}
          >
            Pay Online
          </li>
        </ul>
      </div>

      {openPolicy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black rounded-xl max-w-md w-full p-5 relative">
            
            <button
              onClick={() => setOpenPolicy(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {openPolicy === "disclaimer" && (
              <>
                <h3 className="font-semibold mb-2">Disclaimer</h3>
                <p className="text-sm text-gray-600">
                  All consultations and guidance are based on personal belief and
                  experience. Results may vary for each individual.
                </p>
              </>
            )}

            {openPolicy === "privacy" && (
              <>
                <h3 className="font-semibold mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600">
                  Your personal details are kept strictly confidential and are
                  never shared with any third party.
                </p>
              </>
            )}

            {openPolicy === "payment" && (
              <>
                <h3 className="font-semibold mb-2">Pay Online</h3>
                <p className="text-sm text-gray-600">
                  All payments are processed securely. No card or payment
                  information is stored on our servers.
                </p>
              </>
            )}

          </div>
        </div>
        )}

        </div>

        <div className="border-t border-white/30 my-6"></div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-white/70 gap-3">
          <p>© 2005 All rights reserved. Astrologer Seemaa</p>

          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/astrologerseemasingh?mibextid=wwXIfr&rdid=bsv69xUqoUvsKiIN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17viL4jZXm%2F%3Fmibextid%3DwwXIfr#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/astrologerseemasingh?igsh=ZHhzdG13ZzRhd3M5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
