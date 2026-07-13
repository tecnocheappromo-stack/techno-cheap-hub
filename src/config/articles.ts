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
        image: "https://images.kabum.com.br/produtos/fotos/magalu/881112/medium/MOTOROLA-G86-5G-256GB_1748633773.jpg",
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
        image: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/734633/medium/Smartphone-Samsung-Galaxy-A36-128GB-5g-Preto-C-mera-Tripla-50mp-Ram-6gb-Tela-6-7-_1781278742.jpg",
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
        image: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/734571/medium/Smartphone-Samsung-Galaxy-A56-128GB-Preto-5g-C-mera-Tripla-50mp-Ram-8GB-Tela-6-7-_1777055936.jpg",
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
        image: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/716544/medium/Smartphone-Xiaomi-Poco-X7-Pro-256gb-12gb-Ram-5g-Vers-o-Global-Nfc_1765458539.jpg",
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
        image: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/924194/medium/Smartphone-Samsung-Galaxy-A17-5g-Com-Ia-256GB-8GB-RAM-C-m-De-50mp-Tela-De-6-7-NFC-Ip54-Preto_1770927225.jpg",
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
        title: "Havit MS1003",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/1PWa51W",
        image: "https://img.terabyteshop.com.br/produto/g/mouse-gamer-havit-ms1003-rgb-4-botoes-2400-dpi-preto_66716.jpg",
      },
      {
        type: "cta",
        title: "Redragon Cobra M711",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "https://meli.la/16s1NiX",
        image: "https://img.terabyteshop.com.br/produto/m/mouse-gamer-redragon-cobra-v2-rgb-12400-dpi-8-botoes-programaveis-black-m711-v2_193873.jpg",
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
        link: "https://s.shopee.com.br/7KvIv30nuT",
        image: "https://img.terabyteshop.com.br/produto/m/mouse-logitech-gamer-prodigy-g203-6-botoes-6000-dpi-preto_37772.png",
      },
      {
        type: "cta",
        title: "Logitech G Pro X Superlight",
        text: "Confira o preço atual e a disponibilidade.",
        buttonLabel: "Ver oferta",
        store: "amazon",
        link: "https://link.amazon/B09cpIIoN",
        image: "https://img.terabyteshop.com.br/produto/m/mouse-gamer-logitech-g-pro-x-superlight-sem-fio-25400-dpi-sensor-hero-5-botoes-vermelho-910-006783_234449.jpg",
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
        link: "https://meli.la/1caEgHJ",
        image: "https://images.tcdn.com.br/img/img_prod/670412/headset_gamer_profissional_onikuma_x32_rgb_preto_4715_1_0ea615972ec25a9b33c9e47f34db55d8.jpg",
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
        store: "amazon",
        link: "https://link.amazon/B0eWLthb0",
        image: "https://images.kabum.com.br/produtos/fotos/614879/monitor-gamer-lg-ultragear-24-full-hd-ips-180hz-1ms-displayport-e-hdmi-nvidia-g-sync-amd-freesync-hdr10-srgb-99-24gs60f-b_1722881105_m.jpg",
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
        store: "amazon",
        link: "https://link.amazon/B0bhGXXTL",
        image: "https://images.kabum.com.br/produtos/fotos/magalu/459198/Monitor-Gamer-Samsung-Odyssey-G30-24-Full-HD_1682704439_m.jpg",
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

  /* ============================================================
   *  ARTIGO 4 — 10 produtos de tecnologia mais procurados
   * ============================================================ */
  {
    slug: "10-produtos-tecnologia-mais-procurados",
    title: "Os 10 produtos de tecnologia mais procurados da semana",
    description:
      "Ranking atualizado dos eletrônicos que mais vendem nos marketplaces agora — de fone Bluetooth a mini projetor, passando por SSD e smartwatch.",
    category: "comparativo",
    coverIcon: "Flame",
    publishedAt: "2026-07-13",
    tags: ["ranking", "tecnologia", "mais vendidos", "tendência"],
    readTimeMinutes: 10,
    relatedCategoryIds: ["celulares", "fones", "projetores"],
    content: [
      {
        type: "paragraph",
        text: "Toda semana, milhares de brasileiros pesquisam produtos de tecnologia nos marketplaces sem saber exatamente o que comprar. O resultado é previsível: acabam levando o que aparece mais nos anúncios, nem sempre o que tem melhor custo-benefício. Aqui vai um atalho — os 10 itens mais procurados agora, com contexto sobre por que estão em alta e se realmente valem a pena.",
      },
      {
        type: "heading",
        text: "1. Fone Bluetooth TWS (in-ear sem fio)",
      },
      {
        type: "paragraph",
        text: "Disparado o item de tecnologia mais vendido no Brasil. A faixa de R$ 50 a R$ 150 concentra a maioria das vendas, com modelos chineses que melhoraram muito nos últimos dois anos. O ponto de atenção continua sendo a qualidade do microfone para chamadas — leia nosso guia de fones Bluetooth para não errar na escolha.",
      },
      {
        type: "cta",
        title: "Fones Bluetooth em oferta",
        text: "Veja os modelos mais bem avaliados na categoria.",
        buttonLabel: "Ver fones",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3766799?view=storefront",
      },
      {
        type: "heading",
        text: "2. Carregador portátil (power bank)",
      },
      {
        type: "paragraph",
        text: "Com celulares cada vez mais potentes consumindo mais bateria, o power bank virou item obrigatório na mochila. Os modelos de 10.000mAh com carga rápida (PD/QC) estão entre os mais buscados agora, custando entre R$ 60 e R$ 120.",
      },
      {
        type: "cta",
        title: "Power banks populares",
        text: "Confira os modelos mais vendidos.",
        buttonLabel: "Ver power banks",
        store: "mercadolivre",
        link: "https://meli.la/1DRaGZv",
        image: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/565089/medium/Carregador-Port-til-Power-Bank-Baseus-Bipow-10000mAh-20W-Digital-Display-com-Cabo-Type-C-Preto_1729521613.jpg",
      },
      {
        type: "heading",
        text: "3. Smartwatch / smartband",
      },
      {
        type: "paragraph",
        text: "Relógios inteligentes continuam em alta, puxados pela preocupação com saúde e fitness. A maioria dos compradores não quer um Apple Watch — quer algo na faixa de R$ 100 a R$ 300 que meça frequência cardíaca, conte passos e mostre notificações do celular.",
      },
      {
        type: "heading",
        text: "4. SSD externo / interno",
      },
      {
        type: "paragraph",
        text: "SSDs internos de 480GB já custam menos que um almoço em restaurante bom, e SSDs externos USB-C de 1TB estão abaixo de R$ 300. É o upgrade que mais muda a experiência de quem ainda usa HD mecânico — o computador parece outro. Explicamos melhor as diferenças no nosso artigo sobre power bank, SSD e smartwatch.",
      },
      {
        type: "heading",
        text: "5. Mini projetor",
      },
      {
        type: "paragraph",
        text: "Continua entre os mais desejados, especialmente na faixa de R$ 300 a R$ 800. O apelo é claro: transformar qualquer parede em tela grande sem gastar o preço de uma TV de 55 polegadas. Confira nosso guia completo de projetores para não ser enganado pelos lumens do anúncio.",
      },
      {
        type: "cta",
        title: "Projetores em oferta",
        text: "Categoria atualizada toda semana.",
        buttonLabel: "Ver projetores",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3760310?view=storefront",
      },
      {
        type: "heading",
        text: "6. Smartphone intermediário",
      },
      {
        type: "paragraph",
        text: "Galaxy A36, A56, Moto G86, Poco X7 — os intermediários dominam o volume de vendas no Brasil. Tela AMOLED de 120Hz, bateria de 5.000mAh e câmera decente por um preço que cabe no parcelamento. Veja nosso comparativo detalhado de smartphones.",
      },
      {
        type: "heading",
        text: "7. Carregador GaN",
      },
      {
        type: "paragraph",
        text: "Carregadores de nitreto de gálio são menores, mais leves e geram menos calor que os de silício — e o preço caiu bastante. Os modelos de 65W com duas portas USB-C são os mais procurados por quem quer carregar notebook e celular com o mesmo carregador. Veja se vale a pena no nosso guia de carregadores GaN.",
      },
      {
        type: "heading",
        text: "8. Tablet para estudo e vídeos",
      },
      {
        type: "paragraph",
        text: "Tablets voltaram a crescer, puxados por quem estuda online e por quem quer uma tela maior que o celular para assistir vídeos. A faixa de R$ 500 a R$ 1.500 concentra os modelos mais vendidos, com destaque para tablets Android com tela de 10 a 11 polegadas.",
      },
      {
        type: "cta",
        title: "Tablets em oferta",
        text: "Modelos para estudo, vídeos e trabalho.",
        buttonLabel: "Ver tablets",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3841978?view=storefront",
      },
      {
        type: "heading",
        text: "9. Capinha e película de celular",
      },
      {
        type: "paragraph",
        text: "Parece básico, mas acessórios de proteção estão sempre entre os itens mais vendidos — todo celular novo precisa de capa e película. As capas com MagSafe e películas de vidro temperado premium são as que mais crescem em busca agora.",
      },
      {
        type: "heading",
        text: "10. Câmera de segurança Wi-Fi",
      },
      {
        type: "paragraph",
        text: "Câmeras IP de segurança baratas (R$ 50–R$ 200) viraram um dos itens de tecnologia residencial mais vendidos. Modelos com visão noturna, áudio bidirecional e gravação em nuvem/cartão dominam as vendas.",
      },
      {
        type: "cta",
        title: "Itens para casa inteligente",
        text: "Câmeras, lâmpadas e automação em oferta.",
        buttonLabel: "Ver itens para casa",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3766803?view=storefront",
      },
      {
        type: "heading",
        text: "Como usar esse ranking",
      },
      {
        type: "list",
        items: [
          "Produto popular não é sinônimo de produto bom — confira avaliações reais antes de comprar",
          "Compare preços entre Shopee e Mercado Livre; o mesmo produto pode ter diferença de 20-30%",
          "Se o preço está muito abaixo da média, desconfie — pode ser versão inferior ou vendedor sem reputação",
          "Fique de olho nas nossas categorias atualizadas para encontrar as melhores ofertas de cada item",
        ],
      },
    ],
  },

  /* ============================================================
   *  ARTIGO 5 — Fones Bluetooth que estão bombando
   * ============================================================ */
  {
    slug: "fones-bluetooth-bombando",
    title: "Fones Bluetooth que estão bombando: qual escolher",
    description:
      "TWS, over-ear, neckband: os fones sem fio mais vendidos agora no Brasil, comparados por qualidade de som, bateria, microfone e preço.",
    category: "comparativo",
    coverIcon: "Headphones",
    publishedAt: "2026-07-14",
    tags: ["fone", "bluetooth", "TWS", "áudio", "comparativo"],
    readTimeMinutes: 8,
    relatedCategoryIds: ["fones"],
    content: [
      {
        type: "paragraph",
        text: "O mercado de fones Bluetooth no Brasil explodiu nos últimos anos. Hoje, dá pra comprar um fone sem fio decente por menos de R$ 100 — mas a quantidade de opções também aumentou o risco de levar gato por lebre. Neste guia, separamos os modelos que estão realmente bombando nas vendas e nas avaliações, organizados por tipo e faixa de preço.",
      },
      {
        type: "heading",
        text: "TWS (in-ear sem fio): o formato mais popular",
      },
      {
        type: "paragraph",
        text: "Fones TWS (True Wireless Stereo) são os que vêm no estojinho de carga, sem nenhum fio entre si. São os mais vendidos no Brasil por serem compactos e práticos no dia a dia. Na faixa de R$ 50 a R$ 100, modelos como o QCY T13 e o Haylou GT7 Neo oferecem som razoável e bateria de 5+ horas por carga. Acima de R$ 150, o salto de qualidade é perceptível — cancelamento de ruído ativo (ANC) começa a aparecer, e a qualidade do microfone melhora bastante.",
      },
      {
        type: "cta",
        title: "QCY T13",
        text: "Um dos TWS mais vendidos do Brasil — som equilibrado, bateria longa e preço baixo.",
        buttonLabel: "Ver oferta",
        store: "shopee",
        link: "https://s.shopee.com.br/9pPwjxCBQi",
        image: "https://img.terabyteshop.com.br/produto/m/fone-de-ouvido-sem-fio-qcy-t13-tws-bluetooth-5-1-branco_170629.jpg",
      },
      {
        type: "heading",
        text: "Over-ear (sobre a orelha): conforto e isolamento",
      },
      {
        type: "paragraph",
        text: "Fones over-ear são maiores e cobrem a orelha inteira — são a melhor opção para quem trabalha em ambientes barulhentos, joga por horas seguidas ou simplesmente quer a melhor qualidade de som possível na faixa de preço. O isolamento passivo já é bom, e com ANC ativo fica melhor ainda. Modelos como o Edifier W820NB Plus oferecem ANC de boa qualidade, conforto para uso prolongado e até 49 horas de bateria — tudo isso por volta de R$ 300.",
      },
      {
        type: "cta",
        title: "Edifier W820NB Plus",
        text: "Over-ear com ANC, 49h de bateria e codec LDAC.",
        buttonLabel: "Ver oferta",
        store: "mercadolivre",
        link: "COLOCAR_LINK_AQUI",
        image: "https://images.kabum.com.br/produtos/fotos/510655/headphone-bluetooth-edifier-w820nb-plus-cancelamento-de-ruido-ativo-bluetooth-5-2-preto-w820nb-plus-bk_1705693994_m.jpg",
      },
      {
        type: "heading",
        text: "Neckband (colar): o queridinho de quem malha",
      },
      {
        type: "paragraph",
        text: "Fones com fio entre as cápsulas e apoio no pescoço continuam populares entre quem pratica exercícios — são mais difíceis de cair durante atividade física e costumam ter bateria maior que os TWS (10-15h). Na faixa de R$ 60 a R$ 120, modelos como o Baseus Bowie P1 e o QCY AilyBuds Neckband são boas opções.",
      },
      {
        type: "heading",
        text: "O que realmente importa na hora de escolher",
      },
      {
        type: "list",
        items: [
          "Qualidade do microfone: se você faz ligações ou reuniões, esse é o ponto mais importante — e o que os anúncios menos mostram. Confira avaliações de quem usa em chamadas",
          "ANC (cancelamento de ruído): vale a pena em ambientes barulhentos, mas fones baratos com ANC ruim são piores que fones sem ANC — o processamento pode distorcer o áudio",
          "Codec de áudio: AAC é o padrão, aptX e LDAC entregam qualidade superior mas precisam que o celular também suporte",
          "Bateria: para TWS, acima de 5h por carga é bom; para over-ear, acima de 30h é excelente",
          "IP rating: se vai usar no treino, procure pelo menos IPX4 (resistente a suor e respingos)",
        ],
      },
      {
        type: "quote",
        text: "Dica: fone caro nem sempre é fone bom. Muitas marcas cobram mais pelo nome do que pela qualidade real do áudio. Foque nas avaliações de quem já usa no dia a dia, não nas especificações do anúncio.",
      },
      {
        type: "cta",
        title: "Todos os fones em oferta",
        text: "Categoria atualizada com os modelos mais bem avaliados.",
        buttonLabel: "Ver fones Bluetooth",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3766799?view=storefront",
      },
      {
        type: "paragraph",
        text: "Se você também está montando um setup gamer e precisa de headset com bom microfone, confira nosso artigo sobre os produtos gamer mais procurados da semana — tem recomendações específicas para quem joga em squad.",
      },
    ],
  },

  /* ============================================================
   *  ARTIGO 6 — Power bank, SSD ou smartwatch
   * ============================================================ */
  {
    slug: "power-bank-ssd-smartwatch-o-que-vale-mais",
    title: "Power bank, SSD ou smartwatch: o que vale mais a pena",
    description:
      "Se você tem R$ 100–300 pra gastar em tecnologia, qual desses três itens faz mais diferença no dia a dia? Comparamos utilidade, preço e perfil de uso.",
    category: "comparativo",
    coverIcon: "Star",
    publishedAt: "2026-07-15",
    tags: ["power bank", "SSD", "smartwatch", "custo-benefício"],
    readTimeMinutes: 7,
    relatedCategoryIds: ["celulares"],
    content: [
      {
        type: "paragraph",
        text: "Power bank, SSD e smartwatch são três dos itens de tecnologia mais procurados no Brasil — e os três cabem na mesma faixa de preço (R$ 100 a R$ 300). Se você só pode comprar um agora, qual faz mais diferença? A resposta depende muito do seu dia a dia, mas vamos ser objetivos.",
      },
      {
        type: "heading",
        text: "Power bank: pra quem fica sem bateria todo dia",
      },
      {
        type: "paragraph",
        text: "Se você sai de casa cedo e chega tarde, usa o celular pra trabalho, transporte e entretenimento, e não tem onde carregar durante o dia, o power bank é o item que mais vai mudar sua rotina. Um modelo de 10.000mAh carrega a maioria dos celulares pelo menos 1,5 vez. Os melhores custo-benefício agora estão na faixa de R$ 70 a R$ 150, com suporte a carga rápida (PD 20W+).",
      },
      {
        type: "list",
        items: [
          "Priorize modelos com carga rápida PD ou QC — recarregar o power bank lento é a maior reclamação dos compradores",
          "10.000mAh é suficiente para a maioria; 20.000mAh vale se você viaja muito ou precisa carregar dois aparelhos",
          "Evite modelos sem marca ou com capacidade 'inflada' (30.000mAh por R$ 40 não existe de verdade)",
        ],
      },
      {
        type: "cta",
        title: "Power banks em oferta",
        text: "Modelos com carga rápida e boa capacidade.",
        buttonLabel: "Ver power banks",
        store: "mercadolivre",
        link: "https://meli.la/1DRaGZv",
        image: "https://images.kabum.com.br/produtos/fotos/sync_mirakl/565089/medium/Carregador-Port-til-Power-Bank-Baseus-Bipow-10000mAh-20W-Digital-Display-com-Cabo-Type-C-Preto_1729521613.jpg",
      },
      {
        type: "heading",
        text: "SSD: pra quem tem um computador lento",
      },
      {
        type: "paragraph",
        text: "Se seu notebook ou PC demora mais de 30 segundos para ligar, ou travar ao abrir vários programas, trocar o HD por um SSD é literalmente a melhor relação custo-benefício em tecnologia que existe. Um SSD SATA de 480GB custa menos de R$ 200 e faz o computador ligar em 10-15 segundos. O impacto é imediato e dramático.",
      },
      {
        type: "list",
        items: [
          "SSD SATA: mais barato, compatível com notebooks antigos, velocidade de até 550 MB/s",
          "SSD NVMe (M.2): mais rápido (até 3.500+ MB/s), menor, mas precisa de slot M.2 no computador",
          "SSD externo USB-C: portátil, ótimo pra backup e transferência de arquivos grandes entre máquinas",
        ],
      },
      {
        type: "heading",
        text: "Smartwatch: pra quem quer monitorar saúde",
      },
      {
        type: "paragraph",
        text: "Se você pratica atividade física regularmente, quer monitorar sono e frequência cardíaca, ou simplesmente não quer tirar o celular do bolso toda hora pra ver notificações, um smartwatch ou smartband faz diferença real. Na faixa de R$ 100 a R$ 300, os modelos mais vendidos oferecem monitor cardíaco, oxímetro, GPS e bateria de 7+ dias.",
      },
      {
        type: "list",
        items: [
          "Smartband (Xiaomi Band, Amazfit Band): mais barata, bateria de 10-14 dias, tela menor — ideal pra quem quer só monitorar saúde e ver notificações",
          "Smartwatch (Amazfit GTS/GTR, Galaxy Watch FE): tela maior, mais recursos, bateria de 3-7 dias — ideal pra quem quer interagir mais (responder mensagens, apps)",
          "Apple Watch: ecossistema completo, mas preço alto e bateria curta (1-2 dias)",
        ],
      },
      {
        type: "heading",
        text: "Veredicto: qual comprar primeiro?",
      },
      {
        type: "paragraph",
        text: "Se seu computador trava: compre o SSD — nenhum dos outros itens chega perto do impacto que essa troca causa. Se seu celular morre antes do fim do dia: power bank. Se nenhum dos dois é problema e você quer melhorar sua rotina de saúde/fitness: smartwatch. Simples assim.",
      },
      {
        type: "quote",
        text: "A melhor compra de tecnologia não é a mais cara — é a que resolve o problema que mais te incomoda no dia a dia.",
      },
      {
        type: "paragraph",
        text: "Veja também nosso ranking dos 10 produtos de tecnologia mais procurados da semana para conferir o que está em alta agora nos marketplaces.",
      },
    ],
  },

  /* ============================================================
   *  ARTIGO 7 — Carregador GaN vale a pena?
   * ============================================================ */
  {
    slug: "carregador-gan-vale-a-pena",
    title: "Carregador GaN vale a pena? O que muda na prática",
    description:
      "Carregadores de nitreto de gálio prometem ser menores, mais rápidos e eficientes. Explicamos o que é verdade, o que é marketing e quando realmente compensa trocar.",
    category: "guia",
    coverIcon: "Sparkles",
    publishedAt: "2026-07-16",
    tags: ["carregador", "GaN", "carga rápida", "USB-C"],
    readTimeMinutes: 6,
    relatedCategoryIds: ["celulares"],
    content: [
      {
        type: "paragraph",
        text: "Se você pesquisou carregadores nos últimos meses, provavelmente viu a sigla 'GaN' aparecer em tudo — geralmente acompanhada de promessas de tamanho menor, carga mais rápida e menos aquecimento. Mas o que é GaN, e será que realmente vale a pena pagar mais por ele? A resposta curta: depende do que você vai carregar.",
      },
      {
        type: "heading",
        text: "O que é GaN (nitreto de gálio)?",
      },
      {
        type: "paragraph",
        text: "GaN é um material semicondutor que substitui o silício tradicional nos circuitos internos do carregador. Na prática, ele conduz eletricidade de forma mais eficiente, o que significa que o carregador consegue entregar a mesma potência (ou mais) em um corpo menor e com menos calor gerado. Não é marketing: a diferença física de tamanho entre um carregador GaN de 65W e um de silício de 65W é visível e significativa.",
      },
      {
        type: "heading",
        text: "Quando GaN vale a pena",
      },
      {
        type: "list",
        items: [
          "Você carrega notebook + celular com o mesmo carregador (modelos 65W+ com 2 portas USB-C fazem isso bem)",
          "Você viaja bastante e quer reduzir peso na mochila — um GaN de 65W tem o tamanho de um carregador de celular comum",
          "Você quer carga rápida real (PD 3.0 / PPS) para celulares Samsung, iPhones ou Motorola recentes",
          "Você usa MacBook Air ou notebooks USB-C que aceitam carregamento por PD",
        ],
      },
      {
        type: "heading",
        text: "Quando GaN NÃO vale a pena",
      },
      {
        type: "list",
        items: [
          "Você só carrega o celular à noite na tomada (um carregador de R$ 25 resolve)",
          "Seu celular não suporta carga rápida PD/PPS (celulares muito antigos ou de entrada)",
          "Você não liga pra tamanho do carregador (fica fixo em casa)",
        ],
      },
      {
        type: "heading",
        text: "Potência: quanto você realmente precisa?",
      },
      {
        type: "paragraph",
        text: "30W é suficiente para carregar qualquer celular rápido. 45W cobre celulares + tablets. 65W é o ponto ideal para quem quer carregar notebook + celular no mesmo carregador. Acima de 100W é para notebooks mais potentes ou múltiplos dispositivos simultâneos.",
      },
      {
        type: "heading",
        text: "Modelos populares no Brasil",
      },
      {
        type: "paragraph",
        text: "Os carregadores GaN mais vendidos no Brasil são da Baseus, Ugreen e Anker. Na faixa de 65W com duas portas, os preços giram entre R$ 100 e R$ 200 — um investimento que se paga pela versatilidade (substitui dois ou três carregadores separados).",
      },
      {
        type: "cta",
        title: "Carregadores GaN em oferta",
        text: "Modelos 30W a 100W com USB-C e carga rápida.",
        buttonLabel: "Ver carregadores",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3760315?view=storefront",
      },
      {
        type: "heading",
        text: "Cuidados na hora de comprar",
      },
      {
        type: "list",
        items: [
          "Certificação ANATEL/Inmetro: carregadores sem certificação podem ser inseguros — vale conferir antes de comprar, especialmente em modelos muito baratos",
          "Protocolo de carga: confirme que o carregador suporta PD (Power Delivery) se seu aparelho usa — QC (Qualcomm Quick Charge) é diferente",
          "Cabos importam: um carregador de 65W com um cabo USB-C ruim não vai entregar 65W — use cabos que suportem a potência do carregador",
        ],
      },
      {
        type: "quote",
        text: "Resumo: se você carrega mais de um aparelho, viaja com frequência ou quer simplificar seus cabos e tomadas, GaN vale cada centavo. Se é só pra carregar o celular na tomada do quarto, economize.",
      },
      {
        type: "paragraph",
        text: "Confira também nosso artigo sobre acessórios de celular em alta para mais dicas de itens que complementam bem o seu setup de carga.",
      },
    ],
  },

  /* ============================================================
   *  ARTIGO 8 — Acessórios pra celular em alta
   * ============================================================ */
  {
    slug: "acessorios-celular-em-alta",
    title: "Acessórios pra celular em alta: o que todo mundo tá comprando",
    description:
      "De capinhas com MagSafe a suportes de carro com carregamento sem fio — os acessórios de celular mais vendidos agora e se valem o investimento.",
    category: "comparativo",
    coverIcon: "Smartphone",
    publishedAt: "2026-07-17",
    tags: ["celular", "acessórios", "capinha", "película", "suporte"],
    readTimeMinutes: 7,
    relatedCategoryIds: ["celulares"],
    content: [
      {
        type: "paragraph",
        text: "Acessórios de celular movimentam mais dinheiro nos marketplaces do que muita categoria 'principal' de eletrônicos. E faz sentido: cada celular novo comprado gera pelo menos 2-3 compras de acessórios (capa, película, carregador). O problema é que a variedade é tão grande que fica difícil separar o que realmente vale do que é só modinha. Reunimos os acessórios mais vendidos agora e organizamos por utilidade real.",
      },
      {
        type: "heading",
        text: "Capinhas: proteção ainda é o básico",
      },
      {
        type: "paragraph",
        text: "Capas de silicone transparente e de TPU com bordas reforçadas continuam sendo as mais vendidas. A novidade é o crescimento das capas com MagSafe (ou compatíveis), que permitem encaixar carregador sem fio, carteira magnética e suporte veicular sem precisar tirar a capa. Se seu celular suporta MagSafe ou carregamento sem fio, vale investir numa capa compatível.",
      },
      {
        type: "heading",
        text: "Películas: vidro temperado virou padrão",
      },
      {
        type: "paragraph",
        text: "Películas de hidrogel perderam espaço para películas de vidro temperado, que são mais baratas e protegem melhor contra impacto. As de privacidade (que escurecem a tela para quem olha de lado) cresceram bastante nas vendas — úteis pra quem usa o celular no transporte público.",
      },
      {
        type: "heading",
        text: "Carregadores e cabos",
      },
      {
        type: "paragraph",
        text: "Carregadores GaN com USB-C são a grande tendência — menores, mais rápidos e mais versáteis. Cabos de nylon trançado com conector reforçado substituíram os cabos lisos que quebravam em 3 meses. Para quem quer saber mais sobre carregadores, escrevemos um guia completo sobre carregadores GaN.",
      },
      {
        type: "cta",
        title: "Celulares e acessórios",
        text: "Smartphones, capas, carregadores e mais.",
        buttonLabel: "Ver acessórios",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3760315?view=storefront",
      },
      {
        type: "heading",
        text: "Suportes veiculares",
      },
      {
        type: "paragraph",
        text: "Suportes de celular para carro evoluíram: os modelos com garra automática e carregamento sem fio (Qi) estão entre os mais desejados. Preços variam de R$ 30 (garra simples) a R$ 150 (com carregamento sem fio). Para apps de GPS e motoristas de app, é item essencial.",
      },
      {
        type: "heading",
        text: "Ring lights e tripés",
      },
      {
        type: "paragraph",
        text: "Com a explosão do conteúdo em vídeo (TikTok, Reels, YouTube Shorts), ring lights compactas e tripés com controle Bluetooth viraram acessórios de celular de alto volume de venda. Na faixa de R$ 30 a R$ 80, encontram-se kits completos (tripé + ring light + controle).",
      },
      {
        type: "heading",
        text: "O que realmente vale comprar",
      },
      {
        type: "list",
        items: [
          "Capa com proteção na câmera: o módulo de câmera é o ponto mais caro de reparar — capa com borda elevada na câmera é obrigatória",
          "Película de vidro temperado: barata e eficaz, troque a cada 6 meses ou quando trincar",
          "Carregador GaN 30W+: substitui o carregador que veio na caixa (ou que não veio) com vantagem",
          "Cabo reforçado: cabos de nylon com conector em L são práticos pra quem usa o celular enquanto carrega",
          "Suporte veicular: se você dirige, não use o celular na mão — suporte custa menos que a multa",
        ],
      },
      {
        type: "paragraph",
        text: "Para ver todos os acessórios e celulares em oferta, confira nossas categorias de celulares na Shopee e no Mercado Livre. E se está pensando em trocar de celular, veja nosso comparativo dos melhores smartphones em alta agora.",
      },
    ],
  },

  /* ============================================================
   *  ARTIGO 9 — Tecnologia em alta no Brasil
   * ============================================================ */
  {
    slug: "tecnologia-em-alta-no-brasil",
    title: "Tecnologia em alta no Brasil: as tendências que estão moldando 2026",
    description:
      "De mini projetores a carregadores GaN, passando por IA no celular e o boom dos intermediários: o que está definindo o consumo de tecnologia no Brasil em 2026.",
    category: "noticia",
    coverIcon: "Flame",
    publishedAt: "2026-07-18",
    tags: ["tendências", "Brasil", "2026", "tecnologia", "mercado"],
    readTimeMinutes: 8,
    relatedCategoryIds: [],
    content: [
      {
        type: "paragraph",
        text: "O mercado de tecnologia no Brasil em 2026 não é o mesmo de dois anos atrás. O consumidor ficou mais criterioso, o parcelamento no Pix ganhou força nos marketplaces, e algumas categorias explodiram enquanto outras estagnaram. Este artigo mapeia as tendências que estão definindo o que os brasileiros compram (e deixam de comprar) em tecnologia agora.",
      },
      {
        type: "heading",
        text: "1. O intermediário é o novo topo de linha",
      },
      {
        type: "paragraph",
        text: "A maior mudança de comportamento do consumidor brasileiro em 2026 é clara: celulares intermediários viraram o centro das vendas. Modelos como Galaxy A36, A56 e Moto G86 vendem mais que qualquer topo de linha. O motivo é simples — a diferença percebida entre um intermediário de R$ 1.500 e um topo de R$ 5.000 ficou cada vez menor para o uso real do dia a dia. Fizemos um comparativo detalhado dos melhores smartphones em alta agora.",
      },
      {
        type: "heading",
        text: "2. Mini projetores dominaram o entretenimento residencial",
      },
      {
        type: "paragraph",
        text: "Projetores compactos se tornaram uma alternativa real às Smart TVs para quem tem espaço limitado ou quer uma segunda tela em casa. Com preços entre R$ 300 e R$ 800 nos marketplaces, eles atraem especialmente o público jovem que mora em apartamentos pequenos. Confira nosso guia completo sobre como escolher um mini projetor.",
      },
      {
        type: "heading",
        text: "3. USB-C finalmente virou padrão",
      },
      {
        type: "paragraph",
        text: "Depois de anos de transição, 2026 é o ano em que USB-C se consolidou como o conector universal no Brasil. Celulares, tablets, notebooks, fones e até controles de videogame usam USB-C. Isso impulsionou a venda de carregadores GaN multiporta (um carregador para tudo) e cabos USB-C de qualidade. Explicamos tudo sobre carregadores GaN no nosso guia dedicado.",
      },
      {
        type: "heading",
        text: "4. IA no celular: ainda mais marketing que realidade",
      },
      {
        type: "paragraph",
        text: "Todos os fabricantes estão vendendo 'IA' como recurso principal dos novos celulares. Na prática, os recursos mais úteis de IA no dia a dia ainda são poucos: melhoria automática de fotos, transcrição de áudio e resumo de textos. Para a maioria dos consumidores, IA no celular ainda não é motivo suficiente para trocar de aparelho — mas está melhorando a cada atualização.",
      },
      {
        type: "heading",
        text: "5. Marketplaces competindo por preço e entrega",
      },
      {
        type: "paragraph",
        text: "Shopee, Mercado Livre e Amazon Brasil estão em guerra de preços e velocidade de entrega. Para o consumidor, isso é ótimo: o mesmo produto pode ter preços diferentes em cada plataforma, e a comparação ficou mais fácil. A dica é sempre checar as duas ou três plataformas antes de comprar — e aproveitar cupons e cashback quando disponíveis.",
      },
      {
        type: "cta",
        title: "Ofertas na Shopee",
        text: "Categorias atualizadas toda semana.",
        buttonLabel: "Ver ofertas Shopee",
        store: "shopee",
        link: "https://collshp.com/technocheap/category/3861778?view=storefront",
      },
      {
        type: "cta",
        title: "Ofertas no Mercado Livre",
        text: "Eletrônicos com bom custo-benefício.",
        buttonLabel: "Ver ofertas ML",
        store: "mercadolivre",
        link: "https://meli.la/1DRaGZv",
      },
      {
        type: "heading",
        text: "6. Casa inteligente barata",
      },
      {
        type: "paragraph",
        text: "Câmeras de segurança Wi-Fi, lâmpadas inteligentes e tomadas smart invadiram as listas de mais vendidos. O que era 'coisa de rico' há dois anos hoje custa menos de R$ 100 por item — e a instalação é tão simples quanto trocar uma lâmpada comum. Assistentes de voz (Alexa, Google) continuam sendo o centro de controle mais popular.",
      },
      {
        type: "heading",
        text: "7. Periféricos gamer como presentes e upgrades baratos",
      },
      {
        type: "paragraph",
        text: "Mouse, headset e teclado gamer se tornaram uma das categorias de presente mais populares no Brasil. Modelos na faixa de R$ 50 a R$ 200 oferecem RGB, macros e desempenho de sobra para jogos casuais e competitivos. Reunimos os mais procurados no nosso artigo sobre produtos gamer da semana.",
      },
      {
        type: "heading",
        text: "O que esperar para o segundo semestre",
      },
      {
        type: "list",
        items: [
          "Black Friday em novembro deve ser a maior do Brasil em volume de vendas online — vale guardar compras grandes pra essa data",
          "Novos modelos de celulares Samsung e Motorola chegam entre agosto e outubro, derrubando o preço dos modelos atuais",
          "Carregadores GaN de 100W+ devem ficar abaixo de R$ 200, viabilizando carga de notebook sem carregador proprietário",
          "Fones TWS com ANC por menos de R$ 100 devem se tornar viáveis com a entrada de novas marcas chinesas",
        ],
      },
      {
        type: "paragraph",
        text: "Para acompanhar os melhores preços e ofertas, confira nossas categorias de Shopee e Mercado Livre — atualizamos toda semana com os produtos que valem a pena.",
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
