import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You've received an invite!",
  description: "Someone sent you a special invitation. Click to see!",
  openGraph: {
    title: "You've received an invite!",
    description: "Someone sent you a special invitation. Click to see!",
    images: [
      {
        url: "https://yoursinvite.com/preview.png",
        width: 1200,
        height: 630,
        alt: "Yours Invite - You've received an invite!",
      },
    ],
    type: "website",
    siteName: "Yours Invite",
  },
  twitter: {
    card: "summary_large_image",
    title: "You've received an invite!",
    description: "Someone sent you a special invitation. Click to see!",
    images: ["https://yoursinvite.com/preview.png"],
  },
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
