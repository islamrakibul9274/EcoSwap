"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Instagram, Twitter, Github, Mail, ArrowRight, Heart } from "lucide-react";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { name: "Browse Plants", href: "/plants" },
      { name: "How it Works", href: "/how-it-works" },
      { name: "Safety Tips", href: "/safety" },
      { name: "Community Guidelines", href: "/guidelines" },
    ],
  },
  {
    title: "EcoSwap",
    links: [
      { name: "About Us", href: "/about" },
      { name: "FAQ", href: "/faq" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Contact Support", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-primary overflow-hidden pt-20 pb-10">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <Leaf className="absolute -top-10 -right-10 w-64 h-64 rotate-12 text-white" />
        <Leaf className="absolute top-1/2 -left-20 w-48 h-48 -rotate-45 text-white" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-white tracking-tight">EcoSwap</span>
            </Link>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-sm">
              Connecting plant lovers worldwide. Trade cuttings, share knowledge, and grow your sustainable garden with a community that cares.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-white font-bold mb-6">{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm font-medium transition-colors inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold mb-6">Stay Rooted</h4>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Get the latest plant care tips and marketplace updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full h-12 pl-11 pr-4 bg-white/10 border-none rounded-xl text-white text-sm focus:ring-2 focus:ring-white/30 transition-all outline-none"
                />
              </div>
              <button className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-primary hover:bg-white/90 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-sm text-white/40 font-medium">
            © {new Date().getFullYear()} EcoSwap Community. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>Rakibul Islam Rumel</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
