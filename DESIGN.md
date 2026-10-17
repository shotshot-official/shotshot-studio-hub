---
name: SHOTSHOT Studio Hub
description: Swiss International Typographic dossier and asymmetric 12-column bento grid for a 4-principal creative collective.
colors:
  stark-chalk: "#ffffff"
  architectural-obsidian: "#08080a"
  slate-subsurface: "#101013"
  graphite-plate: "#141418"
  graphite-hover: "#1b1b21"
  chalk-secondary: "#d4d4d8"
  ash-muted: "#a3a3a3"
  hairline-border: "rgba(255, 255, 255, 0.11)"
  hairline-strong: "rgba(255, 255, 255, 0.22)"
  hairline-active: "rgba(255, 255, 255, 0.45)"
  signal-emerald: "#10b981"
  telemetry-sky: "#38bdf8"
  commission-amber: "#f59e0b"
typography:
  display:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.stark-chalk}"
    textColor: "{colors.architectural-obsidian}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.chalk-secondary}"
    textColor: "{colors.architectural-obsidian}"
  button-secondary:
    backgroundColor: "{colors.architectural-obsidian}"
    textColor: "{colors.chalk-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.slate-subsurface}"
    textColor: "{colors.stark-chalk}"
  card-dossier:
    backgroundColor: "{colors.graphite-plate}"
    textColor: "{colors.stark-chalk}"
    rounded: "{rounded.none}"
    padding: "24px"
  card-dossier-hover:
    backgroundColor: "{colors.graphite-hover}"
  chip-spec:
    backgroundColor: "{colors.architectural-obsidian}"
    textColor: "{colors.chalk-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  input-field:
    backgroundColor: "{colors.architectural-obsidian}"
    textColor: "{colors.stark-chalk}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
---

# Design System: SHOTSHOT Studio Hub

## Overview

**Creative North Star: "The Swiss Architectural Dossier"**

SHOTSHOT Studio Hub embodies Emil Ruder's Swiss International Typographic philosophy translated into a dark, architectural digital index. Rather than relying on decorative gradients, soft pill geometry, or ornamental drop shadows, visual hierarchy is engineered entirely through extreme font-weight contrast, disciplined negative space, tabular monospace specifications, and exposed 1px planar grid hairlines.

Every surface functions simultaneously as an operational daily dossier for the four studio principals and an authoritative commission showcase for visiting clients and partners. Information is organized into a responsive 12-column `@container`-query bento grid where principal profiles, product ventures, and live studio dispatches lock together with rectilinear precision.

 We explicitly reject rounded consumer SaaS tropes—no pill buttons, no circular avatar masks, no blurred glassmorphic halos, and no decorative color washes.

**Key Characteristics:**
- Rectilinear 0px corner geometry across every card, avatar frame, badge, input, and drawer
- Planar 1px hairline borders that brighten on interaction to articulate structural boundaries
- Extreme variable-font weight contrast pairing 900 Black display headlines with 200 Extralight counter-phrases
- Tabular monospace specification headers (`01`, `02`, `03`) and telemetry status codes (`ACTIVE`, `IN DEV`, `SYNC`)
- High-contrast 2px solid chalk focus rings (`outline-offset: 2px`) on every interactive element

## Colors

The palette is a disciplined dark monochrome architectural system punctuated only by high-contrast Stark Chalk actions and three semantic telemetry signal hues.

### Primary
- **Stark Chalk** (`{colors.stark-chalk}`): Reserved for primary display typography, primary call-to-action fills (`Inquire`, `Start a Project`, `VISIT`), active border highlights, and 2px keyboard focus rings.

### Secondary
- **Signal Emerald** (`{colors.signal-emerald}`): Indicates live commission availability in the masthead, active venture status badges (`ACTIVE`), and live synchronization indicators in the Studio Dispatch bar.

### Tertiary
- **Telemetry Sky** (`{colors.telemetry-sky}`): Marks ventures currently in active engineering (`IN DEV` / `IN PROJECT`).
- **Commission Amber** (`{colors.commission-amber}`): Highlights archive preview notices (`ARCHIVE PREVIEW`), busy states, and quick demo portal presets.

