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
  title: {
    default: 'Nirvana - Municipal Grievance Redressal Platform',
    template: '%s | Nirvana'
  },
  description: 'Government-grade digital platform for efficient municipal complaint management and citizen services.',
  keywords: ['municipal', 'grievance', 'complaints', 'government', 'citizen services', 'digital governance'],
  authors: [{ name: 'Nirvana Team' }],
  openGraph: {
    title: 'Nirvana - Municipal Grievance Platform',
    description: 'Efficient municipal complaint management for citizens and authorities',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
