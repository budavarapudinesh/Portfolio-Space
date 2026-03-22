"use client";

import { Sidebar } from "@/components/sidebar";
import { NavBar } from "@/components/nav-bar";
import { ProfileScene } from "@/components/profile-scene";
import { Globe } from "@/components/globe";
import { useTheme } from "@/components/theme-provider";

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Full-page Background Graphic */}
      <div style={{ position: "absolute", inset: 0 }}>
        <ProfileScene />
      </div>

      {/* Full-page 3D Globe with native view offset */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "auto" }}>
        <Globe isDark={isDark} />
        {/* Hint text hovering over full canvas */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 10,
            fontSize: 11,
            color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)",
            pointerEvents: "none",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* Main UI Layout Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maxWidth: 1280,
          margin: "0 auto",
          padding: 24,
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div style={{ pointerEvents: "auto", flexShrink: 0 }}>
          <Sidebar />
        </div>

        <div style={{ flex: 1, pointerEvents: "auto" }}>
          <NavBar />
        </div>
      </div>
    </div>
  );
}
