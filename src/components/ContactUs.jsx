import React from "react";
import Navbar from "./Navbar";
import zodiacWheel from "../img/zodiacwheel.png";
import Booking from "./Booking";
import Footer from "./Footer";

const ContactUs = () => {
  return (
    <>
      <Navbar />

      <div className="w-full mt-20 bg-gray-50 flex justify-center px-3 md:px-6 animate-slide-up">
        <section className="w-full max-w-6xl relative py-10 md:py-24 my-4 md:my-10 flex flex-col items-center justify-center px-4 md:px-8 bg-linear-to-r from-[#7A1E1E] to-[#3B1F1B] overflow-hidden rounded-2xl">
          <div className="absolute flex justify-center items-center pointer-events-none">
            <div className="absolute w-32 h-32 md:w-72 md:h-72 rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse" />
            <div className="w-28 h-28 md:w-66 md:h-66 rounded-full overflow-hidden animate-spin-slow opacity-80">
              <img
                src={zodiacWheel}
                alt="Zodiac Wheel"
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h2 className="text-[#FAF9F6] font-serif text-xl sm:text-2xl md:text-4xl text-center z-10">
            Here are Our Contact Details
          </h2>
          <p className="text-[#FAF9F6] text-sm sm:text-base md:text-lg text-center z-10">
            Message us anytime; we will try to reply as soon as possible.
          </p>

          <button
            onClick={() => {
              document.getElementById("booking")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="relative z-10 bg-[#F4C430] text-[#7A1E1E] w-36 md:w-52 py-2 md:py-3 rounded-full font-serif font-semibold cursor-pointer text-xs md:text-base"
          >
            Book Consultation
          </button>
        </section>
      </div>
      <section className="flex flex-col bg-gray-50 items-center justify-center">
        <div className="w-full max-w-3xl my-8 px-4 text-center">
          <h3 className="text-gray-500 text-base md:text-lg">
            Important Note: Please be aware that our main office is currently
            located in{" "}
            <span className="font-bold font-serif text-[#7A1E1E]">Canada</span>.
            Due to the time zone difference, there may be delays in answering
            calls. If you are calling from{" "}
            <span className="font-bold font-serif text-[#7A1E1E]">India</span>{" "}
            or other regions, we recommend contacting us in the{" "}
            <span className="font-bold font-serif text-[#7A1E1E]">evening</span>{" "}
            local time for a quicker response. Alternatively, if you send us a
            message, our team will get back to you as soon as possible.
          </h3>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-6 mt-10 mb-10 w-full max-w-full px-4 sm:px-6 justify-center items-center">
        <div className="w-full sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
          <h2 className="font-bold text-xl font-serif text-[#7A1E1E] mb-2">
            India Office
          </h2>
          <a
            href="tel:+917696134636"
            className="text-gray-600 text-center hover:text-[#7A1E1E] transition-colors"
          >
            📞 +91 7696134636
          </a>
        </div>

        <div className="w-full sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
          <h2 className="font-bold text-xl font-serif text-[#7A1E1E] mb-2">
            Canada Office
          </h2>
          <a
            href="tel:+12362589866"
            className="text-gray-600 text-center hover:text-[#7A1E1E] transition-colors"
          >
            📞 +1 236-258-9866
          </a>
        </div>

        <div className="w-full sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
          <h2 className="font-bold text-xl font-serif text-[#7A1E1E] mb-2">
            Email
          </h2>
          <a
            href="mailto:Info@seemaaastrologer.com"
            className="text-gray-600 text-center hover:text-[#7A1E1E] transition-colors"
          >
            ✉️ Info@seemaaastrologer.com
          </a>
        </div>
      </div>

      {/* <div className="flex flex-col my-10 w-full items-center justify-center">
        <h1 className="font-bold text-3xl md:text-4xl font-serif text-[#7A1E1E] text-center mb-8">
          Our Office Locations
        </h1>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-full px-4 sm:px-6 justify-center items-center">
          <div className="w-full md:w-2xl sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold text-2xl font-serif text-[#7A1E1E] mb-2">
              India Office
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Piccadily Rd, Sector 34A, <br /> Sector 34, Chandigarh, 160022
            </p>
            <iframe
              title="India Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.12345!2d76.7800!3d30.7333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed123456!2sPiccadily%20Rd,%20Sector%2034A,%20Chandigarh!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-2xl sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold text-2xl font-serif text-[#7A1E1E] mb-2">
              Canada Office
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Unit 310-23 Westmore Dr, <br /> Etobicoke, Ontario, M9W 0C3,
              CANADA
            </p>
            <iframe
              title="Canada Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.12345!2d-79.5500!3d43.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b12345!2sWestmore%20Dr,%20Etobicoke!5e0!3m2!1sen!2sca!4v1234567890"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </div> */}

      <Booking />
      <Footer />
    </>
  );
};

export default ContactUs;
