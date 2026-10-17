# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary (Internal Team):** The four multidisciplinary members of SHOTSHOT Studio (Product Designer, Frontend Engineer, Fullstack Developer, Growth Marketer) who use the hub as a daily internal workspace to check team status, update their skill/social profiles, and register new projects.
- **Secondary (External Visitors):** Prospective clients, collaborators, and partners visiting the hub to understand the studio's core capabilities, individual member profiles, and active product portfolio at a glance.

## Product Purpose

SHOTSHOT Studio Hub unifies a four-person creative studio's member directory and multi-brand product portfolio into a single-screen hub. Success means both internal teammates and external visitors can immediately see who is on the team, what products the studio is building or running, and jump directly to live services, repositories, or member channels without navigating multi-level menus.

## Positioning

A zero-cost ($0) headless studio hub that turns Notion databases (`Team DB`, `Products DB`) into a fast, type-safe Next.js 15 web application with 60-second Incremental Static Regeneration (ISR) and bidirectional slide-over drawers—requiring no separate backend server or paid database infrastructure.

## Operating Context

- Team members manage detailed records in Notion or submit quick updates (profile edits, new project entries) directly from the hub's slide-over drawers (`ProfileDrawer`, `ProjectDrawer`, `AuthDrawer`).
- External visitors browse the main hub in read mode, inspecting member skills, social/portfolio links, project status badges, and live product links.
- When Notion environment variables are absent in local or preview environments, the hub falls back gracefully to an isolated demo dataset (`lib/mock-data.ts`).

## Capabilities and Constraints

- **Single-Hub Architecture:** All primary information lives on a single main route (`app/page.tsx`); deep sub-routes and complex page trees are intentionally excluded.
- **Zero-Cost ($0) Stack:** Next.js 15 App Router (Server Components + Server Actions + 60s ISR), TypeScript strict mode (no `any`), Tailwind CSS v4 CSS-first configuration, Framer Motion, and `@notionhq/client`.
- **Stateless Team Auth:** Lightweight Web Crypto HMAC-SHA256 signed session cookies (`lib/auth.ts`) with instant 1-click demo presets for testing.
- **Media Expiry Resilience:** External image URLs are prioritized, with automatic dark fallback states to guard against Notion S3 signed URL expiration (1-hour TTL).
- **UI Language & Terminology:** English UI copy throughout. Consistent terms: `Projects` (for studio products/brands), `Sign In` / `Join Team` (for member authentication), `Skills` (for member capabilities), and `Tech Stack` (for project technologies).

## Brand Commitments

- **Name:** SHOTSHOT (`SHOTSHOT Studio Hub`).
- **Voice:** Clear, concise, action-oriented English free of internal infrastructure jargon or exaggerated marketing claims.
- **Committed Aesthetic Constraints:** Swiss graphic design hierarchy (weight contrast, disciplined whitespace) paired with an asymmetric 12-column `@container`-query bento grid on a dark monochrome surface (`AGENTS.md`).

## Evidence on Hand

- Live Notion schema mappings (`types/notion.ts`, `lib/notion.ts`) for Team and Products databases.
- Verified four-person team roster and studio product structure (`lib/mock-data.ts`).
- **Absences:** No external client testimonials, revenue figures, user-count metrics, or press logos are on hand; future work must not fabricate them.

## Product Principles

1. **Dual-purpose legibility:** Every surface must serve the 4 internal members as a practical daily hub while reading cleanly as a credible studio showcase for external visitors.
2. **Notion as the single source of truth:** Content stays editable in Notion and syncs automatically within 60 seconds without manual redeploys.
3. **Zero-cost operational simplicity:** Preserve the $0 serverless/edge footprint—never introduce paid databases, heavy backend services, or unnecessary route sprawl.
4. **Actionable, jargon-free copy:** Keep interface labels, empty states, and errors direct and human-readable rather than exposing framework or database internals.

## Accessibility & Inclusion

- WCAG 2.2 SC 2.4.7 compliant `focus-visible` ring styles (`.swiss-focus`) required on every interactive link, button, and form control.
- Hardware-accelerated motion must respect `prefers-reduced-motion` via `useReducedMotion()`.
