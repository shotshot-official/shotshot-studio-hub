// app/members/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTeamMembers, getPageBlocks } from '@/lib/notion';
import { getSession } from '@/lib/auth';
import HeaderAuthButtons from '@/components/HeaderAuthButtons';
import SkillMatrix from '@/components/SkillMatrix';
import NotionBlocksRenderer from '@/components/NotionBlocksRenderer';
import StudioLogo from '@/components/StudioLogo';
import { resolveSocialLink } from '@/lib/social-links';
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react';

export const revalidate = 60;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const [members, session] = await Promise.all([
    getTeamMembers(),
    getSession(),
  ]);

  const memberIndex = members.findIndex(
    (m) =>
      m.id === decodedId ||
      m.name.toLowerCase().trim() === decodedId.toLowerCase().trim()
  );

  if (memberIndex === -1) {
    notFound();
  }

  const member = members[memberIndex];
  const memberOrderLabel = String(memberIndex + 1).padStart(2, '0');

  // Fetch Notion page blocks directly from Notion API
  const blocks = await getPageBlocks(member.id);

  const links =
    member.personalLinks && member.personalLinks.length > 0
      ? member.personalLinks
      : member.personalLink
      ? [member.personalLink]
      : [];

  return (
    <main className="min-h-screen bg-[var(--color-canvas)] text-neutral-100 px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14">
      {/* Top Architectural Navigation Bar */}
      <header className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono">
            <Link
              href="/"
              className="swiss-focus inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950 border border-neutral-700/80 hover:border-white text-neutral-300 hover:text-white rounded-[4px] transition-colors uppercase tracking-wider"
            >
              <StudioLogo size="xs" />
              <span>STUDIO HUB</span>
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400 uppercase tracking-wider">TEAM</span>
            <span className="text-neutral-600">/</span>
            <span className="text-white font-medium uppercase tracking-wider">{member.name}</span>
          </nav>

          <HeaderAuthButtons
            session={session}
            members={members}
            teamDbId={process.env.NOTION_MEMBER_DB_ID}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-14 sm:space-y-20">
        {/* Principal Profile Header & Specification Grid */}
        <section aria-labelledby="member-profile-heading">
          <div className="flex items-center justify-between gap-3 pb-3 mb-6 border-b border-neutral-800">
            <h2
              id="member-profile-heading"
              className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-200 font-mono font-bold"
            >
              PRINCIPAL PROFILE
            </h2>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              SHOTSHOT TEAM
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left 4 Columns: Circular Portrait Frame, Status & Channel Directory */}
            <div className="lg:col-span-4 space-y-4">
              <div className="swiss-border p-5 sm:p-6 text-center">
                {/* Circular Portrait Avatar */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center overflow-hidden mb-6">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 208px, 208px"
                      priority
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center select-none">
                      <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-1">
                        PRINCIPAL
                      </span>
                      <span className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-white">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* External Channels & Direct Contact */}
                <div className="pt-4 border-t border-neutral-800 text-left">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                    CHANNELS &amp; DISPATCH
                  </div>
                  {links.length > 0 || member.email ? (
                    <div className="flex flex-col gap-2">
                      {links.map((url, idx) => {
                        const { icon: Icon, label } = resolveSocialLink(url);
                        return (
                          <a
                            key={`${url}-${idx}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="swiss-focus flex items-center justify-between px-3 py-2 bg-neutral-950 border border-neutral-800 hover:border-white text-xs font-mono uppercase tracking-wider text-neutral-200 hover:text-white rounded-[4px] transition-colors"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{label}</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                          </a>
                        );
                      })}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="swiss-focus flex items-center justify-between px-3 py-2 bg-neutral-950 border border-neutral-800 hover:border-white text-xs font-mono uppercase tracking-wider text-neutral-200 hover:text-white rounded-[4px] transition-colors"
                        >
                          <span className="inline-flex items-center gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-neutral-400">
                      No public channels registered.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right 8 Columns: Identity, Bio, Full Capability Matrix & Dossier Notes */}
            <div className="lg:col-span-8 space-y-6">
              <div className="swiss-border p-6 sm:p-8 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                    {member.role}
                  </p>
                  {member.specialty && (
                    <span className="px-2.5 py-0.5 bg-neutral-950 border border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-300">
                      {member.specialty}
                    </span>
                  )}
                </div>
                <h1
                  id="member-dossier-heading"
                  className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
                >
                  {member.name}
                </h1>

                {member.featuredQuote && (
                  <blockquote className="mt-5 pl-4 border-l-2 border-white text-sm sm:text-base font-mono text-neutral-200 leading-relaxed max-w-3xl break-keep">
                    &ldquo;{member.featuredQuote}&rdquo;
                  </blockquote>
                )}

                <p className="text-base sm:text-lg text-neutral-300 mt-5 leading-relaxed max-w-3xl break-keep">
                  {member.bio ||
                    `${member.name} serves as ${member.role} at SHOTSHOT Studio, contributing across visual storytelling, production, and digital product engineering.`}
                </p>

                {/* Full Capability Matrix */}
                <div className="mt-8 pt-6 border-t border-neutral-800">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      CORE CAPABILITIES &amp; DISCIPLINES
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {String(member.skills.length).padStart(2, '0')} SKILLS
                    </span>
                  </div>
                  <SkillMatrix skills={member.skills} variant="detail" />
                </div>

                {/* Notion Page Blocks / Extended Dossier */}
                {blocks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-neutral-800">
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
                      DOSSIER NOTES &amp; PRACTICE
                    </div>
                    <NotionBlocksRenderer blocks={blocks} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 sm:mt-20 pt-6 sm:pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider gap-3">
        <div>&copy; {new Date().getFullYear()} SHOTSHOT STUDIO. ALL RIGHTS RESERVED.</div>
        <Link href="/" className="swiss-focus text-neutral-300 hover:text-white">
          ← RETURN TO STUDIO HUB
        </Link>
      </footer>
    </main>
  );
}
