import express, { Express } from "express";
import { envs } from "./core/config/envs";
import { setupSwagger } from "./core/config/swagger";
import logger from "./core/utils/logger";
import routes from "./routes";

async function bootstrap() {

    const app: Express = express();

    app.use(express.json());

    setupSwagger(app);

    const port = envs.port || 3000;

    // app.get('/', async (req, res) => {
    //     res.send('Hello world!');
    // });

    app.use('/', routes);

    // logRoutes(router);

    // console.log('routes', routes);

    app.listen(port, () => {

        logger.info(`[server]: Server is running at http://localhost:${port}`);

    });
}
bootstrap();