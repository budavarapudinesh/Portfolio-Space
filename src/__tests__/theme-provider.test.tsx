/**
 * Tests for the ThemeProvider — dark/light mode toggle and localStorage persistence.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

function ThemeDisplay() {
  const { isDark, toggle } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDark ? "dark" : "light"}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark mode", () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode").textContent).toBe("dark");
  });

  it("toggles from dark to light on button click", () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("persists preference to localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("reads persisted preference on mount", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode").textContent).toBe("light");
  });
});
