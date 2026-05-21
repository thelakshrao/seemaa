import React, { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import news1 from "../img/denikbhaskar.webp";
import news2 from "../img/fwtv.webp";
import news3 from "../img/indianews.webp";
import news4 from "../img/zsangam.webp";
import news5 from "../img/jantatv.webp";
import news6 from "../img/liveindia.webp";
import news7 from "../img/omnitv.webp";
import news8 from "../img/ptcnews.webp";
import news9 from "../img/spaceradio.webp";
import news10 from "../img/yugmarg.webp";

const defaultTestimonials = [
  {
    text:
      "Seemaa is an amazing astrologer! Her insights into my career and personal life were incredibly accurate and helped me make the right decisions.",
    name: "— Riya Sharma",
  },
  {
    text:
      "I was skeptical at first, but her guidance truly changed my perspective. Highly recommended for clarity and peace.",
    name: "— Aman Verma",
  },
  {
    text:
      "Her readings are deeply intuitive and precise. I felt understood and guided in the right direction.",
    name: "— Neha Kapoor",
  },
  {
    text:
      "Very calm, knowledgeable, and accurate. The remedies she suggested worked beautifully for me.",
    name: "— Rohit Mehta",
  },
];

const mediaNews = [
  news1,
  news2,
  news3,
  news4,
  news5,
  news6,
  news7,
  news8,
  news9,
  news10,
];

const Review = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem("testimonials");
    return saved ? JSON.parse(saved) : defaultTestimonials;
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setAnimate(true),
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) return;

    setTestimonials([
      { text: message, name: `— ${name}` },
      ...testimonials,
    ]);

    setName("");
    setMessage("");
    setShowForm(false);
  };

  return (
    <section
      ref={sectionRef}
      className="flex flex-col md:flex-row w-full items-center justify-center bg-[#FAF9F6] gap-10 px-6 py-12"
    >
      <div
        className={`w-full md:w-1/2 flex flex-col items-center justify-center text-[#7A1E1E]
        transition-all duration-700 ${
          animate ? "animate-left-right" : "opacity-0 -translate-x-10"
        }`}
      >
        <h3 className="text-3xl md:text-4xl font-serif mb-6">
          Featured & Trusted
        </h3>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max px-4">
            {mediaNews.map((img, index) => (
              <div
                key={index}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white flex items-center justify-center"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover scale-125"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="hidden md:block bg-[#7A1E1E] w-px h-48" />

      <div
        className={`w-full md:w-1/2 flex flex-col items-center justify-center text-[#7A1E1E]
        transition-all duration-700 ${
          animate ? "animate-right-left" : "opacity-0 translate-x-10"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-3xl md:text-4xl font-serif">
            What People Think
          </h3>
          <div className="relative group">
            <button
              onClick={() => setShowForm(!showForm)}
              className="p-2 rounded-full bg-[#7A1E1E]/10 hover:bg-[#7A1E1E]/20 transition"
            >
              <Pencil size={18} />
            </button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#7A1E1E] text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Add your review
            </span>
          </div>
        </div>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mb-4 bg-white p-4 rounded-xl shadow space-y-3"
          >
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Write your review..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-24"
            />
            <button
              type="submit"
              className="w-full bg-[#7A1E1E] text-white py-2 rounded-lg text-sm hover:opacity-90"
            >
              Submit Review
            </button>
          </form>
        )}
        <div className="w-full max-w-md h-46 p-6 bg-[#7A1E1E]/10 rounded-2xl overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#7A1E1E]/40">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white/70 rounded-xl p-4 text-center shadow-sm"
            >
              <p className="text-sm text-[#4B2E2B] mb-3">
                "{item.text}"
              </p>
              <span className="font-semibold text-[#7A1E1E]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Review;
