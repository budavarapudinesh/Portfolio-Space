import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Budavarapu Dinesh",
  description:
    "ML Engineer & Product Designer with expertise in LLMs, Computer Vision, and human-centered AI products.",
  openGraph: {
    title: "About — Budavarapu Dinesh",
    description:
      "ML Engineer & Product Designer with expertise in LLMs, Computer Vision, and human-centered AI products.",
    url: "https://dinesh.dev/about",
    siteName: "Budavarapu Dinesh",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Budavarapu Dinesh",
    description:
      "ML Engineer & Product Designer with expertise in LLMs, Computer Vision, and human-centered AI products.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
