/*
  Warnings:

  - You are about to drop the `UsersSecondFactorKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UsersSecondFactorKey";

-- CreateTable
CREATE TABLE "users_second_factor_key" (
    "user_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL,
    "validated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_second_factor_key_key_key" ON "users_second_factor_key"("key");

-- AddForeignKey
ALTER TABLE "users_second_factor_key" ADD CONSTRAINT "users_second_factor_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
