import { createFileRoute } from "@tanstack/react-router";
import {
  Tv,
  Headphones,
  Tablet,
  Smartphone,
  Home,
  Microwave,
  Tag,
  Flame,
  Projector,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MousePointerClick,
  Truck,
  CheckCircle2,
} from "lucide-react";

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

const MAIN_VIDEO_LINK = "COLOCAR_LINK_AQUI";
const FULL_SHOP_LINK = "COLOCAR_LINK_AQUI";

const categories = [
  {
    icon: Sparkles,
    name: "Produtos dos vídeos",
    description: "Veja os produtos que apareceram nos vídeos recentes do TikTok.",
    cta: "Ver produtos dos vídeos",
    link: "COLOCAR_LINK_AQUI",
    featured: true,
  },
  {
    icon: Projector,
    name: "Projetores para cinema em casa",
    description: "Mini projetores, acessórios e opções para assistir filmes, séries e futebol.",
    cta: "Ver projetores",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Headphones,
    name: "Fones Bluetooth",
    description: "Fones sem fio, modelos custo-benefício e achadinhos para o dia a dia.",
    cta: "Ver fones",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Tablet,
    name: "Tablets em oferta",
    description: "Tablets para estudo, vídeos, trabalho e uso diário.",
    cta: "Ver tablets",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Smartphone,
    name: "Celulares e acessórios",
    description: "Smartphones, capas, carregadores e itens úteis para celular.",
    cta: "Ver celulares",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Tv,
    name: "Smart TVs e telas",
    description: "Ofertas em TVs, telas e produtos para entretenimento em casa.",
    cta: "Ver Smart TVs",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Home,
    name: "Casa e conforto",
    description: "Itens para deixar sua casa mais prática, bonita e confortável.",
    cta: "Ver casa e conforto",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Microwave,
    name: "Eletros para casa",
    description: "Fogões, eletrodomésticos e produtos úteis para cozinha e casa.",
    cta: "Ver eletros",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Tag,
    name: "Ofertas até R$100",
    description: "Achadinhos baratos para comprar sem pensar muito.",
    cta: "Ver ofertas baratas",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Flame,
    name: "Mais vendidos da semana",
    description: "Produtos com maior procura e boas chances de promoção.",
    cta: "Ver mais vendidos",
    link: "COLOCAR_LINK_AQUI",
  },
];

const highlights = [
  {
    icon: Projector,
    title: "Projetores em alta",
    text: "Transforme qualquer parede em uma tela para filmes, séries e futebol.",
    cta: "Ver projetores",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Headphones,
    title: "Fones Bluetooth",
    text: "Achadinhos para usar no trabalho, academia, estudos e no dia a dia.",
    cta: "Ver fones",
    link: "COLOCAR_LINK_AQUI",
  },
  {
    icon: Flame,
    title: "Produtos virais do TikTok",
    text: "Itens que chamaram atenção nos vídeos e podem acabar rápido.",
    cta: "Ver produtos virais",
    link: "COLOCAR_LINK_AQUI",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* HERO */}
      <header
        className="relative overflow-hidden text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-shopee blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-brand-blue blur-3xl" />
        </div>

        <nav className="relative z-10 max-w-6xl mx-auto px-5 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
              style={{ background: "var(--gradient-shopee)" }}
            >
              T
            </div>
            <span className="font-bold text-lg tracking-tight">Techno Cheap</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
            <ShoppingBag size={14} /> Achadinhos da Shopee
          </span>
        </nav>

        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-12 pb-16 md:pt-20 md:pb-24 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 mb-5">
            <Sparkles size={14} className="text-shopee" />
            Tudo que você precisa em um só lugar
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Achadinhos <span className="text-shopee">Techno Cheap</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            Produtos em oferta direto da Shopee, separados por categoria para você
            encontrar rápido o que apareceu no TikTok.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={MAIN_VIDEO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-base text-shopee-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "var(--gradient-shopee)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <ShoppingBag size={20} />
              Ver produto do vídeo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-xs text-white/60 max-w-xs">
              Os preços e estoques podem mudar dentro da Shopee. Confira antes de comprar.
            </p>
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Escolha uma categoria
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Clique na categoria que você quer ver e acesse as ofertas direto na Shopee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.name}
                href={cat.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col p-5 rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 ${
                  cat.featured
                    ? "border-shopee/40 ring-2 ring-shopee/20"
                    : "border-border"
                }`}
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                {cat.featured && (
                  <span className="absolute -top-2 right-4 text-[10px] font-bold uppercase tracking-wider bg-shopee text-shopee-foreground px-2 py-1 rounded-md">
                    Em alta
                  </span>
                )}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: cat.featured
                      ? "var(--gradient-shopee)"
                      : "linear-gradient(135deg, var(--brand-blue-deep), var(--brand-blue))",
                  }}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground leading-tight">
                  {cat.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed flex-1">
                  {cat.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 font-semibold text-sm text-primary group-hover:gap-2.5 transition-all">
                  {cat.cta}
                  <ArrowRight size={16} />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="bg-secondary/50 py-14 md:py-20 border-y border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-shopee mb-2">
              <Flame size={14} /> Não perca
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Destaques da semana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className="group flex flex-col p-6 rounded-2xl bg-card border border-border transition-all hover:-translate-y-1"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "var(--gradient-shopee)" }}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-black text-xl text-foreground">{h.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {h.text}
                  </p>
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-bold text-sm text-shopee-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "var(--gradient-shopee)" }}
                  >
                    {h.cta}
                    <ArrowRight size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-5 py-14 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Como funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: MousePointerClick, title: "1. Escolha", text: "Você escolhe uma categoria." },
            { icon: ArrowRight, title: "2. Acesse", text: "O botão leva direto para a Shopee." },
            { icon: Truck, title: "3. Confira", text: "Confira preço, frete e estoque dentro da Shopee." },
            { icon: ShieldCheck, title: "4. Compre", text: "Finaliza a compra com segurança pela própria Shopee." },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex gap-4 p-5 rounded-2xl bg-card border border-border"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-muted border border-border">
          <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Aviso:</strong> esta página pode conter
            links de afiliado. Ao comprar por eles, posso receber uma comissão, sem custo
            extra para você.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-16 md:pb-24">
        <div
          className="max-w-4xl mx-auto rounded-3xl px-6 py-12 md:py-16 text-center text-white overflow-hidden relative"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-shopee blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Não encontrou o que procurava?
            </h2>
            <p className="mt-4 text-white/80 max-w-md mx-auto">
              Acesse a vitrine completa da Techno Cheap na Shopee e veja todos os produtos selecionados.
            </p>
            <a
              href={FULL_SHOP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-5 rounded-2xl font-bold text-base text-shopee-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "var(--gradient-shopee)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <ShoppingBag size={20} />
              Ver todos os achadinhos
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-sm"
            style={{ background: "var(--gradient-shopee)" }}
          >
            T
          </div>
          <span className="font-bold text-foreground">Techno Cheap</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tudo que você precisa em um só lugar · Achadinhos da Shopee
        </p>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-background/95 backdrop-blur-lg border-t border-border">
        <a
          href={MAIN_VIDEO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-bold text-base text-shopee-foreground active:scale-[0.98] transition-transform"
          style={{
            background: "var(--gradient-shopee)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <ShoppingBag size={20} />
          Ver produto do vídeo
        </a>
      </div>
    </div>
  );
}
