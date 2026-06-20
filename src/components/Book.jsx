import React, { useEffect, useRef, useState } from "react";
import bookImg1 from "../img/book.webp";
import bookImg3 from "../img/book3.webp";
import bookImg4 from "../img/book4.webp";
import tarotVideo from "../assets/vid/Tarotvid.mp4";
import { Volume2, VolumeX, Play } from "lucide-react";

const books = [
  {
    title: "Healing Through Mantra",
    author: "Seemaa Singh",
    image: bookImg3,
    description:
      "The present book is an attempt to develop the human potential through Mantra.",
  },
  {
    title: "Tarot for Beginners",
    author: "Seemaa Singh",
    image: bookImg1,
    description:
      "Learn the basics of Tarot reading and discover how to interpret cards for insight and guidance.",
  },
  {
    title: "The Rock That Was Not",
    author: "Seemaa Singh",
    image: bookImg4,
    description:
      "An inspiring story about finding inner strength, overcoming challenges, and spiritual growth.",
  },
];

const BookCard = ({ book, animate }) => (
  <div
    className={`
      relative bg-white rounded-3xl shadow-2xl overflow-hidden
      flex flex-col items-center p-3 sm:p-4 md:p-6 transition-transform duration-300 hover:scale-105
      max-h-112 md:max-h-96
      ${animate ? "animate-left-right" : "opacity-0"}
    `}
  >
    <div className="w-44 h-60 sm:w-52 sm:h-64 md:w-56 md:h-72 lg:w-60 lg:h-80 rounded-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-full object-cover rounded-xl"
      />
    </div>

    <div className="mt-2 md:mt-3 text-center px-2 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-base sm:text-sm md:text-lg lg:text-xl font-semibold text-[#7A1E1E] mb-1 sm:mb-2">
          {book.title}
        </h3>
        <p className="text-xs sm:text-[0.7rem] md:text-sm text-gray-600 italic mb-1 sm:mb-2">
          by {book.author}
        </p>
        <p className="text-gray-700 text-xs sm:text-[0.7rem] md:text-sm leading-snug">
          {book.description}
        </p>
      </div>
    </div>
  </div>
);

const Book = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-14 px-3 sm:px-4 overflow-hidden bg-gradient-to-b from-[#7A1E1E] via-[#5c1616] to-[#FFFDF8]"
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #FFD700 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-10 -right-16 w-72 h-72 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

      <h2 className="relative text-center text-2xl sm:text-3xl md:text-4xl font-serif text-[#FFD700] mb-3 z-10">
        Famous Books by Seemaa
      </h2>
      <p className="relative text-center text-[#f5e6c8] text-sm sm:text-base mb-10 z-10 max-w-xl mx-auto">
        Words of wisdom, woven with the wisdom of the stars
      </p>

      {/* Video + Text Section */}
      <div className="relative z-10 max-w-5xl mx-auto mb-14 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 bg-white/5 backdrop-blur-sm border border-[#FFD700]/20 rounded-3xl p-5 sm:p-8 shadow-2xl">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block text-[#FFD700] text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 font-semibold">
            Tarot for Beginners
          </span>
          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#FFD700] mb-4 leading-snug">
            Lost Between Questions?
            <br /> Discover the Path Ahead.
          </h3>
          <p className="text-[#f5e6c8] text-sm sm:text-base leading-relaxed mb-5">
            Unlock the wisdom hidden within love, career, finance, and
            health. Learn to read the signs and discover the story each
            card holds. Introducing{" "}
            <span className="text-[#FFD700] font-semibold">
              Tarot for Beginners
            </span>{" "}
            by Seemaa Singh, published by Dinette Publishers.
          </p>
          <p className="text-[#f5e6c8]/80 text-xs sm:text-sm italic">
            Have a story to share? Turn your manuscript into a published
            book with our free publication program.
          </p>
        </div>

        {/* Right: Smaller Video */}
        <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_0_4px_rgba(255,215,0,0.25)] border border-[#FFD700]/40">
            <video
              ref={videoRef}
              src={tarotVideo}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="w-full h-auto block"
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-[#FFD700] p-2 rounded-full transition-colors duration-200"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto flex gap-4 snap-x snap-mandatory no-scrollbar pb-2 md:p-15">
        {books.map((b, index) => (
          <div
            key={index}
            className="min-w-[65%] sm:min-w-[50%] md:min-w-[35%] lg:min-w-[30%] snap-center"
          >
            <BookCard book={b} animate={animate} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Book;