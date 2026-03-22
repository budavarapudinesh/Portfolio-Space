"use client";

import { motion } from "framer-motion";
import { MacWindow } from "@/components/mac-window";
import { PageLayout } from "@/components/page-layout";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  message: string;
};

function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{time || "--:--"}</span>;
}

const contactInfo = [
  {
    label: "Email",
    value: "dinesh.budavarapu@gmail.com",
    href: "mailto:dinesh.budavarapu@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "dinesh-budavarapu",
    href: "https://www.linkedin.com/in/dinesh-budavarapu/",
  },
  {
    label: "GitHub",
    value: "budavarapudinesh",
    href: "https://github.com/budavarapudinesh",
  },
  {
    label: "Mobile",
    value: "+91-7989866720",
    href: "tel:+917989866720",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setSubmitError(error ?? "Something went wrong. Please try again.");
      } else {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
    <MacWindow title="Contact" subtitle="Get in touch" badge="Contact">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginBottom: 36 }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--dm-text)",
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
        >
          My inbox is open
        </h2>
        <p style={{ fontSize: 15, color: "var(--dm-text-muted)", lineHeight: 1.65 }}>
          Have an idea, a project, or just want to talk AI and design? Drop a
          message!
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          gap: 48,
          flexWrap: "wrap",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ flex: "1 1 260px" }}
        >
          {contactInfo.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 28 }}>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--dm-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 5,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </p>
              <a
                href={item.href}
                target={
                  item.label === "Email" || item.label === "Mobile"
                    ? undefined
                    : "_blank"
                }
                rel="noopener noreferrer"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--dm-text)",
                  textDecoration:
                    item.label === "LinkedIn" || item.label === "GitHub"
                      ? "underline"
                      : "none",
                  textUnderlineOffset: 3,
                }}
              >
                {item.value}
              </a>
            </div>
          ))}

          <hr
            className="separator-solid"
            style={{ margin: "8px 0 28px" }}
          />

          <div style={{ marginBottom: 28 }}>
            <p
              style={{
                fontSize: 12,
                color: "var(--dm-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 5,
                fontWeight: 500,
              }}
            >
              Currently in
            </p>
            <p style={{ fontSize: 16, fontWeight: 500, color: "var(--dm-text)" }}>
              Nellore, Andhra Pradesh, India
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: 12,
                color: "var(--dm-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 5,
                fontWeight: 500,
              }}
            >
              Local time
            </p>
            <p style={{ fontSize: 16, fontWeight: 500, color: "var(--dm-text)" }}>
              <LocalTime />
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            flex: "1 1 340px",
            border: "1px solid var(--dm-border)",
            borderRadius: 12,
            padding: 28,
            position: "relative",
            transition: "border-color 0.3s",
          }}
        >
          {isSuccess && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--dm-success-overlay)",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 36 }}>✉️</span>
              <p style={{ fontWeight: 600, fontSize: 17, color: "var(--dm-text)" }}>Message Sent!</p>
              <p style={{ fontSize: 14, color: "var(--dm-text-muted)" }}>
                I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 22 }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--dm-text)",
                  marginBottom: 7,
                }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="form-input"
                placeholder="Jane Smith"
              />
              {errors.name && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#dc2626",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {errors.name.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--dm-text)",
                  marginBottom: 7,
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="form-input"
                placeholder="jane@work.com"
              />
              {errors.email && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#dc2626",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--dm-text)",
                  marginBottom: 7,
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                {...register("message", {
                  required: "Message is required",
                })}
                className="form-input"
                placeholder="Hi Dinesh, I wanna reach out..."
                rows={5}
              />
              {errors.message && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#dc2626",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {errors.message.message}
                </span>
              )}
            </div>

            {submitError && (
              <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 14 }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: "#0088ff",
                color: "white",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.65 : 1,
                transition: "background 0.2s, opacity 0.2s",
              }}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </motion.div>
      </div>
    </MacWindow>
    </PageLayout>
  );
}
