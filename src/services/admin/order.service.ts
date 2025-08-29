import { prisma } from "config/client";
import { TOTAL_ITEM_PER_PAGE } from "config/constant";

const getAllOrders = async (currentPage: number) => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const skip = (currentPage - 1) * pageSize;
    return await prisma.order.findMany({
        skip: skip,
        take: pageSize,
        include: {
            user: true
        }
    });
}
const countTotalOrderPage = async () => {
    const totalItem = await prisma.order.count();
    const totalPages = Math.ceil(totalItem / TOTAL_ITEM_PER_PAGE);
    return totalPages;
}
const getOrderDetailById = async (id: number) => {
    return await prisma.orderDetail.findMany({
        where: {
            orderId: id
        },
        include: {
            product: true
        }
    })
}
export { getAllOrders, getOrderDetailById, countTotalOrderPage }