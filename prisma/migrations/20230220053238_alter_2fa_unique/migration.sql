/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `users_second_factor_key` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_second_factor_key_user_id_key" ON "users_second_factor_key"("user_id");
