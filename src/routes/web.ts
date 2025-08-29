import express, { Express } from "express";
import {
    getHomepage, getCreateUserPage, postCreateUser,
    postDeleteUser, getViewUser, postUpdateUser,
    getProductFilterPage
} from "controllers/user.controller";
import {
    getDashboardPage, getAdminUserPage,
    getAdminProductPage, getAdminOrderPage,
    getAdminOrderDetailPage
} from "controllers/admin/dashboard.controller"
import fileUploadMiddleware from "src/middleware/multer";
import { getCartPage, getCheckoutPage, getDonePage, getOrderHistoryPage, getProductPage, postAddProductToCart, postAddToCartFromDetailPage, postDeleteProductInCart, postHandleCartToCheckout, postPlaceOrder } from "controllers/client/product.controller";
import { getAdminCreateProductPage, getViewProduct, postAdminCreateProduct, postDeleteProduct, postUpdateProduct } from "controllers/admin/product.controller";
import { getLoginPage, getRegisterPage, getSuccessRedirectPage, postLogout, postRegister } from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomepage);
    router.get("/products", getProductFilterPage);

    router.get("/product/:id", getProductPage);
    router.get("/success-redirect", getSuccessRedirectPage)
    router.get("/login", getLoginPage);
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/success-redirect',
        failureRedirect: '/login',
        failureMessage: true
    }));
    router.post("/logout", postLogout);
    router.get("/register", getRegisterPage);
    router.post("/register", postRegister)
    router.post("/add-product-to-cart/:id", postAddProductToCart)
    router.get("/cart", getCartPage);
    router.post("/delete-product-in-cart/:id", postDeleteProductInCart);
    router.post("/handle-cart-to-checkout", postHandleCartToCheckout)
    router.get("/checkout", getCheckoutPage);
    router.post("/place-order", postPlaceOrder);
    router.get("/done", getDonePage);
    router.get("/order-history", getOrderHistoryPage);
    router.post("/add-to-cart-from-detail-page/:id", postAddToCartFromDetailPage);


    //admin routes
    router.get("/admin", getDashboardPage);
    router.get("/admin/user", getAdminUserPage);
    router.get("/admin/create-user", getCreateUserPage);
    router.post("/admin/handle-create-user", fileUploadMiddleware("avatar", "images/user"), postCreateUser);
    router.post("/admin/delete-user/:id", postDeleteUser);
    router.get("/admin/view-user/:id", getViewUser);
    router.get("/admin/order", getAdminOrderPage);
    router.get("/admin/view-order/:id", getAdminOrderDetailPage);
    router.post("/admin/update-user", fileUploadMiddleware("avatar", "images/user"), postUpdateUser);

    router.get("/admin/product", getAdminProductPage);
    router.get("/admin/create-product", getAdminCreateProductPage);
    router.post("/admin/create-product", fileUploadMiddleware("image", "images/product"), postAdminCreateProduct);
    router.post("/admin/delete-product/:id", postDeleteProduct);
    router.get("/admin/view-product/:id", getViewProduct);
    router.post("/admin/update-product", fileUploadMiddleware("image", "images/product"), postUpdateProduct);



    app.use("/", isAdmin, router);
}
export default webRoutes;