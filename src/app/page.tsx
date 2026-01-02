import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Users, MessageCircle, Zap, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-light-blue to-brand-blue-light text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                🎉 Your 24/7 Service Marketplace
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Discover & Book Services,{" "}
              <br className="hidden sm:block" />
              <span className="text-yellow-300">Anytime, Anywhere.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Handee 247 connects you with trusted professionals offering services around the clock.
              Browse, chat, negotiate, and book—all in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg bg-white/10 text-white border-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                  Explore Services
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Handee 247 Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and designed for seamless service discovery and booking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-light-blue text-white rounded-xl flex items-center justify-center mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Discover</h3>
              <p className="text-gray-600">
                Browse through hundreds of services across multiple categories. Find exactly what you need.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-light-blue text-white rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Chat</h3>
              <p className="text-gray-600">
                Connect directly with service providers. Negotiate terms and ask questions in real-time.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-light-blue text-white rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Book</h3>
              <p className="text-gray-600">
                Secure your service with just a few clicks. Track progress from proposal to completion.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-light-blue text-white rounded-xl flex items-center justify-center mb-4">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Review</h3>
              <p className="text-gray-600">
                Rate your experience and build trust in the community with verified reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Handee 247?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Verified Professionals</h3>
                    <p className="text-gray-600">All service providers are verified with ratings and reviews from real users.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Built-in Communication</h3>
                    <p className="text-gray-600">Chat, voice messages, and calls—all within the platform for seamless coordination.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Growing Community</h3>
                    <p className="text-gray-600">Join thousands of users who trust Handee 247 for their service needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-brand-blue to-brand-light-blue rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-6xl font-bold mb-2">24/7</div>
                  <div className="text-2xl font-semibold">Always Available</div>
                  <p className="mt-4 text-blue-100">Services when you need them, day or night</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-light-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join Handee 247 today and discover a world of services at your fingertips.
            Whether you're offering or seeking, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 backdrop-blur-sm">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
