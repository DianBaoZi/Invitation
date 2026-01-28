import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invitation - Create Valentine's Invites They Can't Say No To",
  description:
    "Design fun, interactive Valentine's Day invitations with drag-and-drop editor. Add runaway buttons, confetti explosions, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
