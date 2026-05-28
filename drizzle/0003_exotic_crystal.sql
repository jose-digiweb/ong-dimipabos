CREATE TABLE `partnership_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`message` text NOT NULL,
	`locale` text DEFAULT 'pt' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`email_error` text,
	`ip_hash` text,
	`user_agent` text,
	`created_at` integer
);
