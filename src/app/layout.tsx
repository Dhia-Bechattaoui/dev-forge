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
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
