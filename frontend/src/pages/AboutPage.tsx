import React from "react";
import { Sparkles, Heart, Users, CheckCircle } from "lucide-react";

// (no inline social svgs required in this page)

const CHEFS = [
  {
    name: "Savitri Devi",
    specialty: "North Indian Home Classics",
    experience: "12 years",
    bio: "Learned to cook from her mother; famous for homestyle dals and rotis.",
    rating: 4.8,
  },
  {
    name: "Ramesh Patel",
    specialty: "Gujarati Thalis & Snacks",
    experience: "8 years",
    bio: "Crafts balanced vegetarian meals with bold regional spices.",
    rating: 4.6,
  },
  {
    name: "Farah Khan",
    specialty: "Hyderabadi Home Biryani",
    experience: "15 years",
    bio: "Signature slow-cooked biryanis passed down through generations.",
    rating: 4.9,
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 py-12 md:py-16">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-b from-bg-surface/30 to-bg-surface/10 border border-border/80 p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Real Homes. Real Flavors. Real Food.</h1>
          <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
            GharFlavor connects you with passionate home chefs in your city who cook fresh, authentic meals — just like your own kitchen, but better.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Story</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              GharFlavor was born from a simple idea — the best food doesn't come from restaurants, it comes from homes. Every city is full of talented home cooks with generations of recipes, unique regional flavors, and a passion for feeding people well. We just built the bridge.
            </p>

            <p className="text-sm text-text-muted leading-relaxed">
              We created a platform where home kitchens can register, list their daily menus, and reach customers who are tired of the same restaurant food. No middlemen, no compromises — just genuine homemade meals delivered to your door.
            </p>
          </div>

          <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70 text-left">
            <h3 className="text-sm font-bold text-white">At a glance</h3>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li className="flex items-start gap-3"><CheckCircle className="h-4 w-4 text-accent mt-1" /> Fresh, home-cooked meals</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-4 w-4 text-accent mt-1" /> Verified home kitchens</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-4 w-4 text-accent mt-1" /> Fair prices for chefs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
          <p className="text-sm text-text-muted max-w-2xl mx-auto">Simple, transparent, and built for people who love homemade food.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-semibold text-white">For Customers</h3>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Browse daily menus from verified home kitchens near you. Order fresh, homemade meals prepared with care and delivered on time. No mystery ingredients, no industrial kitchens — just real food from real homes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-semibold text-white">For Home Chefs</h3>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Turn your passion for cooking into income. Register your home kitchen, list your menu, set your prices, and start receiving orders. We handle the payments; you focus on cooking. We only take a small platform fee when you earn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-semibold text-white">For the Community</h3>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Every order on GharFlavor supports a home cook in your neighborhood. You're not just eating well — you're helping someone build a livelihood from their kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* Why GharFlavor */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white">Why GharFlavor</h2>
            <ul className="mt-4 space-y-2 text-sm text-text-muted list-inside list-disc">
              <li>Fresh food cooked in small batches, not mass produced</li>
              <li>Authentic regional recipes you won't find anywhere else</li>
              <li>Transparent pricing — home chefs earn fairly, customers pay honestly</li>
              <li>Verified home kitchens with food safety standards</li>
              <li>Supporting local, one meal at a time</li>
            </ul>
          </div>

          <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70 text-left">
            <h3 className="text-sm font-bold text-white">Our Mission</h3>
            <p className="mt-2 text-sm text-text-muted">
              To make homemade food accessible to everyone while giving every passionate home cook the opportunity to turn their kitchen into a business. We believe food tastes better when it's made with love, and even better when it creates livelihoods.
            </p>
          </div>
        </div>
      </section>

      {/* Chef Profiles */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Meet the Hands Behind Your Meal</h2>
          <p className="text-sm text-text-muted max-w-2xl mx-auto">Every chef on GharFlavor has a story — know who cooks your food.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHEFS.map((chef) => (
            <div key={chef.name} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{chef.name}</h3>
                  <p className="text-xs text-text-muted">{chef.specialty} • {chef.experience}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent">{chef.rating} ★</p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{chef.bio}</p>

              <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                <CheckCircle className="h-4 w-4 text-accent" /> <span>Food safety verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Tiffin */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Corporate Tiffin Tie-ups</h2>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Fresh Homemade Lunch. Delivered to Your Office. Every Day.
            </p>

            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              GharFlavor's Corporate Tiffin Program connects your office with verified home chefs who prepare fresh, balanced, homemade meals delivered right to your workplace.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-text-muted list-disc list-inside">
              <li>Subscribe to a weekly or monthly tiffin plan</li>
              <li>Choose cuisine style or rotate for variety</li>
              <li>Set headcount and delivery time — we handle the rest</li>
              <li>Flexible plans for small teams to large offices</li>
              <li>Itemized billing every month, easy for accounts</li>
            </ul>

            <p className="mt-4 text-sm text-text-muted">Get in touch to set up a tiffin plan for your office.</p>

            <div className="mt-6">
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black font-semibold">Contact Sales</a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/70">
            <h3 className="text-lg font-semibold text-white">Why offices love it</h3>
            <ul className="mt-3 space-y-2 text-sm text-text-muted list-disc list-inside">
              <li>Fresh food cooked that morning, not reheated</li>
              <li>Affordable vs restaurant catering</li>
              <li>Daily variety — no menu fatigue</li>
              <li>Supports local home chefs</li>
              <li>Healthy meals keep teams energized</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
