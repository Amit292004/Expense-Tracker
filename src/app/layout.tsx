import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpensIQ | Advanced AI Expense Tracker",
  description: "The world's most advanced AI-powered expense tracker. Take control of your finances with smart categorization, predictions, and beautiful analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
