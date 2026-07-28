ALTER TABLE "sessions" RENAME COLUMN "occurred_at" TO "occurred_on";--> statement-breakpoint
DROP INDEX "sessions_occurred_at_idx";--> statement-breakpoint
CREATE INDEX "sessions_occurred_on_idx" ON "sessions" USING btree ("occurred_on");