import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, Poppins, Space_Grotesk, Playfair_Display, Merriweather } from "next/font/google";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

// Extra fonts a recruiter can pick for their careers page (see
// lib/editor/theme-options.ts). Not preloaded — the app's own UI never uses
// them, so they only cost anything on a careers page that opts in.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  preload: false,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  preload: false,
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Careers Page Builder",
  description: "Build and publish branded, accessible careers pages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hankenGrotesk.variable} ${poppins.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${merriweather.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
    </html>
  );
}
