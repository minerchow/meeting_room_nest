import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742393835880 implements MigrationInterface {
    name = 'Init1742393835880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`booking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startTime\` datetime NOT NULL COMMENT '会议开始时间', \`endTime\` datetime NOT NULL COMMENT '会议结束时间', \`status\` varchar(20) NOT NULL COMMENT '状态（申请中、审批通过、审批驳回、已解除）' DEFAULT '申请中', \`note\` varchar(100) NOT NULL COMMENT '备注' DEFAULT '', \`createTime\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`roomId\` int NULL COMMENT '会议室ID', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_336b3f4a235460dc93645fbf222\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_769a5e375729258fd0bbfc0a456\` FOREIGN KEY (\`roomId\`) REFERENCES \`meeting_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_769a5e375729258fd0bbfc0a456\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_336b3f4a235460dc93645fbf222\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
    }

}
