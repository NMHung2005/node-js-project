import { prisma } from "config/client";
import { Request, Response } from "express"
import { getUserCartDetails } from "services/client/auth.service";
import { addProductToCart, deleteProductInCart, getOrderDetailById, getOrderHistoryById, getProductById, handlePlaceOrder, updateCartDetailBeforeCheckout } from "services/client/item.service";
const getProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(id);
    return res.render("client/product/detail", {
        product
    });

}
const postAddProductToCart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    if (user) {
        await addProductToCart(1, +id, user);
    } else {
        res.redirect("/login");
    }

    return res.redirect("/");
}
const getCartPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {

        const cartDetail = await getUserCartDetails(user.id);

        const totalPrice = cartDetail?.map(item => +item.price * +item.quantity)
            ?.reduce((a, b) => a + b, 0);

        const cartId = cartDetail.length ? cartDetail[0].cartId : 0;

        return res.render("client/product/cart", {
            cartDetails: cartDetail,
            totalPrice: totalPrice,
            cartId: cartId
        });
    } else {
        return res.redirect("/login");
    }
}
const postDeleteProductInCart = async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (user) {
        await deleteProductInCart(+id, user.id, user.sumCart);
    } else {
        return res.redirect("/login");
    }
    return res.redirect("/cart");
}
const getCheckoutPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const cartDetail = await getUserCartDetails(user.id);
        const totalPrice = cartDetail?.map(item => +item.price * +item.quantity)
            ?.reduce((a, b) => a + b, 0);
        return res.render("client/product/checkout", {
            cartDetails: cartDetail,
            totalPrice: totalPrice
        });
    } else {
        return res.redirect("/login");
    }
}
const postHandleCartToCheckout = async (req: Request, res: Response) => {
    const user = req.user;
    const { cartId } = req.body;
    if (user) {
        const currentCartDetail: { id: string; quantity: string }[]
            = req.body?.details ?? [];

        await updateCartDetailBeforeCheckout(currentCartDetail, cartId);
        return res.redirect("/checkout");
    } else {
        return res.redirect("/login");
    }
}
const postPlaceOrder = async (req: Request, res: Response) => {
    const user = req.user;
    const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body
    if (user) {

        const message = await handlePlaceOrder(user.id, receiverName, receiverAddress, receiverPhone, totalPrice);
        if (message) {
            return res.redirect("/checkout");
        }
        return res.redirect("/done");

    } else {
        return res.redirect("/login");
    }
}
const getDonePage = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        return res.render("client/product/done");
    } else {
        return res.redirect("/login");
    }
}
const getOrderHistoryPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const orders = await getOrderHistoryById(user.id);
        return res.render("client/product/order-history", {
            orders: orders
        });
    } else {
        return res.redirect("/login");
    }
}
const postAddToCartFromDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    if (user) {
        await addProductToCart(quantity, +id, user);
        return res.redirect(`/product/${id}`);
    } else {
        return res.redirect("/login");
    }
}
export {
    getProductPage, postAddProductToCart, getCartPage,
    postDeleteProductInCart, getCheckoutPage,
    postHandleCartToCheckout, postPlaceOrder,
    getDonePage, getOrderHistoryPage,
    postAddToCartFromDetailPage
}