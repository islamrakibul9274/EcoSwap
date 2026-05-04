import type { Metadata, Viewport } from "next"; // Added Viewport type
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { RouteLoader } from "@/components/layout/RouteLoader";
import ErrorBoundary from "@/components/ErrorBoundary";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-be-vietnam-pro",
});

// Corrected: Moved themeColor to the viewport export below
export const metadata: Metadata = {
  title: "EcoSwap - Community Plant Swapping",
  description: "Connect with neighbors, trade plants, and grow your community with EcoSwap.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EcoSwap",
  },
};

// New: Required export for viewport-related settings in Next.js 14
export const viewport: Viewport = {
  themeColor: "#2d4430",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${beVietnamPro.variable} font-sans antialiased min-h-screen flex flex-col bg-surface text-foreground`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <RouteLoader />
          </Suspense>
          {children}
        </ErrorBoundary>

        {/* Service Worker Registration for PWA support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}