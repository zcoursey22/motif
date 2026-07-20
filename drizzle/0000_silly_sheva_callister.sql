CREATE TYPE "public"."self_rating" AS ENUM('poor', 'below', 'above', 'strong');--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"instrument" text,
	"focus" text[] DEFAULT '{}' NOT NULL,
	"duration_min" integer,
	"self_rating" "self_rating"
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_text" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entries_session_id_idx" ON "entries" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "sessions_occurred_at_idx" ON "sessions" USING btree ("occurred_at");