import { MigrationInterface, QueryRunner } from 'typeorm';

export class Create0011728713114411 implements MigrationInterface {
  name = 'Create0011728713114411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_auth_method\` (\`id\` int NOT NULL AUTO_INCREMENT, \`method_type\` enum ('password') NOT NULL COMMENT '登录方式' DEFAULT 'password', \`password\` varchar(255) NULL COMMENT '密码', \`create_time\` timestamp NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(20) NOT NULL COMMENT '用户名', \`nickname\` varchar(12) NOT NULL COMMENT '昵称', \`create_time\` timestamp NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_auth_method\` ADD CONSTRAINT \`FK_9d9aee1fc2f2b71a4cfe2c0c6fc\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_auth_method\` DROP FOREIGN KEY \`FK_9d9aee1fc2f2b71a4cfe2c0c6fc\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`user_auth_method\``);
  }
}
