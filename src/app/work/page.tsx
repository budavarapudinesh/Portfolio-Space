"use client";

import { motion } from "framer-motion";
import { MacWindow } from "@/components/mac-window";
import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function WorkPage() {
  return (
    <PageLayout>
    <MacWindow
      title="Work"
      subtitle="Projects I've worked on recently"
      badge="Portfolio"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {projects.map((project, idx) => (
          <motion.div
            key={project.github}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + idx * 0.12 }}
            style={{
              border: "1px solid var(--dm-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: project.gradient,
                height: 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: 16 }}>{project.icon}</div>
              <span
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: 22,
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "0 24px",
                  letterSpacing: "-0.01em",
                }}
              >
                {project.title}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                {project.date}
              </span>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 18,
                  justifyContent: "center",
                  padding: "0 24px",
                }}
              >
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.18)",
                      borderRadius: 1000,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 500,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Description inside card */}
              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                  marginTop: 16,
                  lineHeight: 1.55,
                  maxWidth: 460,
                  textAlign: "center",
                  padding: "0 24px",
                }}
              >
                {project.description.substring(0, 110)}…
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                background: "var(--dm-card)",
                flexWrap: "wrap",
                gap: 12,
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  flex: "1 1 0",
                  minWidth: 0,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "var(--dm-text)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.title}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--dm-text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.description.substring(0, 55)}...
                </span>
              </div>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 22px",
                  background: "#24292e",
                  color: "white",
                  borderRadius: 1000,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 56,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({
                title: "Dinesh's Portfolio",
                url: window.location.origin,
              });
            } else if (typeof navigator !== "undefined") {
              navigator.clipboard.writeText(window.location.origin);
            }
          }}
          style={{
            padding: "11px 22px",
            background: "transparent",
            color: "var(--dm-text)",
            border: "1px solid var(--dm-border-dashed)",
            borderRadius: 1000,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.15s, color 0.3s, border-color 0.3s",
          }}
        >
          Share with someone
        </button>
        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "11px 22px",
            background: "#0088ff",
            color: "white",
            borderRadius: 1000,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
        >
          Get in touch
        </Link>
      </motion.div>
    </MacWindow>
    </PageLayout>
  );
}
