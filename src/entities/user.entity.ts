

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Schema_key } from './schemaKey';


@Entity({
    tableName: 'user',
    collection: 'user',
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

    @Property({ type: 'date', default: 'now()' })
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

}