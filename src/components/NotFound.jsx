import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 mt-20 bg-[#F2EDE8]">
        <h1 className="text-4xl font-serif font-bold text-[#7A1E1E] mb-4">Page not found</h1>
        <p className="text-gray-700 mb-6">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="bg-[#7A1E1E] text-[#F2EDE8] px-6 py-2 rounded-full font-semibold">
          Back to home
        </Link>
      </section>
      <Footer />
    </>
  );
}
