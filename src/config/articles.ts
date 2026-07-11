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
 *  - { type: "image", url: "...", alt: "..." }  → imagem solta no meio do texto
 *  - { type: "cta", ... }                       → caixa de destaque com
 *                                                  botão de link de afiliado,
 *                                                  cupom, e opcionalmente
 *                                                  uma foto do produto (campo
 *                                                  `image`) — veja exemplo
 *                                                  no artigo de amostra
 * ============================================================ */

import { ICONS, STORES, validateLink, LINK_PLACEHOLDER, type IconName, type StoreId } from "./categories";
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
      type: "image";
      /** URL direta da imagem (ex: imagem do produto na página da loja) */
      url: string;
      /** Texto alternativo — obrigatório por acessibilidade e SEO */
      alt: string;
      /** Legenda opcional exibida abaixo da imagem */
      caption?: string;
    }
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
      /** URL direta da imagem do produto (opcional) */
      image?: string;
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
    type: z.literal("image"),
    url: z.string().url("URL da imagem inválida"),
    alt: z.string().min(1, "toda imagem precisa de um texto alternativo (alt)"),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("cta"),
    title: z.string().min(1),
    text: z.string().min(1),
    buttonLabel: z.string().min(1),
    store: z.enum(Object.keys(STORES) as [StoreId, ...StoreId[]]),
    link: z.string().min(1),
    couponCode: z.string().optional(),
    image: z.string().url("URL da imagem inválida").optional(),
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
  {
    slug: "melhores-smartphones-em-alta-agora",
    title: "Melhores smartphones em alta agora: quais valem a pena",
    description:
      "Os intermediários dominaram as vendas em 2026. Veja quais modelos estão mais procurados agora e para qual perfil de uso cada um faz sentido.",
    category: "comparativo",
    coverIcon: "Smartphone",
    publishedAt: "2026-07-10",
    tags: ["smartphone", "celular", "comparativo"],
    readTimeMinutes: 8,
    relatedCategoryIds: ["celulares"],
    content: [
      {
        type: "paragraph",
        text: "Quem olha só pro topo de linha pode se surpreender: os celulares que mais vendem no Brasil em 2026 não são os mais caros. A maioria dos compradores está priorizando modelos intermediários que entregam tela boa, bateria que dura o dia inteiro e câmera decente, sem pagar o preço de um topo de linha. Reunimos os modelos que estão em alta agora, organizados por perfil de uso.",
      },
      {
        type: "heading",
        text: "Por que os intermediários estão dominando",
      },
      {
        type: "paragraph",
        text: "O comportamento do consumidor brasileiro mudou: em vez de esticar o orçamento para um topo de linha, a maioria busca o melhor equilíbrio entre preço e recursos do dia a dia — tela AMOLED, boa taxa de atualização, câmera versátil e bateria de longa duração. Isso empurrou modelos como a linha Galaxy A da Samsung e os intermediários da Motorola para o topo dos rankings de venda, na frente até de alguns topo de linha mais antigos.",
      },
      {
        type: "heading",
        text: "Melhor custo-benefício: Moto G86",
      },
      {
        type: "paragraph",
        text: "O Moto G86 chegou ao Brasil com preço salgado, mas passou a valer muito mais a pena depois das primeiras quedas de preço nos marketplaces. Tem acabamento acima do que se espera nessa faixa, tela AMOLED de 120Hz com tecnologia LTPO (que economiza bateria em telas paradas), certificação IP68 contra água e poeira, e uma câmera com zoom óptico de 3x — recurso raro em intermediários. O carregamento ficou mais lento que o da geração anterior, mas isso não compromete a experiência geral.",
      },
      {
        type: "cta",
        title: "Moto G86",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/2NHfQNn",
      },
      {
        type: "heading",
        text: "Mais equilibrado: Galaxy A36 5G",
      },
      {
        type: "paragraph",
        text: "Sem tentar ser o mais potente da categoria, o Galaxy A36 5G segue como um dos intermediários mais fáceis de recomendar. Entrega o que a maioria das pessoas realmente usa no dia a dia — desempenho estável, boa tela e suporte de longo prazo da Samsung — sem os exageros (e o preço) de modelos mais avançados.",
      },
      {
        type: "cta",
        title: "Galaxy A36 5G",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/1qUHEQh",
      },
      {
        type: "heading",
        text: "Mais vendido do momento: Galaxy A56 5G",
      },
      {
        type: "paragraph",
        text: "Aparece no topo de praticamente todos os rankings de vendas do ano. A tela de 6,7 polegadas com 120Hz de taxa de atualização e brilho alto é um dos pontos fortes, junto com a câmera principal de 50MP com estabilização óptica. A bateria de 5.000mAh aguenta tranquilamente um dia inteiro de uso intenso.",
      },
      {
        type: "cta",
        title: "Galaxy A56 5G",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/23ckBzM",
      },
      {
        type: "heading",
        text: "Mais desempenho pelo preço: linha Poco",
      },
      {
        type: "paragraph",
        text: "Para quem joga no celular ou roda apps pesados, os modelos da linha Poco continuam entre os mais procurados por entregarem desempenho de processador acima da média da faixa de preço — às vezes competindo com intermediários bem mais caros. A troca costuma ser em câmera e acabamento, não em potência.",
      },
      {
        type: "cta",
        title: "Linha Poco",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/1Hmp1Lx",
      },
      {
        type: "heading",
        text: "Entrada que não decepciona: Galaxy A17",
      },
      {
        type: "paragraph",
        text: "Na faixa de entrada é onde mais aparece celular que parece um bom negócio no anúncio e decepciona no uso — o Galaxy A17 é uma das exceções. Não tem os recursos dos modelos acima, mas entrega uma experiência estável para quem quer só um celular confiável para o dia a dia, sem travamentos constantes.",
      },
      {
        type: "cta",
        title: "Galaxy A17",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/2p3EfS6",
      },
      {
        type: "heading",
        text: "Como escolher entre eles",
      },
      {
        type: "list",
        items: [
          "Bateria: priorize modelos com 5.000mAh ou mais se você usa o celular o dia inteiro fora de casa",
          "Tela: 120Hz faz diferença perceptível na rolagem e nos jogos — vale mais que ganhar alguns MP a mais na câmera",
          "Armazenamento: 128GB é o mínimo confortável hoje; 256GB evita dor de cabeça no futuro",
          "Atualização de software: marcas como Samsung costumam garantir mais anos de atualização — importante para quem troca de celular com menos frequência",
        ],
      },
      {
        type: "paragraph",
        text: "No fim, o melhor smartphone não é necessariamente o mais caro da lista — é o que combina com o seu uso real. Se você grava muito vídeo, priorize câmera e estabilização; se joga bastante, foque em processador; se é o uso do dia a dia, bateria e tela pesam mais que qualquer especificação técnica isolada.",
      },
    ],
  },
  {
    slug: "produtos-gamer-mais-procurados-da-semana",
    title: "Produtos gamer mais procurados da semana: mouse, headset e monitor",
    description:
      "Os periféricos gamer mais buscados agora, com opções pra todo orçamento — do mouse de R$ 35 ao monitor 180Hz que virou o queridinho do custo-benefício.",
    category: "comparativo",
    coverIcon: "Sparkles",
    publishedAt: "2026-07-11",
    tags: ["gamer", "mouse", "headset", "monitor", "setup"],
    readTimeMinutes: 9,
    relatedCategoryIds: [],
    content: [
      {
        type: "paragraph",
        text: "Montar ou dar um upgrade no setup gamer não precisa custar caro. Reunimos os mouses, headsets e monitores mais procurados no momento, organizados por faixa de investimento — do básico funcional ao topo de linha, pra você escolher só o que realmente vai sentir diferença no jogo.",
      },
      {
        type: "heading",
        text: "Mouse gamer",
      },
      {
        type: "paragraph",
        text: "Na faixa de entrada, o Havit MS1003 (ou variantes como o HV-MS1001) segue como a porta de entrada mais popular: sensor óptico com DPI ajustável, botões programáveis e iluminação RGB por um preço bem baixo — só não espera software de configuração avançado. Um degrau acima, o Redragon Cobra M711 é um dos mouses mais vendidos do Brasil nessa faixa, com RGB customizável e boa relação de recursos pelo preço.",
      },
      {
        type: "cta",
        title: "Redragon Cobra M711",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "shopee",
        link: LINK_PLACEHOLDER,
      },
      {
        type: "paragraph",
        text: "Para quem já quer sentir diferença de desempenho de verdade, o Logitech G203 Prodigy segue como referência de custo-benefício: sensor de até 8.000 DPI, 6 botões programáveis e construção confiável — um mouse que atende tanto jogos quanto uso do dia a dia. Se o orçamento permitir esticar mais, o Logitech G Pro X Superlight (sem fio, 63g, sensor HERO 25K) é o queridinho de quem joga competitivo e sente cada grama do mouse na mão.",
      },
      {
        type: "cta",
        title: "Logitech G203 Prodigy",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "shopee",
        link: LINK_PLACEHOLDER,
      },
      {
        type: "heading",
        text: "Headset gamer",
      },
      {
        type: "paragraph",
        text: "O Onikuma X32 aparece com frequência entre os mais bem avaliados da faixa de entrada: drivers de 50mm para grave mais presente, almofadas confortáveis para sessões longas e microfone flexível com cancelamento de ruído — tudo isso girando em torno de R$ 130, com nota alta de avaliação nos marketplaces.",
      },
      {
        type: "cta",
        title: "Onikuma X32",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: LINK_PLACEHOLDER,
      },
      {
        type: "paragraph",
        text: "Vale reforçar um ponto na hora de escolher headset: drivers grandes (40-50mm) costumam dar mais grave e presença sonora, mas o que realmente separa um bom headset de um ruim pra quem joga em squad é a qualidade do microfone — cancelamento de ruído decente evita que o time reclame do barulho do teclado durante a partida.",
      },
      {
        type: "heading",
        text: "Monitor gamer",
      },
      {
        type: "paragraph",
        text: "Aqui está um dos upgrades que mais valem a pena: sair de 60Hz para 144Hz ou 180Hz muda a sensação de fluidez do jogo de forma perceptível nos primeiros minutos de uso, sem precisar de um PC muito mais forte para sentir a diferença. O LG UltraGear 24GS60F-B é hoje uma das referências de custo-benefício: painel IPS Full HD de 24 polegadas, 180Hz, 1ms de resposta e compatibilidade com FreeSync e G-Sync — ótimo tanto para jogos competitivos quanto para uso misto com trabalho.",
      },
      {
        type: "cta",
        title: "LG UltraGear 24GS60F-B",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "shopee",
        link: LINK_PLACEHOLDER,
      },
      {
        type: "paragraph",
        text: "Para quem prefere painel VA (contraste mais profundo, bom em cenas escuras) em vez de IPS, o Samsung Odyssey G30 se destaca pela base totalmente ajustável — altura, inclinação, giro e até modo retrato, recurso raro nessa faixa de preço — mantendo 144Hz e boa resposta para jogos competitivos.",
      },
      {
        type: "cta",
        title: "Samsung Odyssey G30",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: LINK_PLACEHOLDER,
      },
      {
        type: "heading",
        text: "Como priorizar o orçamento",
      },
      {
        type: "list",
        items: [
          "Se só dá pra trocar uma coisa agora, o monitor costuma trazer o ganho mais perceptível — sair de 60Hz pra 144Hz+ muda a sensação de jogo inteira",
          "Mouse: DPI alto só importa se você realmente ajusta sensibilidade por jogo; pra maioria, 6-8 botões programáveis e peso equilibrado pesam mais no dia a dia",
          "Headset: priorize conforto pra sessões longas e qualidade do microfone antes de brilho ou RGB",
          "Painel IPS x VA: IPS entrega cor mais fiel e ângulo de visão melhor; VA ganha em contraste e cenas escuras — não tem errado, é sobre o que você joga mais",
        ],
      },
      {
        type: "paragraph",
        text: "Preços e estoque de periféricos gamer mudam bastante de semana pra semana nos marketplaces — vale sempre conferir o preço atual antes de fechar a compra, mesmo em modelos que já são conhecidos como boa pedida.",
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
