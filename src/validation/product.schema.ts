import { z } from 'zod'

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(1, { message: "Không để trống tên" }),
    price: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Gia phai lon hon 0"
        }),
    detailDesc: z.string().trim().min(1, { message: "Không để trống detailDesc" }),
    shortDesc: z.string().trim().min(1, { message: "Không để trống shortDesc" }),
    quantity: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Gia phai lon hon 0"
        }),
    factory: z.string().trim().min(1, { message: "Không để trống factory" }),
    target: z.string().trim().min(1, { message: "Không để trống target" })
});

export type TProductSchema = z.infer<typeof productSchema>;