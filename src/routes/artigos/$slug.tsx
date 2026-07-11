import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { ICONS, STORES, safeHref, validateLink } from "@/config/categories";
import { ARTICLE_CATEGORIES, getArticleBySlug, type Article, type ArticleBlock } from "@/config/articles";

export const Route = createFileRoute("/artigos/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => {
    const article = loaderData as Article;
    return {
      meta: [
        { title: `${article.title} | Techno Cheap` },
        { name: "description", content: article.description },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.description },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: article.publishedAt },
      ],
      links: [{ rel: "canonical", href: `/artigos/${article.slug}` }],
    };
  },
  component: ArticlePage,
  notFoundComponent: ArticleNotFound,
});

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function ArticleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">Artigo não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esse artigo não existe ou foi removido.
        </p>
        <Link
          to="/artigos"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold"
        >
          <ArrowLeft size={14} /> Ver todos os artigos
        </Link>
      </div>
    </div>
  );
}

/** Imagem que some sozinha (sem quebrar o layout) se o link parar de funcionar. */
function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="text-2xl font-bold text-foreground mt-8 mb-3">{block.text}</h2>;
    case "paragraph":
      return <p className="text-base text-foreground/90 leading-relaxed mb-4">{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc pl-5 space-y-2 mb-4">
          {block.items.map((item, i) => (
            <li key={i} className="text-base text-foreground/90 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-shopee pl-4 py-1 my-6 italic text-foreground/80">
          {block.text}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-6">
          <SafeImage
            src={block.url}
            alt={block.alt}
            className="w-full rounded-3xl border border-border object-cover"
          />
          {block.caption && (
            <figcaption className="mt-2 text-xs text-muted-foreground text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "cta": {
      const store = STORES[block.store];
      const v = validateLink(block.link, block.store);
      return (
        <div
          className="my-8 rounded-3xl p-6 text-white"
          style={{ background: store.gradientVar, boxShadow: "var(--shadow-glow-sm)" }}
        >
          {block.image && (
            <SafeImage
              src={block.image}
              alt={block.title}
              className="w-full max-h-64 object-contain rounded-2xl bg-white/10 mb-4"
            />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
            {store.label}
          </span>
          <h3 className="text-xl font-black mt-3">{block.title}</h3>
          <p className="mt-1 text-sm text-white/85">{block.text}</p>
          {block.couponCode && (
            <p className="mt-3 inline-block text-xs font-mono bg-white/15 px-3 py-1.5 rounded-lg">
              Cupom: <strong>{block.couponCode}</strong>
            </p>
          )}
          <a
            href={safeHref(block.link, block.store)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (v.status !== "valid") e.preventDefault();
            }}
            className="mt-4 inline-flex items-center gap-2 bg-white text-foreground font-bold text-sm px-5 py-3 rounded-2xl md:hover:scale-[1.02] md:transition-transform"
          >
            {block.buttonLabel}
            <ArrowRight size={16} />
          </a>
        </div>
      );
    }
    default:
      return null;
  }
}

function ArticlePage() {
  const article = Route.useLoaderData();
  const Icon = ICONS[article.coverIcon];
  const cat = ARTICLE_CATEGORIES[article.category];

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden text-white" style={{ background: "var(--gradient-hero)" }}>
        <nav className="relative z-10 flex items-center justify-between px-5 py-5 max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
            <span className="text-shopee">Techno</span>Cheap
          </Link>
          <Link
            to="/artigos"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/15 md:transition-colors"
          >
            <ArrowLeft size={13} /> Todos os artigos
          </Link>
        </nav>
        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-4 pb-12">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "var(--gradient-icon)" }}
          >
            <Icon size={24} className="text-white" />
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit ${cat.badgeClass}`}
          >
            {cat.label}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.1] mt-3">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {article.readTimeMinutes} min de leitura
            </span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 sm:py-12">
        <article>
          {article.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            to="/artigos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <ArrowLeft size={16} /> Ver todos os artigos
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">Techno Cheap · Artigos sobre tecnologia</p>
      </footer>
    </div>
  );
}
