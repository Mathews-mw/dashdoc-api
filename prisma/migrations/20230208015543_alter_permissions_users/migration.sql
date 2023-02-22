/*
  Warnings:

  - A unique constraint covering the columns `[id_permission]` on the table `permissions_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "permissions_users_id_permission_key" ON "permissions_users"("id_permission");
