import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Rel, Cascade } from '@mikro-orm/core';

import { Schema_key } from './schemaKey';
import { User_Ety } from './user.entity';
import { Activity_Ety } from './activity.entity';

@Entity({
    tableName: 'schedule',
    // collection: 'schedule',
})
export class Schedule_Ety extends Schema_key {

    @Property()
    name: string;

    @Property()
    imageUrl: string;

    @ManyToOne(() => User_Ety, { cascade: [Cascade.ALL] })
    user: Rel<User_Ety>;

    @OneToMany(() => Activity_Ety, activity => activity.schedule, { mappedBy: 'schedule', orphanRemoval: true })
    activities: Activity_Ety[];

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

}
