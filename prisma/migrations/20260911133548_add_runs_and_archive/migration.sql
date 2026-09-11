-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "runs" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- Add a nullable relation first so deployments with existing tasks can be
-- backfilled before the NOT NULL constraint is enforced.
ALTER TABLE "tasks" ADD COLUMN "run_id" TEXT;

WITH "legacy_run" AS (
    INSERT INTO "runs" ("id", "started_at")
    SELECT
        'legacy-' || md5(random()::text || clock_timestamp()::text),
        MIN("created_at")
    FROM "tasks"
    HAVING COUNT(*) > 0
    RETURNING "id"
)
UPDATE "tasks"
SET "run_id" = (SELECT "id" FROM "legacy_run")
WHERE "run_id" IS NULL;

ALTER TABLE "tasks" ALTER COLUMN "run_id" SET NOT NULL;

-- Replace the original single-column indexes with indexes matching the
-- filters and sort orders used by the application.
DROP INDEX "tasks_created_at_idx";
DROP INDEX "blog_posts_published_at_idx";

-- CreateIndex
CREATE INDEX "runs_started_at_idx" ON "runs"("started_at");

-- CreateIndex
CREATE INDEX "tasks_run_id_created_at_idx" ON "tasks"("run_id", "created_at");

-- CreateIndex
CREATE INDEX "blog_posts_archived_published_at_idx" ON "blog_posts"("archived", "published_at");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
