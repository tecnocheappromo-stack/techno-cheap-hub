/* ============================================================
 *  ARTIGOS DO BLOG — TECHNO CHEAP
 * ============================================================
 *  Este arquivo é o "banco de dados" dos artigos do site.
 *  Cada artigo é um objeto dentro do array ARTICLES, no final
 *  deste arquivo.
 *
 *  ----------------------------------------------------------
 *  COMO ADICIONAR UM ARTIGO NOVO
 *  ----------------------------------------------------------
 *  1. Copie um dos artigos existentes lá embaixo (do `{` até o `}`).
 *  2. Cole antes do `];` final.
 *  3. Troque `slug` (único, sem espaço, tudo minúsculo), `title`,
 *     `description`, `category`, `coverIcon`, `publishedAt` e
 *     o conteúdo em `content`.
 *  4. Salve — o artigo aparece automaticamente em /artigos.
 *
 *  ----------------------------------------------------------
 *  TIPOS DE BLOCO DE CONTEÚDO (dentro de `content`)
 *  ----------------------------------------------------------
 *  - { type: "paragraph", text: "..." }         → parágrafo normal
 *  - { type: "heading", text: "..." }           → subtítulo (H2)
 *  - { type: "list", items: ["...", "..."] }    → lista com marcadores
 *  - { type: "quote", text: "..." }             → citação em destaque
 *  - { type: "cta", ... }                       → caixa de destaque com
 *                                                  botão de link de afiliado
 *                                                  ou cupom (veja exemplo
 *                                                  no artigo de amostra)
 * ============================================================ */

import { ICONS, STORES, validateLink, type IconName, type StoreId } from "./categories";
import { z } from "zod";

/* ============================================================
 *  CATEGORIAS DE ARTIGO
 * ============================================================ */
export type ArticleCategory = "review" | "comparativo" | "guia" | "noticia";

export const ARTICLE_CATEGORIES: Record<
  ArticleCategory,
  { label: string; badgeClass: string }
> = {
  review: { label: "Review", badgeClass: "bg-brand-blue/15 text-brand-blue" },
  comparativo: { label: "Comparativo", badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  guia: { label: "Guia", badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  noticia: { label: "Notícia", badgeClass: "bg-shopee/15 text-shopee" },
};

/* ============================================================
 *  BLOCOS DE CONTEÚDO
 * ============================================================ */
export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | {
      type: "cta";
      /** Título curto da caixa de destaque, ex: "Cupom exclusivo" */
      title: string;
      /** Texto de apoio, ex: "10% OFF em fones Bluetooth até domingo" */
      text: string;
      /** Texto do botão, ex: "Ver oferta" */
      buttonLabel: string;
      /** Loja de destino — controla a validação do link e a cor do botão */
      store: StoreId;
      /** Link de afiliado (ou COLOCAR_LINK_AQUI enquanto não tiver o link) */
      link: string;
      /** Código do cupom, se houver (opcional) */
      couponCode?: string;
    };

/* ============================================================
 *  ARTIGO
 * ============================================================ */
const articleBlockSchema: z.ZodType<ArticleBlock> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({ type: z.literal("heading"), text: z.string().min(1) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1) }),
  z.object({
    type: z.literal("cta"),
    title: z.string().min(1),
    text: z.string().min(1),
    buttonLabel: z.string().min(1),
    store: z.enum(Object.keys(STORES) as [StoreId, ...StoreId[]]),
    link: z.string().min(1),
    couponCode: z.string().optional(),
  }),
]);

export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "slug deve ser minúsculo, sem espaços (use - para separar)"),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(200),
  category: z.enum(["review", "comparativo", "guia", "noticia"]),
  coverIcon: z.enum(Object.keys(ICONS) as [IconName, ...IconName[]]),
  /** formato AAAA-MM-DD */
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use o formato AAAA-MM-DD"),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tags: z.array(z.string()).default([]),
  readTimeMinutes: z.number().int().min(1).max(60),
  /** ids de categorias do hub (categories.ts) relacionadas a este artigo */
  relatedCategoryIds: z.array(z.string()).default([]),
  content: z.array(articleBlockSchema).min(1),
});

