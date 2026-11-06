import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Booking from "./Booking";
import { DISCLAIMER } from "../seo/pageContent";


export default function ContentPage({
  h1,
  intro,
  sections = [],
  faqs = [],
  children,
  showBooking = true,
  showDisclaimer = true,
  ctaLabel = "Book a Consultation",
}) {
  return (
    <>
      <Navbar />
      <main className="mt-24 bg-[#F2EDE8]">
        <header className="bg-[#7A1E1E] text-[#F2EDE8] py-12 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#F4E4C1] max-w-4xl mx-auto leading-tight">
            {h1}
          </h1>
          {intro && (
            <p className="mt-5 max-w-3xl mx-auto text-base md:text-lg text-[#F2EDE8]/90 leading-relaxed">
              {intro}
            </p>
          )}
          {showBooking && (
            <a
              href="#booking"
              className="inline-block mt-7 bg-[#F4C430] text-[#7A1E1E] px-8 py-3 rounded-full font-serif font-semibold"
            >
              {ctaLabel}
            </a>
          )}
        </header>

        <article className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          {sections.map((s) => (
            <section key={s.h2}>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#7A1E1E] mb-3">
                {s.h2}
              </h2>
              {(s.paragraphs || []).map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
                  {s.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {s.links && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {s.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="text-[#7A1E1E] font-semibold underline hover:text-[#5e1515]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}

          {children}

          {faqs.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#7A1E1E] mb-4">
                Frequently asked questions
              </h2>
              <div className="space-y-5">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <h3 className="text-lg font-semibold text-[#7A1E1E]">{f.q}</h3>
                    <p className="text-gray-700 leading-relaxed mt-1">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {showDisclaimer && (
            <p className="text-xs text-gray-500 border-t border-[#7A1E1E]/20 pt-4">
              {DISCLAIMER}
            </p>
          )}
        </article>

        {showBooking && <Booking />}
      </main>
      <Footer />
    </>
  );
}
