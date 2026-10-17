// lib/mock-data.ts
// ============================================================================
// [MOCK DATA MODULE]
// 4인 팀 스튜디오 허브 화면 확인용 임시 목업 데이터입니다.
// 나중에 노션(Notion) 연동 후 완전히 제거하려면:
// 1. 이 파일(lib/mock-data.ts)을 삭제합니다.
// 2. app/page.tsx 에서 mockTeamMembers, mockProducts 임포트 및 폴백 로직을 삭제합니다.
// ============================================================================

import { TeamMember, ProductItem, ChatMessage } from '@/types/notion';

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-alex-kim',
    name: 'Alex Kim',
    role: 'Product Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    skills: ['Figma', 'Design Systems', 'Variable Fonts', 'Micro-interactions', 'UI/UX'],
    personalLinks: [
      'https://instagram.com/alexkim.design',
      'https://alexkim.design',
      'https://github.com/alexkim',
    ],
  },
  {
    id: 'member-chloe-lee',
    name: 'Chloe Lee',
    role: 'Frontend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    skills: ['Next.js 15', 'TailwindCSS v4', 'TypeScript', 'Framer Motion', 'WCAG 2.2'],
    personalLinks: [
      'https://github.com/chloelee',
      'https://velog.io/@chloelee',
      'https://linkedin.com/in/chloelee',
    ],
  },
  {
    id: 'member-david-park',
    name: 'David Park',
    role: 'Fullstack Dev',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    skills: ['Node.js', 'React Server Components', 'PostgreSQL', 'Edge Cache', 'API Optimization'],
    personalLinks: [
      'https://github.com/davidpark',
      'https://blog.davidpark.dev',
      'https://x.com/davidpark_dev',
    ],
  },
  {
    id: 'member-sara-choi',
    name: 'Sara Choi',
    role: 'Growth Marketer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    skills: ['Growth Strategy', 'Content Design', 'Brand Storytelling', 'SEO', 'Data Analytics'],
    personalLinks: [
      'https://instagram.com/sara.growth',
      'https://medium.com/@sarachoi',
      'https://linkedin.com/in/sarachoi',
    ],
  },
];

export const mockProducts: ProductItem[] = [
  {
    id: 'product-shotshot',
    brandName: 'ShotShot Studio',
    status: 'Active',
    oneLiner: '스위스 미학 비대칭 벤토 그리드와 무서버 Notion Headless CMS 기반 4인 멀티디시플리너리 크리에이티브 팀 거점 허브.',
    memberIds: ['member-alex-kim', 'member-chloe-lee', 'member-david-park', 'member-sara-choi'],
    techStack: ['Next.js 15', 'Tailwind CSS v4', 'Notion API', 'Framer Motion', 'Vercel Edge'],
    liveUrl: 'https://shotshot.dev',
    internalLink: 'https://github.com',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-devsync',
    brandName: 'DevSync',
    status: 'In Development',
    oneLiner: '분산 환경의 원격 엔지니어링 팀을 위한 초저지연 실시간 페어 프로그래밍 및 비동기 코드 리뷰 허브.',
    memberIds: ['member-chloe-lee', 'member-david-park'],
    techStack: ['TypeScript', 'WebRTC', 'PostgreSQL', 'Next.js', 'Tailwind CSS'],
    liveUrl: 'https://devsync.io',
    internalLink: 'https://github.com',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-typecraft',
    brandName: 'TypeCraft',
    status: 'Active',
    oneLiner: '에밀 루더의 스위스 조형 철학에 기반한 가변 폰트(Variable Font) 두께 대비 계산 및 모듈러 타이포그래피 토큰 생성기.',
    memberIds: ['member-alex-kim', 'member-chloe-lee'],
    techStack: ['React', 'Variable Fonts', 'Canvas API', 'Tailwind CSS'],
    liveUrl: 'https://typecraft.design',
    internalLink: 'https://github.com',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-growthradar',
    brandName: 'GrowthRadar',
    status: 'Concept',
    oneLiner: '마이크로 SaaS 및 크리에이티브 사이드 프로덕트를 위한 AI 에이전트 기반 오가닉 트래픽 성장 지표 추적 및 분석 엔진.',
    memberIds: ['member-david-park', 'member-sara-choi'],
    techStack: ['Python', 'FastAPI', 'AI Agent', 'Next.js', 'PostgreSQL'],
    liveUrl: undefined,
    internalLink: 'https://github.com',
    coverImage: undefined, // 이미지 부재 시 다크 그래디언트 폴백 UI 검증용
  },
];

// Helper to update mock member in memory
export function updateMockMember(memberId: string, updated: Partial<TeamMember>): TeamMember | null {
  const idx = mockTeamMembers.findIndex((m) => m.id === memberId);
  if (idx === -1) return null;
  mockTeamMembers[idx] = {
    ...mockTeamMembers[idx],
    ...updated,
  };
  return mockTeamMembers[idx];
}

// Helper to create a new mock member in memory
export function createMockMember(member: Omit<TeamMember, 'id'>): TeamMember {
  const newMember: TeamMember = {
    id: `member-${Date.now()}`,
    ...member,
  };
  mockTeamMembers.push(newMember);
  return newMember;
}

// ============================================================================
// [MOCK CHAT MESSAGES] Studio Team Live Feed Mockup
// ============================================================================
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'member-alex-kim',
    senderName: 'Alex Kim',
    senderRole: 'Product Designer',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    content: 'Swiss typography scale and 12-column Bento Grid tokens look clean on desktop!',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'msg-2',
    senderId: 'member-chloe-lee',
    senderName: 'Chloe Lee',
    senderRole: 'Frontend Engineer',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    content: 'Just checked the @container queries on tablet & mobile. Smooth responsive transitions.',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'msg-3',
    senderId: 'member-david-park',
    senderName: 'David Park',
    senderRole: 'Fullstack Dev',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    content: 'Notion API integration and 60-second ISR caching are verified. Zero infrastructure cost.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'msg-4',
    senderId: 'member-sara-choi',
    senderName: 'Sara Choi',
    senderRole: 'Growth Marketer',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    content: 'Awesome work team! Ready to showcase our side project matrix globally.',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

export function getMockChatMessages(): ChatMessage[] {
  return [...mockChatMessages];
}

export function addMockChatMessage(msg: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage {
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    ...msg,
    createdAt: new Date().toISOString(),
  };
  mockChatMessages.push(newMsg);
  return newMsg;
}


