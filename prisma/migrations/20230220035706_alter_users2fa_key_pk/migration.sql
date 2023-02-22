-- AlterTable
ALTER TABLE "users_second_factor_key" ADD CONSTRAINT "users_second_factor_key_pkey" PRIMARY KEY ("user_id", "validated");
