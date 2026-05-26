CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`target_amount` integer NOT NULL,
	`current_amount` integer DEFAULT 0,
	`start_date` integer,
	`end_date` integer,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` text PRIMARY KEY NOT NULL,
	`donor_id` text,
	`stripe_payment_intent_id` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`status` text NOT NULL,
	`payment_method` text,
	`is_recurring` integer DEFAULT false,
	`stripe_subscription_id` text,
	`campaign_id` text,
	`metadata` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`donor_id`) REFERENCES `donors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `donations_stripe_payment_intent_id_unique` ON `donations` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE TABLE `donor_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`donor_id` text NOT NULL,
	`email_updates` integer DEFAULT true,
	`email_newsletter` integer DEFAULT false,
	`email_receipts` integer DEFAULT true,
	`preferred_currency` text DEFAULT 'EUR',
	`preferred_language` text DEFAULT 'pt',
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`donor_id`) REFERENCES `donors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `donors` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text,
	`address_line1` text,
	`address_line2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text NOT NULL,
	`stripe_customer_id` text,
	`email_opt_in` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `donors_email_unique` ON `donors` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `donors_stripe_customer_id_unique` ON `donors` (`stripe_customer_id`);--> statement-breakpoint
CREATE TABLE `project_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`target_amount` integer NOT NULL,
	`current_amount` integer DEFAULT 0,
	`percentage_complete` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer
);
