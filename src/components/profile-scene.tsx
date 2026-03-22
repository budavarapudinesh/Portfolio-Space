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
          ? "radial-gradient(ellipse at 50% 40%, #060810 0%, #030408 100%)"
          : "radial-gradient(ellipse at 50% 40%, #e8f0ff 0%, #f0f4ff 100%)",
        transition: "background 0.4s",
      }}
    />
  );
}
