import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevForge | The Open Source Playground",
  description: "An automated, beginner-friendly open-source playground. Add your name to the contributor wall in under 2 minutes without writing any code!",
  openGraph: {
    title: "DevForge | The Open Source Playground",
    description: "An automated, beginner-friendly open-source playground. Add your name to the contributor wall in under 2 minutes without writing any code!",
    url: "https://dev-forge.bechattaoui.dev",
    siteName: "DevForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevForge | The Open Source Playground",
    description: "An automated, beginner-friendly open-source playground. Add your name to the contributor wall in under 2 minutes without writing any code!",
  },
};

import ThemeToggle from '@/components/ThemeToggle';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
        <ThemeProvider>
          <div className="flex h-full w-full">
            {/* Sidebar (Hidden on mobile for now, or fixed width) */}
            <div className="hidden md:flex flex-shrink-0">
              <Sidebar />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Top Navigation */}
              <header className="h-16 flex items-center justify-end px-8 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm z-10">
                <ThemeToggle />
              </header>
              
              {/* Scrollable Content */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-5xl mx-auto space-y-12">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
