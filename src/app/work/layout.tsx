import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Budavarapu Dinesh",
  description:
    "Projects in AI, ML, and product design — including RAG chatbots, face recognition systems, and intelligent resume screening.",
  openGraph: {
    title: "Work — Budavarapu Dinesh",
    description:
      "Projects in AI, ML, and product design — including RAG chatbots, face recognition systems, and intelligent resume screening.",
    url: "https://dinesh.dev/work",
    siteName: "Budavarapu Dinesh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — Budavarapu Dinesh",
    description:
      "Projects in AI, ML, and product design — including RAG chatbots, face recognition systems, and intelligent resume screening.",
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
