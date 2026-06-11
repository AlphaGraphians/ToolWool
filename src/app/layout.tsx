import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: "ToolWool — Premium Utility Suite",
  description: "57 instant browser tools for PDF, Image, Code, Data, Security and CSS workflows. No backend needed.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}