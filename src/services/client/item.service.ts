import { prisma } from "config/client"

const getProducts = async (currentPage: number, productPerPage: number) => {
    const pageSize = productPerPage;
    const skip = (currentPage - 1) * pageSize;
    const products = await prisma.product.findMany({
        skip: skip,
        take: pageSize
    });
    return products;
}
const countTotalPage = async (productPerPage: number) => {
    const totalItem = await prisma.product.count();
    const totalPages = Math.ceil(totalItem / productPerPage);
    return totalPages;
}
const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id: +id }
    })
    return product;
}
const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id
        }
    })
    const product = await prisma.product.findUnique({
        where: {
            id: +productId
        }
    })
    if (cart) {
        //update sum cart
        await prisma.cart.update({
            where: {
                id: cart.id
            },
            data: {
                sum: {
                    increment: +quantity
                }
            }
        })
        //update cart details
        const currentCartDetail = await prisma.cartDetail.findFirst({
            where: {
                cartId: cart.id,
                productId: +productId
            }
        })
        await prisma.cartDetail.upsert({
            where: {
                id: currentCartDetail?.id ?? 0
            },
            update: {
                quantity: {
                    increment: +quantity
                }
            },
            create: {
                cartId: cart.id,
                price: product.price,
                productId: +productId,
                quantity: +quantity
            }
        })
    } else {
        //create
        await prisma.cart.create({
            data: {
                sum: +quantity,
                userId: user.id,
                cartDetails: {
                    create: [
                        {
                            price: product.price,
                            quantity: +quantity,
                            productId: productId
                        }
                    ]
                }
            }
        })
    }
}
const deleteProductInCart = async (cartDetailId: number, userId: number, userSumCart: number) => {
    const cartDetail = await prisma.cartDetail.findUnique({
        where: {
            id: cartDetailId
        }
    })
    const quantity = cartDetail.quantity;
    // Xoa cart detail
    await prisma.cartDetail.delete({
        where: {
            id: cartDetailId
        }
    })

    //Update SumCart
    if (userSumCart === 1) {
        await prisma.cart.delete({
            where: {
                userId: userId
            }
        })
    } else {
        await prisma.cart.update({
            where: {
                userId: userId
            },
            data: {
                sum: {
                    decrement: quantity,
                }
            }
        })
    }
}
const updateCartDetailBeforeCheckout = async (
    data: { id: string; quantity: string }[],
    cartId: number) => {

    let quantity = 0;

    for (let i = 0; i < data.length; i++) {
        quantity += +data[i].quantity;
        await prisma.cartDetail.update({
            where: {
                id: +data[i].id
            },
            data: {
                quantity: +data[i].quantity
            }
        })
    }

    //update cart sum
    await prisma.cart.update({
        where: {
            id: +cartId
        },
        data: {
            sum: quantity
        }
    })
}
const handlePlaceOrder = async (user_id: number,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    totalPrice: number) => {
    //add transaction
    try {
        await prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: {
                    userId: user_id
                },
                include: {
                    cartDetails: true
                }
            })
            if (cart) {
                //create order
                const dataOrderDetail = cart?.cartDetails?.map(
                    item => ({
                        price: item.price,
                        quantity: item.quantity,
                        productId: item.productId
                    })
                ) ?? []
                await tx.order.create({
                    data: {
                        receiverName,
                        receiverAddress,
                        receiverPhone,
                        paymentMethod: "COD",
                        paymentStatus: "PAYMENT_UNPAID",
                        status: "PENDING",
                        totalPrice: +totalPrice,
                        userId: user_id,
                        orderDetails: {
                            create: dataOrderDetail
                        }
                    }
                })
            }
            //remove cart detail, cart
            await tx.cartDetail.deleteMany({
                where: {
                    cartId: cart.id
                }
            })
            await tx.cart.delete({
                where: {
                    id: cart.id
                }
            })
            for (let i = 0; i < cart.cartDetails.length; i++) {
                const productId = cart.cartDetails[i].productId;
                const product = await tx.product.findUnique({
                    where: {
                        id: productId
                    }
                })
                if (!product || product.quantity < cart.cartDetails[i].quantity) {
                    throw new Error(`Sản phẩm ${product.name} không tồn tại hoặc không đủ số lượng`);
                }

                await tx.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        quantity: {
                            decrement: cart.cartDetails[i].quantity
                        },
                        sold: {
                            increment: cart.cartDetails[i].quantity
                        }
                    }
                })
            }
        })
        return ""
    } catch (error) {
        return error.message;
    }

}
const getOrderHistoryById = async (userId: number) => {

    const order = await prisma.order.findMany({
        where: {
            userId: userId
        },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }
        }
    })
    if (order) {
        return order;
    } else {
        return [];
    }
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
export {
    getProducts, getProductById, addProductToCart, deleteProductInCart,
    updateCartDetailBeforeCheckout, handlePlaceOrder, getOrderHistoryById,
    getOrderDetailById, countTotalPage
}