// app/page.tsx
import { getTeamMembers, getProducts } from '@/lib/notion';
import { getSession } from '@/lib/auth';
import BentoGridLayout from '@/components/BentoGridLayout';
import HeaderAuthButtons from '@/components/HeaderAuthButtons';
import { ArrowUpRight } from 'lucide-react';

// ============================================================================
// [MOCK DATA IMPORT] 노션 연동 후 제거 시: 이 임포트와 아래 Fallback 로직을 삭제하세요.
import { mockTeamMembers, mockProducts } from '@/lib/mock-data';
// ============================================================================

// Incremental Static Regeneration (ISR): Revalidate cache in background every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  // Parallel Data Fetching via Server Component with Graceful Fallbacks
  const [notionMembers, notionProducts, session] = await Promise.all([
    getTeamMembers(),
    getProducts(),
    getSession(),
  ]);

  // --------------------------------------------------------------------------
  // [MOCK DATA FALLBACK] 노션 DB 연결 시 자동 해제되며, 수동 삭제도 가능합니다.
  const isUsingMock = notionMembers.length === 0 && notionProducts.length === 0;
  const members = isUsingMock ? mockTeamMembers : notionMembers;
  const products = isUsingMock ? mockProducts : notionProducts;
  // --------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-[var(--color-canvas)] text-neutral-100 px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-14 relative">
      {/* Swiss International Typographic Masthead */}
      <header className="max-w-7xl mx-auto mb-16">
        {/* Top Navigation Bar */}
        <nav aria-label="Main" className="flex items-center justify-between pb-6 mb-12 border-b border-neutral-800">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-neutral-400 uppercase">
            <span className="font-bold text-white tracking-wider">SHOTSHOT</span>
            <span aria-hidden="true" className="text-neutral-700">/</span>
            <span className="hidden sm:inline">STUDIO</span>
            <span aria-hidden="true" className="hidden sm:inline text-neutral-700">/</span>
            <span className="inline-flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-[var(--color-status-available)]" />
              <span className="text-[11px]">AVAILABLE</span>
            </span>
          </div>

          <HeaderAuthButtons
            session={session}
            members={members}
            teamDbId={process.env.NOTION_TEAM_DB_ID}
          />
        </nav>

        {/* Minimal Hero Title */}
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] text-white uppercase font-sans leading-[0.95]">
            SHOTSHOT{' '}
            <span className="text-neutral-400 font-extralight">
              STUDIO
            </span>
          </h1>
          <p className="text-neutral-400 text-base md:text-lg mt-5 leading-relaxed font-normal">
            An independent creative studio working across visual media, software, and storytelling.
          </p>
        </div>
      </header>

      {/* Main Bento Grid Content Area */}
      <div className="max-w-7xl mx-auto">
        {members.length === 0 && products.length === 0 ? (
          <div className="swiss-border p-12 md:p-16 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 border border-neutral-700 bg-neutral-950 text-neutral-300 mb-4 font-mono text-xs">
              00
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2 uppercase">
              Archive Unavailable
            </h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
              Unable to load studio records right now. Check back shortly or verify connection
              settings.
            </p>
          </div>
        ) : (
          <BentoGridLayout
            members={members}
            products={products}
            session={session}
            productsDbId={process.env.NOTION_PRODUCTS_DB_ID}
          />
        )}
      </div>

      {/* 03 // Commercial Inquiry & Commission Section */}
      <section id="inquire" className="max-w-7xl mx-auto mt-20">
        <div className="flex items-center justify-between gap-4 pb-3 mb-6 border-b border-neutral-800">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono font-bold text-white tracking-widest">03</span>
            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-300 font-mono">
              COLLABORATE
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
            PARTNERSHIPS &amp; INQUIRIES
          </span>
        </div>

        <div className="swiss-border p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-end">
          <div className="lg:col-span-8">
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl">
              Let&apos;s make something memorable.
            </h3>
            <p className="text-sm md:text-base text-neutral-300 mt-3 max-w-[65ch] leading-relaxed">
              Open for brand collaborations, video productions, and original content ideas.
              We plan, shoot, edit, and build everything in-house.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 font-mono text-[11px] uppercase tracking-wider text-neutral-300">
              <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800">
                BRAND PARTNERSHIPS
              </span>
              <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800">
                VIDEO PRODUCTION
              </span>
              <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800">
                ORIGINAL CONTENT
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between w-full gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
            <div className="text-left lg:text-right font-mono text-xs text-neutral-400">
              <div className="uppercase tracking-wider text-neutral-300">DIRECT DISPATCH</div>
              <div className="mt-0.5">hello@shotshot.studio</div>
            </div>
            <a
              href="mailto:hello@shotshot.studio?subject=Collaboration%20Inquiry%20%E2%80%94%20SHOTSHOT%20Studio"
              className="swiss-focus inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Swiss Editorial Colophon Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider gap-4">
        <div>&copy; {new Date().getFullYear()} SHOTSHOT STUDIO COLLECTIVE. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-4">
          <span>GRID: 12-COL ASYMMETRIC</span>
          <span>/</span>
          <span>EDITION 2026</span>
        </div>
      </footer>
    </main>
  );
}
