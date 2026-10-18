// app/page.tsx
import { getTeamMembers, getProducts } from '@/lib/notion';
import { getSession } from '@/lib/auth';
import BentoGridLayout from '@/components/BentoGridLayout';
import HeaderAuthButtons from '@/components/HeaderAuthButtons';
import IntroSplashScreen from '@/components/IntroSplashScreen';
import ShimmerCta from '@/components/ShimmerCta';
import StudioLogo from '@/components/StudioLogo';
import { ArrowUpRight } from 'lucide-react';

// Incremental Static Regeneration (ISR): Revalidate cache in background every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  // Parallel Data Fetching directly from Notion Headless CMS
  const [members, products, session] = await Promise.all([
    getTeamMembers(),
    getProducts(),
    getSession(),
  ]);

  return (
    <main className="min-h-screen bg-[var(--color-canvas)] text-neutral-100 px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 relative overflow-x-hidden">
      {/* Kinetic Intro & FLIP Header Transition Overlay */}
      <IntroSplashScreen />

      {/* Swiss Editorial Masthead */}
      <header className="max-w-7xl mx-auto mb-8 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6 pb-5 sm:pb-8 border-b border-neutral-800">
          <div className="max-w-3xl">
            <div
              id="studio-brand-anchor"
              className="inline-flex items-center gap-2.5 sm:gap-4 md:gap-5 whitespace-nowrap"
            >
              <StudioLogo size="lg" />
              <h1 className="text-[clamp(1.5rem,6.8vw,2.25rem)] sm:text-6xl md:text-7xl font-black tracking-[-0.04em] text-white uppercase font-sans leading-[0.95] whitespace-nowrap">
                SHOTSHOT{' '}
                <span className="text-neutral-400 font-extralight">
                  STUDIO
                </span>
              </h1>
            </div>
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg mt-2.5 sm:mt-5 leading-relaxed font-normal">
              An independent creative studio working across visual media, software, and storytelling.
            </p>
          </div>

          <div className="shrink-0 sm:pt-2">
            <HeaderAuthButtons
              session={session}
              members={members}
              teamDbId={process.env.NOTION_MEMBER_DB_ID}
            />
          </div>
        </div>

        {/* Mobile Quick-Jump Architectural Index Strip (<sm) */}
        <nav
          aria-label="Section index"
          className="sm:hidden grid grid-cols-3 divide-x divide-neutral-800 border-b border-neutral-800 font-mono text-xs uppercase tracking-wider"
        >
          <a
            href="#team"
            className="swiss-focus py-2.5 px-2 flex items-center justify-between text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <span>01 TEAM</span>
            <span className="text-neutral-400">{String(members.length).padStart(2, '0')}</span>
          </a>
          <a
            href="#works"
            className="swiss-focus py-2.5 px-2 flex items-center justify-between text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <span>02 WORKS</span>
            <span className="text-neutral-400">{String(products.length).padStart(2, '0')}</span>
          </a>
          <a
            href="#inquire"
            className="swiss-focus py-2.5 px-2 flex items-center justify-between text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <span>03 INQUIRE</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </nav>
      </header>

      {/* Main Bento Grid Content Area */}
      <div className="max-w-7xl mx-auto">
        {members.length === 0 && products.length === 0 ? (
          <div className="swiss-border p-12 md:p-16 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 border border-neutral-700 bg-neutral-950 text-neutral-300 mb-4 font-mono text-xs rounded-[4px]">
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
      <section id="inquire" className="max-w-7xl mx-auto mt-14 sm:mt-20 scroll-mt-6">
        <div className="flex items-center justify-between gap-4 pb-3 mb-4 sm:mb-6 border-b border-neutral-800">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono font-bold text-white tracking-widest">03</span>
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-300 font-mono">
              COLLABORATE
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
            PARTNERSHIPS &amp; INQUIRIES
          </span>
        </div>

        <div className="swiss-border p-5 sm:p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start lg:items-end">
          <div className="lg:col-span-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl">
              Let&apos;s make something memorable.
            </h3>
            <p className="text-sm md:text-base text-neutral-300 mt-2.5 sm:mt-3 max-w-[65ch] leading-relaxed">
              Open for brand collaborations, video productions, and original content ideas.
              We plan, shoot, edit, and build everything in-house.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-5 sm:mt-6 pt-4 border-t border-neutral-800/80 font-mono text-xs uppercase tracking-wider text-neutral-400">
              <span className="text-neutral-300">BRAND PARTNERSHIPS</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-300">VIDEO PRODUCTION</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-300">ORIGINAL CONTENT</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between w-full gap-4 pt-5 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
            <div className="text-left lg:text-right font-mono text-xs text-neutral-400">
              <div className="uppercase tracking-wider text-neutral-300">DIRECT DISPATCH</div>
              <div className="mt-0.5">hello@shotshot.studio</div>
            </div>
            <ShimmerCta
              href="mailto:hello@shotshot.studio?subject=Collaboration%20Inquiry%20%E2%80%94%20SHOTSHOT%20Studio"
              variant="primary"
            >
              Get in Touch
            </ShimmerCta>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 sm:mt-20 pt-6 sm:pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono uppercase tracking-wider gap-3">
        <div className="flex items-center gap-2.5">
          <StudioLogo size="xs" />
          <span>&copy; {new Date().getFullYear()} SHOTSHOT STUDIO. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </main>
  );
}
