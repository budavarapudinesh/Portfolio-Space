"use client";

import { useTheme } from "./theme-provider";

export function ProfileScene() {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: isDark
          ? "radial-gradient(ellipse at 50% 50%, #0a0d14 0%, #000000 100%)"
          : "radial-gradient(ellipse at 50% 50%, #eef1f5 0%, #e4e8ef 100%)",
        transition: "background 0.4s",
      }}
    />
  );
}
