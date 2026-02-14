import z, { email } from "zod";


export const loginSchema = z.object({    
    email: z.email({"message": "email inválido"}),
    password: z.string(),
})

export const registerSchema = z.object({
    email: z.email({"message": "email inválido"}),
    password: z.string().min(6, "Password tiene que tener al menos 6 caracteres alfanuméricos"),
    username: z
        .string()
            .min(3, "Username tiene que tener al menos 3 caracteres")
            .max(63, "Username tiene que tener como máximo 63 caracteres")
            .regex(
                /^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 
                "Usuario solo puede contener letras minúsculas, números y guiones. Tiene que empezar y acabar por una letra o número"
            )
            .refine(
                (val) => !val.includes("--"), "Usuario no puede tener guiones consecutivos"
            )
            .transform((val) => val.toLowerCase())
})