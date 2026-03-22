"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        padding: 24,
        gap: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--color-accent-blue)",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "var(--color-text)",
          margin: 0,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--color-text-secondary)",
          maxWidth: 380,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 22px",
          background: "var(--color-accent-blue)",
          color: "#fff",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          transition: "opacity 0.15s",
        }}
      >
        ← Back to home
      </Link>
    </div>
  );
}
