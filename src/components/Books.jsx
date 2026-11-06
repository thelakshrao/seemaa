import React from "react";
import ContentPage from "./ContentPage";
import { books } from "../seo/pageContent";
import tarotImg from "../img/book.webp";
import mantraImg from "../img/book3.webp";
import rockImg from "../img/book4.webp";

const images = { tarot: tarotImg, mantra: mantraImg, rock: rockImg };

export default function Books() {
  return (
    <ContentPage
      h1="Books by Acharya Seemaa Singh"
      intro="Acharya Seemaa Singh is an author as well as an astrologer and tarot reader. Her books cover tarot, mantra and personal growth."
      showBooking={false}
      showDisclaimer={false}
    >
      <div className="space-y-10">
        {books.map((b) => (
          <section
            key={b.key}
            className="bg-white rounded-3xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start"
          >
            <img
              src={images[b.key]}
              alt={`${b.title} by Seemaa Singh`}
              loading="lazy"
              className="w-40 sm:w-48 rounded-xl shadow-md shrink-0"
            />
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#7A1E1E]">
                {b.title}
              </h2>
              <p className="text-sm italic text-gray-500 mb-2">by Seemaa Singh</p>
              <p className="text-gray-700 leading-relaxed">{b.description}</p>
              {b.publisher && (
                <p className="text-sm text-gray-600 mt-3">
                  Publisher: {b.publisher}
                  {b.isbn ? ` · ISBN ${b.isbn}` : ""}
                </p>
              )}
              {b.link && (
                <a
                  href={b.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[#7A1E1E] font-semibold underline hover:text-[#5e1515]"
                >
                  {b.link.label}
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
