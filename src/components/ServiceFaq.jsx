import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const SHORT_ANSWER = 220;

export default function ServiceFaq({ faqs = [], title = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!faqs.length) return null;

  const visible = new Set();
  if (openIndex === null) {
    faqs.forEach((_, i) => visible.add(i));
  } else {
    visible.add(openIndex);
    if (faqs[openIndex].a.length <= SHORT_ANSWER) {
      const extra = openIndex < faqs.length - 1 ? openIndex + 1 : openIndex - 1;
      if (extra >= 0) visible.add(extra);
    }
  }

  const closed = openIndex === null;

  return (
    <section className="py-12 px-4 md:px-20 bg-[#F2EDE8]">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6">
        {title}
      </h2>

      <div className="max-w-3xl mx-auto">
        <div
          className={
            closed
              ? "space-y-3 max-h-54 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#7A1E1E_#e9dfc8] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#F4C430]/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#7A1E1E]"
              : "space-y-3 max-h-128 overflow-y-auto pr-1"
          }
        >
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={f.q}
                className={`${visible.has(i) ? "" : "hidden"} rounded-2xl border-2 border-[#F4C430]/40 bg-[#F2EDE8] shadow-sm`}
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-3.5 font-serif font-semibold text-base md:text-lg text-[#7A1E1E] cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <FaChevronDown
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      size={14}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  hidden={!isOpen}
                  className="px-5 pb-4 text-gray-700 text-sm md:text-base leading-relaxed"
                >
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>

        {!closed && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="text-[#7A1E1E] font-semibold underline hover:text-[#5c1515] cursor-pointer"
            >
              Show all questions
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
