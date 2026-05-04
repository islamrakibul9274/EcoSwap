"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Leaf, Users, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-cream py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6"
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-primary">
              Grow Your Garden, <br />
              <span className="text-terracotta">Together.</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-lg leading-relaxed">
              Join the neighborhood plant swap community. Trade cuttings, share tips, and connect with fellow plant enthusiasts near you.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" variant="primary">Join the Community</Button>
              </Link>
              <Link href="/plants">
                <Button size="lg" variant="outline">Browse Plants</Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] bg-surface-dim overflow-hidden shadow-2xl"
          >
            {/* Hero Image */}
            <img
              src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=1000&fit=crop&q=80"
              alt="Hands carefully holding a young green plant"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">How EcoSwap Works</h2>
            <p className="text-foreground/70">A simple, tactile way to diversify your indoor jungle without spending a fortune.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: MapPin, 
                title: "Find Locals", 
                desc: "Discover plant lovers in your area ready to trade.",
                image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=250&fit=crop&q=80"
              },
              { 
                icon: Leaf, 
                title: "List Your Plants", 
                desc: "Upload cuttings or full plants you want to swap.",
                image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=250&fit=crop&q=80"
              },
              { 
                icon: Users, 
                title: "Connect & Trade", 
                desc: "Chat securely and arrange your local swap.",
                image: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=400&h=250&fit=crop&q=80"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-cream rounded-[1.5rem] overflow-hidden text-center flex flex-col items-center shadow-sm border border-surface-dim"
              >
                <div className="w-full h-40 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-8 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary -mt-12 border-4 border-cream z-10 bg-cream">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
