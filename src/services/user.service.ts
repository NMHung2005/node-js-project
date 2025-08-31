import { prisma } from "config/client";
import { ACCOUNT_TYPE, TOTAL_ITEM_PER_PAGE } from "config/constant";
import bcrypt from 'bcrypt';
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds);
}
const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword);
}
const handleCreateUser = async (
    fullName: string,
    email: string,
    address: string,
    phone: string,
    avatar: string,
    role: string
) => {
    const defaultPassword = await hashPassword("123456");
    //insert into database
    const createUser = await prisma.user.create({
        data: {
            username: email,
            address: address,
            fullName: fullName,
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            phone: phone,
            avatar: avatar,
            roleId: +role
        }
    })
    return createUser;
}

const getAllUsers = async (currentPage: number) => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const skip = (currentPage - 1) * pageSize;
    const allUser = await prisma.user.findMany({
        skip: skip,
        take: pageSize
    });
    return allUser;
}

const countTotalUserPage = async () => {
    const totalItem = await prisma.user.count();
    const totalPages = Math.ceil(totalItem / TOTAL_ITEM_PER_PAGE);
    return totalPages;
}
const getAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;
}

const handleDeleteUser = async (id: string) => {
    const deleteUser = await prisma.user.delete({
        where: { id: +id }
    })
    return deleteUser;
}
const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id: +id }
    })
    return user;
}

const updateUserById = async (id: string, fullName: string, phone: string, address: string, avatar: string, role: string) => {
    const updateUser = await prisma.user.update({
        where: { id: +id },
        data: {
            fullName: fullName,
            address: address,
            phone: phone,
            ...(role !== "" && { roleId: +role }),
            ...(avatar !== undefined && { avatar: avatar })
        }
    })
    return updateUser;
}
export {
    handleCreateUser, getAllUsers, handleDeleteUser,
    getUserById, updateUserById, getAllRoles, hashPassword, comparePassword,
    countTotalUserPage
};