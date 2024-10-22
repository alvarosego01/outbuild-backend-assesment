import { MikroORM, EntityManager, EntityRepository } from '@mikro-orm/core';
import { User_Ety } from '../entities/user.entity';
import { Schedule_Ety } from '../entities';
import { Activity_Ety } from '../entities/activity.entity';


export class OrmContext {

    private static orm: MikroORM;
    public em: EntityManager;

    users: EntityRepository<User_Ety>;
    schedules: EntityRepository<Schedule_Ety>;
    activities: EntityRepository<Activity_Ety>;

    constructor() {
        if (!OrmContext.orm) {
            throw new Error("ORM has not been initialized. Call OrmContext.init() first.");
        }

        this.em = OrmContext.orm.em.fork();
        this.users =  this.em.getRepository(User_Ety);
        this.schedules = this.em.getRepository(Schedule_Ety);
        this.activities = this.em.getRepository(Activity_Ety);
    }



    public static async init() {
        if (!OrmContext.orm) {
            OrmContext.orm = await MikroORM.init();
        }
    }

}
