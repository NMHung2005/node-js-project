import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import jwt from 'jsonwebtoken';
import "dotenv/config";

const handleGetAllUser = async () => {
    return await prisma.user.findMany();
}
const handleGetUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    });
}
const handleUpdateUserById = async (id: number,
    fullName: string, address: string, phone: string) => {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            fullName: fullName,
            address: address,
            phone: phone
        }
    });
}
const handleDeleteUserById = async (id: number) => {
    return await prisma.user.delete({
        where: {
            id: id
        }
    });
}
const handleUserLogin = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { username: username },
        include: {
            role: true
        }
    })

    if (!user) {
        throw new Error(`Username: ${username} khong ton tai`);
    }

    //user exist check matkhau
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("password khong dung");
    }
    //Xac dinh user => tao token
    const payload = {
        id: user.id,
        username: user.username,
        roleId: user.roleId,
        role: user.role,
        accountType: user.accountType,
        avatar: user.avatar
    }
    const secret = process.env.JWT_SECRET;
    const access_token = jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN as any
    })
    return access_token;
}
export {
    handleGetAllUser, handleGetUserById, handleUpdateUserById,
    handleDeleteUserById, handleUserLogin
}