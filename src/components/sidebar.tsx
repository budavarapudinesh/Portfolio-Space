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

function SunIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill="#f59e0b" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
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
          <SunIcon />
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
