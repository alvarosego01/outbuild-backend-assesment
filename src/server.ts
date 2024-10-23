
import express, { Express } from "express";
import { envs } from "./core/config/envs";
import { setupSwagger } from "./core/config/swagger";
import { OrmContext } from "./orm_database/ormContext";
import routes from "./routes";
import { configurePassport } from "./core/config/passport";
import passport from "passport";
import LoggerService from "./core/utils/logger";

const set_port = () => {

    if(envs.nodeEnv === 'test') {

        return 0


    }else {
        return envs.port || 3000;
    }

}

export const server = async (): Promise<Express> => {

    const app: Express = express();
    const port = set_port();

    const logger = new LoggerService('server');

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    setupSwagger(app);

    await OrmContext.init();

    app.use(passport.initialize());
    configurePassport(passport);

    app.use('/', routes);

    app.listen(port, () => {

        logger.info(`Server is running at http://localhost:${port}`);

    });

    return app;

}