CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"originalURL" text NOT NULL,
	"shortenedURL" text NOT NULL,
	"numberOfAccesses" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_shortenedURL_unique" UNIQUE("shortenedURL")
);
