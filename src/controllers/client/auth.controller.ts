import { NextFunction, Request, Response } from "express"
import { registerNewUser } from "services/client/auth.service";
import { registerSchema, TRegisterSchema } from "src/validation/register.schema";

const getLoginPage = (req: Request, res: Response) => {
    const { session } = req as any;
    const messages = session?.messages ?? [];
    return res.render("client/auth/login", {
        messages
    });
}
const getRegisterPage = (req: Request, res: Response) => {
    const error = [];
    const oldData = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    };
    return res.render("client/auth/register", {
        errors: error,
        oldData
    });
}
const postRegister = async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body as TRegisterSchema;
    const validate = await registerSchema.safeParseAsync(req.body);

    if (!validate.success) {
        //error
        const errorsZod = validate.error.issues;
        const errors = errorsZod?.map(item => `${item.message} (${item.path[0]})`);
        const oldData = {
            fullName, email, password, confirmPassword
        }
        return res.render("client/auth/register", {
            errors, oldData
        });
    }
    //success
    await registerNewUser(fullName, email, password);
    res.redirect("/login");
}
const getSuccessRedirectPage = async (req: Request, res: Response) => {
    const user = req.user as any;
    if (user?.role?.name === 'ADMIN') {
        res.redirect("/admin");
    } else res.redirect("/");
}
const postLogout = async (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
export { getLoginPage, getRegisterPage, postRegister, getSuccessRedirectPage, postLogout }
