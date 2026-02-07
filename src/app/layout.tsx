import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ui/toast";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ZRXCKB6TZC";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoursinvite.com"),
  title: "Yours Invite - Create Beautiful Interactive Invitations",
  description:
    "Create and share cute, interactive invitations for dates, hangouts, and special moments. Fun templates that make saying no impossible!",
  keywords: ["invitation", "love", "romantic", "date", "interactive", "valentine", "hangout", "special moments"],
  authors: [{ name: "Yours Invite" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "https://yoursinvite.com",
  },
  openGraph: {
    title: "Yours Invite - Create Beautiful Interactive Invitations",
    description: "Create cute, interactive invitations for dates and special moments",
    url: "https://yoursinvite.com",
    siteName: "Yours Invite",
    images: [
      {
        url: "https://yoursinvite.com/preview.png",
        width: 1200,
        height: 630,
        alt: "Yours Invite - Create Beautiful Interactive Invitations",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yours Invite - Create Beautiful Interactive Invitations",
    description: "Create cute, interactive invitations for dates and special moments",
    images: ["https://yoursinvite.com/preview.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>
        <ToastProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
