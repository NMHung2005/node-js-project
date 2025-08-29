import { prisma } from "config/client";
import { TOTAL_ITEM_PER_PAGE } from "config/constant";

const handleCreateProduct = async (
    name: string,
    detailDesc: string,
    factory: string,
    price: number,
    quantity: number,
    shortDesc: string,
    target: string,
    image: string
) => {
    const createProduct = prisma.product.create({
        data: {
            name: name,
            detailDesc: detailDesc,
            factory: factory,
            price: price,
            quantity: +quantity,
            shortDesc: shortDesc,
            target: target,
            ...(image !== undefined && { image: image })
        }
    })
    return createProduct
}
const getAllProduct = async (currentPage: number) => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const skip = (currentPage - 1) * pageSize;
    const allProduct = await prisma.product.findMany({
        skip: skip,
        take: pageSize
    });
    return allProduct;
}
const countTotalProductPage = async () => {
    const totalItem = await prisma.product.count();
    const totalPages = Math.ceil(totalItem / TOTAL_ITEM_PER_PAGE);
    return totalPages;
}
const handleDeleteProduct = async (id: string) => {
    const deleteProduct = await prisma.product.delete({
        where: { id: +id }
    })
    return deleteProduct;
}
const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id: +id }
    })
    return product;
}
const updateProductById = async (
    id: string,
    name: string,
    detailDesc: string,
    shortDesc: string,
    quantity: number,
    price: number,
    factory: string,
    target: string,
    image: string
) => {
    const updateProduct = await prisma.product.update({
        where: { id: +id },
        data: {
            name: name,
            detailDesc: detailDesc,
            shortDesc: shortDesc,
            quantity: quantity,
            price: price,
            factory: factory,
            target: target,
            ...(image !== undefined && { image: image })
        }
    })
    return updateProduct;
}
export {
    handleCreateProduct, getAllProduct, handleDeleteProduct,
    getProductById, updateProductById, countTotalProductPage
}