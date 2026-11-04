import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PayOnline from "./components/PayOnline";
import Seo from "./components/Seo";
// Static imports (not lazy) so the server can render every page to HTML.
import Home from "./components/Home";
import About from "./components/About";
import Servicebrief from "./components/Servicebrief";
import HoroscopeBrief from "./components/HoroscopeBrief";
import BookConsultation from "./components/BookConsultation";
import ContactUs from "./components/ContactUs";
import NotFound from "./components/NotFound";

// The <Router> is added in main.jsx (browser) and entry-server.jsx (build-time
// prerender), so the same routes are used in both places.
function App() {
  return (
    <>
      <Seo />
      <ScrollToTop />
      <PayOnline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/:slug" element={<Servicebrief />} />
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
