"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MacWindow } from "@/components/mac-window";
import { PageLayout } from "@/components/page-layout";
import { PillBadge } from "@/components/pill-badge";
import { designs, categories, toolColors, type DesignCategory } from "@/data/designs";

export default function DesignsPage() {
  const [active, setActive] = useState<DesignCategory>("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = active === "All" ? designs : designs.filter((d) => d.category === active);

  return (
    <PageLayout>
      <MacWindow title="Designs" subtitle="Creative & visual work" badge="Design">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 32 }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--dm-text)",
              marginBottom: 10,
              letterSpacing: "-0.02em",
            }}
          >
            Design Work
          </h2>
          <p style={{ fontSize: 15, color: "var(--dm-text-muted)", lineHeight: 1.65 }}>
            UI/UX, 3D modelling, and branding work across Figma, Blender, and more.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: "7px 18px",
                borderRadius: 1000,
                border: "1px solid",
                borderColor: active === cat ? "#0088ff" : "var(--dm-border-dashed)",
                background: active === cat ? "#0088ff" : "transparent",
                color: active === cat ? "#fff" : "var(--dm-text-muted)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <PillBadge>{active === "All" ? "All Designs" : active}</PillBadge>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((design, idx) => (
              <motion.div
                key={design.title}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                style={{
                  border: "1px solid var(--dm-border)",
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
              >
                {/* Preview — real image or gradient */}
                <div
                  style={{
                    height: 220,
                    overflow: "hidden",
                    background: "image" in design && design.image ? design.gradient : design.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {"image" in design && design.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={design.image as string}
                      alt={design.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        imageOrientation: "none",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.9)",
                          textAlign: "center",
                          padding: "0 20px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {design.title}
                      </span>
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "3px 10px",
                      background: "rgba(0,0,0,0.35)",
                      borderRadius: 1000,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 500,
                      backdropFilter: "blur(4px)",
                      zIndex: 1,
                    }}
                  >
                    {design.year}
                  </span>
                </div>

                {/* Card footer */}
                <div
                  style={{
                    padding: "14px 18px",
                    background: "var(--dm-card)",
                    transition: "background 0.3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: expanded === idx ? 10 : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: toolColors[design.tool] ?? "#0088ff",
                      }}
                    >
                      {design.tool}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 1000,
                        background: "var(--dm-pill-bg)",
                        color: "var(--dm-text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {design.category}
                    </span>
                  </div>

                  <AnimatePresence>
                    {expanded === idx && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          fontSize: 13,
                          color: "var(--dm-text-secondary)",
                          lineHeight: 1.6,
                          overflow: "hidden",
                        }}
                      >
                        {design.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </MacWindow>
    </PageLayout>
  );
}
