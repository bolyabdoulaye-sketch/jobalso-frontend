import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Jobalso",
  description: "Plateforme de recrutement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${raleway.variable} antialiased`}>{children}</body>
    </html>
  );
}
