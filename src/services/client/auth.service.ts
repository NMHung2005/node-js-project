import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import { error } from "console";
import { hashPassword } from "services/user.service";

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    })
    if (user)
        return true;
    else
        return false;
}
const registerNewUser = async (
    fullName: string,
    email: string,
    password: string
) => {

    const defaultPassword = await hashPassword(password);

    const userRole = await prisma.role.findUnique({
        where: { name: "USER" }
    })
    //insert into database
    if (userRole) {
        const createUser = await prisma.user.create({
            data: {
                username: email,
                fullName: fullName,
                password: defaultPassword,
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: userRole.id
            }
        })
        return createUser;
    } else {
        throw new error("User Role khong ton tai");
    }
}
const getUserAndRoleById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id: +id },
        include: {
            role: true
        },
        omit: {
            password: true
        }
    })
    return user;
}
const getUserSumCart = async (id: string) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: +id },
    })
    return cart?.sum ?? 0;
}
const getUserCartDetails = async (id: number) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: +id },
    })
    if (cart) {
        const cartDetail = await prisma.cartDetail.findMany({
            where: {
                cartId: cart.id
            },
            include: {
                product: true
            }
        })
        return cartDetail;
    }
    return [];
}

export {
    isEmailExist, registerNewUser,
    getUserAndRoleById, getUserSumCart, getUserCartDetails,
}