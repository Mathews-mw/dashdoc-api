-- CreateTable
CREATE TABLE "signatures" (
    "id" TEXT NOT NULL,
    "signature_img_base64" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_At" TIMESTAMP(3),

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_signatures" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "signature_id" TEXT NOT NULL,

    CONSTRAINT "users_signatures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_signatures" ADD CONSTRAINT "users_signatures_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "signatures"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_signatures" ADD CONSTRAINT "users_signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
