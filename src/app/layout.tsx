import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://kkb-three.vercel.app"),
  title: "KKB - Kanya-Kanyang Bayad | Bill Splitting App",
  description:
    "Split bills easily with friends and family. Track payments, calculate shares, and share via messaging apps. Perfect for dining out, trips, and group expenses in the Philippines.",
  keywords: [
    "bill splitter",
    "split bill",
    "KKB",
    "kanya-kanyang bayad",
    "hatian",
    "bill calculator",
    "expense splitter",
    "group expenses",
    "Philippines",
    "dining calculator",
  ],
  authors: [{ name: "Arwin Miclat" }],
  creator: "Arwin Miclat",
  publisher: "Arwin Miclat",
  applicationName: "KKB",
  category: "Finance",
  classification: "Utility",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://kkb-three.vercel.app",
    siteName: "KKB - Kanya-Kanyang Bayad",
    title: "KKB - Kanya-Kanyang Bayad | Bill Splitting App",
    description:
      "Split bills easily with friends. Track payments, calculate shares, and share results instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KKB - Bill Splitting App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KKB - Kanya-Kanyang Bayad",
    description: "Split bills easily with friends and family.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KKB",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4dde8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2744" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
