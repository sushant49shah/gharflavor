import React, { useState } from "react";
import { Mail, Send, Users, HelpCircle } from "lucide-react";
import axiosInstance from "../app/axios";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("General");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setInquiryType("General");
    setMessage("");
    setErrors({});
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required";
    if (!message.trim()) e.message = "Please enter a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      const response = await axiosInstance.post('/api/common/contact/', {
        full_name: name,
        email,
        phone,
        inquiry_type: inquiryType,
        message,
      });

      setSubmitted(true);
      setSuccessMessage(response.data.detail || 'Your inquiry has been submitted successfully.');
      resetForm();
    } catch (error: any) {
      setApiError(error.response?.data?.detail || error.message || 'Failed to send inquiry.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left */}
        <aside className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Get in Touch</h1>
            <p className="mt-2 text-sm text-text-muted">
              We'd love to hear from customers, home chefs wanting to register, and corporate tiffin inquiries.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-bg-surface/50 border border-border">
              <p className="text-xs text-text-muted">Email</p>
              <p className="text-sm font-semibold text-white">contactus@gharflavor.com</p>
            </div>

            <div className="p-4 rounded-lg bg-bg-surface/50 border border-border">
              <p className="text-xs text-text-muted">Phone</p>
              <p className="text-sm font-semibold text-white">+91 9611270554</p>
            </div>

            <div className="p-4 rounded-lg bg-bg-surface/50 border border-border">
              <p className="text-xs text-text-muted">Location</p>
              <p className="text-sm font-semibold text-white">Bangalore, Karnataka, India</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
              <div className="p-2 rounded-md bg-bg-surface/30"><HelpCircle className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm font-bold text-white">Customer Support</p>
                <p className="text-xs text-text-muted">Help with orders, refunds and delivery.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
              <div className="p-2 rounded-md bg-bg-surface/30"><Users className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm font-bold text-white">Become a Chef</p>
                <p className="text-xs text-text-muted">Register your home kitchen and list daily menus.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
              <div className="p-2 rounded-md bg-bg-surface/30"><Mail className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm font-bold text-white">Corporate Tiffin</p>
                <p className="text-xs text-text-muted">Office lunch plans and bulk orders.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right */}
        <main className="lg:col-span-7">
          {!submitted ? (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80">
              <h2 className="text-xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-xs text-text-muted mb-4">Tell us how we can help — we'll get back shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Full Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-bg-surface/70 py-2 px-3 text-xs text-white border border-border focus:outline-none" />
                    {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg bg-bg-surface/70 py-2 px-3 text-xs text-white border border-border focus:outline-none" />
                    {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Phone (optional)</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg bg-bg-surface/70 py-2 px-3 text-xs text-white border border-border focus:outline-none" />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Inquiry Type</label>
                  <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className="w-full rounded-lg bg-bg-surface/70 py-2 px-3 text-xs text-white border border-border focus:outline-none">
                    <option>General</option>
                    <option>Customer Support</option>
                    <option>Become a Chef</option>
                    <option>Corporate Tiffin</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full rounded-lg bg-bg-surface/70 py-2 px-3 text-xs text-white border border-border focus:outline-none resize-none" />
                  {errors.message && <p className="text-rose-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {apiError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {apiError}
                  </div>
                )}
                <div>
                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-black text-xs font-bold shadow transition-all">
                    <Send className="h-4 w-4" />
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center">
              <h3 className="text-lg font-bold">Message Sent</h3>
              <p className="text-sm text-text-muted mt-2">
                {successMessage || 'Thank you — we\'ve received your message and will respond within 12 hours.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContactPage;