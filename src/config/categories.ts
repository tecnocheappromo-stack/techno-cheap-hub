/**
 * ============================================================
 *  CONFIGURAÇÃO DAS CATEGORIAS — Techno Cheap
 * ============================================================
 *
 *  Este é o ÚNICO arquivo que você precisa editar para trocar
 *  os links, nomes, descrições, ícones e ordem das categorias
 *  da sua landing page.
 *
 *  ----------------------------------------------------------
 *  COMO EDITAR
 *  ----------------------------------------------------------
 *  1. Encontre a categoria que deseja alterar abaixo.
 *  2. Troque o valor de `link` pelo link real (de afiliado) da loja.
 *  3. Se quiser, edite também `name`, `description`, `cta`,
 *     `icon`, `store` ou `order`.
 *  4. Salve o arquivo — a página atualiza automaticamente.
 *
 *  ----------------------------------------------------------
 *  CAMPOS
 *  ----------------------------------------------------------
 *  - id           identificador único (não repita)
 *  - name         nome exibido no card
 *  - description  texto curto abaixo do nome
 *  - cta          texto do botão do card
 *  - store        "shopee" | "mercadolivre" | "amazon" — define
 *                 quais domínios são aceitos em `link` e a cor do selo
 *  - link         URL da loja (de preferência já com seu link de afiliado)
 *  - icon         nome do ícone (veja lista de ícones abaixo)
 *  - order        ordem de exibição (1 aparece primeiro)
 *  - featured     true para destacar como "Em alta"
 *  - showInHighlights  true para também aparecer na seção
 *                      "Destaques da semana"
 *
 *  ----------------------------------------------------------
 *  ÍCONES DISPONÍVEIS
 *  ----------------------------------------------------------
 *  Sparkles, Projector, Headphones, Tablet, Smartphone, Tv,
 *  Home, Microwave, Tag, Flame, ShoppingBag, Star, Package
 *
 *  Para adicionar um ícone novo, importe-o de "lucide-react"
 *  no arquivo src/config/categories.ts e adicione no objeto
 *  ICONS abaixo.
 * ============================================================
 */

import {
  Sparkles,
  Projector,
  Headphones,
  Tablet,
  Smartphone,
  Tv,
  Home,
  Microwave,
  Tag,
  Flame,
  ShoppingBag,
  Star,
  Package,
  type LucideIcon,
} from "lucide-react";
import { z } from "zod";

export const ICONS = {
  Sparkles,
  Projector,
  Headphones,
  Tablet,
  Smartphone,
  Tv,
  Home,
  Microwave,
  Tag,
  Flame,
  ShoppingBag,
  Star,
  Package,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/* ============================================================
 *  LOJAS SUPORTADAS
 * ============================================================
 *  Cada categoria pertence a UMA loja. Isso controla:
 *   - quais domínios são aceitos no link daquela categoria
 *   - a cor/selo mostrado no card
 *
 *  Para adicionar uma nova loja no futuro, basta acrescentar
 *  uma entrada aqui (e as cores correspondentes em styles.css).
 * ============================================================ */
export type StoreId = "shopee" | "mercadolivre" | "amazon";

export type StoreConfig = {
  id: StoreId;
  label: string;
  /** Domínios https aceitos para links de produto/afiliado dessa loja */
  hosts: readonly string[];
  /** Classe Tailwind (usa as cores registradas em styles.css) para o selo do card */
  badgeClass: string;
  /** CSS var usada no ícone/CTA do card */
  gradientVar: string;
};

export const STORES: Record<StoreId, StoreConfig> = {
  shopee: {
    id: "shopee",
    label: "Shopee",
    hosts: ["shopee.com.br", "s.shopee.com.br", "shp.ee", "collshp.com"],
    badgeClass: "bg-shopee text-shopee-foreground",
    gradientVar: "var(--gradient-shopee)",
  },
  mercadolivre: {
    id: "mercadolivre",
    label: "Mercado Livre",
    // Links de afiliado ML costumam ser a própria URL do produto/loja com
    // parâmetros de rastreio, ou o link curto gerado no Portal do Afiliado.
    hosts: [
      "mercadolivre.com.br",
      "mercadolivre.com",
      "produto.mercadolivre.com.br",
      "lista.mercadolivre.com.br",
      "mercadopago.com.br",
    ],
    badgeClass: "bg-mercadolivre text-mercadolivre-foreground",
    gradientVar: "var(--gradient-mercadolivre)",
  },
  amazon: {
    id: "amazon",
    label: "Amazon",
    // amzn.to é o encurtador oficial gerado pelo SiteStripe/Creators API.
    hosts: ["amazon.com.br", "amzn.to"],
    badgeClass: "bg-amazon text-amazon-foreground",
    gradientVar: "var(--gradient-amazon)",
  },
};

export const STORE_IDS = Object.keys(STORES) as StoreId[];

/** Domínios aceitos que não são "loja" (ex.: grupo do WhatsApp). */
const OTHER_ALLOWED_HOSTS = ["chat.whatsapp.com", "whatsapp.com"] as const;

/* ============================================================
 *  VALIDAÇÃO DE LINKS
 * ============================================================
 *  Aceitamos apenas:
 *   - O placeholder "COLOCAR_LINK_AQUI" (link ainda não definido)
 *   - URLs https dos domínios oficiais da loja informada
 *     (ou de qualquer loja + WhatsApp, se nenhuma loja for passada)
 * ============================================================ */
export const LINK_PLACEHOLDER = "COLOCAR_LINK_AQUI";

/** Mantido por compatibilidade: lista de todos os domínios aceitos, de todas as lojas. */
export const ALLOWED_LINK_HOSTS = [
  ...STORE_IDS.flatMap((s) => STORES[s].hosts),
  ...OTHER_ALLOWED_HOSTS,
];

export function allowedHostsFor(store?: StoreId): readonly string[] {
  if (store) return STORES[store].hosts;
  return ALLOWED_LINK_HOSTS;
}

export type LinkValidation =
  | { status: "placeholder"; message: string }
  | { status: "valid"; url: string }
  | { status: "invalid"; message: string };

export function validateLink(raw: string, store?: StoreId): LinkValidation {
  const value = (raw ?? "").trim();
  if (!value || value === LINK_PLACEHOLDER) {
    return { status: "placeholder", message: "Link ainda não definido" };
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { status: "invalid", message: "URL malformada" };
  }
  if (parsed.protocol !== "https:") {
    return { status: "invalid", message: "Use HTTPS" };
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const hosts = allowedHostsFor(store);
  const ok = hosts.some((h) => host === h || host.endsWith("." + h));
  if (!ok) {
    const storeLabel = store ? STORES[store].label : "uma loja compatível";
    return {
      status: "invalid",
      message: `Domínio não permitido (${host}). Use um link oficial de ${storeLabel}.`,
    };
  }
  return { status: "valid", url: parsed.toString() };
}

/** URL segura para usar em href: "#" quando inválida ou placeholder. */
export function safeHref(raw: string, store?: StoreId): string {
  const v = validateLink(raw, store);
  return v.status === "valid" ? v.url : "#";
}

const storeSchema = z.enum(STORE_IDS as [StoreId, ...StoreId[]], {
  message: "Loja inválida",
});

const iconSchema = z.enum(Object.keys(ICONS) as [IconName, ...IconName[]], {
  message: "Ícone inválido",
});

export const categorySchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, "id obrigatório")
      .max(50, "id muito longo")
      .regex(/^[a-z0-9-]+$/, "id deve ser minúsculo, sem espaços (use - para separar)"),
    name: z.string().trim().min(1, "Nome obrigatório").max(60, "Nome muito longo"),
    description: z.string().trim().min(1, "Descrição obrigatória").max(200, "Descrição muito longa"),
    cta: z.string().trim().min(1, "CTA obrigatório").max(40, "CTA muito longo"),
    store: storeSchema,
    link: z.string().trim().max(2048, "Link muito longo"),
    icon: iconSchema,
    order: z.number().int().min(1).max(999),
    featured: z.boolean().optional(),
    showInHighlights: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const r = validateLink(data.link, data.store);
    if (r.status === "invalid") {
      ctx.addIssue({ code: "custom", path: ["link"], message: r.message });
    }
  });

export type Category = z.infer<typeof categorySchema>;

/* ============================================================
 *  LINKS GLOBAIS (botões principais da página)
 * ============================================================ */
export const SITE_LINKS = {
  // Botão "Ver produto do vídeo" (hero + rodapé fixo do mobile)
  mainVideo: "https://collshp.com/technocheap/category/3861778?view=storefront",
  // Botão final "Ver todos os achadinhos"
  fullShop: "https://collshp.com/technocheap?view=storefront",
  // Grupo do WhatsApp
  whatsappGroup: "https://chat.whatsapp.com/D7Hy7JmpQUGEFGzAOLt8Bc?s=cl&p=a&ilr=0",
};

/* ============================================================
 *  CATEGORIAS
 *  Edite os links abaixo. A ordem é controlada por `order`.
 * ============================================================ */
export const CATEGORIES: Category[] = [
  {
    id: "videos",
    name: "Produtos dos vídeos",
    description: "Veja os produtos que apareceram nos vídeos recentes do TikTok.",
    cta: "Ver produtos dos vídeos",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3861778?view=storefront",
    icon: "Sparkles",
    order: 1,
    featured: true,
  },
  {
    id: "projetores",
    name: "Projetores",
    description: "Mini projetores e acessórios para assistir filmes, séries e futebol.",
    cta: "Ver projetores",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3760310?view=storefront",
    icon: "Projector",
    order: 2,
    showInHighlights: true,
  },
  {
    id: "fones",
    name: "Fones Bluetooth",
    description: "Fones sem fio, modelos custo-benefício e achadinhos do dia a dia.",
    cta: "Ver fones",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3766799?view=storefront",
    icon: "Headphones",
    order: 3,
    showInHighlights: true,
  },
  {
    id: "tablets",
    name: "Tablets",
    description: "Tablets para estudo, vídeos, trabalho e uso diário em oferta.",
    cta: "Ver tablets",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3841978?view=storefront",
    icon: "Tablet",
    order: 4,
  },
  {
    id: "celulares",
    name: "Celulares",
    description: "Smartphones, capas, carregadores e acessórios úteis para celular.",
    cta: "Ver celulares",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3760315?view=storefront",
    icon: "Smartphone",
    order: 5,
  },
  {
    id: "smart-tvs",
    name: "Smart TVs",
    description: "Ofertas em TVs e telas para entretenimento em casa.",
    cta: "Ver Smart TVs",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3760320?view=storefront",
    icon: "Tv",
    order: 6,
  },
  {
    id: "casa",
    name: "Casa",
    description: "Itens para deixar sua casa mais prática, bonita e confortável.",
    cta: "Ver casa",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3766803?view=storefront",
    icon: "Home",
    order: 7,
  },
  {
    id: "eletros",
    name: "Eletros",
    description: "Fogões, eletrodomésticos e produtos úteis para cozinha e casa.",
    cta: "Ver eletros",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3760316?view=storefront",
    icon: "Microwave",
    order: 8,
  },

  /* --------------------------------------------------------
   *  MERCADO LIVRE
   *  Troque o link de cada categoria abaixo pelo link gerado
   *  no Portal do Afiliado do Mercado Livre (após aprovação).
   * -------------------------------------------------------- */
  {
    id: "ml-eletronicos",
    name: "Eletrônicos ML",
    description: "Celulares, tablets e eletrônicos com ofertas no Mercado Livre.",
    cta: "Ver no Mercado Livre",
    store: "mercadolivre",
    link: https://meli.la/1DRaGZv,
    icon: "Smartphone",
    order: 9,
  },
  {
    id: "ml-casa",
    name: "Casa ML",
    description: "Itens para casa e eletrodomésticos com bom custo-benefício.",
    cta: "Ver no Mercado Livre",
    store: "mercadolivre",
    link: https://meli.la/2UqLU9K,
    icon: "Home",
    order: 10,
  },

  /* --------------------------------------------------------
   *  AMAZON
   *  Troque o link de cada categoria abaixo pelo link gerado
   *  no SiteStripe / Creators API da sua conta de Associado.
   * -------------------------------------------------------- */
  {
    id: "amazon-tech",
    name: "Tecnologia Amazon",
    description: "Achadinhos de tecnologia e acessórios vendidos e entregues pela Amazon.",
    cta: "Ver na Amazon",
    store: "amazon",
    link: LINK_PLACEHOLDER,
    icon: "Package",
    order: 11,
  },
  {
    id: "amazon-casa",
    name: "Casa Amazon",
    description: "Produtos para casa com entrega rápida pela Amazon.",
    cta: "Ver na Amazon",
    store: "amazon",
    link: LINK_PLACEHOLDER,
    icon: "Home",
    order: 12,
  },
];

