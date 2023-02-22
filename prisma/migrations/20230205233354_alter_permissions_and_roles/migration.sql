/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user]` on the table `permissions_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_users_id_user_key" ON "permissions_users"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");
