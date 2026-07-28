import { z } from "zod";

/* ============================================================
 *  CUPONS PROMOCIONAIS
 *  Adicione cupons no array COUPONS abaixo.
 *  Cupons com expiresAt no passado somem automaticamente.
 * ============================================================ */

export type CouponStore = "shopee" | "mercadolivre" | "amazon";

export const couponSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "id deve ser minúsculo, sem espaços"),
  code: z.string().trim().min(1).max(30),
  description: z.string().trim().min(1).max(100),
  store: z.enum(["shopee", "mercadolivre", "amazon"]),
  link: z.string().url(),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use formato AAAA-MM-DD"),
});

export type Coupon = z.infer<typeof couponSchema>;

export const COUPONS: Coupon[] = [
  {
    id: "cupom-shopee-10",
    code: "TECHNO10",
    description: "10% OFF em tecnologia",
    store: "shopee",
    link: "https://collshp.com/technocheap/category/3861778?view=storefront",
    expiresAt: "2026-08-15",
  },
  {
    id: "cupom-ml-energia",
    code: "ENERGIA5",
    description: "R$ 5 de desconto em eletrônicos",
    store: "mercadolivre",
    link: "https://meli.la/1DRaGZv",
    expiresAt: "2026-08-20",
  },
  {
    id: "cupom-amazon-frete",
    code: "FRETEGratis",
    description: "Frete grátis em itens selecionados",
    store: "amazon",
    link: "https://www.amazon.com.br",
    expiresAt: "2026-08-31",
  },
];

/* ============================================================
 *  Helpers
 * ============================================================ */
export function getActiveCoupons(): Coupon[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return COUPONS.filter((c) => new Date(c.expiresAt) >= today);
}

export function validateCoupons(): Array<{ id: string; field: string; message: string }> {
  const issues: Array<{ id: string; field: string; message: string }> = [];
  for (const c of COUPONS) {
    const r = couponSchema.safeParse(c);
    if (!r.success) {
      for (const err of r.error.issues) {
        issues.push({ id: c.id, field: err.path.join("."), message: err.message });
      }
    }
  }
  return issues;
}