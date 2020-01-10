CREATE DATABASE IF NOT EXISTS nodeapp;
USE nodeapp;
CREATE TABLE IF NOT EXISTS `users` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`username` varchar(32) NOT NULL,
	`password` varchar(32) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `posts` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`user_id` int(11) NOT NULL,
	`body` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `sessions` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`user_id` int(11) NOT NULL,
	`session_key` varchar(32) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE USER IF NOT EXISTS 'node'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON nodeapp.* TO 'node'@'localhost';