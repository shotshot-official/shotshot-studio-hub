// lib/mock-data.ts
// ============================================================================
// [MOCK DATA MODULE]
// 4인 팀 스튜디오 허브 화면 확인용 임시 목업 데이터입니다.
// 나중에 노션(Notion) 연동 후 완전히 제거하려면:
// 1. 이 파일(lib/mock-data.ts)을 삭제합니다.
// 2. app/page.tsx 에서 mockTeamMembers, mockProducts 임포트 및 폴백 로직을 삭제합니다.
// ============================================================================

import { TeamMember, ProductItem } from '@/types/notion';

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-minsu-seo',
    name: '서민수',
    role: 'Creative Technologist & Producer',
    avatarUrl: undefined,
    skills: ['Fullstack Dev', 'Next.js', 'Video Production', 'Cinematography', 'Editing', 'Creative Direction'],
    personalLinks: [
      'https://github.com',
      'https://instagram.com',
      'https://youtube.com',
    ],
  },
  {
    id: 'member-minkyun-kim',
    name: '김민균',
    role: 'Video Director & Producer',
    avatarUrl: undefined,
    skills: ['Video Directing', 'Cinematography', 'Premiere Pro', 'Storyboarding', 'Content Strategy'],
    personalLinks: [
      'https://youtube.com',
      'https://instagram.com',
    ],
  },
  {
    id: 'member-hanseong-yoo',
    name: '유한성',
    role: 'Creator & Host',
    avatarUrl: undefined,
    skills: ['On-Camera Hosting', 'Local Curation', 'Video Editing', 'Storytelling', 'Interviewing'],
    personalLinks: [
      'https://youtube.com',
      'https://instagram.com',
    ],
  },
  {
    id: 'member-jonghyun-won',
    name: '원종현',
    role: 'Tech Lead & Service Planner',
    avatarUrl: undefined,
    skills: ['Next.js', 'TypeScript', 'Product Planning', 'Database Design', 'API Development'],
    personalLinks: [
      'https://github.com',
      'https://linkedin.com',
    ],
  },
];

export const mockProducts: ProductItem[] = [
  {
    id: 'product-seoul-vlog',
    brandName: 'Seoul In-Between (서울 인터루드)',
    status: 'Active',
    oneLiner: '서울의 숨겨진 동네와 크리에이터들의 솔직한 일상을 담아내는 로컬 게스트 토크 & 브이로그 시리즈.',
    memberIds: ['member-minsu-seo', 'member-minkyun-kim', 'member-hanseong-yoo'],
    techStack: ['YouTube', 'Cinematic Vlog', 'Premiere Pro', 'Local Culture', 'Interview'],
    liveUrl: 'https://youtube.com',
    internalLink: 'https://notion.so',
    coverImage: 'https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-hanseong-spots',
    brandName: 'Hanseong Spots (한성의 서울 수첩)',
    status: 'Active',
    oneLiner: '뻔한 관광지가 아닌 로컬의 시선으로 발굴한 유한성 추천 서울 골목길과 히든 스팟 영상 가이드.',
    memberIds: ['member-hanseong-yoo', 'member-minkyun-kim', 'member-minsu-seo'],
    techStack: ['YouTube', 'Hidden Gems', 'City Walk', 'Local Guide', 'Storytelling'],
    liveUrl: 'https://youtube.com',
    internalLink: 'https://notion.so',
    coverImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-concept-travel',
    brandName: 'Budget to Boutique (컨셉 로드트립)',
    status: 'In Development',
    oneLiner: '초가성비 배낭여행부터 감성 테마 여행까지, 명확한 예산과 테마로 떠나는 컨셉 여행 시리즈.',
    memberIds: ['member-minsu-seo', 'member-minkyun-kim', 'member-hanseong-yoo', 'member-jonghyun-won'],
    techStack: ['Travel Content', 'Budget Travel', 'Theme Roadtrip', 'Production', 'Planning'],
    liveUrl: 'https://youtube.com',
    internalLink: 'https://notion.so',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-seoul-guide',
    brandName: 'Seoul Pulse & Guide (서울 트렌드 위키)',
    status: 'In Development',
    oneLiner: '지금 서울에서 가장 핫한 장소 Top 5와 외국인을 위한 한국 여행 실전 솔루션 웹 & 영상 미디어.',
    memberIds: ['member-jonghyun-won', 'member-minsu-seo', 'member-minkyun-kim', 'member-hanseong-yoo'],
    techStack: ['Next.js 15', 'YouTube Shorts', 'Notion API', 'Travel Wiki', 'SEO'],
    liveUrl: 'https://shotshot.dev',
    internalLink: 'https://github.com',
    coverImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
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


