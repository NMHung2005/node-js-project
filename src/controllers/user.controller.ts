import { Request, Response } from "express";
import { countTotalPage, getProducts } from "services/client/item.service";
import { getProductWithFilter, productsFilterFactories, productsFilterFactory, productsFilterMaxPrice, productsFilterMinPrice, productsFilterPrice, userFilter } from "services/client/product.filter";
import {
    getAllUsers, handleCreateUser, handleDeleteUser,
    getUserById, updateUserById,
    getAllRoles
} from "services/user.service";

const getHomepage = async (req: Request, res: Response) => {
    const { page } = req.query;

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    const products = await getProducts(currentPage, 8);
    const totalPages = await countTotalPage(8);
    return res.render('client/home/show.ejs', {
        products,
        totalPages,
        page: +currentPage
    });
}
const getCreateUserPage = async (req: Request, res: Response) => {
    //get roles
    const roles = await getAllRoles();
    return res.render('admin/user/create', {
        roles: roles
    });
}
const postCreateUser = async (req: Request, res: Response) => {
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? "";
    //handle create user
    await handleCreateUser(fullName, username, address, phone, avatar, role);

    return res.redirect("/admin/user");
}
const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUser(id);
    return res.redirect("/admin/user");
}
const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUserById(id);
    const roles = await getAllRoles();

    return res.render('admin/user/detail', {
        user: user,
        roles: roles
    });
}
const postUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;
    //update user by id
    const a = await updateUserById(id, fullName, phone, role, address, avatar);
    return res.redirect('/admin/user');
}
const getProductFilterPage = async (req: Request, res: Response) => {
    const { page, factory = "", target = "", price = "", sort = "" }
        = req.query as {
            page?: string;
            factory: string;
            target: string;
            price: string;
            sort: string;
        };

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    // const products = await getProducts(currentPage, 6);
    // const totalPages = await countTotalPage(6);

    const data = await getProductWithFilter(currentPage, 6, factory, target, price, sort);
    return res.render('client/product/filter.ejs', {
        products: data.products,
        totalPages: +data.totalPages,
        page: +currentPage
    });
    // const users = await userFilter(username as string);
    // const productMin = await productsFilterMinPrice(minPrice as string);
    // const productMax = await productsFilterMaxPrice(maxPrice as string);
    // const productFac = await productsFilterFactory(factory as string);
    // const productFacs = await productsFilterFactories((factory as string).split(","));
    // const product = await productsFilterPrice(10000000, 15000000);
    // res.status(200).json({
    //     data: product
    // })
}
export {
    getHomepage, getCreateUserPage, postCreateUser,
    postDeleteUser, getViewUser, postUpdateUser,
    getProductFilterPage
};