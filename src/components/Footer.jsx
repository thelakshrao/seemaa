import React, { useState } from "react";
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
            <img
              src={logo}
              alt="Seemaa Astrologer"
              loading="lazy"
              className="w-28 mb-4"
            />
            <p className="text-white/80 text-xs leading-relaxed">
              Authentic Vedic Astrology & Spiritual Guidance for Life Balance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>

            <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
              <a href="tel:+12362589866" className="hover:text-white">
                +1 236-258-9866
              </a>
              <a
                href="https://wa.me/12362589866?text=Hi%20Seemaa%20Ji%2C%20I%20want%20to%20book%20a%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="hover:opacity-80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="#25D366"
                >
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.59 5.93L0 24l6.4-1.68a11.8 11.8 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44zM12.05 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.8 1 1.01-3.7-.24-.38a9.9 9.9 0 0 1-1.52-5.26c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.93-9.86 9.93zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
                </svg>
              </a>
            </div>

            <p className="mt-2 text-xs text-white/80">
              <a
                href="mailto:Info@seemaaastrologer.com"
                className="hover:text-white"
              >
                Info@seemaaastrologer.com
              </a>
            </p>

            <div className="mt-3 text-xs text-white/80">
              <p className="font-semibold text-white mb-1">Office (Canada)</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=30+Eglinton+Ave+W,+Mississauga,+ON+L5R+3E7,+Canada"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white leading-relaxed"
              >
                Unit 50, 30 Eglinton Ave W,
                <br />
                Mississauga, ON L5R 3E7,
                <br />
                Canada
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link
                  to="/services/vedic-astrology"
                  className="hover:text-white"
                >
                  Vedic Astrology
                </Link>
              </li>
              <li>
                <Link
                  to="/services/vedic-vastu"
                  className="hover:text-white"
                >
                  Vastu
                </Link>
              </li>
              <li>
                <Link
                  to="/services/transits-of-the-month"
                  className="hover:text-white"
                >
                  Transits of the Month
                </Link>
              </li>
              <li>
                <Link
                  to="/services/astro-numerology"
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
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-white">
                  Appointment
                </Link>
              </li>
              <li>
                <Link to="/horoscope" className="hover:text-white">
                  Horoscope
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact us
                </Link>
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
                      All consultations and guidance are based on personal
                      belief and experience. Results may vary for each
                      individual.
                    </p>
                  </>
                )}

                {openPolicy === "privacy" && (
                  <>
                    <h3 className="font-semibold mb-2">Privacy Policy</h3>
                    <p className="text-sm text-gray-600">
                      Your personal details are kept strictly confidential and
                      are never shared with any third party.
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