import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designs — Budavarapu Dinesh",
  description:
    "UI/UX, 3D, and branding design work — crafted with Figma, Blender, and Illustrator.",
  openGraph: {
    title: "Designs — Budavarapu Dinesh",
    description:
      "UI/UX, 3D, and branding design work — crafted with Figma, Blender, and Illustrator.",
    url: "https://dinesh.dev/designs",
    siteName: "Budavarapu Dinesh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Designs — Budavarapu Dinesh",
    description:
      "UI/UX, 3D, and branding design work — crafted with Figma, Blender, and Illustrator.",
  },
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
