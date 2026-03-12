import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatBot AI — Intelligent Conversations",
  description: "A powerful chatbot powered by ChatBotAI, built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