### Neutral
- **Architectural Obsidian** (`{colors.architectural-obsidian}`): The root page canvas, recessed input wells, avatar frames, and specification chip backgrounds.
- **Slate Subsurface** (`{colors.slate-subsurface}`): Slide-over drawer panels (`AuthDrawer`, `ProfileDrawer`, `ProjectDrawer`) and the expanded Studio Dispatch console.
- **Graphite Plate** (`{colors.graphite-plate}`): Default resting surface for `MemberCard` and `BrandCard` bento tiles.
- **Graphite Hover** (`{colors.graphite-hover}`): Elevated surface state when a `.swiss-border` bento tile is hovered.
- **Chalk Secondary** (`{colors.chalk-secondary}`): Primary body copy, manifesto paragraphs, and specification pill text.
- **Ash Muted** (`{colors.ash-muted}`): Secondary metadata, discipline labels, timestamps, and form placeholders (maintained at ≥4.5:1 contrast against dark surfaces).
- **Hairline Border / Strong / Active** (`{colors.hairline-border}`, `{colors.hairline-strong}`, `{colors.hairline-active}`): 1px structural dividers that step up in luminance on hover and active selection.

### Named Rules
**The Monochrome Authority Rule.** Over 95% of any viewport must remain pure monochrome (`Architectural Obsidian`, `Graphite Plate`, and `Stark Chalk`). Semantic hues (`Signal Emerald`, `Telemetry Sky`, `Commission Amber`) appear strictly as 6px square status indicators or 1px bordered telemetry badges—never as large surface fills.

**The Contrast Floor Rule.** Secondary labels, timestamps, and input placeholders must never drop below `Ash Muted` (`#a3a3a3`), guaranteeing a minimum 4.5:1 WCAG AA contrast ratio against all dark obsidian and graphite surfaces.

## Typography

**Display Font:** Geist Sans (with `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` fallback)
**Body Font:** Geist Sans
**Label/Mono Font:** Geist Mono (`font-variant-numeric: tabular-nums`)

**Character:** An uncompromising Swiss neo-grotesque pairing where heavy geometric sans-serif headlines anchor the grid while tabular monospace labels read like architectural blueprint annotations.

### Hierarchy
- **Display** (`900 Black` paired with `200 Extralight`, `clamp(3rem, 6vw, 5.25rem)`, `line-height: 0.95`, `letter-spacing: -0.04em`, uppercase): Used exclusively for the `SHOTSHOT STUDIO` masthead title.
- **Headline** (`700 Bold`, `1.875rem–2.25rem`, `line-height: 1.15`, `letter-spacing: -0.025em`): Used for the commercial commission pitch and slide-over drawer titles.
- **Title** (`700 Bold`, `1.5rem`, `line-height: 1.25`, `letter-spacing: -0.02em`): Used for principal names on `MemberCard` and venture titles on `BrandCard`.
- **Body** (`400 Regular`, `0.875rem–1rem`, `line-height: 1.625`, max measure `62ch–65ch`): Used for the studio manifesto, venture descriptions, and dispatch messages.
- **Label** (`500–700 Medium/Bold`, `0.6875rem–0.75rem`, `letter-spacing: 0.1em–0.2em`, uppercase Geist Mono): Used for section indices (`01`, `02`, `03`), discipline tags, skill chips, status badges, and button labels.

### Named Rules
**The Weight Polarity Rule.** Display hierarchy relies on extreme weight contrast (`900 Black` juxtaposed directly with `200 Extralight`) rather than decorative color gradients or italics.

**The Tabular Index Rule.** Every numeric counter (`04 PRINCIPALS`, `03 ARCHIVED / LIVE`, `DISCIPLINE 01`) must use `Geist Mono` with `font-variant-numeric: tabular-nums` and two-digit zero padding so columns align with mechanical precision.

## Layout

The interface is a single-route hub (`max-width: 80rem` / `1280px` centered container with `24px` mobile, `48px` tablet, and `64px` desktop outer padding) governed by a 12-column asymmetric bento grid using CSS `@container` queries (`@container` wrapper on `BentoGridLayout`):

