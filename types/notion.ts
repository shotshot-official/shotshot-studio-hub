// types/notion.ts

export type ProductCategory = 'Original Series' | 'Web & Media' | 'Travel Format' | 'Brand Campaign';

export interface ContentBlock {
  id: string;
  type:
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'quote'
    | 'callout'
    | 'divider';
  text: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatarUrl?: string;
  bio?: string;
  specialty?: string;
  featuredQuote?: string;
  email?: string;
  password?: string;
  personalLink?: string;
  personalLinks?: string[];
  blocks?: ContentBlock[];
}

export interface ProductItem {
  id: string;
  brandName: string;
  category?: ProductCategory | string;
  timeline?: string;
  oneLiner: string;
  overview?: string;
  deliverables?: string[];
  videoUrl?: string;
  memberIds: string[];
  techStack: string[];
  liveUrl?: string;
  internalLink?: string;
  coverImage?: string;
  blocks?: ContentBlock[];
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
  products?: ProductItem[];
}

export interface BrandCardProps {
  product: ProductItem;
  members: TeamMember[];
  featured?: boolean;
  index?: number;
}

export interface SkillMatrixProps {
  skills: string[];
  variant?: 'default' | 'member' | 'featured' | 'detail';
}


