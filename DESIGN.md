# Design System: ISRO Bid-Fit Scanner & Tender Discovery Engine

## 1. Visual Theme & Atmosphere
A restrained, dark aerospace command interface with confident typography and fluid spring-physics motion. The atmosphere is clinical, authoritative, and precision-engineered, reminiscent of space mission operations and high-stakes defense procurement terminals. The canvas avoids generic AI blue/purple neon glows, grounding itself in deep slate-titanium neutrals with high-contrast emerald (`#10b981`), telemetry cyan (`#06b6d4`), and warning amber (`#f59e0b`).

## 2. Color Palette & Roles
- **Canvas Obsidian** (`#08090a`) — Primary background canvas
- **Titanium Surface** (`#13161a`) — Main card container and elevation surface
- **Inset Well** (`#0a0b0e`) — Search bars, input insets, and recessed metric displays
- **Structural Titanium Border** (`#222730`) — 1px precision structural boundaries
- **Border Hover Highlight** (`#303744`) — Subtle active hover border tone
- **ISRO Emerald** (`#10b981`) — Primary accent for high fit scores, active portal gates, and conversion CTAs
- **Telemetry Cyan** (`#06b6d4`) — Secondary accent for mechanical tolerances, GD&T, and OCR extraction
- **Signal Amber** (`#f59e0b`) — Warning accent for tight tender deadlines, EMD requirements, and tolerance deviations
- **Primary Text Crisp White** (`#ffffff`) — High-contrast display headlines and critical telemetry
- **Secondary Zinc** (`#9ca3af`) — Body copy, metadata labels, and statutory references

## 3. Typography Rules
- **Display & Headlines:** `Inter` / `Geist` — Track-tight (`tracking-tight`), weight-driven hierarchy (`font-bold` / `font-extrabold`). Banned: Overly large screaming text, gradient text abuse, generic serifs.
- **Body & Captions:** `Inter` / `Geist` — Relaxed leading, max 65 characters per line, concise anti-slop copy.
- **Mono / Numerical Telemetry:** `JetBrains Mono` / `Geist Mono` — Mandatory for all RFP reference codes, currency values in INR, GD&T tolerances (µm), ISO standards, and tabular counter values.
- **Copywriting Constraint:** Zero generic em-dashes (`—`) or en-dashes (`–`) in all headlines, body, badges, and tooltips.

## 4. Component Stylings
- **Buttons:** Tactile `-1px` translate on `:active:scale-[0.98]`. Flat solid color fill with subtle inset top sheen. No generic blur outer glow.
- **Cards:** Rounded corners (`rounded-2xl`). Border `1px solid #222730`. Background `#13161a`. Hover state elevates border to `#303744` with micro-shadow.
- **Inputs & Search Engines:** Embedded in `#0a0b0e` insets, 12px padding, subtle 1px border. Focus ring in emerald (`#10b981/50`).
- **Score Gauges:** SVG circular meters with tabular monospace percentages. Color-coded thresholds (≥75% Emerald, 50–74% Amber, <50% Red).
- **Tender Result Badges:** High-contrast pill tags (`rounded-md`), semi-transparent colored backgrounds (`bg-emerald-500/10`), 1px calibrated borders.

## 5. Layout Principles
- **Hero Architecture:** Asymmetric split or discovery search bar with live trending filters.
- **Tenderkart Discovery Grid:** Instant search bar, multi-center selector tabs (VSSC, URSC, SAC, IPRC, SDSC, GeM, CPPP), live tender result cards with GD&T match gauges.
- **Responsive Strategy:** Mobile-first collapse below 768px. Zero horizontal scroll. Touch targets minimum 44px. Full-height sections use `min-h-[100dvh]`.
- **Spacing:** Unified 8px grid (`gap-3`, `gap-4`, `gap-6`, `p-5`, `p-6`).

## 6. Motion & Interaction
- **Spring Physics:** `stiffness: 100, damping: 20` or transition `[0.16, 1, 0.3, 1]`.
- **Perpetual Micro-Interactions:** Infinite loop status pulse on live scraper gateway and radar scan indicators.
- **Waterfall Reveals:** Staggered delays on tender search result items (`delay: index * 0.04s`).
- **Hardware Acceleration:** Transforms and opacity animations only (`transform`, `opacity`).

## 7. Anti-Patterns (Banned)
- No emojis anywhere in the UI.
- No em-dashes (`—`) or en-dashes (`–`).
- No generic purple-to-blue AI gradient backgrounds.
- No pure black (`#000000`) backgrounds.
- No 3-column equal card layouts.
- No floating filler text like "Scroll down to explore".
- No broken image links.
