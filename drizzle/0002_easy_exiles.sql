CREATE TABLE `volunteer_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`area` text NOT NULL,
	`availability` text NOT NULL,
	`experience` text DEFAULT '' NOT NULL,
	`locale` text DEFAULT 'pt' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`email_error` text,
	`ip_hash` text,
	`user_agent` text,
	`created_at` integer
);
