# 4인 팀 스튜디오 허브 — 하네스 엔지니어링 문서 체계 (Harness Suite)

본 디렉토리는 AI 에이전트(Cursor, Windsurf, Claude Code, Antigravity 등)가 환각(Hallucination) 없이 일관되고 무결한 코드를 자율적으로 개발할 수 있도록 설계된 **하네스 엔지니어링(Harness Engineering)** 세부 규격서 모음입니다.

---

## 📂 문서 네비게이션 및 역할

| 문서명 | 주요 내용 | 주 활용 에이전트 / 상황 |
| :--- | :--- | :--- |
| **[AGENTS.md](../AGENTS.md)** | 프로젝트 최상위 마스터 헌장, 절대 금지/필수 사항, 폴더 구조 | 모든 AI 에이전트의 기본 컨텍스트 주입 |
| **[01-agent-personas.md](./01-agent-personas.md)** | 4인 팀 배경(기획/디자인/엔지니어링/마케팅) 및 에이전트 4대 분신 역할 정의 | 에이전트 페르소나 전환 및 협업 시 |
| **[02-architecture-schema.md](./02-architecture-schema.md)** | Notion API 연동, 타입 안전성(Strict Types), S3 URL 만료 방어, Next.js 15 ISR | 백엔드/데이터 패칭 및 인터페이스 개발 시 |
| **[03-design-swiss-bento.md](./03-design-swiss-bento.md)** | 에밀 루더의 스위스 디자인, Tailwind v4 CSS-First, 12-컬럼 벤토 그리드, 접근성 | 프론트엔드 UI 컴포넌트 및 스타일링 개발 시 |
| **[04-step-prompts.md](./04-step-prompts.md)** | 개발 단계별 무환각 프롬프트 템플릿 (초기화 → API → UI → 배포 검증) | Cursor Composer / Windsurf 순차 작업 시 |
| **[05-qa-and-dod.md](./05-qa-and-dod.md)** | 단위/E2E 테스트, ISR 60초 캐시 갱신 검증, Lighthouse 점수 기준, DoD | 빌드 검증, 배포 전 품질 감사 시 |

---

## 🛠 하네스 구동 핵심 원칙
1. **Zero Drift**: 모든 개발 단계에서 `AGENTS.md`에 명시된 $0 인프라, Next.js 15 App Router, Tailwind CSS v4 CSS-First 원칙에서 벗어나지 않습니다.
2. **Type First**: UI 컴포넌트나 로직을 구현하기 전에 `types/notion.ts`의 스키마와 데이터 계약을 먼저 확정합니다.
3. **Graceful Degrade**: Notion API 장애, S3 이미지 URL 만료, 환경변수 누락 등의 예외 상황에서도 UI 레이아웃이 붕괴되지 않고 다크 그래디언트 및 스켈레톤 상태로 자연스럽게 폴백(Fallback)되어야 합니다.
