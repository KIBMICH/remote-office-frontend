"use client";

import { useState } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "RemoteHub has transformed our workflow. The Integration between chat and project management is seamless. A must-have for any remote team.",
      name: "Sarah Johnson",
      title: "Project Manager, Tech Innovations",
      initials: "SJ"
    },
    {
      quote: "The video meeting quality is outstanding, and the file sharing system is incredibly secure and robust. We couldn't be happier.",
      name: "Michael Chen",
      title: "IT Director, Creative Solutions",
      initials: "MC"
    },
    {
      quote: "As a startup, efficiency is key. RemoteHub gives us all the tools we need in one place, saving us time and money.",
      name: "Emily Rodriguez",
      title: "CEO, Innovate Co.",
      initials: "ER"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-dark text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-16">
          What Our Client Say
        </h2>
        
        {/* Testimonial Cards Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-green-500 hover:text-green-400 p-2 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-green-500 hover:text-green-400 p-2 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-lightGray p-6 rounded-xl border border-gray-700/30 shadow-lg">
                {/* Quote */}
                <blockquote className="text-gray-200 italic mb-6 text-base leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author Info with Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
