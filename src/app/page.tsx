import Navbar from "../components/layouts/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
