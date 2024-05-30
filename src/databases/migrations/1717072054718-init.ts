import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1717072054718 implements MigrationInterface {
  name = 'Init1717072054718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auths" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "access_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT '"2024-05-30T12:27:36.416Z"', "updated_at" TIMESTAMP NOT NULL DEFAULT '"2024-05-30T12:27:36.416Z"', CONSTRAINT "UQ_a28e912dc6bde5945582f2be0a2" UNIQUE ("email"), CONSTRAINT "PK_22fc0631a651972ddc9c5a31090" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "books" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "stock" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_c19328bbdf15e7ddbea3812318d" UNIQUE ("code"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "borrows" ("id" SERIAL NOT NULL, "borrowed_at" TIMESTAMP NOT NULL DEFAULT now(), "returned_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "memberId" integer, "bookId" integer, CONSTRAINT "PK_69f3a91fbbed0a8a2ce30efbce1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "penalty_end_date" TIMESTAMP, CONSTRAINT "UQ_8b08a36b59b238402b8c38d1f6f" UNIQUE ("code"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "borrows" ADD CONSTRAINT "FK_bfb13ee420c95eaf0c3aaf5e5b9" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "borrows" ADD CONSTRAINT "FK_43e09073c8aa2ba20a669c465dc" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "borrows" DROP CONSTRAINT "FK_43e09073c8aa2ba20a669c465dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "borrows" DROP CONSTRAINT "FK_bfb13ee420c95eaf0c3aaf5e5b9"`,
    );
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(`DROP TABLE "borrows"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "auths"`);
  }
}
