import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PayOnline from "./components/PayOnline";
import Seo from "./components/Seo";
import Home from "./components/Home";
import About from "./components/About";
import ServiceBrief from "./components/Servicebrief";
import HoroscopeBrief from "./components/HoroscopeBrief";
import BookConsultation from "./components/BookConsultation";
import ContactUs from "./components/ContactUs";
import NotFound from "./components/NotFound";
import ManglikDosha from "./components/ManglikDosha";
import TarotReading from "./components/TarotReading";
import Books from "./components/Books";
import Press from "./components/Press";

function App() {
  return (
    <>
      <Seo />
      <ScrollToTop />
      <PayOnline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/manglik-dosha" element={<ManglikDosha />} />
        <Route path="/services/tarot-reading" element={<TarotReading />} />
        <Route path="/services/:slug" element={<ServiceBrief />} />
        <Route path="/books" element={<Books />} />
        <Route path="/press" element={<Press />} />
        <Route path="/horoscope" element={<HoroscopeBrief />} />
        <Route path="/horoscope/:sign" element={<HoroscopeBrief />} />
        <Route path="/consultation" element={<BookConsultation />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;