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
 *  2. Troque o valor de `link` pelo link real da Shopee.
 *  3. Se quiser, edite também `name`, `description`, `cta`,
 *     `icon` ou `order`.
 *  4. Salve o arquivo — a página atualiza automaticamente.
 *
 *  ----------------------------------------------------------
 *  CAMPOS
 *  ----------------------------------------------------------
 *  - id           identificador único (não repita)
 *  - name         nome exibido no card
 *  - description  texto curto abaixo do nome
 *  - cta          texto do botão do card
 *  - link         URL da Shopee (afiliado)
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
 *  VALIDAÇÃO DE LINKS
 * ============================================================
 *  Aceitamos apenas:
 *   - O placeholder "COLOCAR_LINK_AQUI" (link ainda não definido)
 *   - URLs https das hosts oficiais da Shopee:
 *       shopee.com.br, s.shopee.com.br, shp.ee
 * ============================================================ */
export const LINK_PLACEHOLDER = "COLOCAR_LINK_AQUI";

export const ALLOWED_LINK_HOSTS = [
  "shopee.com.br",
  "s.shopee.com.br",
  "shp.ee",
] as const;

export type LinkValidation =
  | { status: "placeholder"; message: string }
  | { status: "valid"; url: string }
  | { status: "invalid"; message: string };

export function validateLink(raw: string): LinkValidation {
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
  const ok = ALLOWED_LINK_HOSTS.some(
    (h) => host === h || host.endsWith("." + h),
  );
  if (!ok) {
    return {
      status: "invalid",
      message: `Domínio não permitido (${host}). Use Shopee.`,
    };
  }
  return { status: "valid", url: parsed.toString() };
}

/** URL segura para usar em href: "#" quando inválida ou placeholder. */
export function safeHref(raw: string): string {
  const v = validateLink(raw);
  return v.status === "valid" ? v.url : "#";
}

const linkSchema = z
  .string()
  .trim()
  .max(2048, "Link muito longo")
  .refine((v) => {
    const r = validateLink(v);
    return r.status === "valid" || r.status === "placeholder";
  }, "Link inválido — use uma URL https da Shopee ou o placeholder COLOCAR_LINK_AQUI");

const iconSchema = z.enum(Object.keys(ICONS) as [IconName, ...IconName[]], {
  message: "Ícone inválido",
});

export const categorySchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "id obrigatório")
    .max(50, "id muito longo")
    .regex(/^[a-z0-9-]+$/, "id deve ser minúsculo, sem espaços (use - para separar)"),
  name: z.string().trim().min(1, "Nome obrigatório").max(60, "Nome muito longo"),
  description: z.string().trim().min(1, "Descrição obrigatória").max(200, "Descrição muito longa"),
  cta: z.string().trim().min(1, "CTA obrigatório").max(40, "CTA muito longo"),
  link: linkSchema,
  icon: iconSchema,
  order: z.number().int().min(1).max(999),
  featured: z.boolean().optional(),
  showInHighlights: z.boolean().optional(),
});

export type Category = z.infer<typeof categorySchema>;

/* ============================================================
 *  LINKS GLOBAIS (botões principais da página)
 * ============================================================ */
export const SITE_LINKS = {
  // Botão "Ver produto do vídeo" (hero + rodapé fixo do mobile)
  mainVideo: "COLOCAR_LINK_AQUI",
  // Botão final "Ver todos os achadinhos"
  fullShop: "COLOCAR_LINK_AQUI",
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
    link: "COLOCAR_LINK_AQUI",
    icon: "Sparkles",
    order: 1,
    featured: true,
  },
  {
    id: "projetores",
    name: "Projetores",
    description: "Mini projetores e acessórios para assistir filmes, séries e futebol.",
    cta: "Ver projetores",
    link: "COLOCAR_LINK_AQUI",
    icon: "Projector",
    order: 2,
    showInHighlights: true,
  },
  {
    id: "fones",
    name: "Fones Bluetooth",
    description: "Fones sem fio, modelos custo-benefício e achadinhos do dia a dia.",
    cta: "Ver fones",
    link: "COLOCAR_LINK_AQUI",
    icon: "Headphones",
    order: 3,
    showInHighlights: true,
  },
  {
    id: "tablets",
    name: "Tablets",
    description: "Tablets para estudo, vídeos, trabalho e uso diário em oferta.",
    cta: "Ver tablets",
    link: "COLOCAR_LINK_AQUI",
    icon: "Tablet",
    order: 4,
  },
  {
    id: "celulares",
    name: "Celulares",
    description: "Smartphones, capas, carregadores e acessórios úteis para celular.",
    cta: "Ver celulares",
    link: "COLOCAR_LINK_AQUI",
    icon: "Smartphone",
    order: 5,
  },
  {
    id: "smart-tvs",
    name: "Smart TVs",
    description: "Ofertas em TVs e telas para entretenimento em casa.",
    cta: "Ver Smart TVs",
    link: "COLOCAR_LINK_AQUI",
    icon: "Tv",
    order: 6,
  },
  {
    id: "casa",
    name: "Casa",
    description: "Itens para deixar sua casa mais prática, bonita e confortável.",
    cta: "Ver casa",
    link: "COLOCAR_LINK_AQUI",
    icon: "Home",
    order: 7,
  },
  {
    id: "eletros",
    name: "Eletros",
    description: "Fogões, eletrodomésticos e produtos úteis para cozinha e casa.",
    cta: "Ver eletros",
    link: "COLOCAR_LINK_AQUI",
    icon: "Microwave",
    order: 8,
  },
  {
    id: "ate-100",
    name: "Até R$100",
    description: "Achadinhos baratos para comprar sem pensar muito no preço.",
    cta: "Ver ofertas",
    link: "COLOCAR_LINK_AQUI",
    icon: "Tag",
    order: 9,
  },
  {
    id: "mais-vendidos",
    name: "Mais vendidos",
    description: "Produtos com maior procura e maiores chances de promoção.",
    cta: "Ver mais vendidos",
    link: "COLOCAR_LINK_AQUI",
    icon: "Flame",
    order: 10,
    showInHighlights: true,
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
