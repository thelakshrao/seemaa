import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import PayOnline from "./components/PayOnline";
const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const Servicebrief = lazy(() => import("./components/Servicebrief"));
const HoroscopeBrief = lazy(() => import("./components/HoroscopeBrief"));
const BookConsultation = lazy(() => import("./components/BookConsultation"));
const ContactUs = lazy(() => import("./components/ContactUs"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <PayOnline />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/servicebrief" element={<Servicebrief />} />
          <Route path="/horoscopebrief" element={<HoroscopeBrief />} />
          <Route path="/cunsultation" element={<BookConsultation />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
