"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  hidden: { opacity: 0, y: 12 },
  enter:  { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -8 },
};

const transition = {
  duration: 0.26,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

/**
 * Wraps page content so navigating between routes feels fluid:
 * old page fades/slides out, new page fades/slides in.
 * Must be a client component to read the pathname.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={transition}
        style={{ flex: 1, minWidth: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
