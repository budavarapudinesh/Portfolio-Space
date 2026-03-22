"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { MacWindow } from "@/components/mac-window";
import { PageLayout } from "@/components/page-layout";
import { PillBadge } from "@/components/pill-badge";
import { skills } from "@/data/skills";
import { certifications, type Cert } from "@/data/certifications";
import { achievements } from "@/data/achievements";

/* ── 3-D Horizontal Cert Carousel ─────────────────────────────── */

const AUTO_INTERVAL = 1200; // ms between auto-advances

function CertCarousel({ certs }: { certs: Cert[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActive((a) => (a + 1) % certs.length), [certs.length]);
  const prev = useCallback(() => setActive((a) => (a - 1 + certs.length) % certs.length), [certs.length]);

  // Auto-advance — pauses on hover
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  // Manual navigation resets the timer
  const goTo = useCallback((idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(idx);
    if (!paused) {
      timerRef.current = setInterval(next, AUTO_INTERVAL);
    }
  }, [paused, next]);

  const handlePrev = useCallback(() => goTo((active - 1 + certs.length) % certs.length), [active, certs.length, goTo]);
  const handleNext = useCallback(() => goTo((active + 1) % certs.length), [active, certs.length, goTo]);

  /** offset: -1 = left, 0 = center, 1 = right, ±2 = far side */
  function getOffset(idx: number) {
    let d = idx - active;
    if (d > certs.length / 2) d -= certs.length;
    if (d < -certs.length / 2) d += certs.length;
    return d;
  }

  return (
    <div
      style={{ position: "relative", paddingBottom: 40 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Carousel track ── */}
      <div
        style={{
          position: "relative",
          height: 340,
          perspective: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {certs.map((cert, idx) => {
          const offset = getOffset(idx);
          const abs = Math.abs(offset);
          if (abs > 1) return null; // only render ±1 neighbours

          const isActive = offset === 0;
          const x = offset * 62;           // % horizontal shift
          const scale = isActive ? 1 : 0.78;
          const rotateY = offset * -22;     // deg tilt
          const z = isActive ? 0 : -80;     // px depth
          const opacity = isActive ? 1 : 0.6;
          const blur = isActive ? 0 : 2;

          return (
            <motion.div
              key={cert.image}
              onClick={() => !isActive && goTo(idx)}
              animate={{ x: `${x}%`, scale, rotateY, z, opacity }}
              transition={{ type: "spring", stiffness: 460, damping: 36 }}
              style={{
                position: "absolute",
                width: "55%",
                maxWidth: 480,
                cursor: isActive ? "default" : "pointer",
                transformStyle: "preserve-3d",
                filter: blur ? `blur(${blur}px)` : "none",
                zIndex: isActive ? 10 : 5,
              }}
            >
              {/* Card */}
              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: isActive
                    ? "0 24px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.2)"
                    : "0 8px 24px rgba(0,0,0,0.2)",
                  border: `2px solid ${isActive ? cert.accent + "60" : "transparent"}`,
                  transition: "box-shadow 0.3s, border-color 0.3s",
                }}
              >
                {/* Certificate image — always white bg */}
                <div style={{ position: "relative", width: "100%", height: 240, background: "#fff" }}>
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    style={{ objectFit: "contain", padding: 10 }}
                    sizes="480px"
                    priority={isActive}
                  />
                  {/* Bottom gradient overlay for label legibility */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 80,
                      background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                    }}
                  />
                  {/* Accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: cert.accent,
                    }}
                  />
                  {/* Date pill */}
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "3px 10px",
                      borderRadius: 1000,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#fff",
                      background: cert.accent,
                    }}
                  >
                    {cert.date}
                  </span>
                </div>

                {/* Info strip */}
                <div
                  style={{
                    background: "var(--dm-card)",
                    padding: "14px 18px",
                    transition: "background 0.3s",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--dm-text)",
                      lineHeight: 1.4,
                      marginBottom: 4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cert.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--dm-text-muted)", fontWeight: 500 }}>
                      {cert.org}
                    </span>
                    {cert.instructor && (
                      <>
                        <span style={{ color: "var(--dm-border)", fontSize: 10 }}>•</span>
                        <span style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>{cert.instructor}</span>
                      </>
                    )}
                    {cert.duration && (
                      <>
                        <span style={{ color: "var(--dm-border)", fontSize: 10 }}>•</span>
                        <span style={{ fontSize: 12, color: "var(--dm-text-muted)" }}>{cert.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Navigation: prev / dots / next ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 8,
        }}
      >
        <motion.button
          onClick={handlePrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid var(--dm-border)",
            background: "var(--dm-card)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--dm-text)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 2L5 7l4 5" />
          </svg>
        </motion.button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {certs.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => goTo(idx)}
              animate={{
                width: idx === active ? 20 : 8,
                background: idx === active ? certifications[active].accent : "var(--dm-border)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{
                height: 8,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid var(--dm-border)",
            background: "var(--dm-card)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--dm-text)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 2l4 5-4 5" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PageLayout>
    <MacWindow
      title="About"
      subtitle="My corner on the internet"
      badge="My corner"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 380px" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.4,
              marginBottom: 24,
              color: "var(--dm-text)",
              letterSpacing: "-0.02em",
            }}
          >
            The Internet is an ocean, and you somehow landed on my little
            island!
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--dm-text-secondary)" }}>
              I&apos;m an innovative Machine Learning Engineer and Product
              Designer with expertise in LLMs, computer vision, and
              human-centered design. I&apos;m passionate about building
              intelligent, user-focused products that bridge the gap between
              cutting-edge AI and real-world usability.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--dm-text-secondary)" }}>
              Beyond work, I&apos;m usually exploring new AI research papers,
              experimenting with generative models, tinkering with 3D design
              in Blender, or diving into the latest developments in the world
              of deep learning.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--dm-text-secondary)" }}>
              I&apos;m drawn to ideas that push the boundaries of what
              machines can understand — in language, in vision, and in
              interaction.
            </p>
          </div>
        </div>

        <div
          style={{
            flex: "0 0 260px",
            height: 320,
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            boxShadow: "0 0 0 3px var(--dm-border), 0 4px 24px var(--dm-shadow)",
            border: "1.5px solid var(--dm-border)",
          }}
        >
          <Image
            src="/profile.jpg"
            alt="Budavarapu Dinesh"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
          {/* Bottom gradient overlay */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }} />
        </div>
      </motion.div>

      <hr className="separator-solid" style={{ margin: "56px 0 0" }} />

      <PillBadge>Technical Skills</PillBadge>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {skills.map((skill, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + idx * 0.06 }}
            style={{
              padding: 22,
              border: "1px solid var(--dm-border)",
              borderRadius: 12,
              transition: "border-color 0.3s",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--dm-text)",
                marginBottom: 14,
              }}
            >
              {skill.category}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skill.items.map((item, i) => (
                <span
                  key={i}
                  style={{
                    padding: "5px 12px",
                    background: "var(--dm-pill-bg)",
                    borderRadius: 1000,
                    fontSize: 13,
                    color: "var(--dm-text-secondary)",
                    fontWeight: 400,
                    transition: "background 0.3s, color 0.3s",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <hr className="separator-solid" style={{ margin: "56px 0 0" }} />

      <PillBadge>Certifications</PillBadge>

      <CertCarousel certs={certifications} />

      <hr className="separator-solid" style={{ margin: "56px 0 0" }} />

      <PillBadge>Achievements</PillBadge>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {achievements.map((achievement, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: 22,
              border: "1px solid var(--dm-border)",
              borderRadius: 12,
              transition: "border-color 0.3s",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fef3c7",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🏆
            </span>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: "var(--dm-text-secondary)",
              }}
            >
              {achievement}
            </p>
          </motion.div>
        ))}
      </div>
    </MacWindow>
    </PageLayout>
  );
}
