import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import RouteResetter from "@/components/route-resetter";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADS Skill India — Global Affiliate Marketing Platform",
  description:
    "Grow your business & earn passive income through affiliate marketing with ADS Skill India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </head>
      <body className="min-h-full flex flex-col">
        <RouteResetter>{children}</RouteResetter>
      </body>
    </html>
  );
}
