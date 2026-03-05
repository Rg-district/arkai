import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arkai — AI Automation for UK Restaurants",
  description: "Automated reviews, booking follow-ups, and social media for UK restaurants. Set up in a week, running in the background forever.",
  openGraph: {
    title: "Arkai — AI Automation for UK Restaurants",
    description: "Turn your restaurant's missed opportunities into revenue. Automated, done-for-you.",
    url: "https://arkaihq.com",
    siteName: "Arkai",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
