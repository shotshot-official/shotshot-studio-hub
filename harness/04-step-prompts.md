# 04. 단계별 무환각 AI 에이전트 실행 프롬프트 (Step-by-Step Prompts)

본 문서는 Cursor Composer, Windsurf Cascade, Antigravity, Claude Code 등 자율 코딩 AI 에이전트에게 순차 주입하여 환각 없이 완벽한 소프트웨어를 점진적으로 완성할 수 있는 4단계 정밀 실행 프롬프트 세트입니다.

---

## 🚀 단계 1: 프로젝트 초기화 및 $0 베이스라인 구축

### 🎯 에이전트 주입 프롬프트 1
```text
You are an expert Chief Web Architect. Initialize and configure the base project structure for a Next.js 15 App Router application with zero-cost deployment in mind.

Strict Negative Constraints:
- Do NOT use deprecated Tailwind CSS v3 configuration files (no tailwind.config.js or tailwind.config.ts).
- Use Tailwind CSS v4 native CSS-first configuration syntax in app/globals.css with @import "tailwindcss";.
- Do NOT install unnecessary UI component libraries. Use Lucide React and Framer Motion directly.

Tasks:
1. Initialize a Next.js 15 project with TypeScript, Tailwind CSS v4, App Router, and ESLint.
2. Install dependencies:
   npm install @notionhq/client framer-motion lucide-react clsx tailwind-merge
3. Configure app/globals.css with @import "tailwindcss"; and define custom @theme tokens for dark monochrome Swiss minimalism (--color-canvas, --color-surface, --color-border, --color-status-*).
4. Create .env.local template with:
   NOTION_TOKEN=
   NOTION_TEAM_DB_ID=
   NOTION_PRODUCTS_DB_ID=
5. Update next.config.ts to whitelist image domains (www.notion.so, s3.us-west-2.amazonaws.com, images.unsplash.com).

Verification Assertion:
- Check that `npm run build` initializes without Tailwind v3 configuration warnings.
- Confirm next.config.ts has remotePatterns properly configured.
```

---

## 🗄️ 단계 2: 노션 데이터 매핑 및 타입 세이프티 확보

### 🎯 에이전트 주입 프롬프트 2
```text
You are a Senior Backend & Data Systems Engineer. Implement the data fetching layer for Team DB and Products DB from Notion Official API using @notionhq/client.

Strict Negative Constraints:
- Do NOT use the `any` type for Notion API responses, parameters, or helper functions.
- Do NOT add 'use client' directive to lib/notion.ts or types/notion.ts (Server-side execution only).
- Do NOT allow unhandled Promise rejections. Every fetcher must return an empty array on catch.

Tasks:
1. Create types/notion.ts with explicit interfaces:
   - MemberStatus ('Available' | 'In Project' | 'Busy' | 'Away')
   - ProductStatus ('Active' | 'In Development' | 'Archived' | 'Concept')
   - TeamMember, ProductItem, StudioHubData, and Component Props interfaces.
2. Create lib/notion.ts using @notionhq/client:
   - Import PageObjectResponse from @notionhq/client/build/src/api-endpoints.
   - Implement `isFullPage` user-defined type guard:
     function isFullPage(response: unknown): response is PageObjectResponse
   - Implement getTeamMembers() with strict property extractions for Name, Role, Skills, Status, and PersonalLinks.
   - Implement getProducts() with strict property extractions for BrandName, Status, OneLiner, Members relation, TechStack, LiveURL, InternalLinks, and CoverImage (handling external.url vs file.url).
3. Ensure missing environment variables trigger console.warn and return [] gracefully without throwing.

Verification Assertion:
- Run `npx tsc --noEmit` and ensure 0 type errors exist.
```

---

## 🎨 단계 3: Tailwind v4 기반 12-컬럼 벤토 그리드 UI 구축

### 🎯 에이전트 주입 프롬프트 3
```text
You are a Lead Swiss Minimalist UI/UX Engineer. Build a responsive 12-column Bento Grid UI layout based on Emil Ruder's graphic design principles.

Strict Negative Constraints:
- Do NOT add 'use client' directive to components unless interactive state or client hooks (like useReducedMotion) require it.
- Do NOT use deprecated Tailwind v3 utilities like @apply in custom CSS classes.
- Ensure all interactive links and buttons implement visible focus rings (`focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`) to satisfy WCAG 2.2 SC 2.4.7 accessibility.
- Prevent layout breaking when CoverImage fails or S3 temporary URL expires; implement dark gradient fallback UI.

Tasks:
1. Create components/StatusBadge.tsx with color-coded dot & pill indicator (Available: Emerald, In Project: Sky, Busy: Amber, Away: Neutral).
2. Create components/SkillMatrix.tsx rendering skill tags as neutral compact mono pills.
3. Create components/MemberCard.tsx (col-span-12 @[640px]:col-span-6 @[1024px]:col-span-3) displaying member name, role, status badge, skills, and personal link.
4. Create components/BrandCard.tsx (col-span-12 @[1024px]:col-span-6 or 8) displaying cover image (with fallback), status badge, title, one-liner, tech stack, contributor avatars, and live/github links.
5. Create components/BentoGridLayout.tsx using `@container` query wrapper to arrange 4 team members and asymmetric project cards.

Verification Assertion:
- Check that all components compile under TypeScript strict mode.
- Verify that keyboard navigation displays visible focus indicators.
```

---

## ⚡ 단계 4: 비동기 RSC 라우트 통합 및 60초 ISR 검증

### 🎯 에이전트 주입 프롬프트 4
```text
You are a Principal Edge & Performance Engineer. Integrate the Notion data layer into the main page route and configure 60-second Incremental Static Regeneration (ISR).

Strict Negative Constraints:
- Do NOT add 'use client' to app/page.tsx. Keep it an Async React Server Component.
- Do NOT execute sequential awaits for getTeamMembers() and getProducts(). Use Promise.all for parallel fetching.

Tasks:
1. Update app/page.tsx:
   - Export `revalidate = 60` to enable Next.js ISR cache invalidation every 60 seconds.
   - Fetch getTeamMembers() and getProducts() in parallel via Promise.all.
   - Render minimalist Swiss header ("STUDIO HUB - 4-Person Multidisciplinary Creative Team & Project Matrix").
   - Render Empty State UI if both members and products are empty arrays.
   - Render BentoGridLayout with fetched data.
2. Verify production build:
   - Execute `npm run build`.
   - Confirm route `/` is marked with `(ISR: 60s)` or static generation with revalidation.
3. Provide deployment configuration:
   - Vercel: Automatic deployment on push to main branch with environment variables registered.
   - Cloudflare Pages: Note on @cloudflare/next-on-pages or OpenNext adapter for edge runtime caching.

Verification Assertion:
- `npm run build` succeeds with zero errors.
- HTML preview renders properly even when .env.local is empty (graceful empty state).
```
