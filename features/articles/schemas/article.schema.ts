import { z } from "zod";

export const articleSchema = z.object({
  code: z
    .string()
    .min(1, "El código es obligatorio"),

  description: z
    .string()
    .min(3, "Ingrese una descripción."),

  category: z
    .string()
    .min(3, "Ingrese una categoría."),

  unitPrice: z
    .number()
    .positive("El precio debe ser mayor que cero"),
});

export type ArticleFormData = z.infer<typeof articleSchema>;