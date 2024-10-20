import { MikroORM, EntityManager, EntityRepository } from '@mikro-orm/core';
import { User_Ety } from '../entities/user.entity';


export class OrmContext {

    private static orm: MikroORM;
    public em: EntityManager;

    users: EntityRepository<User_Ety>

    constructor() {
        if (!OrmContext.orm) {
            throw new Error("ORM has not been initialized. Call OrmContext.init() first.");
        }

        this.em = OrmContext.orm.em.fork();
        this.users =  this.em.getRepository(User_Ety)
    }


    public static async init() {
        if (!OrmContext.orm) {
            OrmContext.orm = await MikroORM.init();
        }
    }

}
