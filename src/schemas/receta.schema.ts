import { z } from "zod";

export const recetaSchema = z.object({
  medicamento: z
    .string()
    .min(4, "El nombre del medicamento debe tener al menos 4 caracteres"),
  cantidad: z.number().positive("La cantidad debe ser positiva"),
  presentacion: z
    .string()
    .min(3, "La presentación debe tener al menos 3 caracteres"),
  fechaAprobacion: z.date().optional(),
  observaciones: z.string().optional(),
});
