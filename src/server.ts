
import express, { Express } from "express";
import { envs } from "./core/config/envs";
import { setupSwagger } from "./core/config/swagger";
import { OrmContext } from "./orm_database/ormContext";
import logger from "./core/utils/logger";
import routes from "./routes";


export const server = async () => {

    const app: Express = express();

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    setupSwagger(app);

    const port = envs.port || 3000;

    app.use('/', routes);

    await OrmContext.init();

    app.listen(port, () => {

        logger.info(`[server]: Server is running at http://localhost:${port}`);

    });

}