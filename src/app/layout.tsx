import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "URGE | Break the Cycle",
  description: "1 USD/month. That's the cost of discipline. What's the cost of your habit?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${jetbrainsMono.variable} font-mono antialiased overflow-x-hidden w-full`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
