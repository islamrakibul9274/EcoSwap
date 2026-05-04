"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How does swapping work?", a: "Find a plant you like, click 'Request Swap', and propose one of your own plants in exchange. If the other user agrees, you'll enter a private chat to arrange the meetup." },
  { q: "Is EcoSwap free to use?", a: "Yes! EcoSwap is entirely free. We believe plant sharing should be accessible to everyone." },
  { q: "What if I don't have plants to trade?", a: "Many users are happy to give away cuttings for free to beginners! Look for listings tagged with 'Gift' or 'Free'." },
  { q: "Is it safe to meet up?", a: "We recommend meeting in public spaces like cafes, parks, or specialized plant meetup spots during daylight hours." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full bg-cream py-24 min-h-[calc(100vh-80px)]">
      <div className="max-w-[800px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl border border-surface-dim overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-lg text-foreground hover:bg-surface transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={cn("w-5 h-5 text-terracotta transition-transform", openIndex === i && "rotate-180")} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-0 text-foreground/70 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
