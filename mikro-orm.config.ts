import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { envs } from "./src/core/config/envs";

const db_c = {
    dbName: envs.db_name || process.env.DB_NAME,
    host: envs.db_host || process.env.DB_HOST,
    port: envs.db_port || process.env.DB_PORT,
    user: envs.db_username || process.env.DB_USERNAME,
    password: envs.db_password || process.env.DB_PASSWORD,
}

const config: Options = {

    entities: ["dist/**/*.entity{.ts,.js}"],
    entitiesTs: ['./src/**/*.entity{.ts,.js}'],
    driver: PostgreSqlDriver,
    clientUrl: `postgresql://${db_c.user}:${db_c.password}@${db_c.host}:${db_c.port}/${db_c.dbName}`,
    debug: (envs.nodeEnv === 'development') ? true : false,
    migrations: {
        path: 'dist/orm_database/migrations',
        pathTs: './src/orm_database/migrations',
        transactional: true,
        tableName: '_migrations',
        emit: 'ts',
    },
    extensions: [Migrator],
    driverOptions: {
        connection: {
            ssl: (envs.db_username === 'postgres')? false : true,
        },
    },

};

export default config;
