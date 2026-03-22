"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "var(--color-text)",
          margin: 0,
        }}
      >
        Something went wrong
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
        An unexpected error occurred. You can try again or return to the home page.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 22px",
            background: "var(--color-accent-blue)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 22px",
            background: "transparent",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
        >
          ← Home
        </a>
      </div>
    </div>
  );
}
