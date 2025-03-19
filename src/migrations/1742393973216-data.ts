import { MigrationInterface, QueryRunner } from "typeorm";

export class Data1742393973216 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO booking (id, startTime, endTime, status, note, createTime, updateTime, userId, roomId) VALUES " +
            "(1, '2025-03-19 22:18:03', '2025-03-19 23:18:03', '申请中', '', '2025-03-19 22:18:02.956887', '2025-03-19 22:18:02.956887', 1, 3), " +
            "(2, '2025-03-19 22:18:03', '2025-03-19 23:18:03', '申请中', '', '2025-03-19 22:18:03.052220', '2025-03-19 22:18:03.052220', 2, NULL), " +
            "(3, '2025-03-19 22:18:03', '2025-03-19 23:18:03', '申请中', '', '2025-03-19 22:18:03.065065', '2025-03-19 22:18:03.065065', 2, 3), " +
            "(4, '2025-03-19 22:18:03', '2025-03-19 23:18:03', '申请中', '', '2025-03-19 22:18:03.070086', '2025-03-19 22:18:03.070086', 1, NULL);");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
