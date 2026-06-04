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

export type Category = {
  id: string;
  name: string;
  description: string;
  cta: string;
  link: string;
  icon: IconName;
  order: number;
  featured?: boolean;
  showInHighlights?: boolean;
};

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
