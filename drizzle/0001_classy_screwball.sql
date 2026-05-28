CREATE TABLE `contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`locale` text DEFAULT 'pt' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`email_error` text,
	`ip_hash` text,
	`user_agent` text,
	`created_at` integer
);
