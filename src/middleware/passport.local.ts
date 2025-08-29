import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"
import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import { getUserAndRoleById, getUserSumCart } from "services/client/auth.service";

const configPassportLocal = () => {
    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, async function verify(req, username, password, cb) {

        const { session } = req as any;
        if (session?.message?.length) {
            session.message = [];
        }

        const user = await prisma.user.findUnique({
            where: { username: username }
        })
        if (!user) {
            //throw new error("username khong ton tai");
            return cb(null, false, { message: 'username hoac password khong dung' });
        }
        //user exist check matkhau
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            //throw new error("password khong dung");
            return cb(null, false, { message: 'username hoac password khong dung' });
        }
        return cb(null, user as any);
    }));
    passport.serializeUser(function (user: any, cb) {
        return cb(null, { id: user.id, username: user.username });
    });

    passport.deserializeUser(async function (user: any, cb) {
        const { id, username } = user;
        //get user in DB
        const userInDB: any = await getUserAndRoleById(id);
        const sumCart = await getUserSumCart(id);
        return cb(null, { ...userInDB, sumCart: sumCart });
    });
}

export default configPassportLocal;
