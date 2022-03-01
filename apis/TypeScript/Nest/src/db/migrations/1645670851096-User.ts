import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1645670851096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table "USER"
                             (
                                 user_id      uuid         not null
                                     constraint user_pk
                                         primary key,
                                 first_name   varchar(200),
                                 last_name    varchar(200) not null,
                                 email        varchar(200) not null,
                                 phone_number varchar(15)  not null,
                                 hire_date    date         not null,
                                 salary       numeric
                             );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('Migration down', queryRunner.rollbackTransaction());
    } catch (e) {
      console.error(e);
    }
  }
}
