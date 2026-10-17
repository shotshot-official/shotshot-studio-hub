# AGENTS.md — 4인 팀 스튜디오 허브 AI 에이전트 마스터 헌장 (Master Harness)

> **프로젝트**: 4인 멀티디시플리너리 크리에이티브 팀 스튜디오 허브 (Studio Hub)  
> **핵심 가치**: $0 인프라 유지비, 스위스 미학 기반 비대칭 벤토 그리드(Bento Grid), 노션 API 기반 무서버 Headless CMS, Next.js 15 ISR 초고속 렌더링  
> **적용 대상**: Cursor, Windsurf, Antigravity, Claude Code 등 프로젝트에 투입되는 모든 자율 코딩 AI Agent

---

## 1. 에이전트 핵심 행동 헌장 (Core Negative & Positive Constraints)

모든 AI 에이전트는 본 프로젝트의 코드를 작성하거나 수정할 때 다음 제약 사항을 **절대적 원칙**으로 준수해야 합니다.

### ⛔ 금지 사항 (Strict Negative Constraints)
1. **Tailwind CSS v3 레거시 설정 금지**: `tailwind.config.js` 또는 `tailwind.config.ts` 파일을 생성하지 마십시오. Tailwind CSS v4 CSS-First 설정(`@import "tailwindcss";`)만을 사용하며, 커스텀 테마는 `app/globals.css` 내 `@theme` 블록으로 정의합니다. CSS 내 `@apply` 남용을 금지합니다.
2. **`any` 타입 사용 금지**: Notion API 응답 처리 및 컴포넌트 Props를 포함한 모든 TypeScript 코드에서 `any` 타입 선언을 엄격히 금지합니다. `@notionhq/client`의 `PageObjectResponse` 타입 가드(`isFullPage`)를 반드시 거치도록 합니다.
3. **불필요한 `'use client'` 지시어 금지**: `app/page.tsx`는 비동기 리액트 서버 컴포넌트(RSC)여야 합니다. `lib/notion.ts` 역시 서버 환경 전용이어야 합니다. 오직 Framer Motion 인터랙션이나 브라우저 훅이 필요한 최소 단위 클라이언트 컴포넌트에만 `'use client'`를 격리 적용합니다.
4. **유료 인프라 및 복잡한 서브 페이지 구성 금지**: 별도의 유료 RDBMS, 외부 유료 백엔드 서버, 다단계 뎁스의 서브 라우트 생성을 금지합니다. 단일 허브 뷰(Bento Grid) 내에서 모든 정보를 소비하도록 설계합니다.
5. **접근성(Accessibility) 결여 금지**: 인터랙티브 요소(링크, 버튼)에 `focus-visible` 링 스타일을 생략하지 마십시오(WCAG 2.2 SC 2.4.7 준수 필수).

### ✅ 필수 준수 사항 (Mandatory Invariants)
1. **스위스 그래픽 디자인(Swiss Graphic Design) 철학 계층화**: 에밀 루더(Emil Ruder)의 원칙에 따라 장식적 그래픽 요소를 최소화하고, 가변 폰트(Variable Font)의 두께 대비(Weight Contrast)와 정교한 여백(Whitespace)으로 시각적 위계를 구축합니다.
2. **12-컬럼 트랙 비대칭 벤토 그리드 & 컨테이너 쿼리**: 뷰포트 미디어 쿼리가 아닌 `@container` 쿼리를 기반으로 카드가 자체 너비에 따라 반응형으로 재배치되도록 구현합니다.
3. **노션 S3 임시 URL 만료(1시간) 방어 로직**: 커버 이미지 렌더링 시 External URL을 최우선으로 취급하며, Notion S3 만료에 대비한 Fallback 다크 그래디언트 UI 및 에러 핸들링을 필수로 탑재합니다.
4. **ISR (Incremental Static Regeneration) 60초 캐시 주기**: `export const revalidate = 60;`을 설정하여 노션 데이터 수정 사항이 1분 이내에 정적 캐시로 재검증 및 반영되도록 보장합니다.

---

## 2. 기술 스택 및 아키텍처 사양 ($0 Tech Stack)

