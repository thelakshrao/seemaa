import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Bookcunsultation from "./Booking";
import Footer from "./Footer";
import NotFound from "./NotFound";
import ServiceFaq from "./ServiceFaq";
import seemaapic1 from "../img/seemaapic1.png";
import { services, servicesBySlug } from "../seo/servicesData";
import { DISCLAIMER } from "../seo/pageContent";

export default function ServiceBrief({ slug: slugProp }) {
  const { slug: paramSlug } = useParams();
  const slug = slugProp || paramSlug;
  const navigate = useNavigate();

  const service = servicesBySlug[slug];

  useEffect(() => {
    if (service) window.scrollTo({ top: 0 });
  }, [slug, service]);

  if (!service) return <NotFound />;

  const { Icon } = service;
  const moreServices = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Navbar />

      <div className="w-full px-4 md:px-20 py-10 bg-[#F2EDE8] mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-14 items-center justify-center">
          <div className="shrink-0 p-6 md:p-8 bg-[#F4C430]/20 rounded-3xl shadow-lg flex justify-center items-center w-48 md:w-64 h-48 md:h-64">
            <Icon size={60} className="text-[#7A1E1E]" />
          </div>
          <div className="flex-1 w-full max-w-2xl flex flex-col justify-center text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-4">
              {service.h1 || service.title}
            </h1>
            <p className="text-gray-700 text-sm md:text-lg leading-relaxed">{service.description}</p>
            <button
              onClick={() => navigate("/consultation")}
              className="mt-6 bg-[#7A1E1E] text-[#F2EDE8] px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer"
            >
              {service.ctaLabel || "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {service.sections && service.sections.length > 0 && (
        <article className="py-4 px-4 md:px-20 bg-[#F2EDE8]">
          <div className="max-w-4xl mx-auto space-y-10">
            {service.sections.map((s) => (
              <section key={s.h2}>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#7A1E1E] mb-3">{s.h2}</h2>
                {(s.paragraphs || []).map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p>
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
            <p className="text-xs text-gray-500 border-t border-[#7A1E1E]/20 pt-4">{DISCLAIMER}</p>
          </div>
        </article>
      )}

      <section className="py-12 px-4 md:px-20 bg-[#F2EDE8]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
          <div className="flex-1 w-full max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-4">
              About Acharya Seemaa Singh
            </h2>
            <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
              Acharya Seemaa Singh is a distinguished astrologer and astro-healer with over two decades of experience guiding individuals through Vedic Astrology, Numerology, Tarot, Aura Reading, Energy Dowsing, and Vastu consultancy. She combines ancient wisdom with modern insights to provide accurate predictions and practical solutions.
            </p>
          </div>
          <div className="shrink-0 flex justify-center">
            <img
              src={seemaapic1}
              alt="Acharya Seemaa Singh"
              className="rounded-3xl w-48 md:w-96 h-48 md:h-96 object-cover shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-20 bg-[#F2EDE8] text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6">Why Choose Us</h2>
        <p className="text-gray-700 text-sm md:text-lg max-w-3xl mx-auto mb-8">
          We prioritize personal guidance, accurate analysis, and holistic solutions to improve your life. Our clients trust us for clarity, reliability, and deep insight into personal, professional, and financial aspects of life.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            ["Expert Guidance", "Decades of expertise in astrology and numerology ensure precise insights and remedies."],
            ["Personalized Approach", "Tailored solutions to fit your unique life situation and challenges."],
            ["Trusted Results", "Proven client satisfaction with meaningful outcomes in relationships, career, and finance."],
          ].map(([t, d]) => (
            <div
              key={t}
              className="bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-center mb-2">{t}</h3>
              <p className="text-gray-700 text-xs md:text-sm">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <ServiceFaq faqs={service.faqs} />

      <section className="py-12 px-4 md:px-20 bg-[#F2EDE8]">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6">More Services</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {moreServices.map(({ slug: s, title, short, Icon: I }) => (
            <Link
              key={s}
              to={`/services/${s}`}
              className="group flex items-start gap-3 bg-[#F2EDE8] rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 border-2 border-[#F4C430]/40"
            >
              <div className="p-3 bg-[#F4C430]/20 rounded-xl shrink-0 transition-transform duration-500 group-hover:scale-110">
                <I size={24} className="text-[#7A1E1E]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-serif font-semibold text-[#7A1E1E]">{title}</h3>
                <p className="text-gray-700 text-xs mt-1 line-clamp-2">{short}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Bookcunsultation />
      <Footer />
    </>
  );
}
