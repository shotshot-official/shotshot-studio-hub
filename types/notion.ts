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
  email?: string;
  password?: string;
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
  featured?: boolean;
  index?: number;
}

export interface StatusBadgeProps {
  status: MemberStatus | ProductStatus;
}

export interface SkillMatrixProps {
  skills: string[];
  variant?: 'default' | 'member' | 'featured';
}