| 계층 | 채택 기술 | 버전 및 사양 | 비고 |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 15.x (App Router, RSC, ISR) | Serverless / Edge 최적화 |
| **Language** | TypeScript | 5.x (Strict Mode) | No `any`, Strict Null Checks |
| **Styling** | Tailwind CSS | v4.x (CSS-First Syntax) | `@import "tailwindcss";` |
| **Icons** | Lucide React | 최신 LTS (Tree-shaken SVG) | 가벼운 번들 사이즈 유지 |
| **Motion** | Framer Motion | 최신 (Hardware Accelerated) | `prefers-reduced-motion` 준수 |
| **Headless CMS** | Notion API | `@notionhq/client` (공식 SDK) | Team DB, Products DB |
| **Deployment** | Vercel / Cloudflare | Hobby / Free Tier ($0) | Vercel Native ISR / CF Pages Adapter |

---

## 3. 프로젝트 디렉토리 구조 및 파일 소유권 규칙

에이전트는 아래 정의된 표준 아키텍처 구조를 엄격히 따라야 하며 임의의 폴더를 생성하지 않습니다.

```text
shotshot/
├── .cursorrules                   # Cursor IDE 전용 하네스 규칙
├── .windsurfrules                 # Windsurf IDE 전용 하네스 규칙
├── AGENTS.md                      # [본 문서] 마스터 헌장
├── harness/                       # 하네스 엔지니어링 세부 가이드
│   ├── README.md                  # 하네스 시스템 네비게이션
│   ├── 01-agent-personas.md       # 에이전트 역할 분담 및 워크플로우
│   ├── 02-architecture-schema.md  # 노션 스키마, 타입 및 패칭 명세
│   ├── 03-design-swiss-bento.md   # 스위스 디자인 & 벤토 그리드 UI 사양
│   ├── 04-step-prompts.md         # 단계별 환각 방지 실행 프롬프트
│   └── 05-qa-and-dod.md           # 테스트, 검증 및 배포 완료 기준 (DoD)
├── app/
│   ├── favicon.ico
│   ├── globals.css                # Tailwind v4 지시어 및 @theme 설정
│   ├── layout.tsx                 # 루트 레이아웃 (Inter/Geist 가변 폰트)
│   └── page.tsx                   # 비동기 RSC (Promise.all 병렬 패칭, ISR 60s)
├── components/
│   ├── AuthDrawer.tsx             # 로그인 / 회원가입 슬라이드오버 서랍 (클라이언트 컴포넌트)
│   ├── BentoGridLayout.tsx        # 12-컬럼 @container 기반 벤토 그리드 래퍼
│   ├── BrandCard.tsx              # 사이드 프로젝트/브랜드 타일 (이미지 Fallback 방어)
│   ├── HeaderAuthButtons.tsx      # 헤더 프로필 아바타 / 인증 트리거 버튼
│   ├── MemberCard.tsx             # 4인 팀원 프로필 타일 (아바타 + 멀티 소셜 링크)
│   ├── ProfileDrawer.tsx          # 마이페이지 프로필 편집 서랍
│   ├── ProjectDrawer.tsx          # 사이드 프로젝트 / 브랜드 신규 등록 서랍 (Notion Products DB 연동)
│   ├── SkillMatrix.tsx            # 압축형 스킬 칩(Pill) 매트릭스
│   ├── StatusBadge.tsx            # 상태(Status) 인디케이터 (색상 코드화)
│   └── StudioChatWidget.tsx       # 플로팅 실시간 스튜디오 피드/채팅 위젯 (Notion DB 연동)
├── app/actions/
│   ├── auth.ts                    # 경량 Web Crypto 세션 Server Actions
│   ├── chat.ts                    # 실시간 스튜디오 피드 Server Actions
│   └── product.ts                 # 사이드 프로젝트 신규 등록 Server Actions
├── lib/
│   ├── auth.ts                    # Web Crypto HMAC-SHA256 세션 쿠키 엔진
│   ├── mock-data.ts               # 격리된 Mock 데이터 및 인메모리 스토어 (쉽게 삭제/치환 가능)
│   └── notion.ts                  # Notion SDK 클라이언트 & Type-safe fetchers
├── types/
│   └── notion.ts                  # TypeScript 인터페이스 명세서 (Team, Product, Chat)
├── .env.local                     # 환경 변수 (토큰, DB ID)
├── next.config.ts                 # 이미지 도메인 화이트리스트 및 최적화 설정
├── package.json
└── tsconfig.json
```

---

## 4. 노션 DB 스키마 및 매핑 가이드라인

