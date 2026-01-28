-- CreateTable
CREATE TABLE "relapses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "streak_days" INTEGER NOT NULL,
    "streak_start" TIMESTAMP(3),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relapses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relapses" ADD CONSTRAINT "relapses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
