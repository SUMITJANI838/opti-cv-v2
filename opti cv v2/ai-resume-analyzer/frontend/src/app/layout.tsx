import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPTI.CV // Next-Gen AI Resume Intelligence Workstation",
  description: "Ultra-minimal, unscrollable AI Resume Analyzer with real-time ATS scoring, keyword gap matrix, and Google X-Y-Z bullet rewrites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased dark`}
    >
      <body className="h-full w-full overflow-hidden bg-[#06070a] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
