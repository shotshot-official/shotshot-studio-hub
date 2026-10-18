// lib/social-links.ts
import {
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  BookOpen,
  Youtube,
  Mail,
  FileText,
  ArrowUpRight,
  Play,
  type LucideIcon,
} from 'lucide-react';

export interface SocialLinkInfo {
  icon: LucideIcon;
  label: string;
}

export function resolveSocialLink(url: string): SocialLinkInfo {
  const lower = url.toLowerCase();

  if (lower.includes('instagram.com')) {
    return { icon: Instagram, label: 'Instagram' };
  }
  if (lower.includes('github.com')) {
    return { icon: Github, label: 'GitHub' };
  }
  if (lower.includes('linkedin.com')) {
    return { icon: Linkedin, label: 'LinkedIn' };
  }
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    return { icon: Twitter, label: 'X (Twitter)' };
  }
  if (
    lower.includes('blog') ||
    lower.includes('velog.io') ||
    lower.includes('medium.com') ||
    lower.includes('tistory.com') ||
    lower.includes('substack.com') ||
    lower.includes('brunch.co.kr')
  ) {
    return { icon: BookOpen, label: 'Blog' };
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { icon: Youtube, label: 'YouTube' };
  }
  if (lower.startsWith('mailto:')) {
    return { icon: Mail, label: 'Email' };
  }

  // Graceful Fallback: Globe icon for any personal portfolio, studio page, or custom domain
  return { icon: Globe, label: 'Website' };
}

export function resolveProductLink(url: string, kind: 'internal' | 'live'): SocialLinkInfo {
  const lower = url.toLowerCase();

  if (lower.includes('github.com') || lower.includes('gitlab.com')) {
    return { icon: Github, label: 'SOURCE' };
  }
  if (lower.includes('notion.so') || lower.includes('notion.site') || lower.includes('docs.google.com')) {
    return { icon: FileText, label: 'DOCS' };
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) {
    return { icon: Play, label: kind === 'live' ? 'WATCH' : 'TRAILER' };
  }
  if (lower.includes('instagram.com')) {
    return { icon: Instagram, label: 'CHANNEL' };
  }

  return kind === 'internal'
    ? { icon: FileText, label: 'ARCHIVE' }
    : { icon: ArrowUpRight, label: 'VISIT' };
}

