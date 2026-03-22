"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TrafficLightsProps {
  readonly onClose?: () => void;
  readonly onMinimize?: () => void;
  readonly onFullscreen?: () => void;
}

interface DotProps {
  color: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  showIcons: boolean;
}

function Dot({ color, label, icon, onClick, showIcons }: DotProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        padding: 0,
        cursor: "pointer",
        background: color,
        outline: "none",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <motion.span
        initial={false}
        animate={{ opacity: showIcons ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {icon}
      </motion.span>
    </motion.button>
  );
}

/**
 * macOS-style traffic light window controls with smooth hover animations
 * and icon reveal on group hover.
 */
export function TrafficLights({ onClose, onMinimize, onFullscreen }: TrafficLightsProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Close */}
      <Dot
        color="#ff5f57"
        label="Close"
        onClick={onClose}
        showIcons={hovered}
        icon={
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path
              d="M0.8 0.8L5.2 5.2M5.2 0.8L0.8 5.2"
              stroke="#4d0000"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
      />

      {/* Minimize */}
      <Dot
        color="#febc2e"
        label="Minimize"
        onClick={onMinimize}
        showIcons={hovered}
        icon={
          <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
            <path d="M0.8 1h4.4" stroke="#995700" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        }
      />

      {/* Fullscreen */}
      <Dot
        color="#28c840"
        label="Fullscreen"
        onClick={onFullscreen}
        showIcons={hovered}
        icon={
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path
              d="M3.3 0.8H0.8v2.5"
              stroke="#006500"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.7 5.2H5.2v-2.5"
              stroke="#006500"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}
