import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { AuthHandler } from "@/components/auth-handler";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SanityLive } from "@/sanity/lib/live";


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
      <head>
        <meta name="google-site-verification" content="9iRNcbse1N8DD01MiMVjoygsKV6VsR2Ji8Sqo3UUmS0" />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased overflow-x-hidden w-full`}>
        <GoogleAnalytics gaId="G-ESS9DV1SL8" />
        <AuthHandler />
        {children}
        <SiteFooter />
        <SanityLive />
      </body>
    </html>
  );
}
