"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems: { label: string; href: string; external?: boolean }[] = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Designs", href: "/designs" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

function AnimatedRubiksCube() {
  const faces = [
    { color: "#ff3b30", transform: "translateZ(12px)" }, // Front - Red
    { color: "#ff9500", transform: "rotateY(180deg) translateZ(12px)" }, // Back - Orange
    { color: "#007aff", transform: "rotateY(90deg) translateZ(12px)" }, // Right - Blue
    { color: "#4cd964", transform: "rotateY(-90deg) translateZ(12px)" }, // Left - Green
    { color: "#ffffff", transform: "rotateX(90deg) translateZ(12px)" }, // Top - White
    { color: "#ffcc00", transform: "rotateX(-90deg) translateZ(12px)" }, // Bottom - Yellow
  ];

  return (
    <div style={{ perspective: "800px", width: 24, height: 24, margin: "0 2px" }}>
      <motion.div
        animate={{ rotateX: [360, 0], rotateY: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: f.transform,
              background: "#111", // Black inner plastic frame
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
              gap: "1.5px",
              padding: "1.5px",
              borderRadius: "2px",
            }}
          >
            {[...Array(9)].map((_, j) => (
              <div key={j} style={{ background: f.color, borderRadius: "0.5px" }} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="sidebar-container"
      style={{
        width: 320,
        maxWidth: 320,
        flexShrink: 0,
        position: "sticky",
        top: 20,
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          background: "var(--dm-card, #ffffff)",
          borderRadius: 14,
          padding: "28px 24px",
          boxShadow: "0 4px 24px var(--dm-shadow, rgba(0,0,0,0.04))",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Name + Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          <AnimatedRubiksCube />
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "var(--dm-text)",
              letterSpacing: "-0.01em",
            }}
          >
            Budavarapu Dinesh
          </span>
        </Link>

        {/* Dashed separator */}
        <hr className="separator-dashed" style={{ margin: "18px 0" }} />

        {/* Bio */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--dm-text-secondary)",
            marginBottom: 24,
          }}
        >
          An innovative ML Engineer & Product Designer who builds intelligent,
          user-focused products bridging cutting-edge AI and real-world
          usability. Currently exploring LLMs, Computer Vision, and human-centered design.
        </p>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            const isExternal = item.external;

            return (
              <div key={item.label} style={{ position: "relative" }}>
                {i > 0 && (
                  <hr className="separator-dashed" style={{ margin: 0 }} />
                )}

                {/* Sliding active background pill */}
                {isActive && !isExternal && (
                  <motion.div
                    layoutId="nav-active-pill"
                    style={{
                      position: "absolute",
                      inset: "0 -4px",
                      borderRadius: 8,
                      background: "rgba(0, 136, 255, 0.08)",
                      zIndex: 0,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 6px",
                      textDecoration: "none",
                      color: "var(--dm-text)",
                      borderRadius: 8,
                      fontWeight: 400,
                      fontSize: 15,
                    }}
                  >
                    {item.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--dm-nav-chevron)" strokeWidth="1.5">
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="nav-link"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 6px",
                      textDecoration: "none",
                      color: isActive ? "#0088ff" : "var(--dm-text)",
                      borderRadius: 8,
                      fontWeight: isActive ? 600 : 400,
                      fontSize: 15,
                      transition: "color 0.18s ease",
                    }}
                  >
                    {item.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--dm-nav-chevron)" strokeWidth="1.5">
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
