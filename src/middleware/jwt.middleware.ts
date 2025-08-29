import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const whiteList = [
        "/add-product-to-cart",
        "/login"
    ]
    const isWhiteList = whiteList.some(route => route === path);
    if (isWhiteList) {
        next();
        return;
    }
    const token = req.headers['authorization']?.split(' ')[1];
    try {
        const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: dataDecoded.id,
            username: dataDecoded.username,
            roleId: dataDecoded.roleId,
            accountType: dataDecoded.accountType,
            password: "",
            fullName: "",
            address: "",
            phone: "",
            avatar: dataDecoded.avatar,
            role: dataDecoded.role
        }
        next();
    } catch (error) {
        res.status(401).json({
            data: null,
            message: "Token không hợp lệ (Không có token hoặc token hết hạn)"
        })
    }

}
export {
    checkValidJWT
}