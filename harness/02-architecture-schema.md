# 02. 시스템 아키텍처 및 노션 DB 스키마 명세 (Architecture & Data Contracts)

본 문서는 $0 제로 코스트 인프라 구조, Notion API를 활용한 Headless CMS 아키텍처, 그리고 엄격한 TypeScript 데이터 모델 계약을 정의합니다.

---

## 1. 제로 코스트 ($0) 엣지 아키텍처 다이어그램

```text
+---------------------------------------------------------------------------------------+
|                    GLOBAL EDGE INFRASTRUCTURE (Vercel / Cloudflare Pages)              |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                              Next.js 15 App Router                                    |
|                      (Async Server Component: app/page.tsx)                           |
|                      ISR: export const revalidate = 60;                               |
+---------------------------------------------------------------------------------------+
                                           │
                   ┌───────────────────────┴───────────────────────┐
                   ▼                                               ▼
+------------------------------------+          +------------------------------------+
|  UI / Rendering Layer              |          |  Data Layer (Server-Side Only)     |
|  - Tailwind CSS v4 (@theme tokens) |          |  - lib/notion.ts (@notionhq/client)|
|  - 12-Column @container Bento Grid |          |  - types/notion.ts (Strict Types)  |
|  - Framer Motion (Hardware Accel)  |          |  - Parallel Promise.all Fetching   |
+------------------------------------+          +------------------------------------+
                                                           │
                                                           ▼ (REST API / HTTPS)
                                                +------------------------------------+
                                                |  Notion Official API               |
                                                |  - Team DB (Profile, Role, Skills) |
                                                |  - Products DB (Brands, Rel, Links)|
                                                +------------------------------------+
```

---

## 2. 노션 데이터베이스(DB) 정밀 스키마 규격

### 2.1 Team DB 스키마 (`NOTION_TEAM_DB_ID`)
4인 팀원의 프로필, 직무, 역량 및 협업 가능 상태를 보관합니다.

| 속성명 (Property) | Notion 타입 | 허용 값 / 포맷 | 설명 |
| :--- | :--- | :--- | :--- |
| `Name` | **Title** | Text (예: Alex Kim) | 팀원 고유 성명 |
| `Role` | **Select** | `Product Designer`<br>`Frontend Engineer`<br>`Fullstack Dev`<br>`Growth Marketer` | 팀 내 메인 직무 |
| `Skills` | **Multi-select** | `Next.js`, `TailwindCSS`, `Figma`, `TypeScript`, `Node.js`, `React`, `AI Agent` 등 | 핵심 기술 스택 태그 |
| `Status` | **Status** | `Available` (초록)<br>`In Project` (파랑)<br>`Busy` (주황)<br>`Away` (회색) | 실시간 업무 수임 상태 |
| `PersonalLinks` | **URL** | 유효한 HTTPS URL | 개인 포트폴리오, GitHub, LinkedIn 등 |

### 2.2 Products DB 스키마 (`NOTION_PRODUCTS_DB_ID`)
팀 또는 개인이 운영하는 멀티 브랜드 사이드 프로젝트의 실체적 정보를 관리합니다.

| 속성명 (Property) | Notion 타입 | 허용 값 / 포맷 | 설명 |
| :--- | :--- | :--- | :--- |
| `BrandName` | **Title** | Text (예: ShotShot, DevSync) | 프로젝트/서비스 브랜드 명칭 |
| `Status` | **Select** | `Active`<br>`In Development`<br>`Archived`<br>`Concept` | 프로젝트 개발 및 배포 상태 |
| `OneLiner` | **Rich Text** | Text (권장: 150자 이내) | 서비스의 핵심 한 줄 가치 제안 |
| `Members` | **Relation** | Team DB의 레코드와 연결 | 기여/참여한 팀원 (다대다 연결) |
| `TechStack` | **Multi-select** | `Next.js`, `Framer`, `Tailwind CSS`, `PostgreSQL`, `AI Agent` 등 | 적용 기술 스택 |
| `LiveURL` | **URL** | 유효한 HTTPS URL | 실제 동작 중인 라이브 서비스 링크 |
| `InternalLinks` | **URL** | 유효한 HTTPS URL | 깃허브 리포지토리 또는 내부 문서 |
| `CoverImage` | **Files & media** | 외부 링크 또는 Notion 업로드 파일 | 프로젝트 카드 대표 비주얼 이미지 |

