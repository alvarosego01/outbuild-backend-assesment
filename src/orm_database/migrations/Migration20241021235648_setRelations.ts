import { Migration } from '@mikro-orm/migrations';

export class Migration20241021235648_setRelations extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "schedule" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "image_url" varchar(255) not null, "user_id" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "schedule_pkey" primary key ("id"));`);

    this.addSql(`create table "activity" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "schedule_id" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "activity_pkey" primary key ("id"));`);

    this.addSql(`alter table "schedule" add constraint "schedule_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "activity" add constraint "activity_schedule_id_foreign" foreign key ("schedule_id") references "schedule" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "activity" drop constraint "activity_schedule_id_foreign";`);

    this.addSql(`drop table if exists "schedule" cascade;`);

    this.addSql(`drop table if exists "activity" cascade;`);
  }

}
