interface PillBadgeProps {
  children: React.ReactNode;
}

export function PillBadge({ children }: PillBadgeProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "48px 0 32px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 24px",
          border: "1px solid var(--dm-border-dashed)",
          borderRadius: 1000,
          fontSize: 14,
          fontWeight: 500,
          color: "var(--dm-text)",
          background: "var(--dm-card)",
          transition: "background 0.3s, color 0.3s, border-color 0.3s",
        }}
      >
        {children}
      </span>
    </div>
  );
}