/* ============================================================
 *  Helpers — não precisa editar.
 * ============================================================ */
export function getCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

export function getHighlights(): Category[] {
  return getCategories().filter((c) => c.showInHighlights);
}

export type CategoryIssue = {
  id: string;
  field: string;
  message: string;
};

/** Valida toda a configuração e retorna uma lista de problemas. */
export function validateConfig(): CategoryIssue[] {
  const issues: CategoryIssue[] = [];

  // ids únicos
  const seen = new Set<string>();
  for (const c of CATEGORIES) {
    if (seen.has(c.id)) {
      issues.push({ id: c.id, field: "id", message: "id duplicado" });
    }
    seen.add(c.id);
  }

  // schema por categoria
  for (const c of CATEGORIES) {
    const r = categorySchema.safeParse(c);
    if (!r.success) {
      for (const err of r.error.issues) {
        issues.push({
          id: c.id,
          field: err.path.join(".") || "(raiz)",
          message: err.message,
        });
      }
    }
  }

  // links globais
  for (const [key, value] of Object.entries(SITE_LINKS)) {
    const v = validateLink(value);
    if (v.status === "invalid") {
      issues.push({ id: `SITE_LINKS.${key}`, field: "link", message: v.message });
    }
  }

  return issues;
}

/* ============================================================
 *  OVERRIDES — links editáveis salvos no localStorage
 * ============================================================
 *  Chaves usadas no mapa de overrides:
 *   - id da categoria (ex: "projetores")
 *   - "SITE_LINKS.mainVideo" e "SITE_LINKS.fullShop" para os globais
 * ============================================================ */
export const LINK_OVERRIDES_STORAGE_KEY = "tc_link_overrides";
export const LINKS_UPDATED_EVENT = "tc-links-updated";

export type LinkOverrides = Record<string, string>;

export function getLinkOverrides(): LinkOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LINK_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as LinkOverrides) : {};
  } catch {
    return {};
  }
}

function persistOverrides(next: LinkOverrides) {
  window.localStorage.setItem(LINK_OVERRIDES_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(LINKS_UPDATED_EVENT));
}

export function setLinkOverride(id: string, link: string) {
  if (typeof window === "undefined") return;
  const all = getLinkOverrides();
  all[id] = link;
  persistOverrides(all);
}

export function clearLinkOverride(id: string) {
  if (typeof window === "undefined") return;
  const all = getLinkOverrides();
  delete all[id];
  persistOverrides(all);
}

export function getEffectiveLink(id: string, fallback: string): string {
  const all = getLinkOverrides();
  return all[id] ?? fallback;
}

/** JSON de configuração atual (categorias + globais, com overrides aplicados). */
export function buildConfigExport(): string {
  const overrides = getLinkOverrides();
  const data = {
    siteLinks: Object.fromEntries(
      Object.entries(SITE_LINKS).map(([k, v]) => [k, overrides[`SITE_LINKS.${k}`] ?? v]),
    ),
    categories: getCategories().map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      cta: c.cta,
      store: c.store,
      link: overrides[c.id] ?? c.link,
      icon: c.icon,
      order: c.order,
      featured: c.featured ?? false,
      showInHighlights: c.showInHighlights ?? false,
    })),
  };
  return JSON.stringify(data, null, 2);
}


