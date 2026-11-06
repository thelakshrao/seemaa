// FAQs for the standard service pages.
// Manglik Dosha and Tarot Reading FAQs live in pageContent.js (manglik.faqs / tarot.faqs).
// Seemaa should read these once and edit anything she would not say herself.

const DETAILS_Q = "What birth details do I need to share?";
const DETAILS_A =
  "Your date of birth, exact time of birth and place of birth. If you do not know the exact time, mention that while booking and it will be discussed.";

const BOOK_Q = "How do I book a consultation?";
const BOOK_A =
  "Click Book Now, fill in the booking form and your request reaches Acharya Seemaa Singh's team, who will confirm the timing with you.";

export const serviceFaqs = {
  "relationship-challenges": [
    {
      q: "Can astrology really help with relationship problems?",
      a: "Astrology is not a replacement for honest communication or professional counselling. A birth-chart reading can show emotional patterns, difficult and supportive phases, and areas where more understanding is needed, so you can act with more clarity.",
    },
    {
      q: "Can both partners attend the same session?",
      a: "Yes. Sharing both partners' birth details lets the two charts be looked at together. A reading is also possible with only one person's details.",
    },
    { q: DETAILS_Q, a: DETAILS_A },
    {
      q: "Will you tell me if my relationship will last?",
      a: "No honest astrologer can promise that. The reading highlights strengths, challenges and timing, but the outcome depends on the choices both people make.",
    },
    { q: BOOK_Q, a: BOOK_A },
  ],

  "business-setbacks": [
    {
      q: "What can astrology tell me about business trouble?",
      a: "Your chart can point to periods that favour growth and periods that call for caution, and to patterns that may be affecting decisions or partnerships. It helps you plan; it does not replace business or financial advice.",
    },
    {
      q: "Will I be told to close or quit my business?",
      a: "No. The reading looks at timing and tendencies, and the final decision stays with you. Please take professional financial advice for major commitments.",
    },
    {
      q: "Do I need to share business details too?",
      a: "Your own birth details are the main requirement. A short note on the nature of your business and when it started can make the reading more useful.",
    },
    { q: DETAILS_Q, a: DETAILS_A },
    { q: BOOK_Q, a: BOOK_A },
  ],

  "financial-struggle": [
    {
      q: "Can astrology solve my money problems?",
      a: "It cannot guarantee wealth or remove debt. It can give you clarity on income patterns, the timing of better and tougher phases, and areas where planning and discipline matter most.",
    },
    {
      q: "Will I be pushed to buy expensive remedies?",
      a: "Remedies, where relevant, are explained openly and you are never obliged to buy anything.",
    },
    {
      q: "Can you tell me when to invest?",
      a: "Astrology is not investment advice. A reading may show favourable and cautious periods, but please speak to a qualified financial advisor before investing.",
    },
    { q: DETAILS_Q, a: DETAILS_A },
    { q: BOOK_Q, a: BOOK_A },
  ],

  "career-roadblocks": [
    {
      q: "Can my chart show which career suits me?",
      a: "A chart can indicate natural strengths, working style and fields where you may do well. It is a guide to consider alongside your skills, education and interests.",
    },
    {
      q: "Can you tell me the right time for a job change?",
      a: "The reading looks at supportive and difficult phases for career moves. It does not promise a result, so use it together with your own research and circumstances.",
    },
    {
      q: "Is this useful for students and freshers?",
      a: "Yes. Students choosing a stream or field, and people starting their first job, often find it helpful for clarity.",
    },
    { q: DETAILS_Q, a: DETAILS_A },
    { q: BOOK_Q, a: BOOK_A },
  ],

  "transits-of-the-month": [
    {
      q: "What are planetary transits?",
      a: "Transits are the ongoing movements of planets through the zodiac. Their effect is read against the position of planets in your own birth chart.",
    },
    {
      q: "How is this different from a monthly horoscope?",
      a: "A general horoscope uses only your sun or moon sign. A transit reading uses your full birth chart, so it is specific to you.",
    },
    {
      q: "How often should I take a transit reading?",
      a: "Many people check once a month or before a major decision. There is no fixed rule.",
    },
    { q: DETAILS_Q, a: DETAILS_A },
    { q: BOOK_Q, a: BOOK_A },
  ],

  "astro-numerology": [
    {
      q: "What is astro numerology?",
      a: "It reads the numbers linked to your date of birth and name, together with astrological ideas, to understand personality, strengths and life phases.",
    },
    {
      q: "Which numbers are looked at?",
      a: "Commonly your birth number, destiny number and name number. The reading explains what each one suggests for you.",
    },
    {
      q: "Do I need to change my name spelling?",
      a: "Not necessarily. Any suggestion is discussed with you, and nothing is guaranteed by a spelling change.",
    },
    {
      q: "What details are needed?",
      a: "Your full name and date of birth. Time and place of birth help if you also want an astrological view.",
    },
    { q: BOOK_Q, a: BOOK_A },
  ],

  "vedic-astrology": [
    {
      q: "What is Vedic astrology (Jyotish)?",
      a: "Jyotish is the traditional Indian system of astrology. It reads your birth chart (kundli) to understand personality, timing and life themes.",
    },
    {
      q: "How is it different from Western astrology?",
      a: "Vedic astrology uses the sidereal zodiac and places strong emphasis on planetary periods (dashas), so signs and timing can differ from Western charts.",
    },
    {
      q: "What is a kundli?",
      a: "A kundli is your birth chart, drawn from your date, time and place of birth. It maps the position of the planets at your birth.",
    },
    {
      q: "Are remedies part of the consultation?",
      a: "Where relevant, simple remedies are discussed. They are suggestions, not guarantees.",
    },
    { q: DETAILS_Q, a: DETAILS_A },
  ],

  "vedic-vastu": [
    {
      q: "What is Vastu Shastra?",
      a: "Vastu Shastra is the traditional Indian science of space. It looks at directions and the placement of rooms and objects to create a balanced living or working space.",
    },
    {
      q: "Can I get Vastu guidance for both home and office?",
      a: "Yes. Homes, offices, shops and other workspaces can all be reviewed.",
    },
    {
      q: "Do I have to break or rebuild anything?",
      a: "Many concerns can be handled through placement and use of space. If any structural change is suggested, it will be discussed with you first.",
    },
    {
      q: "What should I share for a Vastu consultation?",
      a: "A floor plan or clear photos with the direction of the main entrance. Mention your location while booking so the format can be confirmed.",
    },
    { q: BOOK_Q, a: BOOK_A },
  ],
};