- **Masthead Grid:** 12-column split at desktop (`lg:grid-cols-12`) with 8 columns dedicated to the display title and manifesto (`max-w-[62ch]`) and 4 columns housing the left-bordered tabular Discipline Index.
- **Section 01 — Core Collective (`MemberCard`):**
  - `< 640px`: 1-column vertical stack
  - `640px – 1023px` (`@[640px]:grid-cols-2`): 2x2 balanced grid
  - `≥ 1024px` (`@[1024px]:grid-cols-12`): 4 principals in a single row (`@[1024px]:col-span-3` each) with `16px` (`gap-4`) gutters.
- **Section 02 — Ventures & Selected Works (`BrandCard`):**
  - `< 768px`: 1-column stack
  - `768px – 1023px` (`@[768px]:grid-cols-2`): Hero venture spans 2 columns; subsequent ventures span 1 column
  - `≥ 1024px` (`@[1024px]:grid-cols-12`): Asymmetric 12-column matrix where the 1st venture spans 8 columns (`Hero Flagship`), the 2nd spans 4 columns (`Counterweight`), paired subsequent ventures span 6 columns each (`Balanced Diptych`), and any trailing odd venture spans all 12 columns so the grid always forms a closed rectangle.
- **Section Rhythm:** Major sections are separated by `64px–80px` (`mb-16` / `mt-20`) and introduced by a bottom-bordered (`1px solid #262626`) specification header pairing a bold two-digit index (`01`, `02`, `03`) with a wide-tracked uppercase title (`tracking-[0.2em]`).

## Elevation & Depth

SHOTSHOT Studio Hub is a **planar architectural system**. At rest and on hover, bento cards and inline controls use zero drop shadows, expressing hierarchy through tonal surface steps (`#08080a` canvas → `#141418` card plate → `#1b1b21` hover plate) and crisp 1px borders (`rgba(255, 255, 255, 0.11)` resting → `rgba(255, 255, 255, 0.45)` active hover). Ambient shadows are reserved exclusively for floating modal overlays (slide-over drawers) to separate them from the underlying document plane.

### Shadow Vocabulary
- **Overlay Elevation** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75)`): Applied only to fixed slide-over drawers (`AuthDrawer`, `ProfileDrawer`, `ProjectDrawer`).

### Named Rules
**The Planar Hairline Rule.** Cards and inline controls are flat planes bounded by 1px solid borders (`.swiss-border`). Never apply drop shadows or glowing halos to grid tiles; hover state is communicated by stepping the border luminance from `11%` to `45%` white and shifting the surface from `Graphite Plate` (`#141418`) to `Graphite Hover` (`#1b1b21`).

## Shapes

Every component in the system obeys a strict **0px rectilinear geometry (`border-radius: 0px`)**. Cards, square principal avatars (`56px × 56px`), venture cover frames (`height: 208px`), skill chips, status badges, buttons, and form inputs all terminate in sharp 90-degree corners. Dividers are exposed 1px horizontal and vertical hairlines (`border-neutral-800`) that segment internal card regions (header, body, specification footer).

## Components

### Buttons
Rectilinear, high-contrast typographic triggers set in uppercase `Geist Mono` (`12px`, `letter-spacing: 0.08em`).
- **Shape:** Sharp 90-degree corners (`0px` radius).
- **Primary (`Inquire`, `Start a Project`, `VISIT`, Drawer Submit):** Solid `Stark Chalk` (`#ffffff`) background with `Architectural Obsidian` (`#08080a`) text and `10px 16px` (or `14px 24px` hero) padding.
- **Hover / Focus:** Primary buttons shift to `#e5e5e5` on hover; secondary buttons (`Portal`, `Register Venture`, `SOURCE`) use `#08080a` fill with `1px solid #404040` border that brightens to `1px solid #ffffff` on hover. All buttons carry `.swiss-focus` (`2px solid #ffffff` outline with `2px` offset on `:focus-visible`).

