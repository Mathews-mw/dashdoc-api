-- CreateTable
CREATE TABLE "UsersSecondFactorKey" (
    "user_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL,
    "validated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersSecondFactorKey_key_key" ON "UsersSecondFactorKey"("key");
