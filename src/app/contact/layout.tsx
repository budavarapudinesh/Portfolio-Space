import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Budavarapu Dinesh",
  description:
    "Get in touch with Dinesh — open to collaborations, freelance work, and full-time roles in AI and product design.",
  openGraph: {
    title: "Contact — Budavarapu Dinesh",
    description:
      "Get in touch with Dinesh — open to collaborations, freelance work, and full-time roles in AI and product design.",
    url: "https://dinesh.dev/contact",
    siteName: "Budavarapu Dinesh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Budavarapu Dinesh",
    description:
      "Get in touch with Dinesh — open to collaborations, freelance work, and full-time roles in AI and product design.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
