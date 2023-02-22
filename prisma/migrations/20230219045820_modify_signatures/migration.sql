/*
  Warnings:

  - You are about to drop the `users_signatures` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `signatures` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `signatures` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users_signatures" DROP CONSTRAINT "users_signatures_signature_id_fkey";

-- DropForeignKey
ALTER TABLE "users_signatures" DROP CONSTRAINT "users_signatures_user_id_fkey";

-- AlterTable
ALTER TABLE "signatures" ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "users_signatures";

-- CreateIndex
CREATE UNIQUE INDEX "signatures_user_id_key" ON "signatures"("user_id");

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
