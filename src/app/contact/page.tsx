"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQS } from "@/data/faqs";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { addToast } = useToast();
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast("Thank you! Your message has been received.");
  };

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        {/* Page Header */}
        <div className="py-6 border-b border-sand/40 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
            Contact & Customer Support
          </h1>
          <p className="text-sm text-taupe mt-1">
            Have questions regarding products, shipping timelines, or artisan details? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card space-y-6">
              <h3 className="font-serif text-xl font-bold text-espresso border-b border-sand pb-3">
                Get In Touch
              </h3>

              <div className="space-y-4 text-sm text-espresso">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-terracotta/10 text-terracotta shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso">Studio Address</h4>
                    <p className="text-xs text-taupe mt-0.5 leading-relaxed">
                      Shreyank Creations Studio<br />
                      Craft Village, Civil Lines<br />
                      Jaipur, Rajasthan 302006, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-terracotta/10 text-terracotta shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso">Email Us</h4>
                    <a
                      href="mailto:support@shreyankcreations.com"
                      className="text-xs text-terracotta hover:underline mt-0.5 block"
                    >
                      support@shreyankcreations.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-terracotta/10 text-terracotta shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso">Phone Support</h4>
                    <p className="text-xs text-taupe mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-terracotta/10 text-terracotta shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso">Business Hours</h4>
                    <p className="text-xs text-taupe mt-0.5">
                      Monday to Saturday: 10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 sm:p-8 shadow-card">
              <h3 className="font-serif text-xl font-bold text-espresso mb-4">
                Send Us a Message
              </h3>

              {isSubmitted ? (
                <div className="p-6 bg-sage/10 text-sage rounded-xl border border-sage/20 space-y-2 text-center my-6">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-sage" />
                  <h4 className="font-serif font-bold text-lg text-espresso">Message Received!</h4>
                  <p className="text-xs text-taupe">
                    Thank you for reaching out to Shreyank Creations. Our craft team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kulkarni"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Order Shipping Status</option>
                        <option>Bulk / Corporate Gifting</option>
                        <option>Product Care & Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we assist you with our craft collection?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className="pt-8 border-t border-sand">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-terracotta uppercase tracking-widest block mb-1">
              Help Center
            </span>
            <h2 className="font-serif text-3xl font-bold text-espresso">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-cream-surface border border-sand/60 rounded-xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left font-serif font-semibold text-base text-espresso flex items-center justify-between gap-4 hover:text-terracotta transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-taupe transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-terracotta" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-taupe leading-relaxed border-t border-sand/30 bg-sand-light/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
