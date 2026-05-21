import React, { useEffect, useRef, useState } from "react";
import bookImg1 from "../img/book.webp";
import bookImg2 from "../img/book2.webp";
import bookImg3 from "../img/book3.webp";
import bookImg4 from "../img/book4.webp";

const books = [
  {
    title: "Healing Through Mantra",
    author: "Seemaa Singh",
    image: bookImg3,
    description:
      "The present book is an attempt to develop the human potential through Mantra.",
  },
  {
    title: "Healing Through Yantra",
    author: "Seemaa Singh",
    image: bookImg2,
    description:
      "A beginner-friendly guide exploring the spiritual power of Yantras and their uses in daily life.",
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
  const [animate, setAnimate] = useState(false);

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

  return (
    <section ref={sectionRef} className="w-full py-10 px-3 sm:px-4 bg-[#FFFDF8]">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-[#7A1E1E] mb-8 sm:mb-10">
        Famous Books by Seemaa
      </h2>

      <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory no-scrollbar pb-2 md:p-15">
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
