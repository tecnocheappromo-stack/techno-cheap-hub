import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { ICONS } from "@/config/categories";
import { ARTICLE_CATEGORIES, getArticles, type Article } from "@/config/articles";

export const Route = createFileRoute("/artigos/")({
  head: () => ({
    meta: [
      { title: "Artigos | Techno Cheap" },
      {
        name: "description",
        content:
          "Guias, comparativos e reviews de tecnologia: projetores, fones, tablets, celulares e mais — com dicas para escolher e comprar melhor.",
      },
      { property: "og:title", content: "Artigos | Techno Cheap" },
      {
        property: "og:description",
        content: "Guias, comparativos e reviews de tecnologia para você escolher e comprar melhor.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/artigos" }],
  }),
  component: ArtigosPage,
});

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function ArticleCard({ article }: { article: Article }) {
  const Icon = ICONS[article.coverIcon];
  const cat = ARTICLE_CATEGORIES[article.category];
  return (
    <Link
      to="/artigos/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col p-5 sm:p-6 rounded-3xl bg-card border border-border md:transition-all md:duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--gradient-icon)" }}
      >
        <Icon size={20} className="text-white" />
      </div>
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit ${cat.badgeClass}`}
      >
        {cat.label}
      </span>
      <h2 className="font-bold text-lg text-foreground leading-tight mt-2">{article.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
        {article.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} /> {article.readTimeMinutes} min de leitura
        </span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 font-semibold text-sm text-primary md:group-hover:gap-3 md:transition-all">
        Ler artigo
        <ArrowRight size={16} className="md:transition-transform md:group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function ArtigosPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden text-white" style={{ background: "var(--gradient-hero)" }}>
        <nav className="relative z-10 flex items-center justify-between px-5 py-5 max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
            <span className="text-shopee">Techno</span>Cheap
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/15 md:transition-colors"
          >
            <ArrowLeft size={13} /> Voltar para as ofertas
          </Link>
        </nav>
        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-6 pb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">Artigos</h1>
          <p className="mt-4 text-base text-white/80 max-w-lg mx-auto leading-relaxed">
            Guias, comparativos e reviews para você escolher melhor antes de comprar.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12 sm:py-16">
        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">Techno Cheap · Artigos sobre tecnologia</p>
      </footer>
    </div>
  );
}