### Chips (`SkillMatrix` & `StatusBadge`)
Compact specification tags that read like blueprint metadata labels.
- **Style:** `0px` radius, `2px 8px` padding, `11px` uppercase `Geist Mono`, `Architectural Obsidian` (`#08080a`) background with `1px solid #262626` border and `Chalk Secondary` (`#d4d4d8`) text.
- **State:** `SkillMatrix` chips brighten their border to `#525252` and text to `#ffffff` on hover. `StatusBadge` prepends a `6px × 6px` square color indicator (`#10b981`, `#38bdf8`, `#f59e0b`, or `#a3a3a3`) and tints its 1px border to match the semantic status.

### Cards / Containers (`MemberCard` & `BrandCard`)
Modular planar bento tiles governed by `.swiss-border`.
- **Corner Style:** `0px` rectilinear corners.
- **Background:** `Graphite Plate` (`#141418`) at rest, transitioning to `Graphite Hover` (`#1b1b21`) over `200ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Shadow Strategy:** None (planar elevation only).
- **Border:** `1px solid rgba(255, 255, 255, 0.11)` at rest; `1px solid rgba(255, 255, 255, 0.45)` on hover.
- **Internal Padding:** `24px` (`p-6`), with internal sections separated by `1px solid rgba(255, 255, 255, 0.11)` horizontal dividers.

### Inputs / Fields
Recessed rectilinear data-entry fields inside slide-over drawers.
- **Style:** `1px solid #262626` border on `Architectural Obsidian` (`#08080a`) background, `0px` radius, `8px 12px` padding, `14px` (`text-sm`) or `12px` (`text-xs font-mono`) `#ffffff` text with `Ash Muted` (`#a3a3a3`) placeholders.
- **Focus:** `.swiss-focus` (`2px solid #ffffff` outline, `2px` offset).
- **Error / Disabled:** Validation errors render in a `1px solid rgba(153, 27, 27, 0.6)` banner with `#fca5a5` monospace copy; disabled controls drop to `opacity: 0.4–0.5`.

### Navigation
Single-screen masthead specification bar (`app/page.tsx` + `HeaderAuthButtons.tsx`).
- **Style:** Top horizontal bar with `1px solid #262626` bottom border. Left side displays studio identity, location (`SEOUL & GLOBAL`), and live commission status in `12px` uppercase `Geist Mono`. Right side pairs the primary `Inquire` anchor button with the `Portal` drawer trigger (or active member badge + `Profile` / `Sign Out` controls).

## Do's and Don'ts

### Do:
- **Do** enforce `0px` corners across all cards, avatars, buttons, inputs, badges, and drawers to preserve the rectilinear Swiss architectural grid.
- **Do** apply `.swiss-focus` (`2px solid #ffffff` outline with `2px` offset) to every interactive link, button, input, and toggle (`WCAG 2.2 SC 2.4.7`).
- **Do** ensure asymmetric bento rows in `BentoGridLayout` always sum to 12 columns on desktop (`8+4`, `6+6`, or `12` for a single/trailing odd venture).
- **Do** pair every image container with a deterministic typographic fallback (2-letter uppercase monogram for principals, 3-letter `VENTURE // ARCHIVE` poster block for products) to guard against Notion S3 URL expiry.
- **Do** respect `prefers-reduced-motion` via both `useReducedMotion()` in Framer Motion and the global `@media (prefers-reduced-motion: reduce)` rule in `app/globals.css`.

### Don't:
- **Don't** introduce `rounded-lg`, `rounded-xl`, or `rounded-full` pills or circular avatars anywhere in the interface.
- **Don't** use `placeholder-neutral-600` or `text-neutral-500` for readable copy or placeholders; maintain at least `Ash Muted` (`#a3a3a3`) for ≥4.5:1 contrast.
- **Don't** create `tailwind.config.js` or `tailwind.config.ts`; all design tokens belong in the `@theme` block of `app/globals.css` (Tailwind CSS v4 CSS-first).
- **Don't** add decorative drop shadows, colored border-left accents, or glassmorphic background blurs to bento grid cards.
