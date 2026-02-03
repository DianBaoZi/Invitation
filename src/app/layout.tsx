import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "YoursInvite - Create Valentine's Invites They Can't Say No To",
  description:
    "Design fun, interactive Valentine's Day invitations with drag-and-drop editor. Add runaway buttons, confetti explosions, and more!",
  keywords: ["valentine", "invitation", "love", "romantic", "date", "interactive"],
  authors: [{ name: "YoursInvite" }],
  robots: "index, follow",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "YoursInvite - Create Valentine's Invites They Can't Say No To",
    description: "Design fun, interactive Valentine's Day invitations",
    type: "website",
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
      <body>
        <ToastProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
