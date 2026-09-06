import type { Metadata } from "next";
import { Inter, Hanken_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Careers Page Builder",
  description: "Build and publish branded, accessible careers pages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hankenGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
    </html>
  );
}
