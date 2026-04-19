CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"shortened_url" text NOT NULL,
	"number_of_accesses" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_shortened_url_unique" UNIQUE("shortened_url")
);
