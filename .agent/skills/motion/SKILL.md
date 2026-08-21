---
name: motion
description: Expert animation engineering and UI/UX motion design using Motion (formerly Framer Motion) from motiondivision/motion. Covers layoutId, physics springs, gestures, SVG drawing, staggered reveals, scroll-linked animations, and Next.js/React performance best practices.
---

# Motion (Framer Motion) Skill Guide

Production animation engineering for React, Next.js, and modern web applications using [Motion](https://github.com/motiondivision/motion) (`framer-motion` / `motion`).

---

## 1. Quick Installation & Setup

```bash
# In Next.js / React projects
npm install framer-motion
# or using the new package
npm install motion
```

In Next.js App Router, all animated components must be Client Components:
```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
```

---

## 2. Core Concepts & Animation Patterns

### A. Declarative Animations & Variants
Variants organize animation states and orchestrate parent-child timing cleanly:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

export function StaggeredList({ items }: { items: string[] }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item, i) => (
        <motion.li key={i} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

### B. Shared Element & Layout Transitions (`layoutId` & `layout`)
Smoothly animate position, size, and layout morphing without manual math:

```tsx
// Active tab indicator
export function TabNav({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="relative px-4 py-2 text-sm text-zinc-300 transition-colors"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/40 rounded-lg -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

---

### C. Exit Animations (`AnimatePresence`)
Handles unmounting transitions for modals, toasts, dropdowns, and feeds:

```tsx
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.2 } }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

---

### D. Interactive Gestures (Hover, Tap, Drag)

```tsx
<motion.button
  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(16,185,129,0.3)" }}
  whileTap={{ scale: 0.97 }}
  whileFocus={{ ring: 2 }}
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
  dragElastic={0.2}
  className="px-6 py-3 bg-emerald-600 rounded-xl font-medium"
>
  Swipe or Click
</motion.button>
```

---

### E. SVG Path & Gauge Drawing

```tsx
export function AnimatedCircleGauge({ progress }: { progress: number }) {
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={40} stroke="#27272a" strokeWidth={8} fill="none" />
      <motion.circle
        cx={50}
        cy={50}
        r={40}
        stroke="#10b981"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress / 100 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}
```

---

### F. Scroll-Linked Animations & Viewport Triggers (`useScroll`, `useInView`)

```tsx
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export function ParallaxHeader() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.header style={{ y, opacity }} className="relative h-96">
      <h1>Parallax Banner</h1>
    </motion.header>
  );
}
```

---

## 3. High-Performance Best Practices

1. **Hardware Acceleration**: Animate `transform` (e.g. `x`, `y`, `scale`, `rotate`) and `opacity`. Avoid animating layout properties directly (`width`, `height`, `margin`, `top`) — use the `layout` prop instead.
2. **Accessibility**: Respect user motion preferences:
   ```tsx
   import { useReducedMotion } from "framer-motion";
   const shouldReduceMotion = useReducedMotion();
   const animation = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
   ```
3. **Imperative Control (`useAnimate`)**:
   ```tsx
   const [scope, animate] = useAnimate();
   const trigger = async () => {
     await animate("button", { scale: 0.9 });
     await animate(".badge", { opacity: 1, y: 0 });
     await animate("button", { scale: 1 });
   };
   ```
4. **Spring Physics Tuning**:
   * **Snappy UI clicks**: `stiffness: 400, damping: 30`
   * **Gentle float/bounce**: `stiffness: 150, damping: 15`
   * **Stiff precision**: `stiffness: 500, damping: 40`
