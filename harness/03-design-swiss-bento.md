# 03. 스위스 미학 및 비대칭 벤토 그리드 디자인 시스템 (Design System & Bento UI)

본 문서는 스위스 그래픽 디자인(Swiss Graphic Design)의 거장 에밀 루더(Emil Ruder)의 조형 철학과 모던 웹 벤토 그리드(Bento Grid) 레이아웃을 결합한 UI/UX 구현 명세서입니다.

---

## 1. 스위스 미학 (Emil Ruder Minimalism) 3대 구현 원칙

```text
+---------------------------------------------------------------------------------+
|                       SWISS GRAPHIC DESIGN THREE PILLARS                        |
+------------------------------------+--------------------------------------------+
| 1. 타이포그래피 건축화              | 가변 폰트의 Weight 대비(Bold vs Light)와   |
|    (Typography as Structure)       | 엄격한 트래킹(Tracking)만으로 위계 확립    |
+------------------------------------+--------------------------------------------+
| 2. 구조적 여백                     | 빈 공간이 아닌 정보 그룹을 분리하는        |
|    (Active Functional Whitespace)  | 적극적인 조형 요소로 취급                  |
+------------------------------------+--------------------------------------------+
| 3. 비대칭 12-컬럼 벤토 그리드       | 12-Column 모듈을 1, 2, 3, 4, 6 분할하여    |
|    (Asymmetric Bento Modular Grid) | 모듈화된 정보 블록을 입체적으로 배치       |
+------------------------------------+--------------------------------------------+
```

---

## 2. Tailwind CSS v4 CSS-First 설정 (`app/globals.css`)

Tailwind v4의 네이티브 CSS-First 지시어와 `@theme` 블록을 활용하여 테마 토큰을 구성합니다. **(레거시 `tailwind.config.js` 생성 금지)**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-canvas: #09090b;          /* neutral-950 */
  --color-surface: #141416;         /* neutral-900 */
  --color-surface-hover: #1c1c1f;   /* neutral-850 */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-active: rgba(255, 255, 255, 0.2);

  --color-status-available: #10b981; /* Emerald-500 */
  --color-status-inproject: #0ea5e9; /* Sky-500 */
  --color-status-busy: #f59e0b;      /* Amber-500 */
  --color-status-away: #737373;      /* Neutral-500 */

  --font-sans: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}

:root {
  color-scheme: dark;
}

