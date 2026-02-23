// schemas/listing-schema.ts
import { z } from "zod"

export const listingSchema = z.object({
    category: z.string().min(1, "Selecciona una categoría"),
    //location: z.any().nullable(),
    location: z.any().refine(Boolean, {message: "Selecciona una ubicación",}),
    guestCount: z.number().min(1),
    roomCount: z.number().min(1),
    bathroomCount: z.number().min(1),
    //imagesrc: z.string().optional(),
    imagesrc: z.string().min(1, "Añade una imagen"),
    price: z.number().min(1),
    title: z.string().min(3, "El título es muy corto"),
    description: z.string().min(10, "Descripción muy corta"),
})

