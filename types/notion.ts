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

export interface AuthSession {
  memberId: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

// UI Component Props
export interface BentoGridLayoutProps {
  members: TeamMember[];
  products: ProductItem[];
  session?: AuthSession | null;
  productsDbId?: string;
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

// Studio Team Message / Chat Data Contract
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  content: string;
  createdAt: string; // ISO string
}

