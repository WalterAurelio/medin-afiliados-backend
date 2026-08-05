import { z } from "zod";

export const observacionSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/), // El id del emisor
    rolEmisor: z.string().optional(),
    comentario: z.string().trim().min(1, "El comentario es obligatorio."),
    fecha: z.date().optional(),
});