export type Article = z.infer<typeof articleSchema>;

/* ============================================================
 *  ARTIGOS
 * ============================================================
 *  O artigo abaixo é um EXEMPLO/MODELO — mostra os tipos de bloco
 *  disponíveis. Pode editar à vontade ou apagar quando escrever
 *  os artigos de verdade.
 * ============================================================ */
export const ARTICLES: Article[] = [
  {
    slug: "como-escolher-mini-projetor-2026",
    title: "Como escolher um mini projetor em 2026: guia completo",
    description:
      "Lumens, resolução, conectividade e preço: o que realmente importa na hora de comprar um mini projetor para assistir filmes e séries em casa.",
    category: "guia",
    coverIcon: "Projector",
    publishedAt: "2026-07-10",
    tags: ["projetor", "casa", "entretenimento"],
    readTimeMinutes: 6,
    relatedCategoryIds: ["projetores"],
    content: [
      {
        type: "paragraph",
        text: "Mini projetores viraram um dos itens mais procurados por quem quer transformar qualquer parede em uma telona, sem gastar o preço de uma Smart TV grande. Mas nem todo projetor barato entrega uma boa experiência — e é fácil se perder entre termos técnicos como lumens, ANSI e resolução nativa.",
      },
      {
        type: "heading",
        text: "1. Lumens: o número que mais engana",
      },
      {
        type: "paragraph",
        text: "Muitos anúncios usam números de lumens muito altos que não refletem o brilho real do aparelho. Na prática, para uma sala com luz controlada à noite, algo entre 200 e 400 lumens ANSI já entrega uma imagem nítida. Para usar durante o dia, é melhor buscar acima de 500 lumens ANSI.",
      },
      {
        type: "heading",
        text: "2. Resolução nativa vs. resolução suportada",
      },
      {
        type: "paragraph",
        text: "Um projetor pode 'suportar' 4K mas ter resolução nativa de 720p — ou seja, ele recebe o sinal em 4K mas projeta em uma qualidade bem inferior. Para textos legíveis e imagem nítida em telas de até 100 polegadas, resolução nativa 1080p é o ponto ideal de custo-benefício hoje.",
      },
      {
        type: "list",
        items: [
          "Conectividade: prefira modelos com Wi-Fi e Bluetooth nativos, para espelhar tela do celular sem cabo",
          "Correção trapezoidal automática: evita ter que ajustar o ângulo manualmente toda vez",
          "Ruído do ventilador: projetores muito baratos costumam ser barulhentos — vale conferir avaliações sobre isso",
          "Distância de projeção: confirme o tamanho de imagem no ambiente onde você vai usar",
        ],
      },
      {
        type: "quote",
        text: "Regra prática: para uso noturno casual em sala pequena, o custo-benefício está nos modelos com 1080p nativo e 300+ lumens ANSI.",
      },
      {
        type: "cta",
        title: "Separamos os melhores projetores em oferta",
        text: "Categoria atualizada toda semana com os projetores mais bem avaliados dentro do orçamento.",
        buttonLabel: "Ver projetores em oferta",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3760310?view=storefront",
      },
    ],
  },
];

/* ============================================================
 *  Helpers — não precisa editar.
 * ============================================================ */
export function getArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return getArticles().filter((a) => a.category === category);
}

export type ArticleIssue = { slug: string; field: string; message: string };

/** Roda validateLink em todos os CTAs de todos os artigos — útil pro admin panel futuramente. */
export function validateArticles(): ArticleIssue[] {
  const issues: ArticleIssue[] = [];
  for (const article of ARTICLES) {
    const parsed = articleSchema.safeParse(article);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({ slug: article.slug, field: issue.path.join("."), message: issue.message });
      }
    }
    for (const block of article.content) {
      if (block.type === "cta") {
        const r = validateLink(block.link, block.store);
        if (r.status === "invalid") {
          issues.push({ slug: article.slug, field: "cta.link", message: r.message });
        }
      }
    }
  }
  return issues;
}
