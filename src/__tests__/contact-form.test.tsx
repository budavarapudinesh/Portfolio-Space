/**
 * Tests for the contact form validation and submission behaviour.
 * These are unit tests — they do NOT call the real Resend API.
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock framer-motion so tests don't need a DOM with transforms
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div {...p}>{children}</div>,
    form: ({ children, ...p }: React.HTMLAttributes<HTMLFormElement>) => <form {...p}>{children}</form>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock child layout components that pull in Three.js / server context
jest.mock("@/components/mac-window", () => ({
  MacWindow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("@/components/page-layout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Prevent real fetch calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

import ContactPage from "@/app/contact/page";

describe("ContactPage — form validation", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders name, email and message fields", () => {
    render(<ContactPage />);
    expect(screen.getByPlaceholderText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("jane@work.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hi Dinesh, I wanna reach out...")).toBeInTheDocument();
  });

  it("shows required validation errors when submitted empty", async () => {
    render(<ContactPage />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it("shows invalid email error for bad email format", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);
    await user.type(screen.getByPlaceholderText("Jane Smith"), "Dinesh");
    await user.type(screen.getByPlaceholderText("jane@work.com"), "user@x");
    await user.type(screen.getByPlaceholderText("Hi Dinesh, I wanna reach out..."), "Hello!");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("calls /api/contact with correct payload on valid submit", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    const user = userEvent.setup();
    render(<ContactPage />);
    await user.type(screen.getByPlaceholderText("Jane Smith"), "Dinesh");
    await user.type(screen.getByPlaceholderText("jane@work.com"), "dinesh@example.com");
    await user.type(screen.getByPlaceholderText("Hi Dinesh, I wanna reach out..."), "Hello from test!");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            name: "Dinesh",
            email: "dinesh@example.com",
            message: "Hello from test!",
          }),
        })
      );
    });
  });

  it("shows success state after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    const user = userEvent.setup();
    render(<ContactPage />);
    await user.type(screen.getByPlaceholderText("Jane Smith"), "Dinesh");
    await user.type(screen.getByPlaceholderText("jane@work.com"), "dinesh@example.com");
    await user.type(screen.getByPlaceholderText("Hi Dinesh, I wanna reach out..."), "Hello!");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  });

  it("shows error message when API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });
    const user = userEvent.setup();
    render(<ContactPage />);
    await user.type(screen.getByPlaceholderText("Jane Smith"), "Dinesh");
    await user.type(screen.getByPlaceholderText("jane@work.com"), "dinesh@example.com");
    await user.type(screen.getByPlaceholderText("Hi Dinesh, I wanna reach out..."), "Hello!");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
