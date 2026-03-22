"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MacWindow } from "@/components/mac-window";
import { PageLayout } from "@/components/page-layout";

const STORAGE_KEY = "resume_unlocked";

function EmailGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Simulate a short delay for feel
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem(STORAGE_KEY, "1");
    onUnlock();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        borderRadius: 8,
        gap: 0,
        padding: "0 24px",
      }}
    >
      {/* frosted card */}
      <div
        style={{
          background: "var(--dm-card)",
          border: "1px solid var(--dm-border)",
          borderRadius: 16,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 8px 40px var(--dm-shadow)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Lock icon */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(0,136,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#0088ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10" width="14" height="10" rx="2" />
              <path d="M7 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: "var(--dm-text)", marginBottom: 6 }}>
            Enter your email to view
          </p>
          <p style={{ fontSize: 13, color: "var(--dm-text-muted)", lineHeight: 1.6 }}>
            Drop your email to unlock the full resume. No spam, ever.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            style={{
              padding: "11px 14px",
              borderRadius: 8,
              border: `1px solid ${error ? "#ef4444" : "var(--dm-border)"}`,
              fontSize: 14,
              background: "var(--dm-bg)",
              color: "var(--dm-text)",
              outline: "none",
              transition: "border-color 0.2s",
            }}
          />
          {error && (
            <p style={{ fontSize: 12, color: "#ef4444", marginTop: -6 }}>{error}</p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "11px 0",
              background: "#0088ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 1v2M7 11v2M1 7h2M11 7h2" opacity="0.4" />
                  <path d="M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41" opacity="0.6" />
                  <path d="M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41" opacity="0.8" />
                </svg>
                Verifying…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="10" height="7" rx="1.5" />
                  <path d="M5 6V4a2 2 0 0 1 4 0v2" />
                </svg>
                Unlock Resume
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default function ResumePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <PageLayout>
      <MacWindow title="Resume" subtitle="Budavarapu Dinesh" badge="Open to Work">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* PDF + gate wrapper */}
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
            {/* Blurred PDF */}
            <iframe
              src="/resume.pdf"
              style={{
                width: "100%",
                height: "calc(100vh - 260px)",
                minHeight: 500,
                border: "none",
                borderRadius: 8,
                filter: unlocked ? "none" : "blur(8px)",
                transition: "filter 0.5s ease",
                pointerEvents: unlocked ? "auto" : "none",
                userSelect: unlocked ? "auto" : "none",
              }}
              title="Dinesh Budavarapu Resume"
            />

            {/* Blur overlay tint */}
            <AnimatePresence>
              {!unlocked && (
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(var(--dm-card-rgb, 255,255,255), 0.3)",
                    backdropFilter: "blur(2px)",
                    borderRadius: 8,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Email gate */}
            <AnimatePresence>
              {!unlocked && (
                <EmailGate key="gate" onUnlock={() => setUnlocked(true)} />
              )}
            </AnimatePresence>
          </div>

          {/* Download button — visible only when unlocked */}
          <AnimatePresence>
            {unlocked && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <a
                  href="/resume.pdf"
                  download="Dinesh_Budavarapu_Resume.pdf"
                  style={{
                    padding: "8px 20px",
                    background: "#0088ff",
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 1v8M4 6l3 3 3-3" />
                    <path d="M2 11h10" />
                  </svg>
                  Download PDF
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MacWindow>
    </PageLayout>
  );
}
