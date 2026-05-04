"use client";

import { motion } from "framer-motion";

const steps = [
  {
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop&q=80",
    title: "1. Find a Plant",
    desc: "Browse local listings to find plants or cuttings you'd love to add to your collection."
  },
  {
    image: "https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=400&h=300&fit=crop&q=80",
    title: "2. Snap Yours",
    desc: "Take a quick photo of a plant or cutting you are willing to trade in return."
  },
  {
    image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop&q=80",
    title: "3. Propose Swap",
    desc: "Send a swap request. If the owner likes what you offer, they'll accept!"
  },
  {
    image: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=400&h=300&fit=crop&q=80",
    title: "4. Meet & Trade",
    desc: "Chat securely to arrange a local meetup and complete your eco-friendly swap."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="w-full bg-cream py-24 min-h-[calc(100vh-80px)]">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            How It Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 text-lg"
          >
            Four simple steps to grow your indoor jungle.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-[2rem] border border-surface-dim shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 text-center flex flex-col items-center">
                <span className="w-10 h-10 rounded-full bg-primary text-cream flex items-center justify-center font-heading font-bold text-lg mb-4">
                  {i + 1}
                </span>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">{step.title}</h2>
                <p className="text-foreground/70 leading-relaxed text-base">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
