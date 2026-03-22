"use client";

import { Sidebar } from "@/components/sidebar";
import { PageTransition } from "@/components/page-transition";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 1280,
        margin: "0 auto",
        padding: 24,
        gap: 24,
        minHeight: "100vh",
        background: "var(--dm-bg)",
        transition: "background 0.3s",
      }}
    >
      <Sidebar />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
