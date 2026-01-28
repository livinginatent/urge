-- AlterTable
ALTER TABLE "streaks" ALTER COLUMN "started_at" DROP NOT NULL,
ALTER COLUMN "started_at" DROP DEFAULT;
