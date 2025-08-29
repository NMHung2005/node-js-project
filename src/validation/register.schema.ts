import { isEmailExist } from "services/client/auth.service";
import { z } from 'zod'
const passwordSchema = z.string()
    .min(6, { message: "Mat khau can co toi thieu 3 ki tu" })
    .max(20, { message: "Mat khau chi co do dai toi da la 20" })
const emailSchema = z.string().email("Email khong dung dinh dang")
    .refine(async (email) => {
        const existingUser = await isEmailExist(email);
        return !existingUser
    }, {
        message: "Email da ton tai",
        path: ["email"],
    })
export const registerSchema = z.object({
    fullName: z.string().min(1, { message: "Ten khong duoc bo trong" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password confirm khong chinh xac",
        path: ["confirmPassword"],
    })
export type TRegisterSchema = z.infer<typeof registerSchema>;