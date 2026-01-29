import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Invitation - Create Valentine's Invites They Can't Say No To",
  description:
    "Design fun, interactive Valentine's Day invitations with drag-and-drop editor. Add runaway buttons, confetti explosions, and more!",
  keywords: ["valentine", "invitation", "love", "romantic", "date", "interactive"],
  authors: [{ name: "Invitation" }],
  robots: "index, follow",
  openGraph: {
    title: "Invitation - Create Valentine's Invites They Can't Say No To",
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
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
