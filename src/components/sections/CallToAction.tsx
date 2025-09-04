import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-dark text-white py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="border-t border-blue-600 pt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Remote Collaboration?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful teams transforming their remote work experience with RemoteHub.
          </p>
          
          <Link href="/auth/register">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
