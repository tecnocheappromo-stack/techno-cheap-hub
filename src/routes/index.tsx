import { createFileRoute } from "@tanstack/react-router";
import {
  Flame,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MousePointerClick,
  Truck,
  CheckCircle2,
  Play,
  Star,
  Users,
  TrendingUp,
  Package,
  type LucideIcon,
} from "lucide-react";
import {
  ICONS,
  SITE_LINKS,
  getCategories,
  getHighlights,
  safeHref,
  validateLink,
  type Category,
} from "@/config/categories";
import { AdminPanel } from "@/components/AdminPanel";
import { useLinkOverrides } from "@/hooks/use-link-overrides";
import { trackEvent } from "@/lib/analytics";

import type { MouseEvent } from "react";

function guardClick(raw: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (validateLink(raw).status !== "valid") {
      e.preventDefault();
      if (typeof window !== "undefined") {
        console.warn("[Techno Cheap] Link inválido ou ainda não configurado:", raw);
      }
    }
  };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techno Cheap | Achadinhos da Shopee" },
      {
        name: "description",
        content:
          "Encontre produtos em oferta da Shopee separados por categoria: tecnologia, projetores, fones, tablets, celulares, casa e muito mais.",
      },
      { property: "og:title", content: "Techno Cheap | Achadinhos da Shopee" },
      {
        property: "og:description",
        content:
          "Achadinhos selecionados da Shopee em tecnologia, casa e eletrônicos. Categorias diretas para o que apareceu no TikTok.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function TrustBadge({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
      <Icon size={13} className="text-shopee" />
      {text}
    </span>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const Icon = ICONS[category.icon];
  const { name, description, cta, link, featured } = category;
  return (
    <a
      href={safeHref(link)}
      onClick={(e) => {
        guardClick(link)(e);
        trackEvent("click_category_card", { category_name: name });
      }}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col p-5 sm:p-6 rounded-3xl bg-card border md:transition-all md:duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg ${
        featured ? "border-shopee/50 ring-1 ring-shopee/20 shadow-shopee/10" : "border-border"
      }`}
      style={{ boxShadow: featured ? "var(--shadow-card-featured)" : "var(--shadow-card)" }}
    >
      {featured && (
        <span className="absolute -top-2.5 left-5 text-[10px] font-bold uppercase tracking-wider bg-shopee text-white px-3 py-1 rounded-full shadow-sm">
          Em alta
        </span>
      )}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 md:transition-transform md:duration-300 md:group-hover:scale-110"
        style={{
          background: featured ? "var(--gradient-shopee)" : "var(--gradient-icon)",
          boxShadow: featured
            ? "0 8px 24px -8px oklch(0.65 0.22 35 / 0.5)"
            : "0 6px 20px -6px oklch(0.3 0.12 255 / 0.35)",
        }}
      >
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="font-bold text-lg text-foreground leading-tight">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
      <div className="mt-5 inline-flex items-center gap-2 font-semibold text-sm text-primary group-hover:gap-3 transition-all">
        {cta}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

function HighlightCard({ category }: { category: Category }) {
  const Icon = ICONS[category.icon];
  return (
    <div
      className="group flex flex-col p-6 rounded-3xl bg-card border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "var(--gradient-shopee)",
          boxShadow: "0 8px 24px -8px oklch(0.65 0.22 35 / 0.45)",
        }}
      >
        <Icon size={26} className="text-white" />
      </div>
      <h3 className="font-black text-xl text-foreground">{category.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
        {category.description}
      </p>
      <a
        href={safeHref(category.link)}
        onClick={(e) => {
          guardClick(category.link)(e);
          trackEvent("click_cta_button", { button_text: `${category.name} — ${category.cta}` });
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "var(--gradient-shopee)", boxShadow: "var(--shadow-glow-sm)" }}
      >
        {category.cta}
        <ArrowRight size={16} />
      </a>
    </div>
  );
}

function StepCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
      <div
        className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
        style={{ background: "var(--gradient-icon)" }}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function Index() {
  const overrides = useLinkOverrides();
  const withOverride = (cat: Category): Category => ({
    ...cat,
    link: overrides[cat.id] ?? cat.link,
  });
  const categories = getCategories().map(withOverride);
  const highlights = getHighlights().map(withOverride);
  const mainVideoLink = overrides["SITE_LINKS.mainVideo"] ?? SITE_LINKS.mainVideo;
  const fullShopLink = overrides["SITE_LINKS.fullShop"] ?? SITE_LINKS.fullShop;


  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      {/* HERO */}
      <header
        className="relative overflow-hidden text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-25 pointer-events-none hidden md:block">
          <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-shopee blur-[80px]" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-brand-blue blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-shopee/40 blur-[100px]" />
        </div>

        <nav className="relative z-10 max-w-6xl mx-auto px-5 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg"
              style={{ background: "var(--gradient-shopee)" }}
            >
              T
            </div>
            <span className="font-bold text-lg tracking-tight">Techno Cheap</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
            <ShoppingBag size={13} /> Achadinhos da Shopee
          </span>
        </nav>

        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-10 pb-16 md:pt-16 md:pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <TrustBadge icon={Star} text="Links verificados da Shopee" />
            <TrustBadge icon={Users} text="+10 mil acessos" />
            <TrustBadge icon={TrendingUp} text="Atualizado toda semana" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles size={14} className="text-shopee" />
            Tudo que você precisa em um só lugar
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.02]">
            Achadinhos <span className="text-shopee">Techno</span> Cheap
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-lg mx-auto leading-relaxed">
            Produtos em oferta direto da Shopee, separados por categoria para você encontrar rápido
            o que apareceu no TikTok.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href={safeHref(mainVideoLink)}
              onClick={(e) => {
                guardClick(mainVideoLink)(e);
                trackEvent("click_cta_button", { button_text: "Ver produto do vídeo" });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "var(--gradient-shopee)", boxShadow: "var(--shadow-glow-lg)" }}
            >
              <Play size={22} className="fill-white" />
              Ver produto do vídeo
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[11px] text-white/50 max-w-xs leading-relaxed">
              Os preços e estoques podem mudar dentro da Shopee. Confira sempre antes de comprar.
            </p>
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-shopee mb-3">
            <Package size={14} /> Categorias
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Escolha uma categoria
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            Clique na categoria que você quer ver e acesse as ofertas direto na Shopee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="bg-secondary/40 py-16 md:py-24 border-y border-border">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-shopee mb-3">
                <Flame size={14} /> Não perca
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Destaques da semana
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlights.map((h) => (
                <HighlightCard key={h.id} category={h} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-shopee mb-3">
            <MousePointerClick size={14} /> Simples e rápido
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Como funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StepCard
            icon={MousePointerClick}
            title="1. Escolha"
            text="Selecione a categoria que viu no vídeo do TikTok."
          />
          <StepCard
            icon={ArrowRight}
            title="2. Acesse"
            text="O botão leva direto para a página da Shopee."
          />
          <StepCard
            icon={Truck}
            title="3. Confira"
            text="Verifique preço, frete e estoque dentro da Shopee."
          />
          <StepCard
            icon={ShieldCheck}
            title="4. Compre"
            text="Finalize com segurança pela própria Shopee."
          />
        </div>

        <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl bg-muted/70 border border-border">
          <CheckCircle2 size={18} className="text-shopee shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Aviso:</strong> esta página pode conter links de
            afiliado. Ao comprar por eles, posso receber uma comissão — sem custo extra para você.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-16 md:pb-24">
        <div
          className="max-w-4xl mx-auto rounded-[2rem] px-6 py-14 md:py-20 text-center text-white overflow-hidden relative"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-shopee blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-brand-blue blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Não encontrou o que procurava?
            </h2>
            <p className="mt-4 text-white/80 max-w-md mx-auto text-base leading-relaxed">
              Acesse a vitrine completa da Techno Cheap na Shopee e veja todos os produtos
              selecionados.
            </p>
            <a
              href={safeHref(fullShopLink)}
              onClick={(e) => {
                guardClick(fullShopLink)(e);
                trackEvent("click_cta_button", { button_text: "Ver todos os achadinhos" });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "var(--gradient-shopee)", boxShadow: "var(--shadow-glow-lg)" }}
            >
              <ShoppingBag size={22} />
              Ver todos os achadinhos
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
            style={{ background: "var(--gradient-shopee)" }}
          >
            T
          </div>
          <span className="font-bold text-foreground text-lg">Techno Cheap</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tudo que você precisa em um só lugar · Achadinhos da Shopee
        </p>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck size={12} />
          Links verificados · Compra segura pela Shopee
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-background/95 backdrop-blur-xl border-t border-border">
        <a
          href={safeHref(mainVideoLink)}
          onClick={(e) => {
            guardClick(mainVideoLink)(e);
            trackEvent("click_cta_button", { button_text: "Ver produto do vídeo (sticky)" });
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-2xl font-bold text-base text-white active:scale-[0.97] transition-transform"
          style={{ background: "var(--gradient-shopee)", boxShadow: "var(--shadow-glow-lg)" }}
        >
          <Play size={20} className="fill-white" />
          Ver produto do vídeo
          <ArrowRight size={18} />
        </a>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Links de afiliado · Sem custo extra para você
        </p>
      </div>

      <AdminPanel />
    </div>
  );
}
