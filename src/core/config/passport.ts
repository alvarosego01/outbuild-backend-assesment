import { envs } from "./envs";
import { PassportStatic } from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { OrmContext } from "../../orm_database/ormContext";


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: envs.jwt_secret,
};

export const configurePassport = (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const ormContext = new OrmContext();
                const user = await ormContext.users.findOne({ id: jwt_payload.sub });

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }

            } catch (error) {
                return done(error, false);
            }
        })
    );
};