body {
  background-color: var(--color-canvas);
  color: #ededed;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* 1px 정밀 테두리 마스크 하이라이트 */
.swiss-border {
  border: 1px solid var(--color-border);
  transition: border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.swiss-border:hover {
  border-color: var(--color-border-active);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
}

/* WCAG 2.2 SC 2.4.7 포커스 링 표준화 */
.swiss-focus {
  outline: none;
}
.swiss-focus:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
```

---

## 3. 12-컬럼 트랙 비대칭 벤토 그리드 스펙

### 3.1 컨테이너 쿼리(`@container`) 기준 반응형 분할 규칙
뷰포트 크기가 아닌 벤토 그리드 래퍼 자체의 너비를 기준으로 타일의 배치를 재구성합니다.

- **컨테이너 기준 너비**:
  - `container-type: inline-size` 설정
  - 모바일 (< 640px): 전 타일 `col-span-12` (단일 세로 스택)
  - 태블릿 (640px ~ 1023px):
    - `MemberCard`: `col-span-6` (2열 배치)
    - `BrandCard`: `col-span-12`
  - 데스크톱 (≥ 1024px):
    - `MemberCard`: `col-span-3` (4명의 팀원이 한 행에 정교하게 4분할)
    - `BrandCard (Hero)`: `col-span-8`
    - `BrandCard (Secondary)`: `col-span-4` 또는 `col-span-6`

### 3.2 벤토 레이아웃 래퍼 (`components/BentoGridLayout.tsx`)

```tsx
// components/BentoGridLayout.tsx
'use client';

import React from 'react';
import { BentoGridLayoutProps } from '@/types/notion';
import MemberCard from './MemberCard';
import BrandCard from './BrandCard';

export default function BentoGridLayout({ members, products }: BentoGridLayoutProps) {
  return (
    <div className="@container w-full">
      {/* 1. 팀 프로필 섹션 (12-Column: 4명 4등분) */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-neutral-400 mb-4 font-mono">
          01 // Creative Team Members
        </div>
        <div className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-12 gap-4">
          {members.map((member) => (
            <div key={member.id} className="@[1024px]:col-span-3">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>

      {/* 2. 사이드 프로젝트 & 멀티 브랜드 섹션 (12-Column 비대칭) */}
      <div>
        <div className="text-xs uppercase tracking-widest text-neutral-400 mb-4 font-mono">
          02 // Multi-Brand Portfolio Matrix
        </div>
        <div className="grid grid-cols-1 @[640px]:grid-cols-1 @[1024px]:grid-cols-12 gap-4">
          {products.map((product, idx) => {
            // 첫 번째 프로젝트는 Hero (col-span-8 or col-span-6)
            const colSpan = idx === 0 ? '@[1024px]:col-span-8' : '@[1024px]:col-span-4';
            return (
              <div key={product.id} className={`col-span-1 ${colSpan}`}>
                <BrandCard product={product} members={members} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## 4. UI 컴포넌트 세부 디자인 사양

### 4.1 상태 뱃지 (`components/StatusBadge.tsx`)
상태에 따라 직관적인 시각 인디케이터를 제공합니다.

| 상태 | 인디케이터 색상 | 한국어 라벨 |
| :--- | :--- | :--- |
| `Available` | `bg-emerald-500` (초록) + 펄스 애니메이션 | 협업 가능 |
| `In Project` | `bg-sky-500` (하늘색) | 프로젝트 진행 중 |
| `Busy` | `bg-amber-500` (주황색) | 집중 작업 중 |
| `Away` | `bg-neutral-500` (회색) | 부재 중 |

```tsx
// components/StatusBadge.tsx
import React from 'react';
import { StatusBadgeProps } from '@/types/notion';

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Available':
      case 'Active':
        return { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/40 border-emerald-800/40' };
      case 'In Project':
      case 'In Development':
        return { dot: 'bg-sky-400', text: 'text-sky-300', bg: 'bg-sky-950/40 border-sky-800/40' };
      case 'Busy':
        return { dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/40 border-amber-800/40' };
      default:
        return { dot: 'bg-neutral-400', text: 'text-neutral-400', bg: 'bg-neutral-900 border-neutral-800' };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
```

### 4.2 스킬 매트릭스 (`components/SkillMatrix.tsx`)
미니멀하고 압축된 가로 알약형 태그입니다.

```tsx
// components/SkillMatrix.tsx
import React from 'react';
import { SkillMatrixProps } from '@/types/notion';

export default function SkillMatrix({ skills }: SkillMatrixProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {skills.map((skill) => (
        <span
          key={skill}
          className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800/60 text-neutral-300 border border-neutral-700/40"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
```

### 4.3 팀원 프로필 카드 (`components/MemberCard.tsx`)
스위스 타이포그래피 계층과 상태 뱃지, 스킬셋, 외부 링크를 담습니다.

```tsx
// components/MemberCard.tsx
import React from 'react';
import { MemberCardProps } from '@/types/notion';
import StatusBadge from './StatusBadge';
import SkillMatrix from './SkillMatrix';
import { ArrowUpRight } from 'lucide-react';

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="swiss-border bg-neutral-900/60 rounded-xl p-5 flex flex-col justify-between h-full backdrop-blur-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={member.status} />
          {member.personalLink && (
            <a
              href={member.personalLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} personal link`}
              className="swiss-focus text-neutral-400 hover:text-white p-1 rounded transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
        <p className="text-sm text-neutral-400 mt-0.5 font-medium">{member.role}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/60">
        <SkillMatrix skills={member.skills} />
      </div>
    </div>
  );
}
```

### 4.4 브랜드 카드 (`components/BrandCard.tsx`)
대표 커버 이미지 로드 실패 대비 다크 그래디언트 폴백과 관계형 멤버 아바타 연결을 지원합니다.

```tsx
// components/BrandCard.tsx
import React from 'react';
import Image from 'next/image';
import { BrandCardProps } from '@/types/notion';
import StatusBadge from './StatusBadge';
import SkillMatrix from './SkillMatrix';
import { ExternalLink, Github } from 'lucide-react';

export default function BrandCard({ product, members }: BrandCardProps) {
  const relatedMembers = members.filter((m) => product.memberIds.includes(m.id));

  return (
    <div className="swiss-border bg-neutral-900/60 rounded-xl overflow-hidden flex flex-col justify-between h-full">
      {/* 커버 이미지 영역 (S3 만료 및 부재 시 다크 그래디언트 폴백) */}
      <div className="relative w-full h-44 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex items-center justify-center border-b border-neutral-800/60">
        {product.coverImage ? (
          <Image
            src={product.coverImage}
            alt={product.brandName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="text-2xl font-black tracking-widest text-neutral-700 uppercase font-mono select-none">
            {product.brandName.slice(0, 3)}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* 컨텐츠 본문 */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">{product.brandName}</h3>
          <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
            {product.oneLiner}
          </p>

          <SkillMatrix skills={product.techStack} />
        </div>

        {/* 하단 푸터: 참여 멤버 및 액션 링크 */}
        <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between">
          <div className="flex -space-x-1.5 overflow-hidden">
            {relatedMembers.map((m) => (
              <span
                key={m.id}
                title={`${m.name} (${m.role})`}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 text-[10px] font-mono text-neutral-200 border border-neutral-700"
              >
                {m.name.slice(0, 1)}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {product.internalLink && (
              <a
                href={product.internalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Repository or Internal docs"
                className="swiss-focus text-neutral-400 hover:text-white p-1.5 rounded transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {product.liveUrl && (
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live Demo Link"
                className="swiss-focus text-neutral-400 hover:text-white p-1.5 rounded transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. 접근성(WCAG 2.2 SC 2.4.7) 및 모션 감소 가이드라인

1. **Focus Rings**: 마우스 클릭 시에는 보이지 않으나 키보드 Tab 키 탐색 시 선명한 2px 화이트 링(`focus-visible:ring-2 focus-visible:ring-white`)이 표시되어야 합니다.
2. **Reduced Motion**: 사용자가 OS 레벨에서 '애니메이션 효과 줄이기'를 활성화한 경우 Framer Motion 또는 CSS Transition이 즉시 비활성화되도록 `@media (prefers-reduced-motion: reduce)` 및 `useReducedMotion()`을 연동합니다.
