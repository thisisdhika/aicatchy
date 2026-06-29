CREATE TYPE "public"."formula_type" AS ENUM('basic', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."occasion" AS ENUM('casual', 'formal', 'sporty', 'business', 'evening');--> statement-breakpoint
CREATE TABLE "affiliate_links" (
	"id" varchar PRIMARY KEY NOT NULL,
	"product_id" varchar NOT NULL,
	"platform" varchar NOT NULL,
	"url" varchar NOT NULL,
	"commission" integer,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "click_events" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"affiliate_link_id" varchar,
	"timestamp" timestamp DEFAULT now(),
	"ip_address" varchar
);
--> statement-breakpoint
CREATE TABLE "failed_jobs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"job_id" varchar NOT NULL,
	"job_name" varchar NOT NULL,
	"failed_at" timestamp DEFAULT now(),
	"error" text NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "formula_versions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"formula_id" varchar NOT NULL,
	"version" integer NOT NULL,
	"content" jsonb NOT NULL,
	"changelog" text,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "formulas" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"type" "formula_type" NOT NULL,
	"occasion" "occasion" NOT NULL,
	"content" jsonb NOT NULL,
	"created_by" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "generation_logs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"occasion" "occasion" NOT NULL,
	"vibes" jsonb,
	"expression" varchar,
	"shopping_intent" varchar,
	"request_id" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "generation_logs_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"name" varchar,
	"avatar" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "saved_looks" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"occasion" "occasion" NOT NULL,
	"vibes" jsonb,
	"expression" varchar,
	"outfit" jsonb NOT NULL,
	"saved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_affiliate_link_id_affiliate_links_id_fk" FOREIGN KEY ("affiliate_link_id") REFERENCES "public"."affiliate_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_versions" ADD CONSTRAINT "formula_versions_formula_id_formulas_id_fk" FOREIGN KEY ("formula_id") REFERENCES "public"."formulas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_versions" ADD CONSTRAINT "formula_versions_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formulas" ADD CONSTRAINT "formulas_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_logs" ADD CONSTRAINT "generation_logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_looks" ADD CONSTRAINT "saved_looks_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;