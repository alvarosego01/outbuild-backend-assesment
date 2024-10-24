import { Entity, PrimaryKey, Property, ManyToOne, Rel, Cascade } from '@mikro-orm/core';
// import { Schedule } from './Schedule.entity';
import { Schema_key } from './schemaKey';
import { Schedule_Ety } from './schedule.entity';

@Entity({
    tableName: 'activity',
    // collection: 'activity',
})
export class Activity_Ety extends Schema_key {

    @Property()
    name: string;

    @Property()
    startDate: Date;

    @Property()
    endDate: Date;

    @ManyToOne(() => Schedule_Ety, { cascade: [Cascade.ALL] })
    schedule: Rel<Schedule_Ety>;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

}
