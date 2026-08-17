CREATE TYPE "public"."focus" AS ENUM('warmup', 'technique', 'scales', 'arpeggios', 'articulation', 'ornaments', 'phrasing', 'picking', 'bending', 'tone', 'intonation', 'vibrato', 'dynamics', 'rhythm', 'timing', 'groove', 'strumming', 'comping', 'voicings', 'chords', 'theory', 'improvisation', 'licks', 'riffs', 'transcription', 'sight_reading', 'aural', 'composition', 'songwriting', 'arranging', 'recording', 'repertoire', 'performance', 'ensemble', 'jazz', 'classical', 'blues', 'rock', 'pop', 'folk', 'latin', 'funk', 'rb_soul', 'country', 'world', 'electronic', 'metal', 'reggae', 'theater');--> statement-breakpoint
CREATE TYPE "public"."instrument" AS ENUM('voice', 'guitar', 'bass_guitar', 'ukulele', 'banjo', 'mandolin', 'steel_guitar', 'violin', 'viola', 'cello', 'upright_bass', 'harp', 'saxophone', 'clarinet', 'flute', 'oboe', 'bassoon', 'recorder', 'harmonica', 'ocarina', 'whistle', 'trumpet', 'trombone', 'french_horn', 'euphonium', 'tuba', 'piano', 'organ', 'keyboard', 'accordion', 'melodica', 'drums', 'vibraphone', 'kalimba', 'percussion');--> statement-breakpoint
CREATE TYPE "public"."self_rating" AS ENUM('poor', 'below', 'above', 'strong');--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"instrument" "instrument",
	"focus" "focus"[] DEFAULT '{}',
	"duration_min" integer,
	"self_rating" "self_rating"
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_text" text NOT NULL,
	"occurred_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entries_session_id_idx" ON "entries" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "sessions_occurred_on_idx" ON "sessions" USING btree ("occurred_on");