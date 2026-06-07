import { Link } from "react-router-dom";
import { ShoppingBag, Mail, ArrowRight } from "lucide-react";
import React, { useState } from "react";

// Inline brand SVGs to guarantee cross-version TypeScript support
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-bg-dark border-t border-border text-text-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        {/* Top multi-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-border">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <ShoppingBag className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                GharFlavour
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed text-left">
              Bringing Kathmandu the emotional warmth and authentic comfort of homemade meals, farm-fresh local groceries, and traditional Nepalese family flavors.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-bg-surface hover:bg-primary hover:text-white transition-all duration-300" aria-label="Facebook">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-bg-surface hover:bg-primary hover:text-white transition-all duration-300" aria-label="Twitter">
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-bg-surface hover:bg-primary hover:text-white transition-all duration-300" aria-label="Instagram">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-bg-surface hover:bg-primary hover:text-white transition-all duration-300" aria-label="GitHub">
                <GithubIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav Links Grid Col (span 5) */}
          <div className="md:col-span-5 grid grid-cols-3 gap-4">
            
            {/* Shop Column */}
            <div className="text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Shop</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/products" className="hover:text-primary transition-colors">All Flavours</Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-primary transition-colors">Best Sellers</Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-primary transition-colors">New Batches</Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-primary transition-colors">Hot Deals</Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Company</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">Our Kitchen</Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Careers</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Press Kit</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Support</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Delivery Range</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Easy Payments</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">FAQs</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Newsletter Col */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Subscribe to Newsletter
            </h3>
            <p className="text-xs leading-relaxed text-text-muted">
              Get raw updates on freshly prepared menus, seasonal fruit harvests, and warm discount coupons.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="relative flex items-center rounded-lg bg-bg-surface border border-border focus-within:border-primary transition-colors px-2 py-1">
                <Mail className="h-4 w-4 text-text-muted ml-2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none py-1.5 pl-2 pr-8 text-xs text-white placeholder-text-muted/60 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 p-1 rounded-md bg-primary hover:bg-accent text-white transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
            {submitted && (
              <p className="text-xs text-emerald-450 animate-pulse">
                ✓ Success! Check your inbox.
              </p>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-xs text-text-muted/80">
            &copy; {new Date().getFullYear()} GharFlavour Inc. All rights reserved. Made with love in Kathmandu.
          </p>
          
          {/* Payment Badges */}
          <div className="flex gap-2 text-[10px] font-bold text-text-muted select-none">
            <span className="px-2 py-1 rounded bg-bg-surface border border-border/50">ESEWA</span>
            <span className="px-2 py-1 rounded bg-bg-surface border border-border/50">KHALTI</span>
            <span className="px-2 py-1 rounded bg-bg-surface border border-border/50">VISA</span>
            <span className="px-2 py-1 rounded bg-bg-surface border border-border/50">MC</span>
            <span className="px-2 py-1 rounded bg-bg-surface border border-border/50">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
