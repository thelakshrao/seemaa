import React from "react";
import { Link } from "react-router-dom";
import ContentPage from "./ContentPage";
import { pressClips } from "../seo/pressClips";
import dainikBhaskar from "../img/denikbhaskar.webp";
import fwtv from "../img/fwtv.webp";
import indiaNews from "../img/indianews.webp";
import jantaTv from "../img/jantatv.webp";
import liveIndia from "../img/liveindia.webp";
import omniTv from "../img/omnitv.webp";
import ptcNews from "../img/ptcnews.webp";
import spiceRadio from "../img/spaceradio.webp";
import yugmarg from "../img/yugmarg.webp";
import zeeSangam from "../img/zsangam.webp";

const outlets = [
  { name: "Dainik Bhaskar", logo: dainikBhaskar },
  { name: "FW TV", logo: fwtv },
  { name: "India News", logo: indiaNews },
  { name: "Janta TV", logo: jantaTv },
  { name: "Live India", logo: liveIndia },
  { name: "PTC News", logo: ptcNews },
  { name: "Zee Sangam", logo: zeeSangam },
  { name: "Yugmarg", logo: yugmarg },
  { name: "OMNI Television", logo: omniTv, country: "Canada" },
  { name: "Spice Radio", logo: spiceRadio, country: "Canada" },
];

export default function Press() {
  return (
    <ContentPage
      h1="Acharya Seemaa Singh in the Media"
      intro="Acharya Seemaa Singh has shared her views on astrology on television, radio and in print, in India and in Canada. These are some of the outlets she has appeared with."
      showBooking={false}
      showDisclaimer={false}
    >
      <section>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#7A1E1E] mb-5">
          As seen on
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {outlets.map((o) => (
            <li
              key={o.name}
              className="bg-white rounded-2xl shadow p-3 flex flex-col items-center text-center"
            >
              <img
                src={o.logo}
                alt={`${o.name} logo`}
                loading="lazy"
                className="h-20 w-full object-contain"
              />
              <span className="mt-2 text-sm font-semibold text-[#7A1E1E]">
                {o.name}
              </span>
              {o.country && (
                <span className="text-xs text-gray-500">{o.country}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {pressClips.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#7A1E1E] mb-4">
            Interviews, clips and articles
          </h2>
          <ul className="space-y-3">
            {pressClips.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7A1E1E] font-semibold underline hover:text-[#5e1515]"
                >
                  {c.title}
                </a>
                <span className="text-sm text-gray-600"> · {c.outlet}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#7A1E1E] mb-3">
          Media enquiries
        </h2>
        <p className="text-gray-700 leading-relaxed">
          For interviews, guest appearances or collaborations, please use the{" "}
          <Link to="/contact" className="text-[#7A1E1E] font-semibold underline">
            contact page
          </Link>
          .
        </p>
      </section>
    </ContentPage>
  );
}