---

## 3. Notion S3 이미지 URL 만료(1시간) 방어 아키텍처

> [!WARNING]
> Notion에 직접 업로드된 파일(`file.url`)의 AWS S3 보안 서명 URL은 발급 후 **1시간(3,600초)**이 경과하면 만료되어 403 Forbidden 에러가 발생합니다.

### 🛡️ 3단계 방어 전략
1. **외부 고정 URL 우선 권장**: 노션 DB 입력 시 Unsplash, Cloudinary, Imgur 등 영구 유지되는 외부 링크(`external.url`)를 사용할 것을 가이드합니다.
2. **Next.js Image 원격 패턴 허용**: `next.config.ts`에 아래 도메인을 필수로 등록합니다:
   ```typescript
   // next.config.ts
   import type { NextConfig } from 'next';

   const nextConfig: NextConfig = {
     images: {
       remotePatterns: [
         { protocol: 'https', hostname: 'www.notion.so' },
         { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
         { protocol: 'https', hostname: 'images.unsplash.com' },
       ],
     },
   };

   export default nextConfig;
   ```
3. **Graceful Fallback UI**: 커버 이미지가 없거나 S3 서명이 만료되어 로드에 실패할 경우, UI가 붕괴되지 않고 고유 브랜드 이니셜과 모노크롬 다크 그래디언트 배경으로 자연스럽게 폴백되도록 컴포넌트를 설계합니다.

---

## 4. 엄격한 TypeScript 타입 계약 (`types/notion.ts`)

에이전트는 `any`를 절대 사용하지 않고 아래 명세를 준수합니다:

```typescript
// types/notion.ts

export type MemberStatus = 'Available' | 'In Project' | 'Busy' | 'Away';
export type ProductStatus = 'Active' | 'In Development' | 'Archived' | 'Concept';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatarUrl?: string;
  status?: MemberStatus;
  personalLink?: string;
  personalLinks?: string[];
}

export interface ProductItem {
  id: string;
  brandName: string;
  status: ProductStatus;
  oneLiner: string;
  memberIds: string[];
  techStack: string[];
  liveUrl?: string;
  internalLink?: string;
  coverImage?: string;
}

export interface StudioHubData {
  members: TeamMember[];
  products: ProductItem[];
}

// UI Component Props
export interface BentoGridLayoutProps {
  members: TeamMember[];
  products: ProductItem[];
}

export interface MemberCardProps {
  member: TeamMember;
}

export interface BrandCardProps {
  product: ProductItem;
  members: TeamMember[];
}

export interface StatusBadgeProps {
  status: MemberStatus | ProductStatus;
}

export interface SkillMatrixProps {
  skills: string[];
}
```

---

## 5. Notion SDK 및 데이터 패칭 계약 (`lib/notion.ts`)

`@notionhq/client`의 공식 `PageObjectResponse` 타입 가드를 적용하여 안전하게 데이터를 추출합니다:

