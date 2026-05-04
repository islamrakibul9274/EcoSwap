"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="w-full bg-cream py-24 min-h-[calc(100vh-80px)]">
      <div className="max-w-[1000px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            About EcoSwap
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Building a greener world, one swap at a time.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden mb-12 shadow-lg"
        >
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000&h=500&fit=crop&q=80"
            alt="Beautiful green plants in a community garden"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-surface-dim"
          >
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              EcoSwap was born out of a simple idea: growing your indoor jungle shouldn't cost the earth. We believe that plant care is a community effort, and trading cuttings is the most sustainable way to diversify your collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-surface-dim"
          >
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">Our Approach</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              Our "Tactile Minimalism" approach ensures that connecting with neighbors feels organic and straightforward, stripping away the noise of traditional social networks to focus on what matters—the plants.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-surface-dim text-center"
        >
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">Join the Community</h2>
          <p className="text-foreground/80 leading-relaxed text-lg max-w-2xl mx-auto">
            Whether you're a seasoned botanist or just bought your first Monstera, there's a place for you here. Connect, trade, and watch your community grow.
          </p>
        </motion.div>

        {/* Team / Community Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { src: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=300&h=300&fit=crop&q=80", alt: "Potted succulents" },
            { src: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&h=300&fit=crop&q=80", alt: "Monstera leaf close up" },
            { src: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=300&h=300&fit=crop&q=80", alt: "Hands holding a small plant" },
            { src: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=600&fit=crop", alt: "Greenhouse with tropical plants" },
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="aspect-square rounded-2xl overflow-hidden shadow-sm"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
