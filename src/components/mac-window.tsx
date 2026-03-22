"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { DarkModeToggle } from "@/components/theme-provider";
import { TrafficLights } from "@/components/traffic-lights";

interface MacWindowProps {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
}

interface TitleBarProps {
  title: string;
  subtitle: string;
  badge?: string;
  onClose: () => void;
  onMin: () => void;
  onFull: () => void;
}

function TitleBar({ title, subtitle, badge, onClose, onMin, onFull }: TitleBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid var(--dm-border)",
        position: "sticky",
        top: 0,
        background: "var(--dm-card)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
        transition: "background 0.3s, border-color 0.3s",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <TrafficLights onClose={onClose} onMinimize={onMin} onFullscreen={onFull} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: "var(--dm-text)" }}>{title}</span>
          <span style={{ fontSize: 14, color: "var(--dm-text-muted)" }}>{subtitle}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {badge && (
          <span
            style={{
              padding: "5px 16px",
              border: "1px solid var(--dm-border-dashed)",
              borderRadius: 1000,
              fontSize: 13,
              color: "var(--dm-text-muted)",
              fontWeight: 500,
              marginLeft: 4,
            }}
          >
            {badge}
          </span>
        )}
        <DarkModeToggle />
      </div>
    </div>
  );
}

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };
const SPRING_FAST = { type: "spring" as const, stiffness: 400, damping: 34 };

/**
 * Wrapper that clips overflow only during the height animation (minimize/restore).
 * Once open, overflow is visible so children can use position:sticky.
 */
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const [animating, setAnimating] = useState(true);

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={SPRING_FAST}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
      style={{ overflow: animating ? "hidden" : "visible", flex: 1 }}
    >
      {children}
    </motion.div>
  );
}

export function MacWindow({ title, subtitle, badge, children }: MacWindowProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClose = useCallback(() => router.push("/"), [router]);

  const handleFullscreen = useCallback(() => {
    setIsMinimized(false); // restore first if minimized
    setIsFullscreen((v) => !v);
  }, []);

  const handleMinimize = useCallback(() => {
    if (isFullscreen) {
      setIsFullscreen(false); // collapse fullscreen first
      return;
    }
    setIsMinimized((v) => !v);
  }, [isFullscreen]);

  return (
    <>
      {/* ── Normal window ── */}
      <div
        style={{
          background: "var(--dm-card)",
          borderRadius: 14,
          overflow: "clip",
          boxShadow: "0 4px 24px var(--dm-shadow)",
          minHeight: "calc(100vh - 48px)",
          transition: "background 0.3s, box-shadow 0.3s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TitleBar
          title={title}
          subtitle={subtitle}
          badge={badge}
          onClose={handleClose}
          onMin={handleMinimize}
          onFull={handleFullscreen}
        />

        {/* Collapsible content — animates height 0 ↔ auto on minimize */}
        <AnimatePresence initial={false}>
          {!isMinimized && (
            <ContentWrapper>
              <div style={{ padding: "36px 28px 56px" }}>{children}</div>
            </ContentWrapper>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fullscreen overlay — springs open over the entire viewport ── */}
      <AnimatePresence>
        {isFullscreen && (
          <>
            {/* Backdrop dim */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsFullscreen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.25)",
                zIndex: 48,
                backdropFilter: "blur(2px)",
              }}
            />

            {/* Expanding window panel */}
            <motion.div
              key="fullscreen"
              initial={{ opacity: 0, scale: 0.94, borderRadius: 24 }}
              animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
              exit={{ opacity: 0, scale: 0.94, borderRadius: 24 }}
              transition={SPRING}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                background: "var(--dm-card)",
                overflowY: "auto",
                transformOrigin: "center center",
              }}
            >
              <TitleBar
                title={title}
                subtitle={subtitle}
                badge={badge}
                onClose={handleClose}
                onMin={() => setIsFullscreen(false)}
                onFull={() => setIsFullscreen(false)}
              />
              <div style={{ padding: "36px 28px 56px" }}>{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Minimized restore chip ── */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            key="restore-chip"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={SPRING_FAST}
            onClick={() => setIsMinimized(false)}
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--dm-card)",
              border: "1px solid var(--dm-border)",
              borderRadius: 20,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--dm-text)",
              cursor: "pointer",
              boxShadow: "0 4px 20px var(--dm-shadow)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="1" width="12" height="8" rx="2" />
              <line x1="1" y1="4" x2="13" y2="4" />
            </svg>
            {title}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
