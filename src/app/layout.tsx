import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces — a characterful variable serif with optical sizing + a soft
// axis. Premium editorial display face for the name and headlines.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

// Instrument Serif — elegant high-contrast serif used for italic
// emphasis words (the "absurdly" treatment from the reference).
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
