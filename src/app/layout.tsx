import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Budavarapu Dinesh — ML Engineer & Product Designer",
    template: "%s",
  },
  description:
    "Innovative ML Engineer & Product Designer building intelligent, user-focused products bridging cutting-edge AI and real-world usability.",
  metadataBase: new URL("https://dinesh.dev"),
  openGraph: {
    title: "Budavarapu Dinesh — ML Engineer & Product Designer",
    description:
      "Innovative ML Engineer & Product Designer building intelligent, user-focused products bridging cutting-edge AI and real-world usability.",
    url: "https://dinesh.dev",
    siteName: "Budavarapu Dinesh",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budavarapu Dinesh — ML Engineer & Product Designer",
    description:
      "Innovative ML Engineer & Product Designer building intelligent, user-focused products bridging cutting-edge AI and real-world usability.",
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
    // suppressHydrationWarning: data-theme is set client-side after hydration by ThemeProvider
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
