// app/page.tsx
import { getTeamMembers, getProducts } from '@/lib/notion';
import { getSession } from '@/lib/auth';
import BentoGridLayout from '@/components/BentoGridLayout';
import HeaderAuthButtons from '@/components/HeaderAuthButtons';
import StudioChatWidget from '@/components/StudioChatWidget';
import { Layers, Sparkles } from 'lucide-react';

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
    <main className="min-h-screen bg-[#0a0a0c] text-neutral-100 p-6 md:p-12 lg:p-16 relative">
      {/* Swiss Graphic Design Header */}
      <header className="max-w-7xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>SHOTSHOT // Multidisciplinary Creative Studio</span>
            {isUsingMock && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-amber-800/40 bg-amber-950/30 text-amber-300 ml-2">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                Demo Mock
              </span>
            )}
          </div>

          <HeaderAuthButtons session={session} members={members} teamDbId={process.env.NOTION_TEAM_DB_ID} />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-sans">
          SHOTSHOT <span className="text-neutral-500 font-light">STUDIO HUB</span>
        </h1>
        <p className="text-neutral-400 text-base md:text-lg mt-3 max-w-2xl leading-relaxed">
          4-Person Multidisciplinary Creative Team Core Capabilities & Multi-Brand Portfolio Matrix.
        </p>
      </header>

      {/* Main Bento Grid Content Area */}
      <section className="max-w-7xl mx-auto">
        {members.length === 0 && products.length === 0 ? (
          <div className="swiss-border rounded-2xl bg-neutral-900/40 p-12 md:p-16 text-center backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800/80 text-neutral-400 mb-4 font-mono text-sm">
              00
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Awaiting Database Connection
            </h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed mb-6">
              No team members or side projects found in the Notion database, or environment variables (.env.local) are not configured.
            </p>
            <div className="inline-block text-left bg-neutral-950/80 border border-neutral-800 rounded-lg p-4 font-mono text-xs text-neutral-300">
              <span className="text-neutral-400"># Required environment variables in .env.local:</span><br />
              NOTION_TOKEN=secret_...<br />
              NOTION_TEAM_DB_ID=...<br />
              NOTION_PRODUCTS_DB_ID=...
            </div>
          </div>
        ) : (
          <BentoGridLayout
            members={members}
            products={products}
            session={session}
            productsDbId={process.env.NOTION_PRODUCTS_DB_ID}
          />
        )}
      </section>

      {/* Floating Studio Team Chat Widget */}
      <StudioChatWidget session={session} />

      {/* Minimal Swiss Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-mono gap-4">
        <div>&copy; {new Date().getFullYear()} SHOTSHOT Studio. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>ISR: 60s Revalidation</span>
          <span>&bull;</span>
          <span>Zero-Cost ($0) Stack</span>
        </div>
      </footer>
    </main>
  );
}