```typescript
// lib/notion.ts
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { TeamMember, ProductItem, MemberStatus, ProductStatus } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const TEAM_DB_ID = process.env.NOTION_TEAM_DB_ID || '';
const PRODUCTS_DB_ID = process.env.NOTION_PRODUCTS_DB_ID || '';

function isFullPage(response: unknown): response is PageObjectResponse {
  return typeof response === 'object' && response !== null && 'properties' in response;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!TEAM_DB_ID || !process.env.NOTION_TOKEN) {
    console.warn('NOTION_TEAM_DB_ID or NOTION_TOKEN is not defined in environment variables.');
    return [];
  }

  try {
    const response = await notion.databases.query({ database_id: TEAM_DB_ID });
    return response.results.filter(isFullPage).map((page) => {
      const props = page.properties;
      const name = props.Name?.type === 'title' ? props.Name.title[0]?.plain_text : undefined;
      const role = props.Role?.type === 'select' ? props.Role.select?.name : undefined;
      const skills = props.Skills?.type === 'multi_select' ? props.Skills.multi_select.map((s) => s.name) : [];
      const status = props.Status?.type === 'status' ? props.Status.status?.name : undefined;
      const url = props.PersonalLinks?.type === 'url' ? props.PersonalLinks.url : undefined;

      return {
        id: page.id,
        name: name || 'Anonymous Member',
        role: role || 'Contributor',
        skills,
        status: (status as MemberStatus) || 'Away',
        personalLink: url || undefined,
      };
    });
  } catch (error) {
    console.error('Failed to query Team DB from Notion:', error);
    return [];
  }
}

export async function getProducts(): Promise<ProductItem[]> {
  if (!PRODUCTS_DB_ID || !process.env.NOTION_TOKEN) {
    console.warn('NOTION_PRODUCTS_DB_ID or NOTION_TOKEN is not defined in environment variables.');
    return [];
  }

  try {
    const response = await notion.databases.query({ database_id: PRODUCTS_DB_ID });
    return response.results.filter(isFullPage).map((page) => {
      const props = page.properties;
      const brandName = props.BrandName?.type === 'title' ? props.BrandName.title[0]?.plain_text : undefined;
      const status = props.Status?.type === 'select' ? props.Status.select?.name : undefined;
      const oneLiner = props.OneLiner?.type === 'rich_text' ? props.OneLiner.rich_text[0]?.plain_text : undefined;
      const memberIds = props.Members?.type === 'relation' ? props.Members.relation.map((r) => r.id) : [];
      const techStack = props.TechStack?.type === 'multi_select' ? props.TechStack.multi_select.map((t) => t.name) : [];
      const liveUrl = props.LiveURL?.type === 'url' ? props.LiveURL.url : undefined;
      const internalLink = props.InternalLinks?.type === 'url' ? props.InternalLinks.url : undefined;

      let coverImage: string | undefined = undefined;
      if (props.CoverImage?.type === 'files' && props.CoverImage.files.length > 0) {
        const fileObj = props.CoverImage.files[0];
        if (fileObj.type === 'external') {
          coverImage = fileObj.external.url;
        } else if (fileObj.type === 'file') {
          coverImage = fileObj.file.url;
        }
      }

      return {
        id: page.id,
        brandName: brandName || 'Untitled Project',
        status: (status as ProductStatus) || 'Concept',
        oneLiner: oneLiner || '',
        memberIds,
        techStack,
        liveUrl: liveUrl || undefined,
        internalLink: internalLink || undefined,
        coverImage,
      };
    });
  } catch (error) {
    console.error('Failed to query Products DB from Notion:', error);
    return [];
  }
}
```

---

## 6. Incremental Static Regeneration (ISR 60s) 파이프라인

`app/page.tsx`는 병렬 패칭(`Promise.all`)과 60초 캐시 재검증 주기를 가집니다:

```typescript
// app/page.tsx
import { getTeamMembers, getProducts } from '@/lib/notion';
import BentoGridLayout from '@/components/BentoGridLayout';

export const revalidate = 60; // 60초마다 백그라운드 재검증

export default async function HomePage() {
  const [members, products] = await Promise.all([
    getTeamMembers(),
    getProducts(),
  ]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 lg:p-16">
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          STUDIO HUB
        </h1>
        <p className="text-neutral-400 text-lg mt-2">
          4-Person Multidisciplinary Creative Team & Project Matrix
        </p>
      </header>

      <section className="max-w-7xl mx-auto">
        {members.length === 0 && products.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            데이터베이스에 등록된 멤버나 프로젝트가 없거나 연결 설정 중입니다.
          </div>
        ) : (
          <BentoGridLayout members={members} products={products} />
        )}
      </section>
    </main>
  );
}
```
