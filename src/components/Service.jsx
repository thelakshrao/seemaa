import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import serviceBg from "../img/servicebg.png";
import { services } from "../seo/servicesData";

const Service = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setAnimate(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="w-full px-5 py-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${serviceBg})` }}
    >
      <h2 className="text-4xl py-5 font-semibold text-center text-[#7A1E1E] font-serif">
        Our Services
      </h2>

      <div className="max-w-7xl mx-auto overflow-x-clip">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 py-5 transition-all duration-700 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {services.map(({ slug, title, short, Icon }) => (
            <div
              key={slug}
              className="group bg-[#F2EDE8] rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center p-5 border-2 border-[#F4C430]/40"
            >
              <div className="p-5 bg-[#F4C430]/20 rounded-3xl mb-4 flex justify-center items-center transition-transform duration-700 group-hover:scale-110">
                <Icon size={40} className="text-[#7A1E1E]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#7A1E1E] mb-2">{title}</h3>
              <p className="text-gray-700 text-sm">{short}</p>
              <Link
                to={`/services/${slug}`}
                className="mt-auto pt-4"
              >
                <span className="inline-block bg-[#7A1E1E] text-[#F2EDE8] px-6 py-2 rounded-full font-semibold hover:bg-[#5c1515] transition-colors">
                  Consult Now
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
