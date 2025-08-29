import { Request, Response, NextFunction } from "express"
const isLogin = (req: Request, res: Response, next: NextFunction) => {
    const isAuthenticate = req.isAuthenticated();
    if (isAuthenticate) {
        res.redirect("/");
        return;
    } else {
        next();
    }
}
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/admin")) {
        const user = req.user;
        if (user?.role?.name === 'ADMIN') {
            next();
        } else res.redirect("/status/403");
        return;
    }
    next();
}
export { isLogin, isAdmin }