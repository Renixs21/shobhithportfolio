import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shobhith BJ — Engineer of Intelligent Systems",
  description:
    "The portfolio of Shobhith BJ — a full-stack engineer building intelligent systems that feel magical. React, Python, AI/ML, and a signal emerging from static.",
  keywords: [
    "Shobhith BJ",
    "full-stack developer",
    "AI engineer",
    "React",
    "Next.js",
    "Python",
    "machine learning",
    "portfolio",
  ],
  authors: [{ name: "Shobhith BJ" }],
  openGraph: {
    title: "Shobhith BJ — Engineer of Intelligent Systems",
    description:
      "A full-stack engineer building intelligent systems that feel magical.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shobhith BJ — Engineer of Intelligent Systems",
    description:
      "A full-stack engineer building intelligent systems that feel magical.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
