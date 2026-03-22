"use client";

import { useRouter } from "next/navigation";
import { DarkModeToggle } from "@/components/theme-provider";
import { TrafficLights } from "@/components/traffic-lights";

export function NavBar() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "var(--dm-card)",
        borderRadius: 14,
        boxShadow: "0 4px 24px var(--dm-shadow)",
        transition: "background 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Left: macOS traffic light buttons — close goes home, fullscreen/minimize are no-ops on home */}
      <TrafficLights onClose={() => router.push("/")} />

      {/* Right: Portfolio pill + dark mode toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          Portfolio
        </span>

        <DarkModeToggle />
      </div>
    </div>
  );
}
