

import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Schema_key } from './schemaKey';
import { Schedule_Ety } from './schedule.entity';


@Entity({
    tableName: 'user',
    // collection: 'user
})
export class User_Ety extends Schema_key{

    @Property({
        type: 'varchar',
        unique: true
    })
    email: string;

    @Property({
        type: 'varchar'
    })
    password: string;

    @Property({
        type: 'varchar'
    })
    name: string;

    @Property({
        type: 'varchar'
    })
    last_name: string;

    @OneToMany(() => Schedule_Ety, schedule => schedule.user, { mappedBy: 'user', orphanRemoval: true})
    schedules: Schedule_Ety[];

    @Property({ type: 'date', default: 'now()' })
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

}