### 4.1 Team DB (`NOTION_TEAM_DB_ID`)
- **Name** (`Title`): 팀원 이름 (Alex Kim, Chloe Lee, David Park, Sara Choi)
- **Role** (`Select`): `Product Designer`, `Frontend Engineer`, `Fullstack Dev`, `Growth Marketer`
- **Avatar** (`Files & media` 또는 `URL`): 프로필 사진 (미입력 시 팀원 이니셜 Fallback)
- **Skills** (`Multi-select`): `Next.js`, `TailwindCSS`, `Figma`, `TypeScript`, `Node.js`, `React` 등
- **PersonalLinks** (`URL` 또는 `Rich Text`): Instagram, 개인 블로그, GitHub, LinkedIn, X 등 다중 링크 (도메인 분석 기반 전용 아이콘 자동 라우팅)
- *(참고: 팀원 카드의 `Status` 표시는 디자인 간결성을 위해 제거됨)*

### 4.2 Products DB (`NOTION_PRODUCTS_DB_ID`)
- **BrandName** (`Title`): 프로젝트/브랜드 명칭
- **Status** (`Select`): `Active`, `In Development`, `Archived`, `Concept`
- **OneLiner** (`Rich Text`): 한 줄 핵심 설명 (최대 150자)
- **Members** (`Relation`): Team DB 페이지 ID 관계형 연결 (다대다 가능)
- **TechStack** (`Multi-select`): 사용 기술 태그 배열
- **LiveURL** (`URL`): 배포된 실서비스 URL
- **InternalLinks** (`URL`): 내부 문서 또는 깃허브 리포지토리 URL
- **CoverImage** (`Files & media`): 대표 이미지 (External URL 권장)

### 4.3 Messages DB (`NOTION_MESSAGES_DB_ID`)
- **Content** (`Title`): 채팅 메시지 본문
- **SenderName** (`Rich Text`): 발신자 이름
- **SenderRole** (`Rich Text` 또는 `Select`): 발신자 직무 / 역할
- **SenderAvatar** (`URL`): 발신자 프로필 이미지 URL
- **SenderEmail** (`Email` 또는 `Rich Text`): 발신자 식별 이메일
- **CreatedAt** (`Date` 또는 `Created time`): 메시지 전송 시각

---

## 5. UI/UX 디자인 시스템 규약 (Swiss Minimalist Bento)

1. **컬러 시스템**:
   - 모노크롬 중심의 절제된 팔레트 (Dark Background: `neutral-950`, Card Surface: `neutral-900/60`, Borders: `neutral-800/80`, Foreground: `neutral-100`, Muted: `neutral-400`).
   - 상태 표시 색상: `Available` (Emerald-500), `In Project` (Sky-500), `Busy` (Amber-500), `Away` (Neutral-500).
2. **12-컬럼 비대칭 비율**:
   - 모바일: `col-span-12` (단일 스택)
   - 태블릿/중간 너비: MemberCard `col-span-6`, BrandCard `col-span-12`
   - 데스크톱/대형 뷰: MemberCard `col-span-3` (4인 한 줄 균등), BrandCard `col-span-6` 또는 비대칭 그리드
3. **인터랙션 및 마이크로 애니메이션**:
   - Framer Motion을 사용하여 카드 진입 시 미세한 Stagger 페이드인 적용.
   - 카드 호버 시 `@property` 기반 회전 보더 하이라이트 또는 부드러운 `y: -2px` 리프트.
   - 반드시 `useReducedMotion()` 훅으로 모션 감소 사용자의 접근성을 보장할 것.

---

## 6. 에이전트 자율 작업 워크플로우

새로운 기능 개발이나 코드 리팩토링 요청 시, 에이전트는 다음 단계를 반드시 순서대로 실행합니다:

1. **컨텍스트 확인**: `harness/` 내의 관련 명세 문서(아키텍처, 디자인 시스템 등)를 먼저 읽고 현재 구현 상태와 비교합니다.
2. **타입 우선 선언**: 데이터 변경이 필요한 경우 `types/notion.ts`의 타입을 먼저 갱신합니다.
3. **무결성 구현**: `lib/notion.ts`와 컴포넌트 코드를 작성할 때 null-safety, 에러 바운더리, 빈 상태(Empty State) 처리를 누락하지 않습니다.
4. **검증 및 빌드**: 작성 후 `npm run build` 및 TypeScript 타입 체크를 수행하여 컴파일 에러가 0건임을 확인합니다.
5. **완료 보고**: 수정한 파일 목록과 검증 결과를 요약하여 보고합니다.
