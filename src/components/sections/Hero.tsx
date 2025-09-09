import Link from "next/link";
import FloatingDots from "@/components/decor/FloatingDots";
import "@/components/decor/floating-dots.css";

export default function Hero() {
  return (
    <section className="text-center py-20 bg-gray-900 text-white relative pt-32 overflow-hidden">
      {/* Subtle floating dots overlay (transparent background) */}
      <FloatingDots />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h3 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">Remortify: </span>
          <span style={{ color: '#8b5cf6' }}>Your Remote Workspace</span>
          <span className="text-white"> for </span>
          <span style={{ color: '#14b8a6' }}>Limitless Collaboration</span>
        </h3>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Seamlessly connect, share, and achieve more with your remote team.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/auth/register">
            <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Sign up free
            </button>
          </Link>
          <Link href="/book-demo">
            <button className="bg-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Book a Demo
            </button>
          </Link>
        </div>
      </div>
      {/* Keyframes and reduced motion moved to CSS in components/decor/floating-dots.css */}
    </section>
  );
}
