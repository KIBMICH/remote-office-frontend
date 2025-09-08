"use client";

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

  return (
    <section className="bg-dark text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-16">
          What Our Client Say
        </h2>
        
        {/* Testimonial Cards Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-lightGray p-6 rounded-xl border border-gray-700/30 shadow-lg">
                {/* Quote */}
                <blockquote className="text-gray-200 italic mb-6 text-base leading-relaxed">
                  &quot;{testimonial.quote}&quot;
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
