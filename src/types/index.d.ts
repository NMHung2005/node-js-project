import { role, user as UserPrisma } from '@prisma/client'
import { number } from 'zod'
declare global {
    namespace Express {
        interface User extends UserPrisma {
            role?: Role,
            sumCart?: number
        }
    }
}