import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.service";
import { countTotalOrderPage, getAllOrders, getOrderDetailById } from "services/admin/order.service";
import { countTotalProductPage, getAllProduct } from "services/admin/product.service";
import { countTotalUserPage, getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
    const info = await getDashboardInfo();
    return res.render('admin/dashboard/show.ejs', {
        info
    });

}

const getAdminUserPage = async (req: Request, res: Response) => {
    const { page } = req.query;

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    const user = await getAllUsers(currentPage);
    const totalPages = await countTotalUserPage();
    return res.render('admin/user/show.ejs', {
        users: user,
        totalPages,
        currentPage
    });

}
const getAdminProductPage = async (req: Request, res: Response) => {
    const { page } = req.query;

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    const product = await getAllProduct(currentPage);
    const totalPages = await countTotalProductPage();
    return res.render('admin/product/show.ejs', {
        products: product,
        totalPages,
        currentPage
    });

}
const getAdminOrderPage = async (req: Request, res: Response) => {
    const { page } = req.query;

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    const { orders, orderNumber } = await getAllOrders(currentPage);
    const totalPages = await countTotalOrderPage();
    return res.render('admin/order/show.ejs', {
        orders: orders,
        orderNumber,
        totalPages,
        currentPage
    });
}
const getAdminOrderDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const orderDetails = await getOrderDetailById(+id);
    return res.render('admin/order/detail', {
        orderDetails: orderDetails
    });

}
export {
    getDashboardPage, getAdminUserPage,
    getAdminOrderPage, getAdminProductPage, getAdminOrderDetailPage
};