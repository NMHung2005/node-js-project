import { Request, Response } from "express"
import { getProductById, handleCreateProduct, handleDeleteProduct, updateProductById } from "services/admin/product.service";
import { updateUserById } from "services/user.service";
import { productSchema, TProductSchema } from "src/validation/product.schema";

const getAdminCreateProductPage = async (req: Request, res: Response) => {
    const errors = [];
    const oldData = {
        name: "",
        price: "",
        detailDesc: "",
        shortDesc: "",
        quantity: "",
        factory: "",
        target: ""
    }
    return res.render("admin/product/create", {
        errors, oldData
    });
}
const postAdminCreateProduct = async (req: Request, res: Response) => {

    const { name, detailDesc, factory,
        price, quantity, shortDesc, target, } = req.body as TProductSchema;


    const validate = productSchema.safeParse(req.body);

    if (!validate.success) {
        //error
        const errorsZod = validate.error.issues;
        const errors = errorsZod?.map(item => `${item.message} (${item.path[0]})`);
        const oldData = {
            name, detailDesc, factory,
            price, quantity, shortDesc, target
        }
        return res.render("admin/product/create", {
            errors, oldData
        });
    }
    //success
    const file = req.file;
    const image = file?.filename ?? "";
    await handleCreateProduct(name, detailDesc, factory, +price, +quantity, shortDesc, target, image);
    return res.redirect("/admin/product");
}
const postDeleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteProduct(id);
    return res.redirect("/admin/product");
}

const getViewProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(id);
    const error = []
    const factoryOptions = [
        { name: "Apple (MacBook)", value: "APPLE" },
        { name: "Asus", value: "ASUS" },
        { name: "Lenovo", value: "LENOVO" },
        { name: "Dell", value: "DELL" },
        { name: "LG", value: "LG" },
        { name: "Acer", value: "ACER" },
    ];

    const targetOptions = [
        { name: "Gaming", value: "GAMING" },
        { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
        { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
        { name: "Mỏng nhẹ", value: "MONG-NHE" },
        { name: "Doanh nhân", value: "DOANH-NHAN" },
    ];

    return res.render('admin/product/detail', {
        product: product,
        errors: error,
        factoryOptions,
        targetOptions
    });
}
const postUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, detailDesc, shortDesc, quantity, price, factory, target } = req.body as TProductSchema;
    const file = req.file;
    const image = file?.filename ?? undefined;
    //update product by id
    const a = await updateProductById(id, name, detailDesc, shortDesc, +quantity, +price, factory, target, image);
    return res.redirect("/admin/product");
}
export { getAdminCreateProductPage, postAdminCreateProduct, postDeleteProduct, getViewProduct, postUpdateProduct }