// app/products/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTeamMembers, getProducts } from '@/lib/notion';
import { getSession } from '@/lib/auth';
import HeaderAuthButtons from '@/components/HeaderAuthButtons';
import ProductEditTrigger from '@/components/ProductEditTrigger';
import StudioLogo from '@/components/StudioLogo';
import { resolveProductLink } from '@/lib/social-links';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';

export const revalidate = 60;

function extractYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (parsed.pathname.startsWith('/embed/')) return url;
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.replace('/shorts/', '').split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function renderBrandTitle(name: string) {
  // If title has a parenthesized part e.g. "Budget to Boutique (Road Trip Series)",
  // wrap the parenthesized group in an inline-block whitespace-nowrap span
  const match = name.match(/^(.*?)\s*(\(.*?\))$/);
  if (match) {
    const [, main, sub] = match;
    return (
      <>
        <span>{main}</span>{' '}
        <span className="inline-block whitespace-nowrap">{sub}</span>
      </>
    );
  }
  return name;
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const [members, products, session] = await Promise.all([
    getTeamMembers(),
    getProducts(),
    getSession(),
  ]);

  const productIndex = products.findIndex(
    (p) =>
      p.id === decodedId ||
      p.brandName.toLowerCase().trim() === decodedId.toLowerCase().trim()
  );

  if (productIndex === -1) {
    notFound();
  }

  const product = products[productIndex];
  const productOrderLabel = String(productIndex + 1).padStart(2, '0');
  const prevProduct =
    products.length > 1
      ? products[(productIndex - 1 + products.length) % products.length]
      : null;
  const nextProduct =
    products.length > 1
      ? products[(productIndex + 1) % products.length]
      : null;

  const youtubeEmbedUrl = extractYouTubeEmbedUrl(product.videoUrl);

  const internalLinkInfo = product.internalLink
    ? resolveProductLink(product.internalLink, 'internal')
    : null;
  const liveLinkInfo = product.liveUrl
    ? resolveProductLink(product.liveUrl, 'live')
    : null;

  return (
    <main className="min-h-screen bg-[var(--color-canvas)] text-neutral-100 px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-16">
      {/* Top Architectural Navigation Bar */}
      <header className="max-w-7xl mx-auto mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800/80">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono">
            <Link
              href="/"
              className="swiss-focus inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/60 border border-neutral-700/80 hover:border-white text-neutral-300 hover:text-white rounded-[var(--radius-control)] transition-colors uppercase tracking-wider"
            >
              <StudioLogo size="xs" />
              <span>STUDIO HUB</span>
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400 uppercase tracking-wider">WORKS</span>
            <span className="text-neutral-600">/</span>
            <span className="text-white font-medium uppercase tracking-wider">
              {product.brandName.split('(')[0].trim()}
            </span>
          </nav>

          <HeaderAuthButtons
            session={session}
            members={members}
            teamDbId={process.env.NOTION_MEMBER_DB_ID}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        {/* 01 // Editorial Masthead & Hero Media Stage */}
        <section aria-labelledby="product-case-study-title" className="space-y-8 sm:space-y-12">
          {/* Header Metadata & Headline */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-neutral-400 tracking-widest uppercase">
                  CASE STUDY
                </span>
                {product.category && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                      {product.category}
                    </span>
                  </>
                )}
                {product.timeline && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                      {product.timeline}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <ProductEditTrigger product={product} members={members} session={session} />
              </div>
            </div>

            {/* Semantic H1 Title & High-Contrast Typography */}
            <div className="space-y-4 max-w-4xl">
              <h1
                id="product-case-study-title"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] break-keep"
              >
                {renderBrandTitle(product.brandName)}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 font-light leading-relaxed break-keep pt-1">
                {product.oneLiner}
              </p>
            </div>

            {/* Editorial Action Bar */}
            {((product.videoUrl && !youtubeEmbedUrl) ||
              (product.internalLink && internalLinkInfo) ||
              (product.liveUrl && liveLinkInfo)) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {product.videoUrl && !youtubeEmbedUrl && (
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="swiss-focus inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-900/60 border border-neutral-700 hover:border-white rounded-[var(--radius-control)] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Film</span>
                  </a>
                )}
                {product.internalLink && internalLinkInfo && (
                  <a
                    href={product.internalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="swiss-focus inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-900/60 border border-neutral-700 hover:border-white rounded-[var(--radius-control)] transition-colors"
                  >
                    <internalLinkInfo.icon className="w-3.5 h-3.5" />
                    <span>{internalLinkInfo.label}</span>
                  </a>
                )}
                {product.liveUrl && liveLinkInfo && (
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="swiss-focus inline-flex items-center gap-2 px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 rounded-[var(--radius-control)] transition-colors shadow-lg"
                  >
                    <span>{liveLinkInfo.label}</span>
                    <liveLinkInfo.icon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Cinematic Media Stage (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-video rounded-[var(--radius-card)] overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-2xl">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={`${product.brandName} Video Preview`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : product.coverImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.coverImage}
                  alt={product.brandName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-mono uppercase tracking-widest text-neutral-200 rounded-[var(--radius-control)]">
                    ORIGINAL FILM STILL
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2">
                  SHOTSHOT ARCHIVE
                </span>
                <div className="text-6xl sm:text-7xl font-black tracking-tighter text-neutral-300 uppercase font-sans">
                  {product.brandName.slice(0, 3)}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Project Architecture & Deliverables */}
        <section aria-labelledby="product-thesis-heading" className="pt-8 border-t border-neutral-800/60">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-neutral-800/60 mb-10">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                PROJECT SPECIFICATIONS
              </span>
              <h2
                id="product-thesis-heading"
                className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white"
              >
                Overview &amp; Deliverables
              </h2>
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              ARCHITECTURE &amp; SCOPE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left 8 Columns: Editorial Story & Key Deliverables */}
            <article className="lg:col-span-8 space-y-10">
              {/* 1. Project Overview & Story */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                  PROJECT OVERVIEW
                </span>
                <p className="text-base sm:text-lg md:text-xl text-neutral-200 leading-relaxed font-sans break-keep font-light">
                  {product.overview || product.oneLiner}
                </p>
              </div>

              {/* 2. Key Deliverables & Format */}
              {product.deliverables && product.deliverables.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-neutral-800/60">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                      KEY DELIVERABLES &amp; FORMAT
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {String(product.deliverables.length).padStart(2, '0')} ITEMS
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {product.deliverables.map((item, idx) => (
                      <div
                        key={`${item}-${idx}`}
                        className="p-4 sm:p-5 flex items-start gap-4 rounded-[var(--radius-card)] bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                      >
                        <span className="font-mono text-xs font-bold text-neutral-300 px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-[var(--radius-control)] shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm sm:text-base text-neutral-200 font-medium leading-relaxed break-keep">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </article>

            {/* Right 4 Columns: Refined Editorial Metadata Rail */}
            <aside className="lg:col-span-4 lg:border-l lg:border-neutral-800/60 lg:pl-10 space-y-8">
              {/* Category & Format */}
              {product.category && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    CATEGORY
                  </div>
                  <div className="text-sm font-sans font-medium text-neutral-100">
                    {product.category}
                  </div>
                </div>
              )}

              {/* Studio Attribution */}
              <div className={product.category ? 'pt-6 border-t border-neutral-800/50' : ''}>
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  PRODUCTION
                </div>
                <div className="text-sm font-sans font-medium text-neutral-100">
                  SHOTSHOT Studio Collective
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Adjacent Venture Navigation */}
        {prevProduct && nextProduct && (
          <nav
            aria-label="Adjacent ventures"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-neutral-800/60"
          >
            <Link
              href={`/products/${encodeURIComponent(prevProduct.id)}`}
              className="swiss-focus p-6 rounded-[var(--radius-card)] border border-neutral-800/80 hover:border-neutral-600 bg-neutral-900/20 hover:bg-neutral-900/40 transition-colors flex items-center justify-between gap-4 group"
            >
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  <span>EXPLORE WORK</span>
                </div>
                <div className="text-lg font-bold font-sans text-white group-hover:text-neutral-100">
                  {prevProduct.brandName}
                </div>
              </div>
            </Link>
            <Link
              href={`/products/${encodeURIComponent(nextProduct.id)}`}
              className="swiss-focus p-6 rounded-[var(--radius-card)] border border-neutral-800/80 hover:border-neutral-600 bg-neutral-900/20 hover:bg-neutral-900/40 transition-colors flex items-center justify-between gap-4 text-right group"
            >
              <div className="ml-auto">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1.5 inline-flex items-center gap-1.5">
                  <span>EXPLORE WORK</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-lg font-bold font-sans text-white group-hover:text-neutral-100">
                  {nextProduct.brandName}
                </div>
              </div>
            </Link>
          </nav>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider gap-3">
        <div>&copy; {new Date().getFullYear()} SHOTSHOT STUDIO. ALL RIGHTS RESERVED.</div>
        <Link href="/" className="swiss-focus text-neutral-300 hover:text-white transition-colors">
          ← RETURN TO STUDIO HUB
        </Link>
      </footer>
    </main>
  );
}

function memberFrom<T>(m: T): T {
  return m;
}
