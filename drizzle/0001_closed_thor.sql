CREATE TYPE "public"."qualification" AS ENUM('bachelors', 'masters', 'phd', 'post_doc', 'professor');--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "date_of_birth" timestamp;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "place_of_birth" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "current_address" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "permanent_address" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_name" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_relationship" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_phone" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_email" text;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "date_of_birth" timestamp;